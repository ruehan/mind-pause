"""
데이터베이스 테이블 생성 스크립트
"""
import sys
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from app.db.database import engine, Base
from app.models import (
    User,
    AICharacter,
    Conversation,
    Message,
    ConversationSummary,
    UserMemory,
    Post,
    Comment,
    Like,
    EmotionLog,
    Challenge,
    UserChallenge,
    ChallengeTemplate,
    Report,
    MessageFeedback,
    ConversationRating,
    ConversationMetrics,
)


def create_tables():
    """Create all tables in the database."""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created successfully!")

    # Print created tables
    print("\nCreated tables:")
    for table_name in Base.metadata.tables.keys():
        print(f"  - {table_name}")


if __name__ == "__main__":
    create_tables()
