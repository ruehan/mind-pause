from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from app.db.database import Base


class ConversationRating(Base):
    """대화 만족도 평가 모델"""
    __tablename__ = "conversation_ratings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    conversation_id = Column(
        UUID(as_uuid=True),
        ForeignKey("conversations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
        unique=True  # 대화당 하나의 평가만
    )
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    rating = Column(Integer, nullable=False)  # 1-5 별점
    feedback_text = Column(String(1000), nullable=True)  # 선택적 피드백
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    def __repr__(self):
        return f"<ConversationRating {self.id}: {self.rating}⭐>"
