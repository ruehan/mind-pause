"""
메트릭 및 통계 API 엔드포인트
"""
from typing import List
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from pydantic import BaseModel

from app.db.database import get_db
from app.models import Conversation, Message, ConversationMetrics, MessageFeedback, ConversationRating
from app.core.security import get_current_user
from app.models.user import User


router = APIRouter()


# ==================== Pydantic Schemas ====================

class MetricsOverview(BaseModel):
    """전체 메트릭 개요"""
    # 대화 통계
    total_conversations: int
    total_messages: int
    avg_messages_per_conversation: float

    # 성능 통계
    avg_response_time_ms: float | None
    min_response_time_ms: float | None
    max_response_time_ms: float | None

    # 토큰 사용량
    avg_input_tokens: float | None
    avg_output_tokens: float | None
    total_tokens_used: int

    # 피드백 통계
    total_feedbacks: int
    positive_feedbacks: int
    negative_feedbacks: int
    feedback_ratio: float  # 좋아요 비율 (0-100)

    # 만족도 통계
    total_ratings: int
    average_rating: float | None  # 1-5 평균


class DailyMetric(BaseModel):
    """일일 메트릭"""
    date: str
    conversations: int
    messages: int
    avg_response_time_ms: float | None
    positive_feedbacks: int
    negative_feedbacks: int
    avg_rating: float | None


# ==================== API Endpoints ====================

@router.get("/overview", response_model=MetricsOverview)
async def get_metrics_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    전체 메트릭 개요 조회

    현재 사용자의 모든 대화에 대한 통계를 반환합니다.
    """
    # 사용자의 대화 ID 목록
    conversation_ids = db.query(Conversation.id).filter(
        Conversation.user_id == current_user.id
    ).all()
    conversation_ids = [c[0] for c in conversation_ids]

    # 대화 통계
    total_conversations = len(conversation_ids)
    total_messages = db.query(func.count(Message.id)).filter(
        Message.conversation_id.in_(conversation_ids)
    ).scalar() or 0

    avg_messages = total_messages / total_conversations if total_conversations > 0 else 0

    # 메트릭 집계
    metrics_agg = db.query(
        func.avg(ConversationMetrics.avg_response_time_ms).label('avg_response_time'),
        func.min(ConversationMetrics.min_response_time_ms).label('min_response_time'),
        func.max(ConversationMetrics.max_response_time_ms).label('max_response_time'),
        func.avg(ConversationMetrics.avg_input_tokens).label('avg_input'),
        func.avg(ConversationMetrics.avg_output_tokens).label('avg_output'),
        func.sum(ConversationMetrics.total_input_tokens).label('total_input'),
        func.sum(ConversationMetrics.total_output_tokens).label('total_output'),
        func.sum(ConversationMetrics.positive_feedbacks).label('positive'),
        func.sum(ConversationMetrics.negative_feedbacks).label('negative'),
    ).filter(
        ConversationMetrics.conversation_id.in_(conversation_ids)
    ).first()

    # 피드백 통계
    positive = int(metrics_agg.positive or 0)
    negative = int(metrics_agg.negative or 0)
    total_feedbacks = positive + negative
    feedback_ratio = (positive / total_feedbacks * 100) if total_feedbacks > 0 else 0

    # 만족도 통계
    rating_stats = db.query(
        func.count(ConversationRating.id).label('count'),
        func.avg(ConversationRating.rating).label('avg')
    ).filter(
        ConversationRating.conversation_id.in_(conversation_ids)
    ).first()

    return MetricsOverview(
        total_conversations=total_conversations,
        total_messages=total_messages,
        avg_messages_per_conversation=round(avg_messages, 1),
        avg_response_time_ms=round(metrics_agg.avg_response_time, 2) if metrics_agg.avg_response_time else None,
        min_response_time_ms=round(metrics_agg.min_response_time, 2) if metrics_agg.min_response_time else None,
        max_response_time_ms=round(metrics_agg.max_response_time, 2) if metrics_agg.max_response_time else None,
        avg_input_tokens=round(metrics_agg.avg_input, 1) if metrics_agg.avg_input else None,
        avg_output_tokens=round(metrics_agg.avg_output, 1) if metrics_agg.avg_output else None,
        total_tokens_used=int((metrics_agg.total_input or 0) + (metrics_agg.total_output or 0)),
        total_feedbacks=total_feedbacks,
        positive_feedbacks=positive,
        negative_feedbacks=negative,
        feedback_ratio=round(feedback_ratio, 1),
        total_ratings=int(rating_stats.count or 0),
        average_rating=round(rating_stats.avg, 2) if rating_stats.avg else None,
    )


@router.get("/daily", response_model=List[DailyMetric])
async def get_daily_metrics(
    days: int = 7,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    일일 메트릭 조회

    최근 N일간의 일별 통계를 반환합니다.
    """
    # 날짜 범위
    end_date = datetime.utcnow().date()
    start_date = end_date - timedelta(days=days - 1)

    # 사용자의 대화 목록
    conversations = db.query(Conversation).filter(
        Conversation.user_id == current_user.id,
        func.date(Conversation.created_at) >= start_date
    ).all()

    # 날짜별 그룹화
    daily_data = {}
    for i in range(days):
        date = start_date + timedelta(days=i)
        daily_data[str(date)] = {
            'date': str(date),
            'conversations': 0,
            'messages': 0,
            'response_times': [],
            'positive': 0,
            'negative': 0,
            'ratings': [],
        }

    # 대화 및 메시지 집계
    for conv in conversations:
        date_key = str(conv.created_at.date())
        if date_key in daily_data:
            daily_data[date_key]['conversations'] += 1

            # 메시지 수
            msg_count = db.query(func.count(Message.id)).filter(
                Message.conversation_id == conv.id
            ).scalar() or 0
            daily_data[date_key]['messages'] += msg_count

            # 메트릭
            metrics = db.query(ConversationMetrics).filter(
                ConversationMetrics.conversation_id == conv.id
            ).first()
            if metrics:
                if metrics.avg_response_time_ms:
                    daily_data[date_key]['response_times'].append(metrics.avg_response_time_ms)
                daily_data[date_key]['positive'] += metrics.positive_feedbacks or 0
                daily_data[date_key]['negative'] += metrics.negative_feedbacks or 0

            # 만족도
            rating = db.query(ConversationRating).filter(
                ConversationRating.conversation_id == conv.id
            ).first()
            if rating:
                daily_data[date_key]['ratings'].append(rating.rating)

    # 결과 변환
    result = []
    for date_key in sorted(daily_data.keys()):
        data = daily_data[date_key]
        avg_response = sum(data['response_times']) / len(data['response_times']) if data['response_times'] else None
        avg_rating = sum(data['ratings']) / len(data['ratings']) if data['ratings'] else None

        result.append(DailyMetric(
            date=data['date'],
            conversations=data['conversations'],
            messages=data['messages'],
            avg_response_time_ms=round(avg_response, 2) if avg_response else None,
            positive_feedbacks=data['positive'],
            negative_feedbacks=data['negative'],
            avg_rating=round(avg_rating, 2) if avg_rating else None,
        ))

    return result
