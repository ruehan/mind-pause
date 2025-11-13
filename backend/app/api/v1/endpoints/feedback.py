"""
피드백 및 평가 API 엔드포인트
"""
from typing import Optional
from uuid import UUID
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field

from app.db.database import get_db
from app.models import MessageFeedback, ConversationRating, Message, Conversation, ConversationMetrics
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
