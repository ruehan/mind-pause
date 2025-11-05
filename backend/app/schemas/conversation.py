from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime
from uuid import UUID


class ConversationBase(BaseModel):
    """대화 기본 스키마"""
    title: Optional[str] = Field(None, max_length=200, description="대화 제목")


class ConversationCreate(ConversationBase):
    """대화 생성 스키마"""
    character_id: UUID = Field(..., description="AI 캐릭터 ID")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "character_id": "123e4567-e89b-12d3-a456-426614174000",
                "title": "오늘의 감정 상담"
            }
        }
    )


class ConversationUpdate(BaseModel):
    """대화 업데이트 스키마"""
    title: Optional[str] = Field(None, max_length=200, description="대화 제목")


class ConversationResponse(ConversationBase):
    """대화 응답 스키마"""
    id: UUID
    user_id: UUID
    character_id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
