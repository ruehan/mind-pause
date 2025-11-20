"""
피드백 및 평가 API 엔드포인트
"""
from typing import Optional, List
from uuid import UUID
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from pydantic import BaseModel, Field

from app.db.database import get_db
from app.models import MessageFeedback, ConversationRating, Message, Conversation, ConversationMetrics, AICharacter
from app.core.security import get_current_user
from app.models.user import User


router = APIRouter()


# ==================== Pydantic Schemas ====================

class MessageFeedbackCreate(BaseModel):
    """메시지 피드백 생성 요청"""
    message_id: UUID
    is_helpful: bool
    feedback_text: Optional[str] = Field(None, max_length=500)


class MessageFeedbackResponse(BaseModel):
    """메시지 피드백 응답"""
    id: UUID
    message_id: UUID
    is_helpful: bool
    feedback_text: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ConversationRatingCreate(BaseModel):
    """대화 평가 생성 요청"""
    conversation_id: UUID
    rating: int = Field(..., ge=1, le=5, description="1-5 별점")
    feedback_text: Optional[str] = Field(None, max_length=1000)


class ConversationRatingResponse(BaseModel):
    """대화 평가 응답"""
    id: UUID
    conversation_id: UUID
    rating: int
    feedback_text: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class FeedbackStatsResponse(BaseModel):
    """피드백 통계 응답"""
    total_feedbacks: int
    positive_feedbacks: int
    negative_feedbacks: int
    positive_ratio: float
    total_conversations_rated: int
    average_rating: Optional[float]
    recent_feedbacks: List[MessageFeedbackResponse]

    class Config:
        from_attributes = True


# ==================== API Endpoints ====================

@router.post("/message", response_model=MessageFeedbackResponse, status_code=status.HTTP_201_CREATED)
async def create_or_update_message_feedback(
    feedback_data: MessageFeedbackCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    메시지 피드백 생성 또는 업데이트

    - 같은 메시지에 이미 피드백이 있으면 업데이트
    - 없으면 새로 생성
    """
    # 메시지 존재 여부 및 권한 확인
    message = db.query(Message).filter(Message.id == feedback_data.message_id).first()
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="메시지를 찾을 수 없습니다"
        )

    # 대화 권한 확인
    conversation = db.query(Conversation).filter(
        Conversation.id == message.conversation_id,
        Conversation.user_id == current_user.id
    ).first()
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="이 메시지에 대한 권한이 없습니다"
        )

    # 기존 피드백 확인
    existing_feedback = db.query(MessageFeedback).filter(
        MessageFeedback.message_id == feedback_data.message_id,
        MessageFeedback.user_id == current_user.id
    ).first()

    # 메트릭 업데이트 준비
    metrics = db.query(ConversationMetrics).filter(
        ConversationMetrics.conversation_id == conversation.id
    ).first()

    if not metrics:
        metrics = ConversationMetrics(
            conversation_id=conversation.id,
            positive_feedbacks=0,
            negative_feedbacks=0
        )
        db.add(metrics)
    else:
        # 기존 메트릭의 None 값 처리
        if metrics.positive_feedbacks is None:
            metrics.positive_feedbacks = 0
        if metrics.negative_feedbacks is None:
            metrics.negative_feedbacks = 0

    if existing_feedback:
        # 기존 피드백 변경 시 메트릭 조정
        if existing_feedback.is_helpful != feedback_data.is_helpful:
            if existing_feedback.is_helpful:
                metrics.positive_feedbacks -= 1
                metrics.negative_feedbacks += 1
            else:
                metrics.negative_feedbacks -= 1
                metrics.positive_feedbacks += 1

        # 업데이트
        existing_feedback.is_helpful = feedback_data.is_helpful
        existing_feedback.feedback_text = feedback_data.feedback_text
        db.commit()
        db.refresh(existing_feedback)
        return existing_feedback
    else:
        # 새로운 피드백 메트릭 업데이트
        if feedback_data.is_helpful:
            metrics.positive_feedbacks += 1
        else:
            metrics.negative_feedbacks += 1

        # 새로 생성
        new_feedback = MessageFeedback(
            message_id=feedback_data.message_id,
            user_id=current_user.id,
            is_helpful=feedback_data.is_helpful,
            feedback_text=feedback_data.feedback_text
        )
        db.add(new_feedback)
        db.commit()
        db.refresh(new_feedback)
        return new_feedback


@router.get("/message/{message_id}", response_model=Optional[MessageFeedbackResponse])
async def get_message_feedback(
    message_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    메시지 피드백 조회
    """
    feedback = db.query(MessageFeedback).filter(
        MessageFeedback.message_id == message_id,
        MessageFeedback.user_id == current_user.id
    ).first()

    return feedback


@router.post("/conversation", response_model=ConversationRatingResponse, status_code=status.HTTP_201_CREATED)
async def create_or_update_conversation_rating(
    rating_data: ConversationRatingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    대화 만족도 평가 생성 또는 업데이트

    - 같은 대화에 이미 평가가 있으면 업데이트
    - 없으면 새로 생성
    """
    # 대화 존재 여부 및 권한 확인
    conversation = db.query(Conversation).filter(
        Conversation.id == rating_data.conversation_id,
        Conversation.user_id == current_user.id
    ).first()
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="대화를 찾을 수 없습니다"
        )

    # 기존 평가 확인
    existing_rating = db.query(ConversationRating).filter(
        ConversationRating.conversation_id == rating_data.conversation_id,
        ConversationRating.user_id == current_user.id
    ).first()

    if existing_rating:
        # 업데이트
        existing_rating.rating = rating_data.rating
        existing_rating.feedback_text = rating_data.feedback_text
        db.commit()
        db.refresh(existing_rating)
        return existing_rating
    else:
        # 새로 생성
        new_rating = ConversationRating(
            conversation_id=rating_data.conversation_id,
            user_id=current_user.id,
            rating=rating_data.rating,
            feedback_text=rating_data.feedback_text
        )
        db.add(new_rating)
        db.commit()
        db.refresh(new_rating)
        return new_rating


@router.get("/conversation/{conversation_id}", response_model=Optional[ConversationRatingResponse])
async def get_conversation_rating(
    conversation_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    대화 만족도 평가 조회
    """
    rating = db.query(ConversationRating).filter(
        ConversationRating.conversation_id == conversation_id,
        ConversationRating.user_id == current_user.id
    ).first()

    return rating


@router.get("/stats", response_model=FeedbackStatsResponse)
async def get_feedback_statistics(
    days: int = Query(30, ge=1, le=365, description="최근 N일 통계"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    사용자 피드백 통계 조회

    - 최근 N일간의 메시지 피드백 및 대화 평가 통계
    - 긍정/부정 비율, 평균 별점 등 제공
    """
    # 기준 날짜 계산
    start_date = datetime.utcnow() - timedelta(days=days)

    # 메시지 피드백 통계
    message_feedbacks = db.query(MessageFeedback).join(
        Message, MessageFeedback.message_id == Message.id
    ).join(
        Conversation, Message.conversation_id == Conversation.id
    ).filter(
        Conversation.user_id == current_user.id,
        MessageFeedback.created_at >= start_date
    ).all()

    total_feedbacks = len(message_feedbacks)
    positive_feedbacks = sum(1 for f in message_feedbacks if f.is_helpful)
    negative_feedbacks = total_feedbacks - positive_feedbacks
    positive_ratio = (positive_feedbacks / total_feedbacks * 100) if total_feedbacks > 0 else 0.0

    # 대화 평가 통계
    conversation_ratings = db.query(ConversationRating).filter(
        ConversationRating.user_id == current_user.id,
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
        Conversation.user_id == current_user.id
    ).order_by(
        MessageFeedback.is_helpful.asc(),  # False (부정) 먼저
        MessageFeedback.created_at.desc()
    ).limit(5).all()

    return FeedbackStatsResponse(
        total_feedbacks=total_feedbacks,
        positive_feedbacks=positive_feedbacks,
        negative_feedbacks=negative_feedbacks,
        positive_ratio=round(positive_ratio, 2),
        total_conversations_rated=total_conversations_rated,
        average_rating=round(average_rating, 2) if average_rating else None,
        recent_feedbacks=[
            MessageFeedbackResponse(
                id=f.id,
                message_id=f.message_id,
                is_helpful=f.is_helpful,
                feedback_text=f.feedback_text,
                created_at=f.created_at,
                updated_at=f.updated_at
            ) for f in recent_feedbacks_query
        ]
    )
