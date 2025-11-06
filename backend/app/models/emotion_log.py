from sqlalchemy import Column, String, Text, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid
from app.db.database import Base


class EmotionLog(Base):
    __tablename__ = "emotion_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    emotion_value = Column(Integer, nullable=False)  # -3 to 3 scale
    emotion_label = Column(String(50), nullable=False)  # e.g., "좋음", "보통", "안좋음"
    emotion_emoji = Column(String(10), nullable=False)  # e.g., "😊", "😐", "😢"
    note = Column(Text, nullable=True)  # User's note
    ai_feedback = Column(Text, nullable=True)  # AI-generated feedback
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    user = relationship("User", backref="emotion_logs")

    def __repr__(self):
        return f"<EmotionLog {self.emotion_label} by user {self.user_id}>"
