"""
구독 관리 API
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List

from app.db.database import get_db
from app.core.security import get_current_user
from app.models.user import User, UserRole
from app.models import (
    SubscriptionPlan,
    Subscription,
    SubscriptionStatus,
    SubscriptionTier,
)
from app.schemas.subscription import (
    SubscriptionPlanResponse,
    SubscriptionPlanCreate,
    SubscriptionPlanUpdate,
    SubscriptionResponse,
    SubscriptionWithPlan,
    SubscriptionUpgradeRequest,
)


router = APIRouter()


# ========== 사용자용 API ==========

@router.get("/plans", response_model=List[SubscriptionPlanResponse])
async def get_subscription_plans(
    db: Session = Depends(get_db)
):
    """
    활성화된 구독 플랜 목록 조회 (모든 사용자)
    """
    plans = db.query(SubscriptionPlan).filter(
        SubscriptionPlan.is_active == True
    ).order_by(SubscriptionPlan.display_order).all()
    
    return plans


@router.get("/current", response_model=SubscriptionWithPlan)
async def get_current_subscription(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    현재 사용자의 구독 정보 조회
    """
    # 활성 구독 조회
    subscription = db.query(Subscription).filter(
        Subscription.user_id == current_user.id,
        Subscription.status == SubscriptionStatus.ACTIVE
    ).first()
    
    if not subscription:
        # 구독이 없으면 기본 FREE 플랜으로 생성
        free_plan = db.query(SubscriptionPlan).filter(
            SubscriptionPlan.tier == SubscriptionTier.FREE
        ).first()
        
        if not free_plan:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="기본 플랜을 찾을 수 없습니다"
            )
        
        subscription = Subscription(
            user_id=current_user.id,
            plan_id=free_plan.id,
            tier=SubscriptionTier.FREE,
            status=SubscriptionStatus.ACTIVE
        )
        db.add(subscription)
        db.commit()
        db.refresh(subscription)
    
    # 플랜 정보 로드
    plan = db.query(SubscriptionPlan).filter(
        SubscriptionPlan.id == subscription.plan_id
    ).first()
    
    return {
        **subscription.__dict__,
        "plan": plan
    }


@router.post("/upgrade", response_model=SubscriptionResponse)
async def upgrade_subscription(
    request: SubscriptionUpgradeRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    구독 업그레이드/다운그레이드
    """
    # 새 플랜 조회
    new_plan = db.query(SubscriptionPlan).filter(
        SubscriptionPlan.tier == request.tier,
        SubscriptionPlan.is_active == True
    ).first()
    
    if not new_plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="요청한 플랜을 찾을 수 없습니다"
        )
    
    # 현재 구독 조회
    current_subscription = db.query(Subscription).filter(
        Subscription.user_id == current_user.id,
        Subscription.status == SubscriptionStatus.ACTIVE
    ).first()
    
    if current_subscription:
        # 기존 구독 취소
        current_subscription.status = SubscriptionStatus.CANCELED
        current_subscription.canceled_at = datetime.utcnow()
    
    # 새 구독 생성
    new_subscription = Subscription(
        user_id=current_user.id,
        plan_id=new_plan.id,
        tier=request.tier,
        status=SubscriptionStatus.ACTIVE
    )
    db.add(new_subscription)
    
    # User 테이블의 tier도 업데이트
    current_user.subscription_tier = request.tier
    
    db.commit()
    db.refresh(new_subscription)
    
    return new_subscription


@router.post("/cancel", response_model=SubscriptionResponse)
async def cancel_subscription(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    구독 취소 (FREE 플랜으로 다운그레이드)
    """
    # 현재 구독 조회
    current_subscription = db.query(Subscription).filter(
        Subscription.user_id == current_user.id,
        Subscription.status == SubscriptionStatus.ACTIVE
    ).first()
    
    if not current_subscription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="활성 구독을 찾을 수 없습니다"
        )
    
    # FREE 플랜으로 변경
    free_plan = db.query(SubscriptionPlan).filter(
        SubscriptionPlan.tier == SubscriptionTier.FREE
    ).first()
    
    current_subscription.status = SubscriptionStatus.CANCELED
    current_subscription.canceled_at = datetime.utcnow()
    
    new_subscription = Subscription(
        user_id=current_user.id,
        plan_id=free_plan.id,
        tier=SubscriptionTier.FREE,
        status=SubscriptionStatus.ACTIVE
    )
    db.add(new_subscription)
    
    current_user.subscription_tier = SubscriptionTier.FREE
    
    db.commit()
    db.refresh(new_subscription)
    
    return new_subscription


# ========== 관리자용 API ==========

def require_admin(current_user: User = Depends(get_current_user)) -> User:
    """관리자 권한 확인"""
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="관리자 권한이 필요합니다"
        )
    return current_user


@router.get("/admin/plans", response_model=List[SubscriptionPlanResponse])
async def get_all_subscription_plans(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """
    모든 구독 플랜 조회 (비활성화 포함, 관리자 전용)
    """
    plans = db.query(SubscriptionPlan).order_by(SubscriptionPlan.display_order).all()
    return plans


@router.post("/admin/plans", response_model=SubscriptionPlanResponse)
async def create_subscription_plan(
    plan_data: SubscriptionPlanCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """
    새 구독 플랜 생성 (관리자 전용)
    """
    # 같은 티어가 이미 있는지 확인
    existing = db.query(SubscriptionPlan).filter(
        SubscriptionPlan.tier == plan_data.tier
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"티어 {plan_data.tier}는 이미 존재합니다"
        )
    
    new_plan = SubscriptionPlan(**plan_data.model_dump())
    db.add(new_plan)
    db.commit()
    db.refresh(new_plan)
    
    return new_plan


@router.put("/admin/plans/{plan_id}", response_model=SubscriptionPlanResponse)
async def update_subscription_plan(
    plan_id: str,
    plan_data: SubscriptionPlanUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """
    구독 플랜 수정 (관리자 전용)
    """
    plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.id == plan_id).first()
    
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="플랜을 찾을 수 없습니다"
        )
    
    # 업데이트
    update_data = plan_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(plan, key, value)
    
    db.commit()
    db.refresh(plan)
    
    return plan


@router.delete("/admin/plans/{plan_id}")
async def deactivate_subscription_plan(
    plan_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """
    구독 플랜 비활성화 (관리자 전용)
    """
    plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.id == plan_id).first()
    
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="플랜을 찾을 수 없습니다"
        )
    
    plan.is_active = False
    db.commit()
    
    return {"message": "플랜이 비활성화되었습니다"}


@router.patch("/admin/plans/{plan_id}/activate", response_model=SubscriptionPlanResponse)
async def activate_subscription_plan(
    plan_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """
    구독 플랜 활성화 (관리자 전용)
    """
    plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.id == plan_id).first()
    
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="플랜을 찾을 수 없습니다"
        )
    
    plan.is_active = True
    db.commit()
    db.refresh(plan)
    
    return plan
