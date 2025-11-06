"""감정 기록 데이터 전체 삭제 스크립트"""
import sys
from pathlib import Path

# 프로젝트 루트를 Python 경로에 추가
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

from sqlalchemy.orm import Session
from app.db.database import engine, Base
from app.models.emotion_log import EmotionLog

def clear_emotion_logs():
    """모든 감정 기록 삭제"""
    with Session(engine) as session:
        try:
            # 모든 감정 기록 삭제
            deleted_count = session.query(EmotionLog).delete()
            session.commit()
            print(f"✅ {deleted_count}개의 감정 기록이 삭제되었습니다.")
        except Exception as e:
            session.rollback()
            print(f"❌ 오류 발생: {e}")
            raise

if __name__ == "__main__":
    print("⚠️  모든 감정 기록을 삭제합니다...")
    clear_emotion_logs()
    print("✅ 완료!")
