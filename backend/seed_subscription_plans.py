"""
구독 플랜 초기 데이터 생성 스크립트
"""
import sys
from pathlib import Path
from decimal import Decimal

# Add backend directory to path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from app.db.database import SessionLocal
from app.models import SubscriptionPlan, SubscriptionTier


def seed_subscription_plans():
    """초기 구독 플랜 데이터 생성"""
    db = SessionLocal()
    
    try:
        print("Creating subscription plans...")
        
        # 기존 플랜 확인
        existing_plans = db.query(SubscriptionPlan).all()
        if existing_plans:
            print(f"⚠️  {len(existing_plans)} plans already exist. Skipping...")
            for plan in existing_plans:
                print(f"  - {plan.tier}: {plan.name}")
            return
        
        # FREE 플랜
        free_plan = SubscriptionPlan(
            tier=SubscriptionTier.FREE,
            name="무료",
            description="마음쉼표를 시작하는 모든 분들을 위한 기본 플랜",
            monthly_token_limit=50000,
            daily_token_limit=5000,
            price_monthly=None,
            price_yearly=None,
            currency="KRW",
            max_conversations_per_day=None,  # 무제한
            features={
                "basic_ai": True,
                "emotion_tracking": True,
                "community_access": True,
                "ads_free": False,
                "priority_support": False,
            },
            is_active=True,
            display_order=1,
        )
        
        # PREMIUM 플랜
        premium_plan = SubscriptionPlan(
            tier=SubscriptionTier.PREMIUM,
            name="프리미엄",
            description="더 많은 대화와 고급 기능을 원하시는 분들을 위한 플랜",
            monthly_token_limit=500000,
            daily_token_limit=50000,
            price_monthly=Decimal("9900.00"),
            price_yearly=Decimal("99000.00"),  # 2개월 무료
            currency="KRW",
            max_conversations_per_day=None,
            features={
                "basic_ai": True,
                "advanced_ai": True,
                "emotion_tracking": True,
                "community_access": True,
                "ads_free": True,
                "priority_support": True,
                "custom_characters": True,
            },
            is_active=True,
            display_order=2,
        )
        
        # ENTERPRISE 플랜
        enterprise_plan = SubscriptionPlan(
            tier=SubscriptionTier.ENTERPRISE,
            name="기업",
            description="기업 및 단체를 위한 맞춤형 플랜",
            monthly_token_limit=999999999,  # 사실상 무제한
            daily_token_limit=999999999,
            price_monthly=None,  # 문의 필요
            price_yearly=None,
            currency="KRW",
            max_conversations_per_day=None,
            features={
                "basic_ai": True,
                "advanced_ai": True,
                "dedicated_ai": True,
                "emotion_tracking": True,
                "community_access": True,
                "ads_free": True,
                "priority_support": True,
                "dedicated_support": True,
                "custom_characters": True,
                "analytics_dashboard": True,
                "api_access": True,
            },
            is_active=True,
            display_order=3,
        )
        
        # DB에 저장
        db.add(free_plan)
        db.add(premium_plan)
        db.add(enterprise_plan)
        db.commit()
        
        print("✅ Subscription plans created successfully!")
        print("\nCreated plans:")
        print(f"  1. {free_plan.name} ({free_plan.tier})")
        print(f"     - Monthly tokens: {free_plan.monthly_token_limit:,}")
        print(f"     - Price: Free")
        print(f"  2. {premium_plan.name} ({premium_plan.tier})")
        print(f"     - Monthly tokens: {premium_plan.monthly_token_limit:,}")
        print(f"     - Price: ₩{premium_plan.price_monthly}/월")
        print(f"  3. {enterprise_plan.name} ({enterprise_plan.tier})")
        print(f"     - Monthly tokens: Unlimited")
        print(f"     - Price: Contact us")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_subscription_plans()
