"""
토큰 사용량 관련 스키마
"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# ========== TokenUsage 스키마 ==========

class TokenUsageResponse(BaseModel):
    """토큰 사용 내역 응답"""
    id: str
    user_id: str
    conversation_id: Optional[str] = None
    input_tokens: int
    output_tokens: int
    total_tokens: int
    model_name: Optional[str] = None
    purpose: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class TokenUsageHistoryResponse(BaseModel):
    """토큰 사용 내역 목록 응답"""
    items: list[TokenUsageResponse]
    total: int
    page: int
    page_size: int


# ========== TokenQuota 스키마 ==========

class TokenQuotaResponse(BaseModel):
    """토큰 할당량 응답"""
    monthly_limit: int
    monthly_used: int
    monthly_remaining: int
    daily_limit: int
    daily_used: int
    daily_remaining: int
    bonus_tokens: int
    last_reset_at: datetime

    class Config:
        from_attributes = True


# ========== 토큰 사용 요약 ==========

class TokenUsageSummary(BaseModel):
    """토큰 사용 요약"""
    # 현재 기간
    current_month_total: int
    current_week_total: int
    today_total: int
    
    # 할당량 정보
    quota: TokenQuotaResponse
    
    # 티어 정보
    tier: str
    tier_name: str


# ========== 일별 토큰 사용량 ==========

class DailyTokenUsage(BaseModel):
    """일별 토큰 사용량"""
    date: str
    total_tokens: int
    input_tokens: int
    output_tokens: int
    conversation_count: int
