from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, extract
from typing import List, Optional
from uuid import UUID
from datetime import datetime, timedelta

from app.db.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.emotion_log import EmotionLog
from app.schemas.emotion_log import (
    EmotionLogCreate,
    EmotionLogUpdate,
    EmotionLogResponse,
    EmotionLogListResponse,
    EmotionStatsResponse
)

router = APIRouter()


# ========================================
# Emotion Log Endpoints
# ========================================

@router.post(
    "/logs",
    response_model=EmotionLogResponse,
    status_code=status.HTTP_201_CREATED,
    summary="감정 기록 생성",
    description="새로운 감정 기록을 생성합니다"
)
async def create_emotion_log(
    emotion_data: EmotionLogCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """감정 기록 생성"""

    # AI 피드백은 프론트엔드에서 생성하여 전달
    emotion_log = EmotionLog(
        user_id=current_user.id,
        emotion_value=emotion_data.emotion_value,
        emotion_label=emotion_data.emotion_label,
        emotion_emoji=emotion_data.emotion_emoji,
        note=emotion_data.note,
        ai_feedback=emotion_data.ai_feedback
    )

    db.add(emotion_log)
    db.commit()
    db.refresh(emotion_log)

    return emotion_log


@router.get(
    "/logs",
    response_model=EmotionLogListResponse,
    summary="감정 기록 목록 조회",
    description="사용자의 감정 기록 목록을 조회합니다"
)
async def get_emotion_logs(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    start_date: Optional[datetime] = Query(None, description="시작 날짜"),
    end_date: Optional[datetime] = Query(None, description="종료 날짜"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """감정 기록 목록 조회"""
    offset = (page - 1) * page_size

    # 기본 쿼리
    query = db.query(EmotionLog).filter(EmotionLog.user_id == current_user.id)

    # 날짜 필터
    if start_date:
        query = query.filter(EmotionLog.created_at >= start_date)
    if end_date:
        query = query.filter(EmotionLog.created_at <= end_date)

    # 최신순 정렬
    query = query.order_by(EmotionLog.created_at.desc())

    # 전체 개수
    total = query.count()

    # 페이지네이션
    emotion_logs = query.offset(offset).limit(page_size).all()

    return EmotionLogListResponse(
        emotion_logs=emotion_logs,
        total=total,
        page=page,
        page_size=page_size
    )


@router.get(
    "/logs/{log_id}",
    response_model=EmotionLogResponse,
    summary="감정 기록 상세 조회",
    description="특정 감정 기록의 상세 정보를 조회합니다"
)
async def get_emotion_log(
    log_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """감정 기록 상세 조회"""
    emotion_log = db.query(EmotionLog).filter(
        EmotionLog.id == log_id,
        EmotionLog.user_id == current_user.id
    ).first()

    if not emotion_log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="감정 기록을 찾을 수 없습니다"
        )

    return emotion_log


@router.put(
    "/logs/{log_id}",
    response_model=EmotionLogResponse,
    summary="감정 기록 수정",
    description="기존 감정 기록을 수정합니다"
)
async def update_emotion_log(
    log_id: UUID,
    emotion_data: EmotionLogUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """감정 기록 수정"""
    emotion_log = db.query(EmotionLog).filter(
        EmotionLog.id == log_id,
        EmotionLog.user_id == current_user.id
    ).first()

    if not emotion_log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="감정 기록을 찾을 수 없습니다"
        )

    # 수정할 필드만 업데이트
    update_data = emotion_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(emotion_log, field, value)

    db.commit()
    db.refresh(emotion_log)

    return emotion_log


@router.delete(
    "/logs/{log_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="감정 기록 삭제",
    description="감정 기록을 삭제합니다"
)
async def delete_emotion_log(
    log_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """감정 기록 삭제"""
    emotion_log = db.query(EmotionLog).filter(
        EmotionLog.id == log_id,
        EmotionLog.user_id == current_user.id
    ).first()

    if not emotion_log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="감정 기록을 찾을 수 없습니다"
        )

    db.delete(emotion_log)
    db.commit()


@router.get(
    "/stats",
    response_model=EmotionStatsResponse,
    summary="감정 통계 조회",
    description="사용자의 감정 통계를 조회합니다"
)
async def get_emotion_stats(
    days: int = Query(30, ge=1, le=365, description="통계 기간 (일)"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """감정 통계 조회"""
    start_date = datetime.now() - timedelta(days=days)

    # 기간 내 감정 기록
    logs = db.query(EmotionLog).filter(
        EmotionLog.user_id == current_user.id,
        EmotionLog.created_at >= start_date
    ).all()

    if not logs:
        return EmotionStatsResponse(
            average_emotion=0.0,
            total_records=0,
            streak_days=0,
            emotion_distribution={}
        )

    # 평균 감정 점수
    average_emotion = sum(log.emotion_value for log in logs) / len(logs)

    # 감정 분포
    emotion_distribution = {}
    for log in logs:
        key = str(log.emotion_value)
        emotion_distribution[key] = emotion_distribution.get(key, 0) + 1

    # 연속 기록 일수 계산
    all_logs = db.query(EmotionLog).filter(
        EmotionLog.user_id == current_user.id
    ).order_by(EmotionLog.created_at.desc()).all()

    streak_days = 0
    if all_logs:
        # Get unique dates from logs, sorted descending (most recent first)
        log_dates = sorted(set(log.created_at.date() for log in all_logs), reverse=True)

        if log_dates:
            # Start from the most recent log date and count consecutive days backward
            expected_date = log_dates[0]

            for log_date in log_dates:
                if log_date == expected_date:
                    streak_days += 1
                    expected_date -= timedelta(days=1)
                else:
                    # Gap found (missing day), stop counting
                    break

    return EmotionStatsResponse(
        average_emotion=round(average_emotion, 1),
        total_records=len(logs),
        streak_days=streak_days,
        emotion_distribution=emotion_distribution
    )


@router.get(
    "/chart",
    summary="감정 차트 데이터 조회",
    description="기간별 감정 차트를 위한 데이터를 조회합니다"
)
async def get_emotion_chart(
    days: int = Query(30, ge=7, le=365, description="조회 기간 (일)"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """감정 차트 데이터 조회"""
    start_date = datetime.now() - timedelta(days=days)

    # 일별 평균 감정 점수
    logs = db.query(
        func.date(EmotionLog.created_at).label('date'),
        func.avg(EmotionLog.emotion_value).label('avg_value')
    ).filter(
        EmotionLog.user_id == current_user.id,
        EmotionLog.created_at >= start_date
    ).group_by(
        func.date(EmotionLog.created_at)
    ).order_by(
        func.date(EmotionLog.created_at)
    ).all()

    chart_data = [
        {
            "date": log.date.strftime("%m/%d"),
            "value": round(float(log.avg_value), 1)
        }
        for log in logs
    ]

    return {"data": chart_data}
