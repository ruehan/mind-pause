"""챌린지 모델"""
from sqlalchemy import Column, String, Integer, Boolean, Date, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime, date
import uuid
import enum

from app.db.database import Base


class ChallengeType(enum.Enum):
    """챌린지 타입"""
    STREAK = "streak"  # 연속 기록
    COMMUNITY = "community"  # 커뮤니티


class ChallengeStatus(enum.Enum):
    """챌린지 승인 상태"""
    PENDING = "pending"  # 대기 중
    APPROVED = "approved"  # 승인됨
    REJECTED = "rejected"  # 거부됨


class ChallengeTemplate(Base):
    """챌린지 템플릿 테이블"""
    __tablename__ = "challenge_templates"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(100), nullable=False)
    description = Column(String(500), nullable=False)
    challenge_type = Column(SQLEnum(ChallengeType), nullable=False)
    default_duration_days = Column(Integer, nullable=False)  # 기본 기간 (일)
    default_target_count = Column(Integer, nullable=False)  # 기본 목표 횟수
    icon = Column(String(10), nullable=True)  # 아이콘 이모지
    reward_badge = Column(String(50), nullable=True)  # 완료 시 배지
    is_active = Column(Boolean, default=True)  # 사용 가능 여부
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    challenges = relationship("Challenge", back_populates="template")


class Challenge(Base):
    """챌린지 테이블"""
    __tablename__ = "challenges"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    template_id = Column(UUID(as_uuid=True), ForeignKey("challenge_templates.id", ondelete="SET NULL"), nullable=True)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    title = Column(String(100), nullable=False)
    description = Column(String(500), nullable=False)
    challenge_type = Column(SQLEnum(ChallengeType), nullable=False)
    duration_days = Column(Integer, nullable=False)  # 챌린지 기간 (일)
    target_count = Column(Integer, nullable=False)  # 목표 횟수
    icon = Column(String(10), nullable=True)  # 아이콘 이모지
    reward_badge = Column(String(50), nullable=True)  # 완료 시 배지

    status = Column(SQLEnum(ChallengeStatus), default=ChallengeStatus.PENDING, nullable=False)
    start_date = Column(Date, nullable=False)  # 시작일
    end_date = Column(Date, nullable=False)  # 종료일

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    template = relationship("ChallengeTemplate", back_populates="challenges")
    creator = relationship("User", foreign_keys=[created_by])
    user_challenges = relationship("UserChallenge", back_populates="challenge", cascade="all, delete-orphan")


class UserChallenge(Base):
    """사용자 챌린지 참여 테이블"""
    __tablename__ = "user_challenges"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    challenge_id = Column(UUID(as_uuid=True), ForeignKey("challenges.id", ondelete="CASCADE"), nullable=False)
    joined_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    current_streak = Column(Integer, default=0)  # 현재 연속 일수
    best_streak = Column(Integer, default=0)  # 최고 연속 일수
    completed_count = Column(Integer, default=0)  # 완료 횟수
    is_completed = Column(Boolean, default=False)  # 챌린지 완료 여부
    completed_at = Column(DateTime, nullable=True)  # 완료 일시
    last_activity_date = Column(Date, nullable=True)  # 마지막 활동 날짜
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    challenge = relationship("Challenge", back_populates="user_challenges")
    user = relationship("User")
