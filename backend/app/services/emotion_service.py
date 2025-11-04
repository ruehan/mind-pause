"""
감정 감지 서비스 - 사용자 메시지에서 감정 상태 분석 및 적응형 응답 제안
"""
import google.generativeai as genai
from typing import Dict, Any, Optional
import json

from app.core.config import settings


# 감정 카테고리 정의
EMOTION_CATEGORIES = {
    "joy": "기쁨",
    "gratitude": "감사",
    "excitement": "흥분",
    "satisfaction": "만족",
    "sadness": "슬픔",
    "anger": "분노",
    "anxiety": "불안",
    "stress": "스트레스",
    "depression": "우울",
    "loneliness": "외로움",
    "calm": "평온",
    "curiosity": "호기심",
    "neutral": "중립"
}


async def detect_emotion(message: str) -> Dict[str, Any]:
    """
    사용자 메시지에서 감정 상태 감지

    Args:
        message: 분석할 사용자 메시지

    Returns:
        감정 분석 결과
        {
            "primary_emotion": "슬픔",
            "emotion_category": "negative",
            "intensity": 0.8,
            "secondary_emotions": ["불안", "외로움"],
            "response_style": "empathetic"
        }
    """
    # 매우 짧은 메시지는 분석 생략
    if len(message.strip()) < 3:
        return {
            "primary_emotion": "neutral",
            "emotion_category": "neutral",
            "intensity": 0.0,
            "secondary_emotions": [],
            "response_style": "balanced"
        }

    # Gemini 모델 설정
    model = genai.GenerativeModel(
        model_name=settings.LLM_MODEL,
        generation_config={
            "temperature": 0.3,
            "max_output_tokens": 500,
        }
    )

    # 감정 분석 프롬프트
    prompt = f"""다음 메시지에서 사용자의 감정 상태를 분석해주세요.

메시지: "{message}"

다음 형식의 JSON으로만 응답하세요:
{{
  "primary_emotion": "주요 감정 (한국어)",
  "emotion_category": "positive|negative|neutral",
  "intensity": 0.0-1.0 (감정 강도),
  "secondary_emotions": ["부차적 감정들 (한국어)"],
  "keywords": ["감정을 나타내는 키워드들"],
  "response_style": "empathetic|supportive|calming|encouraging|balanced"
}}

감정 카테고리:
- positive: 기쁨, 감사, 만족, 흥분, 평온
- negative: 슬픔, 분노, 불안, 스트레스, 우울, 외로움
- neutral: 중립적, 호기심, 일반적

응답 스타일 선택 가이드:
- empathetic: 슬픔, 외로움 → 공감과 위로
- supportive: 불안, 스트레스 → 지지와 격려
- calming: 분노, 초조함 → 진정과 이해
- encouraging: 기쁨, 만족 → 긍정 강화
- balanced: 중립, 호기심 → 균형잡힌 대화

중요:
- 반드시 유효한 JSON 형식으로만 응답
- 명확한 감정이 없으면 neutral 선택
- intensity는 메시지에서 드러나는 감정의 강도 (0.0=없음, 1.0=매우 강함)"""

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

        emotion_data = json.loads(response_text)

        # 기본값 설정
        emotion_data.setdefault("primary_emotion", "neutral")
        emotion_data.setdefault("emotion_category", "neutral")
        emotion_data.setdefault("intensity", 0.5)
        emotion_data.setdefault("secondary_emotions", [])
        emotion_data.setdefault("keywords", [])
        emotion_data.setdefault("response_style", "balanced")

        return emotion_data

    except Exception as e:
        print(f"감정 감지 오류: {str(e)}")
        # 오류 시 기본값 반환
        return {
            "primary_emotion": "neutral",
            "emotion_category": "neutral",
            "intensity": 0.0,
            "secondary_emotions": [],
            "keywords": [],
            "response_style": "balanced"
        }


def get_adaptive_response_instructions(emotion_data: Dict[str, Any]) -> str:
    """
    감정 데이터를 기반으로 적응형 응답 지침 생성

    Args:
        emotion_data: 감정 분석 결과

    Returns:
        AI에게 전달할 응답 스타일 지침
    """
    response_style = emotion_data.get("response_style", "balanced")
    primary_emotion = emotion_data.get("primary_emotion", "중립")
    intensity = emotion_data.get("intensity", 0.0)
    emotion_category = emotion_data.get("emotion_category", "neutral")

    # 강도가 낮으면 일반 모드
    if intensity < 0.3:
        return ""

    # 응답 스타일별 지침
    style_instructions = {
        "empathetic": f"""
**현재 사용자 감정**: {primary_emotion} (강도: {intensity:.1f})

**응답 지침**:
- 사용자의 감정을 깊이 공감하고 인정해주세요
- "그런 감정을 느끼시는 게 당연해요", "많이 힘드셨겠어요" 같은 표현 사용
- 따뜻하고 부드러운 어조 유지
- 성급한 조언보다는 경청과 공감에 집중
- 사용자가 자신의 감정을 표현하도록 격려""",

        "supportive": f"""
**현재 사용자 감정**: {primary_emotion} (강도: {intensity:.1f})

**응답 지침**:
- 사용자를 지지하고 응원하는 태도
- "당신은 이겨낼 수 있어요", "함께 해결해봐요" 같은 격려
- 구체적이고 실행 가능한 작은 단계 제안
- 과거에 극복한 경험이 있다면 상기시키기
- 긍정적이지만 현실적인 관점 제시""",

        "calming": f"""
**현재 사용자 감정**: {primary_emotion} (강도: {intensity:.1f})

**응답 지침**:
- 차분하고 안정적인 어조 유지
- 깊은 호흡이나 짧은 명상 같은 즉각적 진정 기법 제안
- "천천히 생각해봐요", "잠시 숨을 고르고" 같은 표현
- 감정을 정당화하되, 건설적인 방향으로 안내
- 급하지 않고 여유있는 대화 진행""",

        "encouraging": f"""
**현재 사용자 감정**: {primary_emotion} (강도: {intensity:.1f})

**응답 지침**:
- 사용자의 긍정적 감정을 함께 기뻐하기
- "정말 잘하셨어요!", "축하드려요!" 같은 긍정 강화
- 이 좋은 상태를 유지하는 방법 제안
- 다른 영역으로 긍정 에너지 확장하도록 격려
- 밝고 활기찬 어조 사용""",

        "balanced": ""
    }

    instruction = style_instructions.get(response_style, "")

    # 감정 카테고리별 추가 지침
    if emotion_category == "negative" and intensity >= 0.7:
        instruction += f"""

**⚠️ 주의**: 사용자가 강한 부정적 감정 ({primary_emotion})을 느끼고 있습니다.
- 전문가 도움이 필요해 보이면 상담 권유
- 자해나 극단적 생각이 엿보이면 즉시 전문기관 안내
- 섣부른 위로보다는 진지한 경청과 공감"""

    return instruction


def format_emotion_summary(emotion_data: Dict[str, Any]) -> str:
    """
    감정 데이터를 요약 텍스트로 포맷

    Args:
        emotion_data: 감정 분석 결과

    Returns:
        포맷된 감정 요약 텍스트
    """
    primary = emotion_data.get("primary_emotion", "중립")
    category = emotion_data.get("emotion_category", "neutral")
    intensity = emotion_data.get("intensity", 0.0)
    secondary = emotion_data.get("secondary_emotions", [])

    category_emoji = {
        "positive": "😊",
        "negative": "😔",
        "neutral": "😐"
    }

    summary = f"{category_emoji.get(category, '')} {primary}"

    if intensity >= 0.7:
        summary += " (강함)"
    elif intensity >= 0.4:
        summary += " (중간)"

    if secondary:
        summary += f" + {', '.join(secondary[:2])}"

    return summary
