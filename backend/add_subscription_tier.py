"""
기존 users 테이블에 subscription_tier 컬럼 추가
"""
import sys
from pathlib import Path

backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from sqlalchemy import text
from app.db.database import engine

def add_subscription_tier_column():
    """Users 테이블에 subscription_tier 컬럼 추가"""
    
    with engine.connect() as conn:
        try:
            # 1. subscription_tier 컬럼 추가 (기본값 FREE)
            print("Adding subscription_tier column to users table...")
            conn.execute(text("""
                ALTER TABLE users 
                ADD COLUMN IF NOT EXISTS subscription_tier VARCHAR(50) NOT NULL DEFAULT 'FREE'
            """))
            conn.commit()
            print("✅ subscription_tier column added successfully!")
            
            # 2. 컬럼 확인
            result = conn.execute(text("""
                SELECT column_name, data_type, column_default
                FROM information_schema.columns
                WHERE table_name = 'users' AND column_name = 'subscription_tier'
            """))
            
            for row in result:
                print(f"\nColumn details:")
                print(f"  - Name: {row[0]}")
                print(f"  - Type: {row[1]}")
                print(f"  - Default: {row[2]}")
            
        except Exception as e:
            print(f"❌ Error: {e}")
            conn.rollback()
            raise

if __name__ == "__main__":
    add_subscription_tier_column()
