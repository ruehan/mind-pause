from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from app.db.database import Base


class ConversationMetrics(Base):
    """대화 메트릭 모델 (자동 수집)"""
    __tablename__ = "conversation_metrics"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    conversation_id = Column(
        UUID(as_uuid=True),
        ForeignKey("conversations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
        unique=True  # 대화당 하나의 메트릭
    )

    # 대화 통계
    total_messages = Column(Integer, default=0, nullable=False)  # 총 메시지 수
    user_messages = Column(Integer, default=0, nullable=False)  # 사용자 메시지 수
    ai_messages = Column(Integer, default=0, nullable=False)  # AI 메시지 수

    # 응답 시간 통계 (밀리초)
    avg_response_time_ms = Column(Float, nullable=True)  # 평균 응답 시간
    min_response_time_ms = Column(Float, nullable=True)  # 최소 응답 시간
    max_response_time_ms = Column(Float, nullable=True)  # 최대 응답 시간

    # 토큰 사용량
    total_input_tokens = Column(Integer, default=0, nullable=False)  # 총 입력 토큰
    total_output_tokens = Column(Integer, default=0, nullable=False)  # 총 출력 토큰
    avg_input_tokens = Column(Float, nullable=True)  # 평균 입력 토큰
    avg_output_tokens = Column(Float, nullable=True)  # 평균 출력 토큰

    # 대화 품질 지표
    positive_feedbacks = Column(Integer, default=0, nullable=False)  # 좋아요 수
    negative_feedbacks = Column(Integer, default=0, nullable=False)  # 싫어요 수

    # 타임스탬프
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )

    def __repr__(self):
        return f"<ConversationMetrics {self.id}: {self.total_messages} messages>"
