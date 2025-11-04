from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, Dict, Any
from datetime import datetime
from uuid import UUID


# Base schemas
class AICharacterBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, description="캐릭터 이름", example="따뜻한 친구")
    personality: str = Field(..., min_length=2, max_length=200, description="캐릭터 성격/역할", example="공감하고 격려하는 친구")
    description: Optional[str] = Field(None, description="캐릭터 설명", example="항상 당신의 이야기를 경청하고 따뜻하게 공감해주는 친구입니다.")
    avatar_options: Optional[Dict[str, Any]] = Field(None, description="아바타 커스터마이징 옵션 (JSON)")
    system_prompt: Optional[str] = Field(None, description="AI 시스템 프롬프트")


# Request schemas
class AICharacterCreate(AICharacterBase):
    """AI 캐릭터 생성 요청 스키마"""
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "name": "따뜻한 친구",
                "personality": "공감하고 격려하는 친구",
                "description": "항상 당신의 이야기를 경청하고 따뜻하게 공감해주는 친구입니다.",
                "avatar_options": {
                    "sex": "man",
                    "faceColor": "#F9C9B6",
                    "earSize": "small",
                    "hairStyle": "normal",
                    "hairColor": "#000",
                    "eyeStyle": "circle",
                    "mouthStyle": "smile",
                    "shirtStyle": "hoody",
                    "shirtColor": "#506AF4"
                },
                "system_prompt": "당신은 사용자의 감정에 공감하고 따뜻하게 격려하는 친구입니다."
            }
        }
    )


class AICharacterUpdate(BaseModel):
    """AI 캐릭터 수정 요청 스키마"""
    name: Optional[str] = Field(None, min_length=2, max_length=100, description="캐릭터 이름")
    personality: Optional[str] = Field(None, min_length=2, max_length=200, description="캐릭터 성격/역할")
    description: Optional[str] = Field(None, description="캐릭터 설명")
    avatar_options: Optional[Dict[str, Any]] = Field(None, description="아바타 커스터마이징 옵션 (JSON)")
    system_prompt: Optional[str] = Field(None, description="AI 시스템 프롬프트")
    is_active: Optional[bool] = Field(None, description="활성 상태")


# Response schemas
class AICharacterResponse(AICharacterBase):
    """AI 캐릭터 응답 스키마"""
    id: UUID = Field(..., description="캐릭터 고유 ID")
    user_id: UUID = Field(..., description="소유자 사용자 ID")
    is_active: bool = Field(..., description="활성 상태")
    created_at: datetime = Field(..., description="생성 일시")
    updated_at: datetime = Field(..., description="수정 일시")

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "user_id": "987e6543-e21b-12d3-a456-426614174000",
                "name": "따뜻한 친구",
                "personality": "공감하고 격려하는 친구",
                "description": "항상 당신의 이야기를 경청하고 따뜻하게 공감해주는 친구입니다.",
                "avatar_options": {
                    "sex": "man",
                    "faceColor": "#F9C9B6",
                    "earSize": "small",
                    "hairStyle": "normal",
                    "hairColor": "#000",
                    "eyeStyle": "circle",
                    "mouthStyle": "smile",
                    "shirtStyle": "hoody",
                    "shirtColor": "#506AF4"
                },
                "system_prompt": "당신은 사용자의 감정에 공감하고 따뜻하게 격려하는 친구입니다.",
                "is_active": True,
                "created_at": "2024-01-01T00:00:00Z",
                "updated_at": "2024-01-01T00:00:00Z"
            }
        }
    )
