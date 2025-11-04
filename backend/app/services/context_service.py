"""
컨텍스트 관리 서비스 - 대화 컨텍스트 구축 및 메모리 관리
"""
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Dict, Any
from uuid import UUID

from app.models.conversation import Conversation
from app.models.message import Message
from app.models.conversation_summary import ConversationSummary
from app.models.user_memory import UserMemory
from app.models.ai_character import AICharacter


def get_user_memories(
    db: Session,
    user_id: UUID,
    character_id: UUID,
    confidence_threshold: float = 0.7
) -> Dict[str, List[Dict[str, Any]]]:
    """
    사용자 메모리 가져오기

    Args:
        db: 데이터베이스 세션
        user_id: 사용자 ID
        character_id: AI 캐릭터 ID
        confidence_threshold: 최소 신뢰도 점수

    Returns:
        메모리 타입별로 분류된 메모리 딕셔너리
    """
    memories = db.query(UserMemory).filter(
        UserMemory.user_id == user_id,
        UserMemory.character_id == character_id,
        UserMemory.confidence_score >= confidence_threshold
    ).order_by(
        desc(UserMemory.confidence_score)
    ).all()

    # 타입별로 분류
    categorized_memories = {
        "facts": [],
        "preferences": [],
        "emotion_patterns": [],
        "tone_preferences": []
    }

    for memory in memories:
        if memory.memory_type == "fact":
            categorized_memories["facts"].append(memory.content)
        elif memory.memory_type == "preference":
            categorized_memories["preferences"].append(memory.content)
        elif memory.memory_type == "emotion_pattern":
            categorized_memories["emotion_patterns"].append(memory.content)
        elif memory.memory_type == "tone_preference":
            categorized_memories["tone_preferences"].append(memory.content)

    return categorized_memories


def format_user_context(memories: Dict[str, List[Dict[str, Any]]]) -> str:
    """
    사용자 메모리를 프롬프트용 텍스트로 포맷

    Args:
        memories: 메모리 딕셔너리

    Returns:
        포맷된 컨텍스트 문자열
    """
    context_parts = []

    # 사실 정보
    if memories["facts"]:
        facts_text = "\n".join([f"- {fact.get('fact', '')}" for fact in memories["facts"][:5]])
        context_parts.append(f"**알려진 사실**:\n{facts_text}")

    # 선호도
    if memories["preferences"]:
        prefs_text = "\n".join([
            f"- {pref.get('preference', '')}"
            for pref in memories["preferences"][:5]
        ])
        context_parts.append(f"**선호도**:\n{prefs_text}")

    # 감정 패턴
    if memories["emotion_patterns"]:
        patterns_text = "\n".join([
            f"- {pattern.get('pattern', '')}"
            for pattern in memories["emotion_patterns"][:3]
        ])
        context_parts.append(f"**감정 패턴**:\n{patterns_text}")

    # 대화 스타일
    if memories["tone_preferences"]:
        tone = memories["tone_preferences"][0]  # 가장 최신/신뢰도 높은 것
        tone_text = f"""**대화 스타일 선호**:
- 격식: {tone.get('formality', '균형적')}
- 따뜻함: {tone.get('warmth', '중간')}
- 응답 길이: {tone.get('response_length', '중간')}
- 스타일: {tone.get('style', '공감적')}"""
        context_parts.append(tone_text)

    return "\n\n".join(context_parts) if context_parts else ""


def get_conversation_summaries(
    db: Session,
    conversation_id: UUID
) -> List[ConversationSummary]:
    """
    대화 요약 가져오기

    Args:
        db: 데이터베이스 세션
        conversation_id: 대화 ID

    Returns:
        대화 요약 리스트 (시간순)
    """
    summaries = db.query(ConversationSummary).filter(
        ConversationSummary.conversation_id == conversation_id
    ).order_by(
        ConversationSummary.created_at
    ).all()

    return summaries


def get_recent_conversation_summaries(
    db: Session,
    user_id: UUID,
    character_id: UUID,
    current_conversation_id: UUID,
    days: int = 7
) -> List[ConversationSummary]:
    """
    최근 N일간의 다른 대화 요약 가져오기 (크로스-대화 컨텍스트)

    Args:
        db: 데이터베이스 세션
        user_id: 사용자 ID
        character_id: AI 캐릭터 ID
        current_conversation_id: 현재 대화 ID (제외)
        days: 최근 N일

    Returns:
        다른 대화의 요약 리스트
    """
    from datetime import datetime, timedelta

    cutoff_date = datetime.utcnow() - timedelta(days=days)

    # 같은 캐릭터와의 다른 대화들
    other_conversations = db.query(Conversation).filter(
        Conversation.user_id == user_id,
        Conversation.character_id == character_id,
        Conversation.id != current_conversation_id,
        Conversation.updated_at >= cutoff_date
    ).order_by(
        desc(Conversation.updated_at)
    ).limit(5).all()  # 최근 5개 대화

    # 해당 대화들의 요약 수집
    summaries = []
    for conv in other_conversations:
        conv_summaries = db.query(ConversationSummary).filter(
            ConversationSummary.conversation_id == conv.id
        ).order_by(
            ConversationSummary.created_at
        ).all()

        summaries.extend(conv_summaries)

    return summaries


def get_recent_messages(
    db: Session,
    conversation_id: UUID,
    limit: int = 20
) -> List[Message]:
    """
    최근 메시지 가져오기

    Args:
        db: 데이터베이스 세션
        conversation_id: 대화 ID
        limit: 가져올 메시지 수

    Returns:
        최근 메시지 리스트 (시간순)
    """
    messages = db.query(Message).filter(
        Message.conversation_id == conversation_id
    ).order_by(
        Message.created_at
    ).limit(limit).all()

    return messages


def get_recent_messages_from_other_conversations(
    db: Session,
    user_id: UUID,
    character_id: UUID,
    current_conversation_id: UUID,
    days: int = 7,
    messages_per_conversation: int = 10
) -> List[Dict[str, Any]]:
    """
    최근 N일간의 다른 대화에서 최근 메시지 가져오기

    Args:
        db: 데이터베이스 세션
        user_id: 사용자 ID
        character_id: AI 캐릭터 ID
        current_conversation_id: 현재 대화 ID (제외)
        days: 최근 N일
        messages_per_conversation: 각 대화당 가져올 메시지 수

    Returns:
        다른 대화의 최근 메시지 리스트 (대화별로 그룹화)
    """
    from datetime import datetime, timedelta

    cutoff_date = datetime.utcnow() - timedelta(days=days)

    # 같은 캐릭터와의 다른 대화들 (최근 3개만)
    other_conversations = db.query(Conversation).filter(
        Conversation.user_id == user_id,
        Conversation.character_id == character_id,
        Conversation.id != current_conversation_id,
        Conversation.updated_at >= cutoff_date
    ).order_by(
        desc(Conversation.updated_at)
    ).limit(3).all()

    # 각 대화의 최근 메시지 수집
    conversations_with_messages = []
    for conv in other_conversations:
        messages = db.query(Message).filter(
            Message.conversation_id == conv.id
        ).order_by(
            desc(Message.created_at)
        ).limit(messages_per_conversation).all()

        # 시간순으로 재정렬 (오래된 것부터)
        messages.reverse()

        if messages:
            conversations_with_messages.append({
                "conversation_title": conv.title or "이전 대화",
                "conversation_date": conv.updated_at,
                "messages": messages
            })

    return conversations_with_messages


def build_conversation_context(
    db: Session,
    conversation_id: UUID,
    user_id: UUID,
    character: AICharacter,
    emotion_data: Dict[str, Any] = None
) -> Dict[str, Any]:
    """
    완전한 대화 컨텍스트 구축

    Args:
        db: 데이터베이스 세션
        conversation_id: 대화 ID
        user_id: 사용자 ID
        character: AI 캐릭터
        emotion_data: 감정 분석 데이터 (선택적)

    Returns:
        LLM에 전달할 컨텍스트 딕셔너리
    """
    # 1. 사용자 메모리 가져오기
    memories = get_user_memories(db, user_id, character.id)
    user_context = format_user_context(memories)

    # 2. 시스템 프롬프트 구성
    base_prompt = f"""당신은 {character.name}이며, {character.personality}입니다.

사용자는 정신 건강 관리와 감정 조절을 위해 당신과 대화하고 있습니다.

**대화 원칙**:
1. 공감적이고 따뜻한 태도 유지
2. 사용자의 감정을 인정하고 검증
3. 구체적이고 실행 가능한 조언 제공
4. 전문적 치료가 필요해 보이면 전문가 상담 권유
5. 한국어로 자연스럽고 친근하게 대화
6. 응답은 2-3문장으로 간결하게 유지
"""

    if character.system_prompt:
        base_prompt += f"\n{character.system_prompt}"

    if user_context:
        base_prompt += f"\n\n**사용자 정보**:\n{user_context}"

    # 감정 기반 응답 지침 추가
    if emotion_data:
        from app.services.emotion_service import get_adaptive_response_instructions
        emotion_instructions = get_adaptive_response_instructions(emotion_data)
        if emotion_instructions:
            base_prompt += f"\n{emotion_instructions}"

    # 3. 현재 대화 요약 가져오기
    summaries = get_conversation_summaries(db, conversation_id)
    summary_context = ""
    if summaries:
        summary_texts = [s.summary for s in summaries[-3:]]  # 최근 3개 요약
        summary_context = "\n\n".join(summary_texts)

    # 4. 최근 다른 대화 요약 가져오기 (크로스-대화 컨텍스트)
    recent_summaries = get_recent_conversation_summaries(
        db=db,
        user_id=user_id,
        character_id=character.id,
        current_conversation_id=conversation_id,
        days=7  # 최근 7일
    )
    recent_context = ""
    if recent_summaries:
        # 최근 요약들을 시간순으로 정렬하고 최대 3개만
        recent_summaries_sorted = sorted(
            recent_summaries,
            key=lambda x: x.created_at,
            reverse=True
        )[:3]
        recent_texts = [s.summary for s in recent_summaries_sorted]
        recent_context = "\n\n".join(recent_texts)

    # 5. 최근 다른 대화의 메시지 가져오기 (구체적 내용 포함)
    other_conversations_messages = get_recent_messages_from_other_conversations(
        db=db,
        user_id=user_id,
        character_id=character.id,
        current_conversation_id=conversation_id,
        days=7,
        messages_per_conversation=10  # 각 대화당 최근 10개
    )

    # 6. 현재 대화의 최근 메시지 가져오기
    recent_messages = get_recent_messages(db, conversation_id, limit=20)

    # 7. 메시지 히스토리 포맷
    messages = [{"role": "system", "content": base_prompt}]

    # 최근 다른 대화 요약이 있으면 추가 (크로스-대화 컨텍스트)
    if recent_context:
        messages.append({
            "role": "system",
            "content": f"**최근 다른 대화 요약**:\n{recent_context}"
        })

    # 다른 대화의 최근 메시지 추가 (구체적 내용)
    if other_conversations_messages:
        other_conv_text_parts = []
        for conv_data in other_conversations_messages:
            conv_title = conv_data["conversation_title"]
            conv_messages = conv_data["messages"]

            # 각 대화별로 메시지 포맷
            conv_text = f"**{conv_title}**:\n"
            for msg in conv_messages:
                role_name = "사용자" if msg.role == "user" else "AI"
                conv_text += f"- {role_name}: {msg.content}\n"

            other_conv_text_parts.append(conv_text)

        if other_conv_text_parts:
            messages.append({
                "role": "system",
                "content": f"**이전 대화에서 나눴던 구체적인 내용** (참고용):\n\n{chr(10).join(other_conv_text_parts)}"
            })

    # 현재 대화 요약이 있으면 추가
    if summary_context:
        messages.append({
            "role": "system",
            "content": f"**이번 대화 요약**:\n{summary_context}"
        })

    # 최근 메시지 추가
    for msg in recent_messages:
        messages.append({
            "role": msg.role,
            "content": msg.content
        })

    return {
        "messages": messages,
        "character": character,
        "user_memories": memories,
        "has_summaries": len(summaries) > 0
    }


def estimate_token_count(text: str) -> int:
    """
    텍스트의 대략적인 토큰 수 추정
    (1 토큰 ≈ 4 글자, 한국어는 좀 더 효율적)

    Args:
        text: 추정할 텍스트

    Returns:
        대략적인 토큰 수
    """
    # 간단한 추정: 공백 기준으로 단어 수 + 문자 수 / 4
    words = len(text.split())
    chars = len(text)
    return int(words + chars / 4)


def optimize_context_for_token_limit(
    context: Dict[str, Any],
    max_tokens: int = 4000
) -> Dict[str, Any]:
    """
    토큰 제한에 맞춰 컨텍스트 최적화

    Args:
        context: 원본 컨텍스트
        max_tokens: 최대 토큰 수

    Returns:
        최적화된 컨텍스트
    """
    messages = context["messages"]

    # 현재 토큰 수 추정
    total_text = "\n".join([msg["content"] for msg in messages])
    current_tokens = estimate_token_count(total_text)

    # 토큰 제한을 초과하면 메시지 줄이기
    if current_tokens > max_tokens:
        # 시스템 프롬프트는 유지
        system_messages = [msg for msg in messages if msg["role"] == "system"]
        conversation_messages = [msg for msg in messages if msg["role"] != "system"]

        # 최근 메시지부터 역순으로 추가
        optimized_messages = system_messages.copy()
        remaining_tokens = max_tokens - estimate_token_count(
            "\n".join([msg["content"] for msg in system_messages])
        )

        for msg in reversed(conversation_messages):
            msg_tokens = estimate_token_count(msg["content"])
            if remaining_tokens - msg_tokens > 0:
                optimized_messages.insert(len(system_messages), msg)
                remaining_tokens -= msg_tokens
            else:
                break

        context["messages"] = optimized_messages

    return context
