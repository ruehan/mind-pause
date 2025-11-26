"""
토큰 사용량 추적 서비스
"""
from datetime import datetime, timedelta
from typing import Optional
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models import (
    TokenUsage,
    TokenQuota,
    Subscription,
    SubscriptionPlan,
    SubscriptionTier,
    SubscriptionStatus,
    User,
)


class TokenTracker:
    """토큰 사용량 추적 및 할당량 관리 서비스"""
    
    @staticmethod
    def get_user_plan(db: Session, user_id: UUID) -> Optional[SubscriptionPlan]:
        """사용자의 현재 구독 플랜 조회"""
        # 활성 구독 조회
        subscription = db.query(Subscription).filter(
            Subscription.user_id == user_id,
            Subscription.status == SubscriptionStatus.ACTIVE
        ).first()
        
        if subscription:
            # 구독의 플랜 반환
            return db.query(SubscriptionPlan).filter(
                SubscriptionPlan.id == subscription.plan_id
            ).first()
        
        # 구독이 없으면 사용자의 티어로 플랜 조회
        user = db.query(User).filter(User.id == user_id).first()
        if user:
            return db.query(SubscriptionPlan).filter(
                SubscriptionPlan.tier == user.subscription_tier,
                SubscriptionPlan.is_active == True
            ).first()
        
        # 기본 FREE 플랜 반환
        return db.query(SubscriptionPlan).filter(
            SubscriptionPlan.tier == SubscriptionTier.FREE,
            SubscriptionPlan.is_active == True
        ).first()
    
    @staticmethod
    def get_or_create_quota(db: Session, user_id: UUID) -> TokenQuota:
        """사용자의 토큰 할당량 조회 또는 생성"""
        quota = db.query(TokenQuota).filter(TokenQuota.user_id == user_id).first()
        
        if not quota:
            quota = TokenQuota(
                user_id=user_id,
                current_month_used=0,
                current_day_used=0,
                bonus_tokens=0,
                last_reset_at=datetime.utcnow()
            )
            db.add(quota)
            db.commit()
            db.refresh(quota)
        
        return quota
    
    @staticmethod
    def check_quota(db: Session, user_id: UUID, estimated_tokens: int = 0) -> tuple[bool, str]:
        """
        사용자의 토큰 할당량 체크
        
        Returns:
            tuple[bool, str]: (사용 가능 여부, 메시지)
        """
        plan = TokenTracker.get_user_plan(db, user_id)
        if not plan:
            return False, "구독 플랜을 찾을 수 없습니다"
        
        quota = TokenTracker.get_or_create_quota(db, user_id)
        
        # 월간 한도 체크
        monthly_limit = plan.monthly_token_limit
        monthly_used = quota.current_month_used
        bonus = quota.bonus_tokens
        
        total_limit = monthly_limit + bonus
        total_used = monthly_used + estimated_tokens
        
        if total_used > total_limit:
            remaining = total_limit - monthly_used
            return False, f"월간 토큰 한도를 초과했습니다. (잔여: {remaining:,} 토큰)"
        
        # 일간 한도 체크
        daily_limit = plan.daily_token_limit
        daily_used = quota.current_day_used
        
        if daily_used + estimated_tokens > daily_limit:
            remaining = daily_limit - daily_used
            return False, f"일간 토큰 한도를 초과했습니다. (잔여: {remaining:,} 토큰)"
        
        return True, "사용 가능"
    
    @staticmethod
    def record_usage(
        db: Session,
        user_id: UUID,
        input_tokens: int,
        output_tokens: int,
        conversation_id: Optional[UUID] = None,
        model_name: Optional[str] = None,
        purpose: Optional[str] = "chat"
    ) -> TokenUsage:
        """
        토큰 사용 내역 기록
        """
        total = input_tokens + output_tokens
        
        # TokenUsage 레코드 생성
        usage = TokenUsage(
            user_id=user_id,
            conversation_id=conversation_id,
            input_tokens=input_tokens,
            output_tokens=output_tokens,
            total_tokens=total,
            model_name=model_name,
            purpose=purpose
        )
        db.add(usage)
        
        # TokenQuota 업데이트
        quota = TokenTracker.get_or_create_quota(db, user_id)
        
        # 일일 리셋 체크
        last_reset = quota.last_reset_at
        now = datetime.utcnow()
        
        if last_reset.date() < now.date():
            # 다음 날이면 일일 사용량 리셋
            quota.current_day_used = 0
        
        # 월간 리셋 체크
        if last_reset.month != now.month or last_reset.year != now.year:
            # 다음 달이면 월간 사용량 리셋
            quota.current_month_used = 0
            quota.last_reset_at = now
        
        # 사용량 누적
        quota.current_month_used += total
        quota.current_day_used += total
        
        db.commit()
        db.refresh(usage)
        
        return usage
    
    @staticmethod
    def get_remaining_tokens(db: Session, user_id: UUID) -> dict:
        """
        사용자의 잔여 토큰 조회
        
        Returns:
            dict: {
                "monthly_limit": int,
                "monthly_used": int,
                "monthly_remaining": int,
                "daily_limit": int,
                "daily_used": int,
                "daily_remaining": int,
                "bonus_tokens": int
            }
        """
        plan = TokenTracker.get_user_plan(db, user_id)
        quota = TokenTracker.get_or_create_quota(db, user_id)
        
        if not plan:
            return {
                "monthly_limit": 0,
                "monthly_used": 0,
                "monthly_remaining": 0,
                "daily_limit": 0,
                "daily_used": 0,
                "daily_remaining": 0,
                "bonus_tokens": 0
            }
        
        monthly_limit = plan.monthly_token_limit + quota.bonus_tokens
        monthly_remaining = max(0, monthly_limit - quota.current_month_used)
        
        daily_limit = plan.daily_token_limit
        daily_remaining = max(0, daily_limit - quota.current_day_used)
        
        return {
            "monthly_limit": monthly_limit,
            "monthly_used": quota.current_month_used,
            "monthly_remaining": monthly_remaining,
            "daily_limit": daily_limit,
            "daily_used": quota.current_day_used,
            "daily_remaining": daily_remaining,
            "bonus_tokens": quota.bonus_tokens
        }
    
    @staticmethod
    def reset_monthly_quota(db: Session, user_id: UUID):
        """월간 할당량 수동 리셋 (관리자용)"""
        quota = TokenTracker.get_or_create_quota(db, user_id)
        quota.current_month_used = 0
        quota.last_reset_at = datetime.utcnow()
        db.commit()
    
    @staticmethod
    def add_bonus_tokens(db: Session, user_id: UUID, amount: int):
        """보너스 토큰 추가 (관리자용)"""
        quota = TokenTracker.get_or_create_quota(db, user_id)
        quota.bonus_tokens += amount
        db.commit()
