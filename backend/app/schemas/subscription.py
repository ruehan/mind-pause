"""
구독 관련 스키마
"""
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime
from decimal import Decimal
from enum import Enum


class SubscriptionTierEnum(str, Enum):
    """구독 티어"""
    FREE = "FREE"
    PREMIUM = "PREMIUM"
    ENTERPRISE = "ENTERPRISE"


class SubscriptionStatusEnum(str, Enum):
    """구독 상태"""
    ACTIVE = "ACTIVE"
    CANCELED = "CANCELED"
    EXPIRED = "EXPIRED"
    PAUSED = "PAUSED"


# ========== SubscriptionPlan 스키마 ==========

class SubscriptionPlanBase(BaseModel):
    """구독 플랜 기본 스키마"""
    tier: SubscriptionTierEnum
    name: str
    description: Optional[str] = None
    monthly_token_limit: int
    daily_token_limit: int
    price_monthly: Optional[Decimal] = None
    price_yearly: Optional[Decimal] = None
    currency: str = "KRW"
    max_conversations_per_day: Optional[int] = None
    features: Optional[Dict[str, Any]] = None
    is_active: bool = True
    display_order: int = 0


class SubscriptionPlanCreate(SubscriptionPlanBase):
    """구독 플랜 생성 요청"""
    pass


class SubscriptionPlanUpdate(BaseModel):
    """구독 플랜 수정 요청"""
    name: Optional[str] = None
    description: Optional[str] = None
    monthly_token_limit: Optional[int] = None
    daily_token_limit: Optional[int] = None
    price_monthly: Optional[Decimal] = None
    price_yearly: Optional[Decimal] = None
    max_conversations_per_day: Optional[int] = None
    features: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None
    display_order: Optional[int] = None


class SubscriptionPlanResponse(SubscriptionPlanBase):
    """구독 플랜 응답"""
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ========== Subscription 스키마 ==========

class SubscriptionCreate(BaseModel):
    """구독 생성 요청"""
    plan_id: str
    tier: SubscriptionTierEnum


class SubscriptionResponse(BaseModel):
    """구독 정보 응답"""
    id: str
    user_id: str
    plan_id: str
    tier: SubscriptionTierEnum
    status: SubscriptionStatusEnum
    started_at: datetime
    expires_at: Optional[datetime] = None
    canceled_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class SubscriptionWithPlan(SubscriptionResponse):
    """플랜 정보 포함 구독 응답"""
    plan: SubscriptionPlanResponse

    class Config:
        from_attributes = True


# ========== 업그레이드/다운그레이드 ==========

class SubscriptionUpgradeRequest(BaseModel):
    """구독 업그레이드 요청"""
    tier: SubscriptionTierEnum


class SubscriptionCancelRequest(BaseModel):
    """구독 취소 요청"""
    reason: Optional[str] = None
