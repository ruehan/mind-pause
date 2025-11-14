"""
사용자별 프롬프트 선호도 모델
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from app.db.database import Base


class UserPromptPreference(Base):
    """
    사용자별 AI 대화 스타일 선호도

    피드백과 대화 패턴을 학습하여 개인 맞춤형 프롬프트 생성에 활용
    """
    __tablename__ = "user_prompt_preferences"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    character_id = Column(UUID(as_uuid=True), ForeignKey("ai_characters.id", ondelete="CASCADE"), nullable=False)

    # 응답 길이 선호도
    preferred_response_length = Column(
        String(20),
        default="medium",
        nullable=False,
        comment="short | medium | long"
    )

    # 톤 선호도
    preferred_tone = Column(
        String(20),
        default="mixed",
        nullable=False,
        comment="formal | casual | mixed"
    )

    # 이모지 사용 선호도
    emoji_preference = Column(
        String(20),
        default="moderate",
        nullable=False,
        comment="none | minimal | moderate | frequent"
    )

    # Few-shot 예제 개수
    preferred_few_shot_count = Column(
        Integer,
        default=3,
        nullable=False,
        comment="1-5 사이 값"
    )

    # 학습 데이터 통계
    total_conversations = Column(Integer, default=0, nullable=False)
    total_feedbacks = Column(Integer, default=0, nullable=False)
    positive_feedback_ratio = Column(Float, default=0.0, nullable=False, comment="0.0-1.0")

    # 메타 정보
    confidence_score = Column(
        Float,
        default=0.0,
        nullable=False,
        comment="학습 데이터 충분성 (0.0-1.0)"
    )
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # 제약 조건: 사용자당 캐릭터당 하나의 선호도만
    __table_args__ = (
        UniqueConstraint('user_id', 'character_id', name='uq_user_character_preference'),
    )

    def __repr__(self):
        return f"<UserPromptPreference user={self.user_id} char={self.character_id} length={self.preferred_response_length}>"
