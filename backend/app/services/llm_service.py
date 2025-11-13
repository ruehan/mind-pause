"""
LLM 서비스 - Gemini API 통합 (Advanced Prompt Engineering)
"""
import google.generativeai as genai
from typing import AsyncGenerator, Dict, List, Optional
from app.core.config import settings
from app.prompts.prompt_builder import build_counseling_prompt

# Gemini API 설정
genai.configure(api_key=settings.GOOGLE_API_KEY)


def get_gemini_model():
    """Gemini 모델 인스턴스 가져오기"""
    return genai.GenerativeModel(
        model_name=settings.LLM_MODEL,
        generation_config={
            "temperature": settings.LLM_TEMPERATURE,
            "max_output_tokens": settings.LLM_MAX_OUTPUT_TOKENS,
        }
    )


async def stream_gemini_response(
    messages: List[Dict[str, str]]
) -> AsyncGenerator[str, None]:
    """
    Gemini API로부터 스트리밍 응답 받기

    Note: Advanced Prompt Engineering은 context_service에서 처리됨

    Args:
        messages: 대화 히스토리 [{"role": "user"/"assistant", "content": "..."}]
                  (이미 고급 프롬프팅이 적용된 상태)

    Yields:
        str: 생성된 텍스트 청크
    """
    model = get_gemini_model()

    # Gemini API 형식으로 변환
    gemini_messages = []
    for msg in messages:
        role = "model" if msg["role"] == "assistant" else "user"
        gemini_messages.append({
            "role": role,
            "parts": msg["content"]
        })

    try:
        # 스트리밍 응답 생성
        response = model.generate_content(
            gemini_messages,
            stream=True
        )

        # 청크 단위로 응답 생성
        for chunk in response:
            if chunk.text:
                yield chunk.text

    except Exception as e:
        print(f"Gemini API 오류: {str(e)}")
        raise Exception(f"AI 응답 생성 중 오류가 발생했습니다: {str(e)}")


def build_system_prompt(character_name: str, personality: str, system_prompt: str = None) -> str:
    """
    AI 캐릭터 기반 시스템 프롬프트 구성

    Args:
        character_name: AI 캐릭터 이름
        personality: AI 캐릭터 성격
        system_prompt: 추가 시스템 프롬프트

    Returns:
        str: 완성된 시스템 프롬프트
    """
    base_prompt = f"""당신은 {character_name}이며, {personality}입니다.

사용자는 정신 건강 관리와 감정 조절을 위해 당신과 대화하고 있습니다.
다음 원칙을 따라 응답해주세요:

1. 공감적이고 따뜻한 태도를 유지하세요
2. 사용자의 감정을 인정하고 검증해주세요
3. 필요시 구체적이고 실행 가능한 조언을 제공하세요
4. 전문적인 치료가 필요해 보이면 전문가 상담을 권유하세요
5. 한국어로 자연스럽고 친근하게 대화하세요
6. 응답은 2-3문장으로 간결하게 유지하세요
"""

    if system_prompt:
        base_prompt += f"\n{system_prompt}"

    return base_prompt
