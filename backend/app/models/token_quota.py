from sqlalchemy import Column, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from app.db.database import Base


class TokenQuota(Base):
    """
    사용자 토큰 할당량 모델
    월간/일간 사용량을 캐시하여 빠른 조회 제공
    """
    __tablename__ = "token_quotas"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    
    # 현재 사용량 (캐시)
    # monthly_limit은 SubscriptionPlan에서 동적으로 가져옴
    current_month_used = Column(Integer, default=0, nullable=False)
    current_day_used = Column(Integer, default=0, nullable=False)
    
    # 추가 할당량 (관리자가 부여 가능)
    bonus_tokens = Column(Integer, default=0, nullable=False)
    
    # 리셋 날짜
    last_reset_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    # 타임스탬프
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    def __repr__(self):
        return f"<TokenQuota user_id={self.user_id} used={self.current_month_used}>"
