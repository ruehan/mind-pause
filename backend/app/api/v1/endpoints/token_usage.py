"""
토큰 사용량 조회 API
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from datetime import datetime, timedelta
from typing import List

from app.db.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models import TokenUsage, SubscriptionPlan
from app.schemas.token_usage import (
    TokenUsageResponse,
    TokenUsageHistoryResponse,
    TokenQuotaResponse,
    TokenUsageSummary,
    DailyTokenUsage,
)
from app.services.token_tracker import TokenTracker


router = APIRouter()


@router.get("/quota", response_model=TokenQuotaResponse)
async def get_token_quota(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    현재 사용자의 토큰 할당량 및 잔여량 조회
    """
    remaining = TokenTracker.get_remaining_tokens(db, current_user.id)
    quota = TokenTracker.get_or_create_quota(db, current_user.id)
    
    return TokenQuotaResponse(
        **remaining,
        last_reset_at=quota.last_reset_at
    )


@router.get("/summary", response_model=TokenUsageSummary)
async def get_token_usage_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    토큰 사용 요약 조회
    """
    now = datetime.utcnow()
    
    # 이번 달 사용량
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    current_month = db.query(func.sum(TokenUsage.total_tokens)).filter(
        TokenUsage.user_id == current_user.id,
        TokenUsage.created_at >= month_start
    ).scalar() or 0
    
    # 이번 주 사용량
    week_start = now - timedelta(days=now.weekday())
    week_start = week_start.replace(hour=0, minute=0, second=0, microsecond=0)
    current_week = db.query(func.sum(TokenUsage.total_tokens)).filter(
        TokenUsage.user_id == current_user.id,
        TokenUsage.created_at >= week_start
    ).scalar() or 0
    
    # 오늘 사용량
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    today = db.query(func.sum(TokenUsage.total_tokens)).filter(
        TokenUsage.user_id == current_user.id,
        TokenUsage.created_at >= today_start
    ).scalar() or 0
    
    # 할당량 정보
    remaining = TokenTracker.get_remaining_tokens(db, current_user.id)
    quota = TokenTracker.get_or_create_quota(db, current_user.id)
    
    # 티어 정보
    plan = TokenTracker.get_user_plan(db, current_user.id)
    tier_name = plan.name if plan else "알 수 없음"
    
    return TokenUsageSummary(
        current_month_total=current_month,
        current_week_total=current_week,
        today_total=today,
        quota=TokenQuotaResponse(**remaining, last_reset_at=quota.last_reset_at),
        tier=current_user.subscription_tier.value,
        tier_name=tier_name
    )


@router.get("/history", response_model=TokenUsageHistoryResponse)
async def get_token_usage_history(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    토큰 사용 내역 조회 (페이지네이션)
    """
    skip = (page - 1) * page_size
    
    # 총 개수
    total = db.query(func.count(TokenUsage.id)).filter(
        TokenUsage.user_id == current_user.id
    ).scalar()
    
    # 내역 조회
    items = db.query(TokenUsage).filter(
        TokenUsage.user_id == current_user.id
    ).order_by(desc(TokenUsage.created_at)).offset(skip).limit(page_size).all()
    
    return TokenUsageHistoryResponse(
        items=[TokenUsageResponse.model_validate(item) for item in items],
        total=total,
        page=page,
        page_size=page_size
    )


@router.get("/daily", response_model=List[DailyTokenUsage])
async def get_daily_token_usage(
    days: int = Query(30, ge=1, le=365),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    일별 토큰 사용량 조회
    """
    end_date = datetime.utcnow().date()
    start_date = end_date - timedelta(days=days - 1)
    
    # 일별 집계
    results = db.query(
        func.date(TokenUsage.created_at).label('date'),
        func.sum(TokenUsage.total_tokens).label('total'),
        func.sum(TokenUsage.input_tokens).label('input'),
        func.sum(TokenUsage.output_tokens).label('output'),
        func.count(func.distinct(TokenUsage.conversation_id)).label('conv_count')
    ).filter(
        TokenUsage.user_id == current_user.id,
        func.date(TokenUsage.created_at) >= start_date
    ).group_by(func.date(TokenUsage.created_at)).order_by('date').all()
    
    return [
        DailyTokenUsage(
            date=str(r.date),
            total_tokens=r.total or 0,
            input_tokens=r.input or 0,
            output_tokens=r.output or 0,
            conversation_count=r.conv_count or 0
        )
        for r in results
    ]
