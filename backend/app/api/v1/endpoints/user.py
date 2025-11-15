"""
사용자 설정 및 선호도 API 엔드포인트
"""
from typing import Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field

from app.db.database import get_db
from app.models import UserPromptPreference
from app.core.security import get_current_user
from app.models.user import User


router = APIRouter()


# ==================== Pydantic Schemas ====================

class UserPreferenceResponse(BaseModel):
    """사용자 선호도 응답"""
    id: UUID
    user_id: UUID
    tone: str
    length: str
    empathy_level: str

    class Config:
        from_attributes = True


class UserPreferenceUpdate(BaseModel):
    """사용자 선호도 업데이트 요청"""
    tone: str = Field(..., description="말투: friendly, professional, casual")
    length: str = Field(..., description="길이: concise, balanced, detailed")
    empathy_level: str = Field(..., description="공감: high, medium, low")


# ==================== API Endpoints ====================

@router.get("/preferences", response_model=UserPreferenceResponse)
async def get_user_preferences(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    사용자 AI 응답 선호도 조회

    - 저장된 선호도가 없으면 기본값 반환
    """
    preference = db.query(UserPromptPreference).filter(
        UserPromptPreference.user_id == current_user.id
    ).first()

    if not preference:
        # 기본 선호도 생성
        preference = UserPromptPreference(
            user_id=current_user.id,
            tone="friendly",
            length="balanced",
            empathy_level="medium"
        )
        db.add(preference)
        db.commit()
        db.refresh(preference)

    return preference


@router.post("/preferences", response_model=UserPreferenceResponse)
async def save_user_preferences(
    preference_data: UserPreferenceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    사용자 AI 응답 선호도 저장

    - 기존 선호도가 있으면 업데이트
    - 없으면 새로 생성
    """
    # 기존 선호도 확인
    existing = db.query(UserPromptPreference).filter(
        UserPromptPreference.user_id == current_user.id
    ).first()

    if existing:
        # 업데이트
        existing.tone = preference_data.tone
        existing.length = preference_data.length
        existing.empathy_level = preference_data.empathy_level
        db.commit()
        db.refresh(existing)
        return existing
    else:
        # 새로 생성
        new_preference = UserPromptPreference(
            user_id=current_user.id,
            tone=preference_data.tone,
            length=preference_data.length,
            empathy_level=preference_data.empathy_level
        )
        db.add(new_preference)
        db.commit()
        db.refresh(new_preference)
        return new_preference
