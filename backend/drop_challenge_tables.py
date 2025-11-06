"""
챌린지 관련 테이블 삭제 스크립트
새로운 스키마 적용을 위해 기존 테이블을 삭제합니다
"""
import sys
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from app.db.database import engine
from sqlalchemy import text


def drop_challenge_tables():
    """챌린지 관련 테이블 및 enum 타입 삭제"""

    print("⚠️  WARNING: 이 작업은 챌린지 관련 모든 데이터를 삭제합니다!")
    response = input("계속하시겠습니까? (y/N): ")

    if response.lower() != 'y':
        print("❌ 작업을 취소합니다.")
        return

    try:
        with engine.connect() as conn:
            # 트랜잭션 시작
            trans = conn.begin()

            try:
                print("\n📋 챌린지 관련 테이블 삭제 중...")

                # 테이블 삭제 (의존성 순서대로)
                conn.execute(text("DROP TABLE IF EXISTS user_challenges CASCADE;"))
                print("  ✅ user_challenges 테이블 삭제")

                conn.execute(text("DROP TABLE IF EXISTS challenges CASCADE;"))
                print("  ✅ challenges 테이블 삭제")

                conn.execute(text("DROP TABLE IF EXISTS challenge_templates CASCADE;"))
                print("  ✅ challenge_templates 테이블 삭제")

                # Enum 타입 삭제 (CASCADE 없이)
                try:
                    conn.execute(text("DROP TYPE IF EXISTS challengestatus;"))
                    print("  ✅ challengestatus enum 타입 삭제")
                except Exception as e:
                    print(f"  ⚠️ challengestatus enum 삭제 실패 (무시됨): {e}")

                try:
                    conn.execute(text("DROP TYPE IF EXISTS challengetype;"))
                    print("  ✅ challengetype enum 타입 삭제")
                except Exception as e:
                    print(f"  ⚠️ challengetype enum 삭제 실패 (무시됨): {e}")

                # 커밋
                trans.commit()

                print("\n✅ 챌린지 관련 테이블이 성공적으로 삭제되었습니다!")
                print("\n다음 명령을 실행하여 새로운 테이블을 생성하세요:")
                print("  python create_tables.py")
                print("  python seed_challenge_templates.py")

            except Exception as e:
                trans.rollback()
                print(f"❌ 오류 발생: {e}")
                raise

    except Exception as e:
        print(f"❌ 데이터베이스 연결 오류: {e}")


if __name__ == "__main__":
    drop_challenge_tables()
