"""
사용자 프롬프트 선호도 학습 서비스
"""
from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from typing import Optional, Dict
from uuid import UUID
from datetime import datetime, timedelta

from app.models.user_prompt_preference import UserPromptPreference
from app.models.message_feedback import MessageFeedback
from app.models.conversation_rating import ConversationRating
from app.models.message import Message
from app.models.conversation import Conversation


def get_or_create_preference(
    db: Session,
    user_id: UUID,
    character_id: UUID
) -> UserPromptPreference:
    """
    사용자 선호도 가져오기 또는 생성

    Args:
        db: 데이터베이스 세션
        user_id: 사용자 ID
        character_id: AI 캐릭터 ID

    Returns:
        UserPromptPreference 인스턴스
    """
    preference = db.query(UserPromptPreference).filter(
        UserPromptPreference.user_id == user_id,
        UserPromptPreference.character_id == character_id
    ).first()

    if not preference:
        preference = UserPromptPreference(
            user_id=user_id,
            character_id=character_id,
            preferred_response_length="medium",
            preferred_tone="mixed",
            emoji_preference="moderate",
            preferred_few_shot_count=3,
            confidence_score=0.0
        )
        db.add(preference)
        db.commit()
        db.refresh(preference)

    return preference


def update_user_preferences(
    db: Session,
    user_id: UUID,
    character_id: UUID
) -> UserPromptPreference:
    """
    사용자 선호도 업데이트

    최근 피드백과 대화 패턴을 분석하여 선호도를 학습합니다.

    Args:
        db: 데이터베이스 세션
        user_id: 사용자 ID
        character_id: AI 캐릭터 ID

    Returns:
        업데이트된 UserPromptPreference
    """
    preference = get_or_create_preference(db, user_id, character_id)

    # 최근 30일간의 대화 및 피드백 수집
    recent_cutoff = datetime.utcnow() - timedelta(days=30)

    # 1. 최근 대화 수집
    conversations = db.query(Conversation).filter(
        Conversation.user_id == user_id,
        Conversation.character_id == character_id,
        Conversation.created_at >= recent_cutoff
    ).all()

    conversation_ids = [conv.id for conv in conversations]

    # 2. 피드백 수집
    feedbacks = db.query(MessageFeedback).join(Message).filter(
        Message.conversation_id.in_(conversation_ids),
        MessageFeedback.user_id == user_id
    ).all()

    # 3. 평가 수집
    ratings = db.query(ConversationRating).filter(
        ConversationRating.conversation_id.in_(conversation_ids),
        ConversationRating.user_id == user_id
    ).all()

    # 통계 업데이트
    preference.total_conversations = len(conversations)
    preference.total_feedbacks = len(feedbacks)

    if feedbacks:
        positive_count = sum(1 for f in feedbacks if f.is_helpful)
        preference.positive_feedback_ratio = positive_count / len(feedbacks)

    # 4. 응답 길이 선호도 학습
    preference.preferred_response_length = _learn_length_preference(
        db, feedbacks, conversation_ids
    )

    # 5. 이모지 선호도 학습
    preference.emoji_preference = _learn_emoji_preference(
        db, feedbacks, conversation_ids
    )

    # 6. 톤 선호도 학습 (향후 구현)
    # preference.preferred_tone = _learn_tone_preference(...)

    # 7. 신뢰도 점수 계산
    preference.confidence_score = _calculate_confidence(len(feedbacks), len(conversations))

    preference.last_updated = datetime.utcnow()

    db.commit()
    db.refresh(preference)

    return preference


def _learn_length_preference(
    db: Session,
    feedbacks: list,
    conversation_ids: list
) -> str:
    """
    응답 길이 선호도 학습

    긍정 피드백을 받은 메시지의 길이 패턴을 분석합니다.
    """
    if not feedbacks:
        return "medium"  # 기본값

    # 피드백별 메시지 길이 수집
    length_feedbacks = {"short": [], "medium": [], "long": []}

    for feedback in feedbacks:
        message = db.query(Message).filter(Message.id == feedback.message_id).first()
        if not message or message.role != "assistant":
            continue

        # 메시지 길이 분류
        msg_length = len(message.content)
        if msg_length < 100:
            category = "short"
        elif msg_length < 300:
            category = "medium"
        else:
            category = "long"

        # 피드백 점수화 (긍정: 1, 부정: -1)
        score = 1 if feedback.is_helpful else -1
        length_feedbacks[category].append(score)

    # 각 길이 카테고리의 평균 점수 계산
    length_scores = {}
    for category, scores in length_feedbacks.items():
        if scores:
            length_scores[category] = sum(scores) / len(scores)
        else:
            length_scores[category] = 0

    # 가장 높은 점수를 받은 길이 선택
    if not length_scores or max(length_scores.values()) <= 0:
        return "medium"  # 긍정 피드백이 없으면 기본값

    preferred = max(length_scores.items(), key=lambda x: x[1])
    return preferred[0]


def _learn_emoji_preference(
    db: Session,
    feedbacks: list,
    conversation_ids: list
) -> str:
    """
    이모지 사용 선호도 학습

    이모지가 포함된 메시지에 대한 피드백을 분석합니다.
    """
    if not feedbacks:
        return "moderate"  # 기본값

    emoji_feedback_scores = []
    non_emoji_feedback_scores = []

    for feedback in feedbacks:
        message = db.query(Message).filter(Message.id == feedback.message_id).first()
        if not message or message.role != "assistant":
            continue

        # 이모지 포함 여부 간단 체크 (유니코드 범위로 검사 가능하지만 간단히 처리)
        has_emoji = any(char in message.content for char in "😊😢😡😍🎉💪👍👎🙏")

        score = 1 if feedback.is_helpful else -1

        if has_emoji:
            emoji_feedback_scores.append(score)
        else:
            non_emoji_feedback_scores.append(score)

    # 이모지 있을 때와 없을 때의 평균 점수
    emoji_avg = (
        sum(emoji_feedback_scores) / len(emoji_feedback_scores)
        if emoji_feedback_scores else 0
    )
    non_emoji_avg = (
        sum(non_emoji_feedback_scores) / len(non_emoji_feedback_scores)
        if non_emoji_feedback_scores else 0
    )

    # 이모지 선호도 결정
    if emoji_avg > non_emoji_avg + 0.3:
        return "frequent"
    elif emoji_avg > non_emoji_avg:
        return "moderate"
    elif emoji_avg < non_emoji_avg - 0.3:
        return "none"
    else:
        return "minimal"


def _calculate_confidence(feedback_count: int, conversation_count: int) -> float:
    """
    신뢰도 점수 계산

    충분한 데이터가 있을수록 신뢰도가 높아집니다.

    Args:
        feedback_count: 피드백 수
        conversation_count: 대화 수

    Returns:
        0.0-1.0 사이의 신뢰도 점수
    """
    # 최소 10개 피드백, 5개 대화가 있어야 높은 신뢰도
    feedback_score = min(feedback_count / 10, 1.0)
    conversation_score = min(conversation_count / 5, 1.0)

    # 평균 신뢰도
    confidence = (feedback_score + conversation_score) / 2

    return round(confidence, 2)


def should_update_preferences(
    db: Session,
    user_id: UUID,
    character_id: UUID
) -> bool:
    """
    선호도 업데이트가 필요한지 판단

    Args:
        db: 데이터베이스 세션
        user_id: 사용자 ID
        character_id: AI 캐릭터 ID

    Returns:
        업데이트 필요 여부
    """
    preference = get_or_create_preference(db, user_id, character_id)

    # 1. 최초 생성이거나 한 번도 업데이트되지 않음
    if preference.confidence_score == 0.0:
        return True

    # 2. 마지막 업데이트 후 7일 경과
    if datetime.utcnow() - preference.last_updated > timedelta(days=7):
        return True

    # 3. 마지막 업데이트 후 새로운 대화가 10개 이상
    new_conversations = db.query(func.count(Conversation.id)).filter(
        Conversation.user_id == user_id,
        Conversation.character_id == character_id,
        Conversation.created_at > preference.last_updated
    ).scalar()

    if new_conversations >= 10:
        return True

    return False
