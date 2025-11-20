"""
사용자 설정 및 선호도 API 엔드포인트
"""
from typing import Optional
from uuid import UUID
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field

from app.db.database import get_db
from app.models import UserPromptPreference, AICharacter
from app.core.security import get_current_user
from app.models.user import User


router = APIRouter()


# ==================== 값 매핑 ====================

# UI 값 → 모델 값 매핑
TONE_MAP = {
    "friendly": "casual",
    "professional": "formal",
    "casual": "mixed"
}

LENGTH_MAP = {
    "concise": "short",
    "balanced": "medium",
    "detailed": "long"
}

EMPATHY_MAP = {
    "high": "moderate",    # 이모지를 공감의 척도로 활용
    "medium": "minimal",
    "low": "none"
}

# 모델 값 → UI 값 역매핑
REVERSE_TONE_MAP = {v: k for k, v in TONE_MAP.items()}
REVERSE_LENGTH_MAP = {v: k for k, v in LENGTH_MAP.items()}
REVERSE_EMPATHY_MAP = {v: k for k, v in EMPATHY_MAP.items()}


# ==================== Pydantic Schemas ====================

class UserPreferenceResponse(BaseModel):
    """사용자 선호도 응답"""
    tone: str
    length: str
    empathy_level: str

    class Config:
        from_attributes = False


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
    # 기본 캐릭터 조회 (첫 번째 캐릭터)
    default_character = db.query(AICharacter).first()
    if not default_character:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="기본 AI 캐릭터를 찾을 수 없습니다"
        )

    # 선호도 조회
    preference = db.query(UserPromptPreference).filter(
        UserPromptPreference.user_id == current_user.id,
        UserPromptPreference.character_id == default_character.id
    ).first()

    if not preference:
        # 기본 선호도 생성 (모델 필드 사용)
        preference = UserPromptPreference(
            user_id=current_user.id,
            character_id=default_character.id,
            preferred_tone="casual",        # friendly
            preferred_response_length="medium",  # balanced
            emoji_preference="minimal"       # medium empathy
        )
        db.add(preference)
        db.commit()
        db.refresh(preference)

    # 모델 값을 UI 값으로 변환
    return UserPreferenceResponse(
        tone=REVERSE_TONE_MAP.get(preference.preferred_tone, "friendly"),
        length=REVERSE_LENGTH_MAP.get(preference.preferred_response_length, "balanced"),
        empathy_level=REVERSE_EMPATHY_MAP.get(preference.emoji_preference, "medium")
    )


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
    # 기본 캐릭터 조회
    default_character = db.query(AICharacter).first()
    if not default_character:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="기본 AI 캐릭터를 찾을 수 없습니다"
        )

    # UI 값을 모델 값으로 변환
    model_tone = TONE_MAP.get(preference_data.tone, "casual")
    model_length = LENGTH_MAP.get(preference_data.length, "medium")
    model_empathy = EMPATHY_MAP.get(preference_data.empathy_level, "minimal")

    # 기존 선호도 확인
    existing = db.query(UserPromptPreference).filter(
        UserPromptPreference.user_id == current_user.id,
        UserPromptPreference.character_id == default_character.id
    ).first()

    if existing:
        # 업데이트
        existing.preferred_tone = model_tone
        existing.preferred_response_length = model_length
        existing.emoji_preference = model_empathy
        existing.last_updated = datetime.utcnow()
        db.commit()
        db.refresh(existing)

        # UI 값으로 변환하여 반환
        return UserPreferenceResponse(
            tone=preference_data.tone,
            length=preference_data.length,
            empathy_level=preference_data.empathy_level
        )
    else:
        # 새로 생성
        new_preference = UserPromptPreference(
            user_id=current_user.id,
            character_id=default_character.id,
            preferred_tone=model_tone,
            preferred_response_length=model_length,
            emoji_preference=model_empathy
        )
        db.add(new_preference)
        db.commit()
        db.refresh(new_preference)

        # UI 값으로 변환하여 반환
        return UserPreferenceResponse(
            tone=preference_data.tone,
            length=preference_data.length,
            empathy_level=preference_data.empathy_level
        )
