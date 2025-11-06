"""챌린지 스키마"""
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime, date
from uuid import UUID
from enum import Enum


class ChallengeType(str, Enum):
    """챌린지 타입"""
    STREAK = "streak"
    COMMUNITY = "community"


class ChallengeStatus(str, Enum):
    """챌린지 승인 상태"""
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


# Template schemas
class ChallengeTemplateBase(BaseModel):
    """챌린지 템플릿 기본 스키마"""
    title: str = Field(..., min_length=1, max_length=100, description="템플릿 제목")
    description: str = Field(..., min_length=1, max_length=500, description="템플릿 설명")
    challenge_type: ChallengeType = Field(..., description="챌린지 타입")
    default_duration_days: int = Field(..., ge=1, le=365, description="기본 기간 (일)")
    default_target_count: int = Field(..., ge=1, description="기본 목표 횟수")
    icon: Optional[str] = Field(None, max_length=10, description="아이콘 이모지")
    reward_badge: Optional[str] = Field(None, max_length=50, description="완료 시 배지")


class ChallengeTemplateResponse(ChallengeTemplateBase):
    """챌린지 템플릿 응답 스키마"""
    id: UUID = Field(..., description="템플릿 ID")
    is_active: bool = Field(..., description="사용 가능 여부")
    created_at: datetime = Field(..., description="생성 일시")
    updated_at: datetime = Field(..., description="수정 일시")

    model_config = ConfigDict(from_attributes=True)


class ChallengeTemplateListResponse(BaseModel):
    """챌린지 템플릿 목록 응답 스키마"""
    templates: List[ChallengeTemplateResponse] = Field(..., description="템플릿 목록")
    total: int = Field(..., description="전체 템플릿 수")


# Challenge schemas
class ChallengeBase(BaseModel):
    """챌린지 기본 스키마"""
    title: str = Field(..., min_length=1, max_length=100, description="챌린지 제목")
    description: str = Field(..., min_length=1, max_length=500, description="챌린지 설명")
    challenge_type: ChallengeType = Field(..., description="챌린지 타입")
    duration_days: int = Field(..., ge=1, le=365, description="챌린지 기간 (일)")
    target_count: int = Field(..., ge=1, description="목표 횟수")
    icon: Optional[str] = Field(None, max_length=10, description="아이콘 이모지")
    reward_badge: Optional[str] = Field(None, max_length=50, description="완료 시 배지")


# Request schemas
class ChallengeCreate(BaseModel):
    """챌린지 생성 요청 스키마 (템플릿 기반)"""
    template_id: UUID = Field(..., description="템플릿 ID")
    start_date: date = Field(..., description="시작일")
    end_date: date = Field(..., description="종료일")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "template_id": "123e4567-e89b-12d3-a456-426614174000",
                "start_date": "2024-01-15",
                "end_date": "2024-01-22"
            }
        }
    )


class ChallengeUpdate(BaseModel):
    """챌린지 수정 요청 스키마"""
    title: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, min_length=1, max_length=500)
    start_date: Optional[date] = None
    end_date: Optional[date] = None


class ChallengeApprove(BaseModel):
    """챌린지 승인 요청 스키마"""
    pass


class ChallengeReject(BaseModel):
    """챌린지 거부 요청 스키마"""
    reason: Optional[str] = Field(None, max_length=500, description="거부 사유")


# Response schemas
class ChallengeResponse(ChallengeBase):
    """챌린지 응답 스키마"""
    id: UUID = Field(..., description="챌린지 ID")
    template_id: Optional[UUID] = Field(None, description="템플릿 ID")
    created_by: UUID = Field(..., description="생성자 ID")
    status: ChallengeStatus = Field(..., description="승인 상태")
    start_date: date = Field(..., description="시작일")
    end_date: date = Field(..., description="종료일")
    created_at: datetime = Field(..., description="생성 일시")
    updated_at: datetime = Field(..., description="수정 일시")

    # 추가 정보 (참여자 수 등)
    participants_count: Optional[int] = Field(0, description="참여자 수")

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "template_id": "123e4567-e89b-12d3-a456-426614174001",
                "created_by": "123e4567-e89b-12d3-a456-426614174002",
                "title": "7일 연속 감정 기록 챌린지",
                "description": "7일 동안 매일 감정을 기록해보세요!",
                "challenge_type": "streak",
                "duration_days": 7,
                "target_count": 7,
                "icon": "🔥",
                "reward_badge": "7일 연속 달성자",
                "status": "approved",
                "start_date": "2024-01-15",
                "end_date": "2024-01-22",
                "created_at": "2024-01-15T10:00:00Z",
                "updated_at": "2024-01-15T10:00:00Z",
                "participants_count": 150
            }
        }
    )


class UserChallengeJoin(BaseModel):
    """챌린지 참여 요청 스키마"""
    challenge_id: UUID = Field(..., description="챌린지 ID")


class UserChallengeResponse(BaseModel):
    """사용자 챌린지 응답 스키마"""
    id: UUID = Field(..., description="사용자 챌린지 ID")
    user_id: UUID = Field(..., description="사용자 ID")
    challenge_id: UUID = Field(..., description="챌린지 ID")
    challenge: ChallengeResponse = Field(..., description="챌린지 정보")
    joined_at: datetime = Field(..., description="참여 일시")
    current_streak: int = Field(..., description="현재 연속 일수")
    best_streak: int = Field(..., description="최고 연속 일수")
    completed_count: int = Field(..., description="완료 횟수")
    is_completed: bool = Field(..., description="챌린지 완료 여부")
    completed_at: Optional[datetime] = Field(None, description="완료 일시")
    last_activity_date: Optional[date] = Field(None, description="마지막 활동 날짜")
    progress_percentage: float = Field(..., description="진행률 (%)")

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174001",
                "user_id": "123e4567-e89b-12d3-a456-426614174002",
                "challenge_id": "123e4567-e89b-12d3-a456-426614174000",
                "challenge": {},
                "joined_at": "2024-01-15T10:00:00Z",
                "current_streak": 5,
                "best_streak": 5,
                "completed_count": 5,
                "is_completed": False,
                "completed_at": None,
                "last_activity_date": "2024-01-19",
                "progress_percentage": 71.4
            }
        }
    )


class ChallengeListResponse(BaseModel):
    """챌린지 목록 응답 스키마"""
    challenges: List[ChallengeResponse] = Field(..., description="챌린지 목록")
    total: int = Field(..., description="전체 챌린지 수")


class UserChallengeListResponse(BaseModel):
    """사용자 챌린지 목록 응답 스키마"""
    user_challenges: List[UserChallengeResponse] = Field(..., description="사용자 챌린지 목록")
    total: int = Field(..., description="전체 참여 챌린지 수")
