"""
감정 기록 피드백 생성 서비스
"""
from sqlalchemy.orm import Session
from typing import Optional
from uuid import UUID

from app.services.llm_service import get_gemini_model
from app.models.emotion_log import EmotionLog


def build_emotion_context(
    db: Session,
    user_id: UUID,
    emotion_value: int,
    emotion_label: str,
    note: Optional[str] = None
) -> str:
    """
    감정 기록에 대한 AI 피드백 생성을 위한 컨텍스트 구축
    
    Args:
        db: 데이터베이스 세션
        user_id: 사용자 ID
        emotion_value: 감정 점수 (-3 ~ 3)
        emotion_label: 감정 라벨
        note: 사용자 메모
    
    Returns:
        str: LLM에 전달할 프롬프트
    """
    # 최근 감정 기록 가져오기 (패턴 파악용)
    recent_logs = db.query(EmotionLog).filter(
        EmotionLog.user_id == user_id
    ).order_by(EmotionLog.created_at.desc()).limit(5).all()
    
    # 감정 점수 해석
    emotion_intensity = ""
    if emotion_value >= 2:
        emotion_intensity = "매우 긍정적인"
    elif emotion_value == 1:
        emotion_intensity = "긍정적인"
    elif emotion_value == 0:
        emotion_intensity = "중립적인"
    elif emotion_value == -1:
        emotion_intensity = "부정적인"
    else:
        emotion_intensity = "매우 부정적인"
    
    # 최근 감정 패턴 분석
    pattern_context = ""
    if recent_logs:
        avg_recent = sum(log.emotion_value for log in recent_logs) / len(recent_logs)
        if avg_recent > 1:
            pattern_context = "최근 감정 상태가 전반적으로 좋은 편입니다."
        elif avg_recent > 0:
            pattern_context = "최근 감정 상태가 안정적인 편입니다."
        elif avg_recent > -1:
            pattern_context = "최근 감정 기복이 있는 것 같습니다."
        else:
            pattern_context = "최근 감정 상태가 다소 힘든 시기인 것 같습니다."
    
    # 프롬프트 구성
    prompt = f"""당신은 공감적이고 따뜻한 감정 관리 도우미입니다. 
사용자가 기록한 감정에 대해 짧고 따뜻한 피드백을 제공해주세요.

**현재 감정 기록:**
- 감정: {emotion_label} ({emotion_intensity} 상태, 점수: {emotion_value})"""
    
    if note:
        prompt += f"\n- 메모: {note}"
    
    if pattern_context:
        prompt += f"\n\n**최근 감정 패턴:** {pattern_context}"
    
    prompt += """

**피드백 작성 가이드:**
1. 사용자의 감정을 인정하고 공감해주세요
2. 긍정적인 감정이면 축하하고, 부정적인 감정이면 위로해주세요
3. 필요하다면 간단한 조언이나 격려를 제공하세요
4. 2-3문장으로 간결하게 작성하세요
5. 친근하고 따뜻한 톤을 사용하세요

피드백을 작성해주세요:"""
    
    return prompt


async def generate_emotion_feedback(
    db: Session,
    user_id: UUID,
    emotion_value: int,
    emotion_label: str,
    note: Optional[str] = None
) -> str:
    """
    감정 기록에 대한 AI 피드백 생성
    
    Args:
        db: 데이터베이스 세션
        user_id: 사용자 ID
        emotion_value: 감정 점수
        emotion_label: 감정 라벨
        note: 사용자 메모
    
    Returns:
        str: 생성된 AI 피드백
    """
    # 컨텍스트 구축
    prompt = build_emotion_context(
        db=db,
        user_id=user_id,
        emotion_value=emotion_value,
        emotion_label=emotion_label,
        note=note
    )
    
    # LLM으로 피드백 생성
    model = get_gemini_model()
    
    try:
        response = model.generate_content(prompt)
        feedback = response.text.strip()
        return feedback
    except Exception as e:
        print(f"감정 피드백 생성 오류: {str(e)}")
        # 폴백 메시지
        if emotion_value >= 1:
            return "긍정적인 감정을 기록해주셔서 감사합니다. 이런 순간들을 잘 기억해두세요!"
        elif emotion_value >= 0:
            return "오늘의 감정을 기록해주셔서 고맙습니다. 차근차근 하루하루 나아가시길 응원합니다."
        else:
            return "힘든 감정을 솔직하게 기록해주셨네요. 이런 순간도 괜찮다는 것을 기억해주세요."
