"""관리자 스키마"""
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from uuid import UUID


class DashboardStats(BaseModel):
    """관리자 대시보드 통계 스키마"""
    # 사용자 통계
    total_users: int = Field(..., description="전체 사용자 수")
    new_users_today: int = Field(..., description="오늘 가입한 사용자 수")
    new_users_week: int = Field(..., description="이번 주 가입한 사용자 수")

    # 감정 기록 통계
    total_emotion_logs: int = Field(..., description="전체 감정 기록 수")
    emotion_logs_today: int = Field(..., description="오늘 작성된 감정 기록 수")
    emotion_logs_week: int = Field(..., description="이번 주 작성된 감정 기록 수")

    # 커뮤니티 통계
    total_posts: int = Field(..., description="전체 게시글 수")
    posts_today: int = Field(..., description="오늘 작성된 게시글 수")
    total_comments: int = Field(..., description="전체 댓글 수")

    # 챌린지 통계
    total_challenges: int = Field(..., description="전체 챌린지 수")
    active_challenges: int = Field(..., description="진행 중인 챌린지 수")
    pending_challenges: int = Field(..., description="승인 대기 중인 챌린지 수")

    # AI 채팅 통계
    total_conversations: int = Field(..., description="전체 대화 수")
    conversations_today: int = Field(..., description="오늘 시작된 대화 수")


class UserManagementItem(BaseModel):
    """사용자 관리 항목 스키마"""
    id: UUID = Field(..., description="사용자 ID")
    email: Optional[str] = Field(None, description="이메일")
    nickname: str = Field(..., description="닉네임")
    role: str = Field(..., description="역할")
    is_deleted: bool = Field(..., description="삭제 여부")
    created_at: datetime = Field(..., description="가입일")
    last_login_at: Optional[datetime] = Field(None, description="마지막 로그인")

    # 통계
    emotion_log_count: int = Field(0, description="감정 기록 수")
    post_count: int = Field(0, description="작성 게시글 수")
    comment_count: int = Field(0, description="작성 댓글 수")

    class Config:
        from_attributes = True


class UserManagementListResponse(BaseModel):
    """사용자 관리 목록 응답 스키마"""
    users: List[UserManagementItem] = Field(..., description="사용자 목록")
    total: int = Field(..., description="전체 사용자 수")


class UserRoleUpdate(BaseModel):
    """사용자 역할 변경 요청 스키마"""
    role: str = Field(..., description="변경할 역할 (USER, ADMIN, EXPERT)")


class UserDeleteRequest(BaseModel):
    """사용자 삭제 요청 스키마"""
    permanent: bool = Field(False, description="영구 삭제 여부 (False: 소프트 삭제, True: 영구 삭제)")


# ============================================
# 신고 관리
# ============================================

class ReportItem(BaseModel):
    """신고 항목 스키마"""
    id: UUID = Field(..., description="신고 ID")
    reporter_id: UUID = Field(..., description="신고자 ID")
    reporter_nickname: str = Field(..., description="신고자 닉네임")
    report_type: str = Field(..., description="신고 대상 타입 (post/comment)")
    report_reason: str = Field(..., description="신고 사유")
    description: Optional[str] = Field(None, description="상세 설명")

    # 신고 대상 정보
    post_id: Optional[UUID] = Field(None, description="게시글 ID")
    comment_id: Optional[UUID] = Field(None, description="댓글 ID")
    target_content: Optional[str] = Field(None, description="신고 대상 내용 (미리보기)")

    # 처리 정보
    status: str = Field(..., description="처리 상태")
    admin_note: Optional[str] = Field(None, description="관리자 메모")
    reviewed_by: Optional[UUID] = Field(None, description="처리한 관리자 ID")
    reviewed_at: Optional[datetime] = Field(None, description="처리 일시")

    created_at: datetime = Field(..., description="신고 일시")

    class Config:
        from_attributes = True


class ReportListResponse(BaseModel):
    """신고 목록 응답 스키마"""
    reports: List[ReportItem] = Field(..., description="신고 목록")
    total: int = Field(..., description="전체 신고 수")


class ReportReviewRequest(BaseModel):
    """신고 처리 요청 스키마"""
    status: str = Field(..., description="처리 상태 (reviewing/resolved/rejected)")
    admin_note: Optional[str] = Field(None, description="관리자 메모")
    delete_content: bool = Field(False, description="신고된 컨텐츠 삭제 여부")
