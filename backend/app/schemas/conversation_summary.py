from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime
from uuid import UUID


class ConversationSummaryBase(BaseModel):
    """대화 요약 기본 스키마"""
    summary: str = Field(..., min_length=10, description="요약 내용")
    message_count: int = Field(..., gt=0, description="요약된 메시지 수")


class ConversationSummaryCreate(ConversationSummaryBase):
    """대화 요약 생성 스키마"""
    start_message_id: Optional[UUID] = Field(None, description="요약 시작 메시지 ID")
    end_message_id: Optional[UUID] = Field(None, description="요약 끝 메시지 ID")


class ConversationSummaryResponse(ConversationSummaryBase):
    """대화 요약 응답 스키마"""
    id: UUID
    conversation_id: UUID
    start_message_id: Optional[UUID]
    end_message_id: Optional[UUID]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
