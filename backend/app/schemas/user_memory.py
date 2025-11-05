from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, Dict, Any
from datetime import datetime
from uuid import UUID


class UserMemoryBase(BaseModel):
    """사용자 메모리 기본 스키마"""
    memory_type: str = Field(
        ...,
        description="메모리 타입: fact, preference, emotion_pattern, tone_preference"
    )
    content: Dict[str, Any] = Field(..., description="메모리 내용 (JSON)")
    confidence_score: float = Field(
        default=1.0,
        ge=0.0,
        le=1.0,
        description="신뢰도 점수 (0.0 ~ 1.0)"
    )


class UserMemoryCreate(UserMemoryBase):
    """사용자 메모리 생성 스키마"""
    source_conversation_id: Optional[UUID] = Field(None, description="출처 대화 ID")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "memory_type": "preference",
                "content": {
                    "category": "communication_style",
                    "preference": "간결하고 실행 가능한 조언 선호",
                    "confidence": 0.85
                },
                "confidence_score": 0.85,
                "source_conversation_id": "123e4567-e89b-12d3-a456-426614174000"
            }
        }
    )


class UserMemoryUpdate(BaseModel):
    """사용자 메모리 업데이트 스키마"""
    content: Optional[Dict[str, Any]] = Field(None, description="메모리 내용")
    confidence_score: Optional[float] = Field(
        None,
        ge=0.0,
        le=1.0,
        description="신뢰도 점수"
    )


class UserMemoryResponse(UserMemoryBase):
    """사용자 메모리 응답 스키마"""
    id: UUID
    user_id: UUID
    character_id: UUID
    source_conversation_id: Optional[UUID]
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
