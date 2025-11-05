"""
메모리 추출 및 관리 서비스 - 대화에서 사용자 정보 자동 학습
"""
import google.generativeai as genai
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from uuid import UUID

from app.models.message import Message
from app.models.user_memory import UserMemory
from app.core.config import settings


async def extract_user_memories(
    db: Session,
    messages: List[Message],
    user_id: UUID,
    character_id: UUID,
    conversation_id: UUID
) -> List[UserMemory]:
    """
    대화에서 사용자 메모리 추출

    Args:
        db: 데이터베이스 세션
        messages: 분석할 메시지 리스트
        user_id: 사용자 ID
        character_id: AI 캐릭터 ID
        conversation_id: 출처 대화 ID

    Returns:
        추출된 메모리 리스트
    """
    if len(messages) < 4:  # 최소 4개 메시지 필요 (2왕복)
        return []

    # Gemini 모델 설정
    model = genai.GenerativeModel(
        model_name=settings.LLM_MODEL,
        generation_config={
            "temperature": 0.3,  # 정확한 정보 추출을 위해 낮은 temperature
            "max_output_tokens": 1000,
        }
    )

    # 대화 텍스트 생성
    conversation_text = "\n".join([
        f"{'사용자' if msg.role == 'user' else 'AI'}: {msg.content}"
        for msg in messages
    ])

    # 메모리 추출 프롬프트
    prompt = f"""다음 대화에서 사용자에 대한 중요한 정보를 추출해주세요.

대화:
{conversation_text}

다음 카테고리별로 정보를 추출하고 JSON 형식으로 반환해주세요:

1. **사실 정보 (facts)**: 사용자의 객관적 정보
   - 직업, 관계, 생활 상황, 구체적 사건 등
   - 예: {{"fact": "소프트웨어 개발자로 일하고 있음", "confidence": 0.9}}

2. **선호도 (preferences)**: 사용자의 취향이나 선호
   - 좋아하는 것, 싫어하는 것, 관심사 등
   - 예: {{"preference": "아침 운동을 선호함", "confidence": 0.8}}

3. **감정 패턴 (emotion_patterns)**: 반복되는 감정 상태나 트리거
   - 스트레스 요인, 기분 변화 패턴 등
   - 예: {{"pattern": "업무 마감 전에 불안감을 느낌", "confidence": 0.85}}

4. **대화 스타일 (tone_preferences)**: 사용자가 선호하는 대화 방식
   - 격식, 응답 길이, 스타일 등
   - 예: {{"formality": "친근함", "warmth": "높음", "response_length": "간결함", "style": "격려적", "confidence": 0.9}}

반환 형식:
{{
  "facts": [
    {{"fact": "내용", "confidence": 0.0-1.0}}
  ],
  "preferences": [
    {{"preference": "내용", "confidence": 0.0-1.0}}
  ],
  "emotion_patterns": [
    {{"pattern": "내용", "confidence": 0.0-1.0}}
  ],
  "tone_preferences": {{
    "formality": "격식 수준",
    "warmth": "따뜻함 수준",
    "response_length": "선호 응답 길이",
    "style": "선호 스타일",
    "confidence": 0.0-1.0
  }}
}}

중요:
- 명확하게 언급된 정보만 추출하세요
- 추측이나 가정은 하지 마세요
- 확실한 정보는 confidence를 높게, 불확실한 정보는 낮게 설정하세요
- 정보가 없으면 빈 배열을 반환하세요
- 반드시 유효한 JSON 형식으로만 응답하세요"""

    try:
        response = model.generate_content(prompt)
        response_text = response.text.strip()

        # JSON 추출 (```json``` 마크다운 제거)
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
        response_text = response_text.strip()

        import json
        extracted = json.loads(response_text)

        memories = []

        # 사실 정보 저장
        for fact_data in extracted.get("facts", []):
            memory = UserMemory(
                user_id=user_id,
                character_id=character_id,
                memory_type="fact",
                content={"fact": fact_data["fact"]},
                confidence_score=fact_data.get("confidence", 0.7),
                source_conversation_id=conversation_id
            )
            memories.append(memory)

        # 선호도 저장
        for pref_data in extracted.get("preferences", []):
            memory = UserMemory(
                user_id=user_id,
                character_id=character_id,
                memory_type="preference",
                content={"preference": pref_data["preference"]},
                confidence_score=pref_data.get("confidence", 0.7),
                source_conversation_id=conversation_id
            )
            memories.append(memory)

        # 감정 패턴 저장
        for pattern_data in extracted.get("emotion_patterns", []):
            memory = UserMemory(
                user_id=user_id,
                character_id=character_id,
                memory_type="emotion_pattern",
                content={"pattern": pattern_data["pattern"]},
                confidence_score=pattern_data.get("confidence", 0.7),
                source_conversation_id=conversation_id
            )
            memories.append(memory)

        # 대화 스타일 저장
        tone_prefs = extracted.get("tone_preferences")
        if tone_prefs and isinstance(tone_prefs, dict):
            confidence = tone_prefs.pop("confidence", 0.7)
            memory = UserMemory(
                user_id=user_id,
                character_id=character_id,
                memory_type="tone_preference",
                content=tone_prefs,
                confidence_score=confidence,
                source_conversation_id=conversation_id
            )
            memories.append(memory)

        # 메모리 저장
        if memories:
            for memory in memories:
                db.add(memory)
            db.commit()
            print(f"✅ {len(memories)}개의 메모리 추출 및 저장 완료")

        return memories

    except Exception as e:
        print(f"메모리 추출 오류: {str(e)}")
        return []


def should_update_memory(db: Session, conversation_id: UUID) -> bool:
    """
    메모리 업데이트가 필요한지 확인

    Args:
        db: 데이터베이스 세션
        conversation_id: 대화 ID

    Returns:
        메모리 업데이트 필요 여부
    """
    # 현재 대화의 메시지 수 확인
    message_count = db.query(Message).filter(
        Message.conversation_id == conversation_id
    ).count()

    # 10개 메시지마다 메모리 업데이트
    return message_count > 0 and message_count % 10 == 0


async def update_user_memory(
    db: Session,
    conversation_id: UUID,
    user_id: UUID,
    character_id: UUID
) -> List[UserMemory]:
    """
    대화 기반 사용자 메모리 업데이트

    Args:
        db: 데이터베이스 세션
        conversation_id: 대화 ID
        user_id: 사용자 ID
        character_id: AI 캐릭터 ID

    Returns:
        업데이트된 메모리 리스트
    """
    # 최근 10개 메시지 가져오기
    recent_messages = db.query(Message).filter(
        Message.conversation_id == conversation_id
    ).order_by(
        Message.created_at.desc()
    ).limit(10).all()

    # 시간순으로 재정렬
    recent_messages.reverse()

    # 메모리 추출
    memories = await extract_user_memories(
        db=db,
        messages=recent_messages,
        user_id=user_id,
        character_id=character_id,
        conversation_id=conversation_id
    )

    return memories
