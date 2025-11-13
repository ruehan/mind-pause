"""신고 모델"""
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Enum as SQLEnum, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum

from app.db.database import Base


class ReportType(enum.Enum):
    """신고 대상 타입"""
    POST = "post"  # 게시글
    COMMENT = "comment"  # 댓글


class ReportReason(enum.Enum):
    """신고 사유"""
    SPAM = "spam"  # 스팸/홍보
    HARASSMENT = "harassment"  # 욕설/비방
    INAPPROPRIATE = "inappropriate"  # 부적절한 내용
    MISINFORMATION = "misinformation"  # 거짓 정보
    COPYRIGHT = "copyright"  # 저작권 침해
    OTHER = "other"  # 기타


class ReportStatus(enum.Enum):
    """신고 처리 상태"""
    PENDING = "pending"  # 대기 중
    REVIEWING = "reviewing"  # 검토 중
    RESOLVED = "resolved"  # 처리 완료
    REJECTED = "rejected"  # 반려


class Report(Base):
    """신고 테이블"""
    __tablename__ = "reports"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    reporter_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    report_type = Column(SQLEnum(ReportType), nullable=False)
    report_reason = Column(SQLEnum(ReportReason), nullable=False)

    # 신고 대상 (post_id 또는 comment_id 중 하나만 사용)
    post_id = Column(UUID(as_uuid=True), ForeignKey("community_posts.id", ondelete="CASCADE"), nullable=True)
    comment_id = Column(UUID(as_uuid=True), ForeignKey("comments.id", ondelete="CASCADE"), nullable=True)

    # 신고 내용
    description = Column(Text, nullable=True)  # 상세 설명

    # 처리 정보
    status = Column(SQLEnum(ReportStatus), default=ReportStatus.PENDING, nullable=False)
    admin_note = Column(Text, nullable=True)  # 관리자 메모
    reviewed_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    reviewed_at = Column(DateTime, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    reporter = relationship("User", foreign_keys=[reporter_id])
    reviewer = relationship("User", foreign_keys=[reviewed_by])
    post = relationship("Post", foreign_keys=[post_id])
    comment = relationship("Comment", foreign_keys=[comment_id])
