from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from app.db.database import Base


class MessageFeedback(Base):
    """메시지 피드백 모델 (좋아요/싫어요)"""
    __tablename__ = "message_feedbacks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    message_id = Column(
        UUID(as_uuid=True),
        ForeignKey("messages.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
        unique=True  # 메시지당 하나의 피드백만
    )
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    is_helpful = Column(Boolean, nullable=False)  # True: 좋아요, False: 싫어요
    feedback_text = Column(String(500), nullable=True)  # 선택적 피드백 텍스트
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )

    def __repr__(self):
        return f"<MessageFeedback {self.id}: {'👍' if self.is_helpful else '👎'}>"
