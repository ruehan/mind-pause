from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import Optional, List
from datetime import datetime
from uuid import UUID


# Base schemas
class EmotionLogBase(BaseModel):
    emotion_value: int = Field(..., ge=-3, le=3, description="감정 점수 (-3: 매우 안좋음, 0: 보통, 3: 매우 좋음)")
    emotion_label: str = Field(..., min_length=1, max_length=50, description="감정 레이블")
    emotion_emoji: str = Field(..., min_length=1, max_length=10, description="감정 이모지")
    note: Optional[str] = Field(None, description="사용자 메모")


# Request schemas
class EmotionLogCreate(EmotionLogBase):
    """감정 기록 생성 요청 스키마"""
    ai_feedback: Optional[str] = Field(None, description="AI 피드백")

    @field_validator('emotion_value')
    @classmethod
    def validate_emotion_value(cls, v):
        if v < -3 or v > 3:
            raise ValueError('emotion_value는 -3부터 3 사이의 값이어야 합니다')
        return v

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "emotion_value": 2,
                "emotion_label": "좋음",
                "emotion_emoji": "😊",
                "note": "오늘은 친구들과 즐거운 시간을 보냈어요!",
                "ai_feedback": "긍정적인 사회적 활동이 기분을 좋게 만들었네요!"
            }
        }
    )


class EmotionLogUpdate(BaseModel):
    """감정 기록 수정 요청 스키마"""
    emotion_value: Optional[int] = Field(None, ge=-3, le=3, description="감정 점수")
    emotion_label: Optional[str] = Field(None, min_length=1, max_length=50, description="감정 레이블")
    emotion_emoji: Optional[str] = Field(None, min_length=1, max_length=10, description="감정 이모지")
    note: Optional[str] = Field(None, description="사용자 메모")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "emotion_value": 1,
                "emotion_label": "조금 좋음",
                "emotion_emoji": "🙂",
                "note": "생각보다 괜찮은 하루였어요."
            }
        }
    )


# Response schemas
class EmotionLogResponse(EmotionLogBase):
    """감정 기록 응답 스키마"""
    id: UUID = Field(..., description="감정 기록 고유 ID")
    user_id: UUID = Field(..., description="사용자 ID")
    ai_feedback: Optional[str] = Field(None, description="AI 피드백")
    created_at: datetime = Field(..., description="생성 일시")
    updated_at: datetime = Field(..., description="수정 일시")

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "user_id": "123e4567-e89b-12d3-a456-426614174001",
                "emotion_value": 2,
                "emotion_label": "좋음",
                "emotion_emoji": "😊",
                "note": "오늘은 친구들과 즐거운 시간을 보냈어요!",
                "ai_feedback": "긍정적인 사회적 활동이 기분을 좋게 만들었네요! 이런 순간들이 정신 건강에 매우 좋습니다.",
                "created_at": "2024-01-15T10:00:00Z",
                "updated_at": "2024-01-15T10:00:00Z"
            }
        }
    )


class EmotionLogListResponse(BaseModel):
    """감정 기록 목록 응답 스키마"""
    emotion_logs: List[EmotionLogResponse] = Field(..., description="감정 기록 목록")
    total: int = Field(..., description="전체 기록 수")
    page: int = Field(..., description="현재 페이지")
    page_size: int = Field(..., description="페이지 크기")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "emotion_logs": [],
                "total": 50,
                "page": 1,
                "page_size": 20
            }
        }
    )


class EmotionStatsResponse(BaseModel):
    """감정 통계 응답 스키마"""
    average_emotion: float = Field(..., description="평균 감정 점수")
    total_records: int = Field(..., description="총 기록 수")
    streak_days: int = Field(..., description="연속 기록 일수")
    emotion_distribution: dict = Field(..., description="감정 분포")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "average_emotion": 1.8,
                "total_records": 24,
                "streak_days": 7,
                "emotion_distribution": {
                    "3": 8,
                    "2": 7,
                    "1": 5,
                    "0": 2,
                    "-1": 1,
                    "-2": 1,
                    "-3": 0
                }
            }
        }
    )
