"""관리자 API 엔드포인트"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta, date
from typing import List
from uuid import UUID

from app.db.database import get_db
from app.core.security import require_admin
from app.models.user import User, UserRole
from app.models.emotion_log import EmotionLog
from app.models.post import Post
from app.models.comment import Comment
from app.models.challenge import Challenge, ChallengeStatus
from app.models.conversation import Conversation
from app.models.report import Report, ReportStatus
from app.schemas.admin import (
    DashboardStats,
    UserManagementItem,
    UserManagementListResponse,
    UserRoleUpdate,
    UserDeleteRequest,
    ReportItem,
    ReportListResponse,
    ReportReviewRequest,
)

router = APIRouter()


# ============================================
# 대시보드 통계
# ============================================

@router.get(
    "/dashboard/stats",
    response_model=DashboardStats,
    summary="관리자 대시보드 통계",
    description="[관리자] 전체 시스템 통계를 조회합니다"
)
async def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """관리자 대시보드 통계 조회"""
    today = date.today()
    week_ago = today - timedelta(days=7)

    # 사용자 통계
    total_users = db.query(User).filter(User.is_deleted == False).count()
    new_users_today = db.query(User).filter(
        User.is_deleted == False,
        func.date(User.created_at) == today
    ).count()
    new_users_week = db.query(User).filter(
        User.is_deleted == False,
        func.date(User.created_at) >= week_ago
    ).count()

    # 감정 기록 통계
    total_emotion_logs = db.query(EmotionLog).count()
    emotion_logs_today = db.query(EmotionLog).filter(
        func.date(EmotionLog.created_at) == today
    ).count()
    emotion_logs_week = db.query(EmotionLog).filter(
        func.date(EmotionLog.created_at) >= week_ago
    ).count()

    # 커뮤니티 통계
    total_posts = db.query(Post).count()
    posts_today = db.query(Post).filter(
        func.date(Post.created_at) == today
    ).count()
    total_comments = db.query(Comment).count()

    # 챌린지 통계
    total_challenges = db.query(Challenge).count()
    active_challenges = db.query(Challenge).filter(
        Challenge.status == ChallengeStatus.APPROVED,
        Challenge.start_date <= today,
        Challenge.end_date >= today
    ).count()
    pending_challenges = db.query(Challenge).filter(
        Challenge.status == ChallengeStatus.PENDING
    ).count()

    # AI 채팅 통계
    total_conversations = db.query(Conversation).count()
    conversations_today = db.query(Conversation).filter(
        func.date(Conversation.created_at) == today
    ).count()

    return DashboardStats(
        total_users=total_users,
        new_users_today=new_users_today,
        new_users_week=new_users_week,
        total_emotion_logs=total_emotion_logs,
        emotion_logs_today=emotion_logs_today,
        emotion_logs_week=emotion_logs_week,
        total_posts=total_posts,
        posts_today=posts_today,
        total_comments=total_comments,
        total_challenges=total_challenges,
        active_challenges=active_challenges,
        pending_challenges=pending_challenges,
        total_conversations=total_conversations,
        conversations_today=conversations_today,
    )


# ============================================
# 사용자 관리
# ============================================

@router.get(
    "/users",
    response_model=UserManagementListResponse,
    summary="사용자 목록 조회",
    description="[관리자] 전체 사용자 목록을 조회합니다"
)
async def get_users(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """사용자 목록 조회 (관리자)"""
    users = db.query(User).offset(skip).limit(limit).all()
    total = db.query(User).count()

    user_items = []
    for user in users:
        # 각 사용자의 통계 계산
        emotion_log_count = db.query(EmotionLog).filter(
            EmotionLog.user_id == user.id
        ).count()
        post_count = db.query(Post).filter(
            Post.user_id == user.id
        ).count()
        comment_count = db.query(Comment).filter(
            Comment.user_id == user.id
        ).count()

        user_item = UserManagementItem(
            id=user.id,
            email=user.email,
            nickname=user.nickname,
            role=user.role.value,
            is_deleted=user.is_deleted,
            created_at=user.created_at,
            last_login_at=user.last_login_at,
            emotion_log_count=emotion_log_count,
            post_count=post_count,
            comment_count=comment_count,
        )
        user_items.append(user_item)

    return UserManagementListResponse(
        users=user_items,
        total=total
    )


@router.patch(
    "/users/{user_id}/role",
    response_model=UserManagementItem,
    summary="사용자 역할 변경",
    description="[관리자] 사용자의 역할을 변경합니다"
)
async def update_user_role(
    user_id: UUID,
    role_data: UserRoleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """사용자 역할 변경 (관리자)"""
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="사용자를 찾을 수 없습니다"
        )

    # 역할 유효성 검사
    try:
        new_role = UserRole(role_data.role)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"유효하지 않은 역할입니다. 가능한 역할: {[r.value for r in UserRole]}"
        )

    # 자기 자신의 역할은 변경할 수 없음
    if user.id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="자기 자신의 역할은 변경할 수 없습니다"
        )

    user.role = new_role
    db.commit()
    db.refresh(user)

    # 통계 계산
    emotion_log_count = db.query(EmotionLog).filter(
        EmotionLog.user_id == user.id
    ).count()
    post_count = db.query(Post).filter(
        Post.user_id == user.id
    ).count()
    comment_count = db.query(Comment).filter(
        Comment.user_id == user.id
    ).count()

    return UserManagementItem(
        id=user.id,
        email=user.email,
        nickname=user.nickname,
        role=user.role.value,
        is_deleted=user.is_deleted,
        created_at=user.created_at,
        last_login_at=user.last_login_at,
        emotion_log_count=emotion_log_count,
        post_count=post_count,
        comment_count=comment_count,
    )


@router.delete(
    "/users/{user_id}",
    summary="사용자 삭제",
    description="[관리자] 사용자를 삭제합니다 (소프트 삭제 또는 영구 삭제)"
)
async def delete_user(
    user_id: UUID,
    delete_data: UserDeleteRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """사용자 삭제 (관리자)"""
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="사용자를 찾을 수 없습니다"
        )

    # 자기 자신은 삭제할 수 없음
    if user.id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="자기 자신은 삭제할 수 없습니다"
        )

    if delete_data.permanent:
        # 영구 삭제
        db.delete(user)
        db.commit()
        return {"message": "사용자가 영구 삭제되었습니다", "user_id": str(user_id)}
    else:
        # 소프트 삭제
        user.is_deleted = True
        user.deleted_at = datetime.utcnow()
        db.commit()
        return {"message": "사용자가 삭제되었습니다", "user_id": str(user_id)}


# ============================================
# 신고 관리
# ============================================

@router.get(
    "/reports",
    response_model=ReportListResponse,
    summary="신고 목록 조회",
    description="[관리자] 전체 신고 목록을 조회합니다"
)
async def get_reports(
    status: str = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """신고 목록 조회 (관리자)"""
    query = db.query(Report)

    # 상태 필터
    if status:
        try:
            status_enum = ReportStatus(status)
            query = query.filter(Report.status == status_enum)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"유효하지 않은 상태입니다. 가능한 상태: {[s.value for s in ReportStatus]}"
            )

    reports = query.order_by(Report.created_at.desc()).offset(skip).limit(limit).all()
    total = query.count()

    report_items = []
    for report in reports:
        # 신고자 정보
        reporter = db.query(User).filter(User.id == report.reporter_id).first()

        # 신고 대상 내용 (미리보기)
        target_content = None
        if report.post_id:
            post = db.query(Post).filter(Post.id == report.post_id).first()
            if post:
                target_content = post.content[:100] + "..." if len(post.content) > 100 else post.content
        elif report.comment_id:
            comment = db.query(Comment).filter(Comment.id == report.comment_id).first()
            if comment:
                target_content = comment.content[:100] + "..." if len(comment.content) > 100 else comment.content

        report_item = ReportItem(
            id=report.id,
            reporter_id=report.reporter_id,
            reporter_nickname=reporter.nickname if reporter else "탈퇴한 사용자",
            report_type=report.report_type.value,
            report_reason=report.report_reason.value,
            description=report.description,
            post_id=report.post_id,
            comment_id=report.comment_id,
            target_content=target_content,
            status=report.status.value,
            admin_note=report.admin_note,
            reviewed_by=report.reviewed_by,
            reviewed_at=report.reviewed_at,
            created_at=report.created_at,
        )
        report_items.append(report_item)

    return ReportListResponse(
        reports=report_items,
        total=total
    )


@router.patch(
    "/reports/{report_id}",
    response_model=ReportItem,
    summary="신고 처리",
    description="[관리자] 신고를 처리합니다"
)
async def review_report(
    report_id: UUID,
    review_data: ReportReviewRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """신고 처리 (관리자)"""
    report = db.query(Report).filter(Report.id == report_id).first()

    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="신고를 찾을 수 없습니다"
        )

    # 상태 유효성 검사
    try:
        new_status = ReportStatus(review_data.status)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"유효하지 않은 상태입니다. 가능한 상태: {[s.value for s in ReportStatus]}"
        )

    # 신고 대상 삭제 처리
    if review_data.delete_content:
        if report.post_id:
            post = db.query(Post).filter(Post.id == report.post_id).first()
            if post:
                db.delete(post)
        elif report.comment_id:
            comment = db.query(Comment).filter(Comment.id == report.comment_id).first()
            if comment:
                db.delete(comment)

    # 신고 상태 업데이트
    report.status = new_status
    report.admin_note = review_data.admin_note
    report.reviewed_by = current_user.id
    report.reviewed_at = datetime.utcnow()

    db.commit()
    db.refresh(report)

    # 신고자 정보
    reporter = db.query(User).filter(User.id == report.reporter_id).first()

    # 신고 대상 내용
    target_content = None
    if report.post_id:
        post = db.query(Post).filter(Post.id == report.post_id).first()
        if post:
            target_content = post.content[:100] + "..." if len(post.content) > 100 else post.content
    elif report.comment_id:
        comment = db.query(Comment).filter(Comment.id == report.comment_id).first()
        if comment:
            target_content = comment.content[:100] + "..." if len(comment.content) > 100 else comment.content

    return ReportItem(
        id=report.id,
        reporter_id=report.reporter_id,
        reporter_nickname=reporter.nickname if reporter else "탈퇴한 사용자",
        report_type=report.report_type.value,
        report_reason=report.report_reason.value,
        description=report.description,
        post_id=report.post_id,
        comment_id=report.comment_id,
        target_content=target_content,
        status=report.status.value,
        admin_note=report.admin_note,
        reviewed_by=report.reviewed_by,
        reviewed_at=report.reviewed_at,
        created_at=report.created_at,
    )
