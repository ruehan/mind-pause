from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
import uuid
from app.db.database import Base


class UserMemory(Base):
    """사용자 메모리 모델 - 장기 사용자 지식 축적"""
    __tablename__ = "user_memory"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    character_id = Column(
        UUID(as_uuid=True),
        ForeignKey("ai_characters.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    memory_type = Column(String(50), nullable=False, index=True)
    # 'fact', 'preference', 'emotion_pattern', 'tone_preference'
    content = Column(JSONB, nullable=False)  # 메모리 내용 (JSON)
    confidence_score = Column(Float, default=1.0, nullable=False, index=True)  # 0.0 ~ 1.0
    source_conversation_id = Column(
        UUID(as_uuid=True),
        ForeignKey("conversations.id", ondelete="SET NULL"),
        nullable=True
    )
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )

    def __repr__(self):
        return f"<UserMemory {self.id}: {self.memory_type}>"
