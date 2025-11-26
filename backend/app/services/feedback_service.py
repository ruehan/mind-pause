"""
피드백 서비스 - 피드백 통계 및 관리
"""
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Dict, Any, Optional, List
from uuid import UUID

from app.models import MessageFeedback, ConversationRating, Message, Conversation

def get_feedback_stats(
    db: Session,
    user_id: UUID,
    days: int = 30
) -> Dict[str, Any]:
    """
    사용자 피드백 통계 조회
    
    Args:
        db: 데이터베이스 세션
        user_id: 사용자 ID
        days: 조회 기간 (일)
        
    Returns:
        피드백 통계 딕셔너리
    """
    # 기준 날짜 계산
    start_date = datetime.utcnow() - timedelta(days=days)

    # 메시지 피드백 통계
    message_feedbacks = db.query(MessageFeedback).join(
        Message, MessageFeedback.message_id == Message.id
    ).join(
        Conversation, Message.conversation_id == Conversation.id
    ).filter(
        Conversation.user_id == user_id,
        MessageFeedback.created_at >= start_date
    ).all()

    total_feedbacks = len(message_feedbacks)
    positive_feedbacks = sum(1 for f in message_feedbacks if f.is_helpful)
    negative_feedbacks = total_feedbacks - positive_feedbacks
    positive_ratio = (positive_feedbacks / total_feedbacks * 100) if total_feedbacks > 0 else 0.0

    # 대화 평가 통계
    conversation_ratings = db.query(ConversationRating).filter(
        ConversationRating.user_id == user_id,
        ConversationRating.created_at >= start_date
    ).all()

    total_conversations_rated = len(conversation_ratings)
    average_rating = None
    if total_conversations_rated > 0:
        average_rating = sum(r.rating for r in conversation_ratings) / total_conversations_rated

    # 최근 피드백 5개 (부정적 피드백 우선)
    recent_feedbacks_query = db.query(MessageFeedback).join(
        Message, MessageFeedback.message_id == Message.id
    ).join(
        Conversation, Message.conversation_id == Conversation.id
    ).filter(
        Conversation.user_id == user_id
    ).order_by(
        MessageFeedback.is_helpful.asc(),  # False (부정) 먼저
        MessageFeedback.created_at.desc()
    ).limit(5).all()
    
    recent_feedbacks = [
        {
            "id": f.id,
            "message_id": f.message_id,
            "is_helpful": f.is_helpful,
            "feedback_text": f.feedback_text,
            "created_at": f.created_at,
            "updated_at": f.updated_at
        } for f in recent_feedbacks_query
    ]

    return {
        "total_feedbacks": total_feedbacks,
        "positive_feedbacks": positive_feedbacks,
        "negative_feedbacks": negative_feedbacks,
        "positive_ratio": round(positive_ratio, 2),
        "total_conversations_rated": total_conversations_rated,
        "average_rating": round(average_rating, 2) if average_rating else None,
        "recent_feedbacks": recent_feedbacks
    }
