"""사용자 대시보드 API 엔드포인트"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta, date

from app.db.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.emotion_log import EmotionLog
from app.models.post import Post
from app.models.comment import Comment
from app.models.like import Like
from app.models.conversation import Conversation
from app.models.challenge import UserChallenge, Challenge, ChallengeStatus
from app.schemas.dashboard import (
    UserDashboard,
    ActivitySummary,
    RecentActivities,
    RecentEmotionLog,
    RecentPost,
    RecentComment,
    ChallengeActivity,
)

router = APIRouter()


@router.get(
    "",
    response_model=UserDashboard,
    summary="사용자 대시보드 조회",
    description="사용자의 활동 요약 통계 및 최근 활동 히스토리를 조회합니다"
)
async def get_user_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """사용자 대시보드 데이터 조회"""
    today = date.today()
    week_ago = today - timedelta(days=7)
    two_weeks_ago = today - timedelta(days=14)
    month_start = today.replace(day=1)
    last_month_start = (month_start - timedelta(days=1)).replace(day=1)

    # ============================================
    # 활동 요약 통계
    # ============================================

    # 감정 기록 통계
    total_emotion_logs = db.query(EmotionLog).filter(
        EmotionLog.user_id == current_user.id
    ).count()

    emotion_logs_this_week = db.query(EmotionLog).filter(
        EmotionLog.user_id == current_user.id,
        func.date(EmotionLog.created_at) >= week_ago
    ).count()

    emotion_logs_this_month = db.query(EmotionLog).filter(
        EmotionLog.user_id == current_user.id,
        func.date(EmotionLog.created_at) >= month_start
    ).count()

    # 커뮤니티 통계
    total_posts = db.query(Post).filter(
        Post.user_id == current_user.id
    ).count()

    total_comments = db.query(Comment).filter(
        Comment.user_id == current_user.id
    ).count()

    # 받은 좋아요 수 (게시글 + 댓글)
    post_likes = db.query(func.sum(Post.num_likes)).filter(
        Post.user_id == current_user.id
    ).scalar() or 0

    comment_likes = db.query(func.count(Like.id)).join(
        Comment, Like.comment_id == Comment.id
    ).filter(
        Comment.user_id == current_user.id
    ).scalar() or 0

    total_likes_received = post_likes + comment_likes

    posts_this_week = db.query(Post).filter(
        Post.user_id == current_user.id,
        func.date(Post.created_at) >= week_ago
    ).count()

    comments_this_week = db.query(Comment).filter(
        Comment.user_id == current_user.id,
        func.date(Comment.created_at) >= week_ago
    ).count()

    # 챌린지 통계
    active_challenges = db.query(UserChallenge).join(
        Challenge, UserChallenge.challenge_id == Challenge.id
    ).filter(
        UserChallenge.user_id == current_user.id,
        UserChallenge.is_completed == False,
        Challenge.status == ChallengeStatus.APPROVED
    ).count()

    completed_challenges = db.query(UserChallenge).filter(
        UserChallenge.user_id == current_user.id,
        UserChallenge.is_completed == True
    ).count()

    # 현재 최고 연속 기록
    best_streak_result = db.query(func.max(UserChallenge.best_streak)).filter(
        UserChallenge.user_id == current_user.id
    ).scalar()
    current_best_streak = best_streak_result or 0

    # AI 채팅 통계
    total_conversations = db.query(Conversation).filter(
        Conversation.user_id == current_user.id
    ).count()

    conversations_this_week = db.query(Conversation).filter(
        Conversation.user_id == current_user.id,
        func.date(Conversation.created_at) >= week_ago
    ).count()
    
    # ============================================
    # 이전 주 데이터 (변화율 계산용)
    # ============================================
    
    # 지난주 감정 기록 수 (2주 전 ~ 1주 전)
    emotion_logs_last_week = db.query(EmotionLog).filter(
        EmotionLog.user_id == current_user.id,
        func.date(EmotionLog.created_at) >= two_weeks_ago,
        func.date(EmotionLog.created_at) < week_ago
    ).count()
    
    # 지난주 대화 수
    conversations_last_week = db.query(Conversation).filter(
        Conversation.user_id == current_user.id,
        func.date(Conversation.created_at) >= two_weeks_ago,
        func.date(Conversation.created_at) < week_ago
    ).count()
    
    # 지난주 완료한 챌린지
    challenges_completed_last_week = db.query(UserChallenge).filter(
        UserChallenge.user_id == current_user.id,
        UserChallenge.is_completed == True,
        func.date(UserChallenge.completed_at) >= two_weeks_ago,
        func.date(UserChallenge.completed_at) < week_ago
    ).count()
    
    challenges_completed_this_week = db.query(UserChallenge).filter(
        UserChallenge.user_id == current_user.id,
        UserChallenge.is_completed == True,
        func.date(UserChallenge.completed_at) >= week_ago
    ).count()
    
    # ============================================
    # 변화율 계산
    # ============================================
    
    def calculate_trend(current: int, previous: int):
        """전주 대비 변화율 계산 (%)"""
        if previous == 0:
            # 이전 주에 데이터가 없으면 현재주에 데이터가 있으면 100% 증가로 간주
            return 100.0 if current > 0 else None
        return round(((current - previous) / previous) * 100, 1)
    
    emotion_logs_trend = calculate_trend(emotion_logs_this_week, emotion_logs_last_week)
    conversations_trend = calculate_trend(conversations_this_week, conversations_last_week)
    challenges_trend = calculate_trend(challenges_completed_this_week, challenges_completed_last_week)

    summary = ActivitySummary(
        total_emotion_logs=total_emotion_logs,
        emotion_logs_this_week=emotion_logs_this_week,
        emotion_logs_this_month=emotion_logs_this_month,
        total_posts=total_posts,
        total_comments=total_comments,
        total_likes_received=total_likes_received,
        posts_this_week=posts_this_week,
        comments_this_week=comments_this_week,
        active_challenges=active_challenges,
        completed_challenges=completed_challenges,
        current_best_streak=current_best_streak,
        total_conversations=total_conversations,
        conversations_this_week=conversations_this_week,
        emotion_logs_trend=emotion_logs_trend,
        conversations_trend=conversations_trend,
        challenges_trend=challenges_trend,
    )

    # ============================================
    # 최근 활동 히스토리
    # ============================================

    # 최근 감정 기록 (5개)
    recent_emotion_logs = db.query(EmotionLog).filter(
        EmotionLog.user_id == current_user.id
    ).order_by(EmotionLog.created_at.desc()).limit(5).all()

    emotion_log_list = [
        RecentEmotionLog(
            id=log.id,
            emotion_type=log.emotion_label,
            intensity=log.emotion_value,
            content=log.note,
            created_at=log.created_at
        )
        for log in recent_emotion_logs
    ]

    # 최근 게시글 (5개)
    recent_posts = db.query(Post).filter(
        Post.user_id == current_user.id
    ).order_by(Post.created_at.desc()).limit(5).all()

    post_list = [
        RecentPost(
            id=post.id,
            title=post.title,
            content=post.content[:100] + "..." if len(post.content) > 100 else post.content,
            num_likes=post.num_likes,
            num_comments=post.num_comments,
            created_at=post.created_at
        )
        for post in recent_posts
    ]

    # 최근 댓글 (5개)
    recent_comments = db.query(Comment).filter(
        Comment.user_id == current_user.id
    ).order_by(Comment.created_at.desc()).limit(5).all()

    comment_list = []
    for comment in recent_comments:
        post = db.query(Post).filter(Post.id == comment.post_id).first()
        if post:
            comment_list.append(
                RecentComment(
                    id=comment.id,
                    post_id=comment.post_id,
                    post_title=post.title,
                    content=comment.content[:100] + "..." if len(comment.content) > 100 else comment.content,
                    created_at=comment.created_at
                )
            )

    # 챌린지 활동 (진행 중인 챌린지)
    user_challenges = db.query(UserChallenge).join(
        Challenge, UserChallenge.challenge_id == Challenge.id
    ).filter(
        UserChallenge.user_id == current_user.id
    ).order_by(UserChallenge.joined_at.desc()).limit(5).all()

    challenge_activity_list = []
    for uc in user_challenges:
        challenge = db.query(Challenge).filter(Challenge.id == uc.challenge_id).first()
        if challenge:
            challenge_activity_list.append(
                ChallengeActivity(
                    id=uc.id,
                    challenge_id=uc.challenge_id,
                    challenge_title=challenge.title,
                    challenge_icon=challenge.icon,
                    current_streak=uc.current_streak,
                    best_streak=uc.best_streak,
                    progress_percentage=uc.progress_percentage,
                    is_completed=uc.is_completed
                )
            )

    recent_activities = RecentActivities(
        emotion_logs=emotion_log_list,
        posts=post_list,
        comments=comment_list,
        challenge_activities=challenge_activity_list
    )

    return UserDashboard(
        summary=summary,
        recent_activities=recent_activities
    )


@router.get(
    "/emotion-trend",
    summary="주간 감정 흐름 데이터 조회",
    description="최근 7일간의 감정 기록을 날짜별, 감정 타입별로 집계하여 반환합니다"
)
async def get_emotion_trend(
    days: int = 7,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """주간 감정 흐름 데이터 조회"""
    from datetime import date, timedelta
    
    today = date.today()
    start_date = today - timedelta(days=days - 1)
    
    # 최근 N일간의 감정 기록 조회
    emotion_logs = db.query(EmotionLog).filter(
        EmotionLog.user_id == current_user.id,
        func.date(EmotionLog.created_at) >= start_date,
        func.date(EmotionLog.created_at) <= today
    ).all()
    
    # 날짜별, 감정별로 그룹화 및 평균 계산
    from collections import defaultdict
    
    grouped_data = defaultdict(lambda: defaultdict(list))
    for log in emotion_logs:
        log_date = log.created_at.date()
        emotion = log.emotion_label
        grouped_data[log_date][emotion].append(log.emotion_value)
    
    # 결과 구성
    result = []
    current_date = start_date
    while current_date <= today:
        if current_date in grouped_data:
            for emotion, values in grouped_data[current_date].items():
                result.append({
                    "date": current_date.isoformat(),
                    "emotion_type": emotion,
                    "avg_intensity": round(sum(values) / len(values), 1),
                    "count": len(values)
                })
        current_date += timedelta(days=1)
    
    return {
        "start_date": start_date.isoformat(),
        "end_date": today.isoformat(),
        "data_points": result
    }
