"""
동적 Few-shot 예제 선택 서비스

사용자의 과거 대화에서 긍정 피드백 받은 응답을 Few-shot 예제로 활용
"""
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Dict, Optional
from uuid import UUID

from app.models.conversation import Conversation
from app.models.message import Message
from app.models.message_feedback import MessageFeedback
from app.prompts.few_shot_examples import FewShotExample


def calculate_text_similarity(text1: str, text2: str) -> float:
    """
    간단한 텍스트 유사도 계산 (키워드 기반)

    Args:
        text1: 첫 번째 텍스트
        text2: 두 번째 텍스트

    Returns:
        0.0-1.0 사이의 유사도 점수
    """
    # 간단한 키워드 매칭 방식
    # 나중에 임베딩 기반으로 업그레이드 가능

    if not text1 or not text2:
        return 0.0

    # 공백으로 토큰화
    tokens1 = set(text1.lower().split())
    tokens2 = set(text2.lower().split())

    if not tokens1 or not tokens2:
        return 0.0

    # Jaccard 유사도
    intersection = tokens1.intersection(tokens2)
    union = tokens1.union(tokens2)

    return len(intersection) / len(union) if union else 0.0


def calculate_emotion_similarity(emotion1: Optional[str], emotion2: Optional[str]) -> float:
    """
    감정 유사도 계산

    Args:
        emotion1: 첫 번째 감정
        emotion2: 두 번째 감정

    Returns:
        0.0-1.0 사이의 유사도 점수
    """
    if not emotion1 or not emotion2:
        return 0.5  # 중립

    # 정확히 같으면 1.0
    if emotion1 == emotion2:
        return 1.0

    # 유사 감정 그룹
    similar_emotions = {
        "불안": ["두려움"],
        "우울": ["슬픔"],
        "분노": ["짜증"],
        "기쁨": ["행복", "만족"],
    }

    # 유사 감정이면 0.7
    for emotion, similar in similar_emotions.items():
        if emotion1 == emotion and emotion2 in similar:
            return 0.7
        if emotion2 == emotion and emotion1 in similar:
            return 0.7

    # 다른 감정이면 0.3
    return 0.3


def select_dynamic_few_shot_examples(
    db: Session,
    user_id: UUID,
    character_id: UUID,
    current_emotion: Optional[str],
    current_message: str,
    count: int = 2
) -> List[FewShotExample]:
    """
    사용자 히스토리 기반 동적 Few-shot 예제 선택

    Args:
        db: 데이터베이스 세션
        user_id: 사용자 ID
        character_id: AI 캐릭터 ID
        current_emotion: 현재 감정
        current_message: 현재 사용자 메시지
        count: 선택할 예제 수 (기본 2개)

    Returns:
        동적으로 선택된 Few-shot 예제 리스트
    """
    # 1. 사용자의 최근 50개 대화 가져오기
    past_conversations = db.query(Conversation).filter(
        Conversation.user_id == user_id,
        Conversation.character_id == character_id
    ).order_by(
        desc(Conversation.created_at)
    ).limit(50).all()

    if not past_conversations:
        return []

    # 2. 유사한 상황에서 긍정 피드백 받은 응답 찾기
    similar_cases = []

    for conv in past_conversations:
        # 대화의 모든 메시지 가져오기
        messages = db.query(Message).filter(
            Message.conversation_id == conv.id
        ).order_by(Message.created_at).all()

        # 사용자 메시지와 AI 응답 쌍 분석
        for i, msg in enumerate(messages):
            if msg.role == "user" and i + 1 < len(messages):
                ai_response = messages[i + 1]

                # AI 응답인지 확인
                if ai_response.role != "assistant":
                    continue

                # 텍스트 유사도 계산
                text_similarity = calculate_text_similarity(
                    current_message,
                    msg.content
                )

                # 감정 유사도 계산 (메시지에 감정 정보가 있으면)
                msg_emotion = getattr(msg, 'detected_emotion', None)
                emotion_similarity = calculate_emotion_similarity(
                    current_emotion,
                    msg_emotion
                )

                # 종합 유사도 (텍스트 70%, 감정 30%)
                total_similarity = text_similarity * 0.7 + emotion_similarity * 0.3

                # 유사도 임계값 0.4 이상
                if total_similarity >= 0.4:
                    # AI 응답의 피드백 확인
                    feedback = db.query(MessageFeedback).filter(
                        MessageFeedback.message_id == ai_response.id,
                        MessageFeedback.user_id == user_id
                    ).first()

                    # 긍정 피드백이 있으면 추가
                    if feedback and feedback.is_helpful:
                        similar_cases.append({
                            "user_message": msg.content,
                            "ai_response": ai_response.content,
                            "similarity": total_similarity,
                            "emotion": msg_emotion or current_emotion
                        })

    # 3. 유사도 순으로 정렬
    similar_cases.sort(key=lambda x: x["similarity"], reverse=True)

    # 4. FewShotExample로 변환 (상위 N개)
    dynamic_examples = []
    for case in similar_cases[:count]:
        dynamic_examples.append(FewShotExample(
            emotion=case["emotion"] or "중립",
            user_message=case["user_message"],
            assistant_response=case["ai_response"],
            notes=f"사용자 히스토리 기반 성공 사례 (유사도: {case['similarity']:.2f})"
        ))

    return dynamic_examples


def get_hybrid_few_shot_examples(
    db: Session,
    user_id: UUID,
    character_id: UUID,
    current_emotion: Optional[str],
    current_message: str,
    total_count: int = 3,
    dynamic_ratio: float = 0.5
) -> List[FewShotExample]:
    """
    동적 예제와 정적 예제를 혼합하여 반환

    Args:
        db: 데이터베이스 세션
        user_id: 사용자 ID
        character_id: AI 캐릭터 ID
        current_emotion: 현재 감정
        current_message: 현재 사용자 메시지
        total_count: 총 예제 수 (기본 3개)
        dynamic_ratio: 동적 예제 비율 (기본 0.5 = 50%)

    Returns:
        하이브리드 Few-shot 예제 리스트
    """
    from app.prompts.few_shot_examples import get_examples_by_emotion

    # 동적 예제 개수 계산
    dynamic_count = int(total_count * dynamic_ratio)
    static_count = total_count - dynamic_count

    # 동적 예제 가져오기
    dynamic_examples = select_dynamic_few_shot_examples(
        db=db,
        user_id=user_id,
        character_id=character_id,
        current_emotion=current_emotion,
        current_message=current_message,
        count=dynamic_count
    )

    # 부족한 개수는 정적 예제로 채우기
    if len(dynamic_examples) < dynamic_count:
        # 동적 예제가 부족하면 정적 예제로 더 채움
        static_count += (dynamic_count - len(dynamic_examples))

    # 정적 예제 가져오기
    static_examples = get_examples_by_emotion(current_emotion or "중립")

    # 동적 예제와 겹치지 않는 정적 예제만 선택
    # (간단히 처음 N개 선택)
    selected_static = static_examples[:static_count]

    # 결합: 동적 예제 우선
    final_examples = dynamic_examples + selected_static

    return final_examples[:total_count]
