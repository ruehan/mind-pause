"""
프롬프트 빌더 시스템

Few-shot Learning, Chain-of-Thought, 감정별 특화 프롬프트를 통합하여
최적화된 시스템 프롬프트를 생성하는 핵심 모듈
"""

from typing import List, Dict, Optional
from .few_shot_examples import (
    get_examples_by_emotion,
    get_random_examples,
    format_examples_for_prompt,
    FewShotExample
)


class PromptBuilder:
    """
    고급 프롬프트 엔지니어링 기법을 활용한 프롬프트 빌더

    주요 기능:
    - Few-shot Learning: 고품질 예시를 통한 응답 패턴 학습
    - Emotion-specific prompts: 감정별 특화 가이드라인
    - Chain-of-Thought: 단계적 추론 프로세스
    - Context integration: 대화 히스토리 및 사용자 프로필 활용
    """

    def __init__(self):
        self.base_system_prompt = self._load_base_prompt()
        self.emotion_guidelines = self._load_emotion_guidelines()

    def _load_base_prompt(self) -> str:
        """기본 시스템 프롬프트 로드"""
        return """당신은 전문적이고 공감적인 심리 상담 AI입니다.

**핵심 역할**:
- 사용자의 감정을 깊이 이해하고 공감하기
- 안전하고 지지적인 대화 환경 제공
- 실질적이고 즉시 실행 가능한 조언 제공
- 전문적 도움이 필요한 경우 적절히 안내

**응답 원칙**:
1. **공감 우선**: 먼저 사용자의 감정을 인정하고 공감 표현
2. **정상화**: 해당 감정이 자연스럽고 정상적임을 알려줌
3. **재프레이밍**: 필요시 다른 관점에서 상황 재해석
4. **구체적 행동**: 추상적 조언보다 즉시 실행 가능한 작은 단계 제시
5. **자기비난 차단**: 사용자가 스스로를 탓하지 않도록 보호

**금지 사항**:
- 진단이나 처방하기 (전문의료행위)
- 무조건적인 긍정이나 부정 ("괜찮아질 거야" 같은 섣부른 위로)
- 복잡하거나 장기적인 계획 제시
- 사용자 감정 부정하기"""

    def _load_emotion_guidelines(self) -> Dict[str, str]:
        """감정별 특화 가이드라인 로드"""
        return {
            "불안": """
**불안 감정 대응 가이드**:
- 불안의 정당성 인정 (예: "걱정되시는 게 당연해요")
- 신체 감각 중심으로 접근 (호흡, 긴장 이완)
- 즉각 실행 가능한 기법 제시 (4-7-8 호흡법, 5-4-3-2-1 기법)
- 통제 가능한 것에 집중하도록 유도
- 재난화 사고 완화 (최악의 시나리오 vs 현실적 가능성)""",

            "우울": """
**우울 감정 대응 가이드**:
- 무기력 인정, 자기비난 차단 ("아무것도 하고 싶지 않은 게 당연해요")
- 아주 작은 행동 하나만 제안 (창문 열기, 5분 산책)
- 완벽주의 내려놓기 ("그것만으로도 충분해요")
- 전문가 도움 권유 시점 판단 (지속 기간, 일상 기능 저하)
- 긍정 강요 금지, 현재의 고통 인정""",

            "분노": """
**분노 감정 대응 가이드**:
- 화의 정당성 인정 ("화나시는 게 너무 당연합니다")
- 감정 표현 유도 (말로 풀어내기)
- 즉각적 행동 억제 (진정 시간 필요성 설명)
- 건설적 표현 방법 제안 (I-message, 비폭력 대화)
- 분노 뒤의 진짜 감정 탐색 (상처, 두려움, 실망)""",

            "기쁨": """
**기쁨 감정 대응 가이드**:
- 함께 기뻐하고 축하하기
- 성취나 긍정 경험 강화 및 내재화
- 긍정 감정 음미하도록 격려
- 성공 경험의 패턴 파악 유도
- 미래 활용 가능성 탐색""",

            "중립": """
**중립/일반 대응 가이드**:
- 정보 제공 시 명확하고 구조적으로
- 질문에는 구체적이고 실용적으로 답변
- 감정 관리 기법 설명 시 근거와 함께
- 선택권 제공 (여러 옵션 중 선택)
- 개인화된 접근 유도"""
        }

    def build_system_prompt(
        self,
        emotion: Optional[str] = None,
        use_few_shot: bool = True,
        few_shot_count: int = 3,
        use_cot: bool = False,
        conversation_history: Optional[List[Dict]] = None,
        user_context: Optional[Dict] = None
    ) -> str:
        """
        통합 시스템 프롬프트 생성

        Args:
            emotion: 감지된 감정 (불안, 우울, 분노, 기쁨, 중립)
            use_few_shot: Few-shot 예시 사용 여부
            few_shot_count: 사용할 예시 개수 (1-5 권장)
            use_cot: Chain-of-Thought 추론 활성화 여부
            conversation_history: 이전 대화 내용
            user_context: 사용자 프로필 정보

        Returns:
            최적화된 시스템 프롬프트
        """
        prompt_parts = [self.base_system_prompt]

        # 1. 감정별 특화 가이드라인 추가
        if emotion and emotion in self.emotion_guidelines:
            prompt_parts.append("\n---\n")
            prompt_parts.append(self.emotion_guidelines[emotion])

        # 2. Few-shot 예시 추가
        if use_few_shot:
            examples = self._get_relevant_examples(emotion, few_shot_count)
            if examples:
                prompt_parts.append("\n---\n")
                prompt_parts.append("**참고할 상담 예시**:")
                prompt_parts.append("\n")
                prompt_parts.append(format_examples_for_prompt(examples))
                prompt_parts.append("\n위 예시의 패턴과 톤을 참고하여 응답하세요.")

        # 3. Chain-of-Thought 추론 프롬프트 추가
        if use_cot:
            prompt_parts.append("\n---\n")
            prompt_parts.append(self._get_cot_prompt())

        # 4. 대화 컨텍스트 추가
        if conversation_history:
            prompt_parts.append("\n---\n")
            prompt_parts.append(self._format_conversation_history(conversation_history))

        # 5. 사용자 컨텍스트 추가
        if user_context:
            prompt_parts.append("\n---\n")
            prompt_parts.append(self._format_user_context(user_context))

        return "\n".join(prompt_parts)

    def _get_relevant_examples(self, emotion: Optional[str], count: int) -> List[FewShotExample]:
        """감정에 맞는 관련 예시 가져오기"""
        if emotion:
            # 해당 감정의 예시 우선 사용
            emotion_examples = get_examples_by_emotion(emotion)
            if len(emotion_examples) >= count:
                return emotion_examples[:count]
            else:
                # 부족하면 랜덤 예시로 채우기
                additional_count = count - len(emotion_examples)
                additional_examples = get_random_examples(additional_count)
                return emotion_examples + additional_examples
        else:
            # 감정 없으면 다양한 예시 랜덤 선택
            return get_random_examples(count)

    def _get_cot_prompt(self) -> str:
        """Chain-of-Thought 추론 프롬프트"""
        return """**응답 생성 프로세스** (내부 사고 과정):

1. **감정 이해**: 사용자가 느끼는 핵심 감정이 무엇인가?
2. **맥락 파악**: 이 감정이 발생한 상황과 배경은?
3. **욕구 식별**: 사용자가 진짜 원하는 것은 무엇인가? (공감, 조언, 해결책)
4. **공감 표현**: 어떻게 사용자의 감정을 인정하고 공감할 것인가?
5. **행동 제안**: 지금 당장 실행 가능한 작은 행동은?
6. **안전 확인**: 위기 상황이거나 전문가 도움이 필요한가?

위 단계를 거쳐 응답을 생성하되, 사용자에게는 최종 응답만 제공하세요."""

    def _format_conversation_history(self, history: List[Dict]) -> str:
        """대화 히스토리 포맷팅"""
        if not history:
            return ""

        formatted = ["**이전 대화 내용** (참고용):"]

        # 최근 5개 대화만 포함 (너무 길어지면 토큰 낭비)
        recent_history = history[-5:] if len(history) > 5 else history

        for i, msg in enumerate(recent_history, 1):
            role = "사용자" if msg.get("role") == "user" else "AI"
            content = msg.get("content", "")[:200]  # 각 메시지 200자로 제한
            formatted.append(f"{i}. **{role}**: {content}")

        formatted.append("\n위 대화 맥락을 고려하여 일관성 있게 응답하세요.")
        return "\n".join(formatted)

    def _format_user_context(self, context: Dict) -> str:
        """사용자 프로필 컨텍스트 포맷팅"""
        if not context:
            return ""

        formatted = ["**사용자 정보** (참고용):"]

        # 주요 정보만 포함
        if context.get("nickname"):
            formatted.append(f"- 닉네임: {context['nickname']}")

        if context.get("frequent_emotions"):
            emotions = ", ".join(context["frequent_emotions"][:3])
            formatted.append(f"- 자주 느끼는 감정: {emotions}")

        if context.get("conversation_count"):
            formatted.append(f"- 대화 횟수: {context['conversation_count']}회")

        if context.get("preferred_style"):
            formatted.append(f"- 선호 응답 스타일: {context['preferred_style']}")

        formatted.append("\n위 정보를 참고하되, 사용자를 진심으로 대하세요.")
        return "\n".join(formatted)


# 전역 인스턴스
_prompt_builder = None


def get_prompt_builder() -> PromptBuilder:
    """싱글톤 패턴으로 프롬프트 빌더 인스턴스 반환"""
    global _prompt_builder
    if _prompt_builder is None:
        _prompt_builder = PromptBuilder()
    return _prompt_builder


# 편의 함수
def build_counseling_prompt(
    emotion: Optional[str] = None,
    use_few_shot: bool = True,
    few_shot_count: int = 3,
    use_cot: bool = False,
    conversation_history: Optional[List[Dict]] = None,
    user_context: Optional[Dict] = None
) -> str:
    """
    상담용 프롬프트 빌드 (간편 인터페이스)

    사용 예시:
        prompt = build_counseling_prompt(
            emotion="불안",
            use_few_shot=True,
            few_shot_count=3,
            use_cot=True
        )
    """
    builder = get_prompt_builder()
    return builder.build_system_prompt(
        emotion=emotion,
        use_few_shot=use_few_shot,
        few_shot_count=few_shot_count,
        use_cot=use_cot,
        conversation_history=conversation_history,
        user_context=user_context
    )


# ============================================
# 테스트 코드
# ============================================

if __name__ == "__main__":
    # 기본 프롬프트 테스트
    print("=" * 50)
    print("기본 프롬프트 테스트")
    print("=" * 50)
    basic_prompt = build_counseling_prompt()
    print(basic_prompt[:500] + "...\n")

    # 불안 감정 + Few-shot 테스트
    print("=" * 50)
    print("불안 감정 + Few-shot 프롬프트")
    print("=" * 50)
    anxiety_prompt = build_counseling_prompt(
        emotion="불안",
        use_few_shot=True,
        few_shot_count=2
    )
    print(anxiety_prompt[:500] + "...\n")

    # Chain-of-Thought 포함 테스트
    print("=" * 50)
    print("CoT 포함 프롬프트")
    print("=" * 50)
    cot_prompt = build_counseling_prompt(
        emotion="우울",
        use_few_shot=True,
        few_shot_count=2,
        use_cot=True
    )
    print(cot_prompt[:500] + "...\n")

    # 대화 히스토리 포함 테스트
    print("=" * 50)
    print("대화 히스토리 포함 프롬프트")
    print("=" * 50)
    history = [
        {"role": "user", "content": "요즘 너무 불안해요"},
        {"role": "assistant", "content": "불안하신 마음이 느껴져요. 어떤 상황에서 특히 불안하신가요?"}
    ]
    history_prompt = build_counseling_prompt(
        emotion="불안",
        use_few_shot=True,
        few_shot_count=2,
        conversation_history=history
    )
    print(history_prompt[:500] + "...\n")

    print("✅ 모든 테스트 완료!")
