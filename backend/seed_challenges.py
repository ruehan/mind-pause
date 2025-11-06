"""
챌린지 초기 데이터 생성 스크립트
"""
import sys
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from app.db.database import SessionLocal
from app.models.challenge import Challenge, ChallengeType
from datetime import datetime, date, timedelta


def seed_challenges():
    """챌린지 초기 데이터 생성"""
    db = SessionLocal()

    try:
        # 기존 챌린지 확인
        existing_count = db.query(Challenge).count()
        if existing_count > 0:
            print(f"⚠️  이미 {existing_count}개의 챌린지가 존재합니다.")
            response = input("기존 챌린지를 삭제하고 새로 생성하시겠습니까? (y/N): ")
            if response.lower() != 'y':
                print("❌ 작업을 취소합니다.")
                return

            # 기존 챌린지 삭제
            db.query(Challenge).delete()
            db.commit()
            print("✅ 기존 챌린지를 삭제했습니다.")

        # 연속 기록 챌린지
        streak_challenges = [
            Challenge(
                title="7일 연속 감정 기록 챌린지",
                description="7일 동안 매일 감정을 기록하고 마음의 변화를 관찰해보세요",
                challenge_type=ChallengeType.STREAK,
                duration_days=7,
                target_count=7,
                icon="🔥",
                reward_badge="7일 연속 달성자",
                is_active=True
            ),
            Challenge(
                title="14일 연속 감정 기록 챌린지",
                description="2주 동안 꾸준히 감정을 기록하며 감정 패턴을 발견해보세요",
                challenge_type=ChallengeType.STREAK,
                duration_days=14,
                target_count=14,
                icon="⚡",
                reward_badge="14일 연속 달성자",
                is_active=True
            ),
            Challenge(
                title="30일 연속 감정 기록 챌린지",
                description="한 달 동안 매일 감정을 기록하고 긍정적인 습관을 만들어보세요",
                challenge_type=ChallengeType.STREAK,
                duration_days=30,
                target_count=30,
                icon="💎",
                reward_badge="30일 연속 달성자",
                is_active=True
            ),
        ]

        # 커뮤니티 챌린지
        community_challenges = [
            Challenge(
                title="이번 달 감정 기록 20회 달성",
                description="이번 달 동안 감정을 20회 기록하고 커뮤니티와 함께 성장해보세요",
                challenge_type=ChallengeType.COMMUNITY,
                duration_days=30,
                target_count=20,
                icon="🌟",
                reward_badge="커뮤니티 챔피언",
                is_active=True,
                start_date=date.today(),
                end_date=date.today() + timedelta(days=30)
            ),
        ]

        # 챌린지 생성
        all_challenges = streak_challenges + community_challenges

        for challenge in all_challenges:
            db.add(challenge)

        db.commit()

        print(f"\n✅ {len(all_challenges)}개의 챌린지를 성공적으로 생성했습니다!\n")

        # 생성된 챌린지 목록 출력
        print("생성된 챌린지:")
        for i, challenge in enumerate(all_challenges, 1):
            print(f"  {i}. {challenge.icon} {challenge.title}")
            print(f"     - 타입: {challenge.challenge_type.value}")
            print(f"     - 기간: {challenge.duration_days}일 / 목표: {challenge.target_count}회")
            print()

    except Exception as e:
        db.rollback()
        print(f"❌ 오류 발생: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_challenges()
