"""
대화 요약 서비스 - 자동 대화 요약 및 토큰 최적화
"""
import google.generativeai as genai
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from app.models.message import Message
from app.models.conversation_summary import ConversationSummary
from app.core.config import settings


def check_summary_trigger(db: Session, conversation_id: UUID) -> bool:
    """
    요약 트리거 조건 확인 (20개 메시지마다)

    Args:
        db: 데이터베이스 세션
        conversation_id: 대화 ID

    Returns:
        요약이 필요한지 여부
    """
    # 전체 메시지 수
    total_messages = db.query(Message).filter(
        Message.conversation_id == conversation_id
    ).count()

    # 이미 요약된 메시지 수
    summaries = db.query(ConversationSummary).filter(
        ConversationSummary.conversation_id == conversation_id
    ).all()

    summarized_count = sum(s.message_count for s in summaries)

    # 미요약 메시지가 20개 이상이면 요약 필요
    unsummarized_count = total_messages - summarized_count

    return unsummarized_count >= 20


async def generate_summary(messages: List[Message]) -> str:
    """
    메시지 목록을 요약 생성

    Args:
        messages: 요약할 메시지 리스트

    Returns:
        요약 텍스트
    """
    # Gemini 모델 설정
    model = genai.GenerativeModel(
        model_name=settings.LLM_MODEL,
        generation_config={
            "temperature": 0.3,  # 요약은 좀 더 정확하게
            "max_output_tokens": 500,
        }
    )

    # 메시지를 텍스트로 변환
    conversation_text = "\n".join([
        f"{'사용자' if msg.role == 'user' else 'AI'}: {msg.content}"
        for msg in messages
    ])

    # 요약 프롬프트
    prompt = f"""다음 대화를 간결하게 요약해주세요.

주요 내용:
- 사용자의 감정 상태
- 논의된 주제
- AI가 제공한 조언
- 중요한 결정이나 인사이트

대화:
{conversation_text}

요약 (3-5문장):"""

    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"요약 생성 오류: {str(e)}")
        # 오류 시 간단한 요약 반환
        return f"{len(messages)}개의 메시지가 교환되었습니다."


async def create_conversation_summary(
    db: Session,
    conversation_id: UUID
) -> Optional[ConversationSummary]:
    """
    대화 요약 자동 생성

    Args:
        db: 데이터베이스 세션
        conversation_id: 대화 ID

    Returns:
        생성된 요약 객체 또는 None
    """
    # 이미 요약된 메시지 수 계산
    existing_summaries = db.query(ConversationSummary).filter(
        ConversationSummary.conversation_id == conversation_id
    ).all()

    summarized_count = sum(s.message_count for s in existing_summaries)

    # 미요약 메시지 가져오기
    all_messages = db.query(Message).filter(
        Message.conversation_id == conversation_id
    ).order_by(Message.created_at).all()

    # 요약할 메시지 (20개씩)
    messages_to_summarize = all_messages[summarized_count:summarized_count + 20]

    if len(messages_to_summarize) < 20:
        return None  # 20개 미만이면 요약하지 않음

    # 요약 생성
    summary_text = await generate_summary(messages_to_summarize)

    # 요약 저장
    summary = ConversationSummary(
        conversation_id=conversation_id,
        summary=summary_text,
        message_count=len(messages_to_summarize),
        start_message_id=messages_to_summarize[0].id,
        end_message_id=messages_to_summarize[-1].id
    )

    db.add(summary)
    db.commit()
    db.refresh(summary)

    print(f"✅ 대화 요약 생성: {len(messages_to_summarize)}개 메시지")

    return summary


def get_token_usage_stats(db: Session, conversation_id: UUID) -> dict:
    """
    대화의 토큰 사용량 통계

    Args:
        db: 데이터베이스 세션
        conversation_id: 대화 ID

    Returns:
        토큰 사용량 통계 딕셔너리
    """
    # 전체 메시지
    messages = db.query(Message).filter(
        Message.conversation_id == conversation_id
    ).all()

    # 요약
    summaries = db.query(ConversationSummary).filter(
        ConversationSummary.conversation_id == conversation_id
    ).all()

    # 토큰 추정
    total_message_tokens = sum(
        len(msg.content.split()) + len(msg.content) // 4
        for msg in messages
    )

    total_summary_tokens = sum(
        len(s.summary.split()) + len(s.summary) // 4
        for s in summaries
    )

    return {
        "total_messages": len(messages),
        "total_summaries": len(summaries),
        "estimated_message_tokens": total_message_tokens,
        "estimated_summary_tokens": total_summary_tokens,
        "compression_ratio": (
            total_summary_tokens / total_message_tokens
            if total_message_tokens > 0 else 0
        )
    }
