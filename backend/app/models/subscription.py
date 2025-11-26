from sqlalchemy import Column, String, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
import enum
from app.db.database import Base
from app.models.subscription_plan import SubscriptionTier


class SubscriptionStatus(str, enum.Enum):
    """구독 상태"""
    ACTIVE = "ACTIVE"  # 활성
    CANCELED = "CANCELED"  # 취소됨
    EXPIRED = "EXPIRED"  # 만료됨
    PAUSED = "PAUSED"  # 일시정지


class Subscription(Base):
    """
    사용자 구독 정보 모델
    """
    __tablename__ = "subscriptions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    plan_id = Column(UUID(as_uuid=True), ForeignKey("subscription_plans.id"), nullable=False)
    tier = Column(SQLEnum(SubscriptionTier), nullable=False, index=True)
    status = Column(SQLEnum(SubscriptionStatus), default=SubscriptionStatus.ACTIVE, nullable=False)
    
    # 구독 기간
    started_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=True)  # null = 무기한
    canceled_at = Column(DateTime(timezone=True), nullable=True)
    
    # 결제 정보 (향후 확장)
    payment_method = Column(String(50), nullable=True)
    last_payment_date = Column(DateTime(timezone=True), nullable=True)
    next_payment_date = Column(DateTime(timezone=True), nullable=True)
    
    # 타임스탬프
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    def __repr__(self):
        return f"<Subscription user_id={self.user_id} tier={self.tier} status={self.status}>"
