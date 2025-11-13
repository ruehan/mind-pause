"""사용자 대시보드 스키마"""
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
from uuid import UUID


class ActivitySummary(BaseModel):
    """활동 요약 통계"""
    # 감정 기록 통계
    total_emotion_logs: int
    emotion_logs_this_week: int
    emotion_logs_this_month: int

    # 커뮤니티 통계
    total_posts: int
    total_comments: int
    total_likes_received: int
    posts_this_week: int
    comments_this_week: int

    # 챌린지 통계
    active_challenges: int
    completed_challenges: int
    current_best_streak: int

    # AI 채팅 통계
    total_conversations: int
    conversations_this_week: int


class RecentEmotionLog(BaseModel):
    """최근 감정 기록"""
    id: UUID
    emotion_type: str
    intensity: int
    content: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class RecentPost(BaseModel):
    """최근 게시글"""
    id: UUID
    title: str
    content: str
    num_likes: int
    num_comments: int
    created_at: datetime

    class Config:
        from_attributes = True


class RecentComment(BaseModel):
    """최근 댓글"""
    id: UUID
    post_id: UUID
    post_title: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True


class ChallengeActivity(BaseModel):
    """챌린지 활동"""
    id: UUID
    challenge_id: UUID
    challenge_title: str
    challenge_icon: Optional[str]
    current_streak: int
    best_streak: int
    progress_percentage: float
    is_completed: bool

    class Config:
        from_attributes = True


class RecentActivities(BaseModel):
    """최근 활동 히스토리"""
    emotion_logs: List[RecentEmotionLog]
    posts: List[RecentPost]
    comments: List[RecentComment]
    challenge_activities: List[ChallengeActivity]


class UserDashboard(BaseModel):
    """사용자 대시보드 전체 데이터"""
    summary: ActivitySummary
    recent_activities: RecentActivities
