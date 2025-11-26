from sqlalchemy import Column, String, Integer, Boolean, Numeric, JSON, DateTime, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from datetime import datetime
import uuid
import enum
from app.db.database import Base


class SubscriptionTier(str, enum.Enum):
    """구독 티어"""
    FREE = "FREE"
    PREMIUM = "PREMIUM"
    ENTERPRISE = "ENTERPRISE"


class SubscriptionPlan(Base):
    """
    구독 플랜 설정 모델
    관리자가 동적으로 수정 가능한 플랜 정보
    """
    __tablename__ = "subscription_plans"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tier = Column(SQLEnum(SubscriptionTier), unique=True, nullable=False, index=True)
    
    # 플랜 정보
    name = Column(String(100), nullable=False)  # 예: "무료", "프리미엄", "기업"
    description = Column(String(500), nullable=True)
    
    # 토큰 한도
    monthly_token_limit = Column(Integer, nullable=False)  # 월간 토큰 한도
    daily_token_limit = Column(Integer, nullable=False)  # 일간 토큰 한도
    
    # 가격 정보
    price_monthly = Column(Numeric(10, 2), nullable=True)  # 월 구독료
    price_yearly = Column(Numeric(10, 2), nullable=True)  # 연 구독료
    currency = Column(String(10), default="KRW", nullable=False)
    
    # 기능 제한
    max_conversations_per_day = Column(Integer, nullable=True)  # 일일 대화 제한
    features = Column(JSON, nullable=True)  # {"priority_support": true, "advanced_ai": true, ...}
    
    # 활성화 여부
    is_active = Column(Boolean, default=True, nullable=False)
    display_order = Column(Integer, default=0, nullable=False)  # UI 표시 순서
    
    # 타임스탬프
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    def __repr__(self):
        return f"<SubscriptionPlan {self.tier}: {self.name}>"
