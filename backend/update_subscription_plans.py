"""
구독 플랜 업데이트 스크립트
FREE: 10K 토큰, PREMIUM: 100K 토큰
"""
import sys
from pathlib import Path
from decimal import Decimal

backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from app.db.database import SessionLocal
from app.models import SubscriptionPlan, SubscriptionTier

def update_subscription_plans():
    """구독 플랜 데이터 업데이트"""
    db = SessionLocal()
    
    try:
        print("Updating subscription plans...")
        
        # FREE 플랜 업데이트
        free_plan = db.query(SubscriptionPlan).filter(
            SubscriptionPlan.tier == SubscriptionTier.FREE
        ).first()
        
        if free_plan:
            free_plan.monthly_token_limit = 10000
            free_plan.daily_token_limit = 500
            free_plan.description = "마음쉼표를 시작하는 모든 분들을 위한 기본 플랜"
            print("✅ FREE plan updated: 10,000 tokens/month")
        
        # PREMIUM 플랜 업데이트
        premium_plan = db.query(SubscriptionPlan).filter(
            SubscriptionPlan.tier == SubscriptionTier.PREMIUM
        ).first()
        
        if premium_plan:
            premium_plan.monthly_token_limit = 100000
            premium_plan.daily_token_limit = 5000
            premium_plan.price_monthly = Decimal("5900.00")  # ₩5,900
            premium_plan.description = "더 많은 대화와 프리미엄 기능을 원하는 분들을 위한 플랜"
            print("✅ PREMIUM plan updated: 100,000 tokens/month, ₩5,900/month")
        
        # ENTERPRISE 플랜 비활성화
        enterprise_plan = db.query(SubscriptionPlan).filter(
            SubscriptionPlan.tier == SubscriptionTier.ENTERPRISE
        ).first()
        
        if enterprise_plan:
            enterprise_plan.is_active = False
            print("✅ ENTERPRISE plan deactivated")
        
        db.commit()
        
        print("\n📊 Updated plans:")
        plans = db.query(SubscriptionPlan).order_by(SubscriptionPlan.display_order).all()
        for plan in plans:
            status = "활성" if plan.is_active else "비활성"
            price = f"₩{plan.price_monthly:,.0f}/월" if plan.price_monthly else "무료"
            print(f"  - {plan.name} ({plan.tier}): {plan.monthly_token_limit:,} tokens/월, {price} [{status}]")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    update_subscription_plans()
