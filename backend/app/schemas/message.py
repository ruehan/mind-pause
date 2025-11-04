from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from uuid import UUID


class MessageBase(BaseModel):
    """메시지 기본 스키마"""
    content: str = Field(..., min_length=1, description="메시지 내용")


class MessageCreate(MessageBase):
    """메시지 생성 스키마"""
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "content": "오늘 기분이 좋지 않아요"
            }
        }
    )


class MessageResponse(MessageBase):
    """메시지 응답 스키마"""
    id: UUID
    conversation_id: UUID
    role: str  # 'user' 또는 'assistant'
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
