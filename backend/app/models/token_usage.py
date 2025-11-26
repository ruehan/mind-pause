from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from app.db.database import Base


class TokenUsage(Base):
    """
    토큰 사용 내역 모델
    모든 AI 요청에 대한 토큰 사용량을 기록
    """
    __tablename__ = "token_usage"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    conversation_id = Column(UUID(as_uuid=True), ForeignKey("conversations.id", ondelete="SET NULL"), nullable=True)
    
    # 토큰 사용량
    input_tokens = Column(Integer, nullable=False)
    output_tokens = Column(Integer, nullable=False)
    total_tokens = Column(Integer, nullable=False)
    
    # 메타데이터
    model_name = Column(String(100), nullable=True)  # 예: "gemini-1.5-pro"
    purpose = Column(String(50), nullable=True)  # "chat", "emotion_analysis", etc.
    
    # 타임스탬프 (인덱스 추가 - 날짜별 집계용)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, index=True)

    def __repr__(self):
        return f"<TokenUsage user_id={self.user_id} total={self.total_tokens}>"
