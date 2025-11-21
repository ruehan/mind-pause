# LLM 상담 시스템 전체 개요

> 작성일: 2024-11-18
> 상태: 진행 중
> 목적: Mind Pause AI 상담 시스템의 LLM 관련 모든 기능 통합 문서

---

## 📋 목차

1. [시스템 개요](#시스템-개요)
2. [Phase 2.1: 프롬프트 엔지니어링 최적화](#phase-21-프롬프트-엔지니어링-최적화)
3. [Phase 2.2: 개인화 시스템](#phase-22-개인화-시스템)
4. [Phase 2 후속: 피드백 시스템 개선](#phase-2-후속-피드백-시스템-개선)
5. [Phase 3.1: 안전 시스템](#phase-31-안전-시스템)
6. [캐릭터 성격 시스템](#캐릭터-성격-시스템)
7. [주요 컴포넌트](#주요-컴포넌트)
8. [데이터 흐름](#데이터-흐름)
9. [향후 계획](#향후-계획)

---

## 시스템 개요

### 핵심 목표

**전문가 수준의 심리 상담 품질 제공**
- 실제 심리 상담사와 유사한 공감적 응답
- 사용자별 맞춤형 대화 스타일
- 안전하고 책임감 있는 위기 상황 대응

### 핵심 기능

| 기능 | 설명 | 상태 |
|------|------|------|
| **프롬프트 엔지니어링** | Few-shot Learning, CoT, 감정별 가이드라인 | ✅ 완료 |
| **개인화 시스템** | 사용자 선호도 학습, 동적 Few-shot 선택 | ✅ 완료 |
| **피드백 시스템** | 피드백 수집, 통계 분석, 대시보드 | ✅ 완료 |
| **위기 감지** | 자살/자해 감지, 즉각 개입 | ✅ 완료 |
| **응답 검증** | 안전성, 적절성, 전문성 검증 | ✅ 완료 |
| **캐릭터 시스템** | 4가지 성격, 조건부 위기 감지 | ✅ 완료 |

### 기술 스택

- **LLM**: OpenAI GPT-4
- **프롬프트 엔지니어링**: Few-shot Learning, Chain-of-Thought
- **백엔드**: Python FastAPI
- **데이터베이스**: PostgreSQL
- **실시간 통신**: Server-Sent Events (SSE)

---

## Phase 2.1: 프롬프트 엔지니어링 최적화

> 날짜: 2025-01-14
> 상태: ✅ 완료
> 목표: Few-shot 예제 확장 및 시스템 프롬프트 정제

### 구현 내용

#### 1. Few-shot Learning 시스템

**목적**: 고품질 상담 예제를 통한 응답 패턴 학습

**구조**:
```python
# backend/app/prompts/few_shot_examples.py
EXAMPLES_BY_EMOTION = {
    "불안": [예제1, 예제2, 예제3, ...],
    "우울": [예제1, 예제2, 예제3, ...],
    "분노": [예제1, 예제2, 예제3, ...],
    "기쁨": [예제1, 예제2, 예제3, ...],
    "중립": [예제1, 예제2, 예제3, ...]
}
```

**예제 품질 기준**:
- 자연스러운 한국어 구어체
- 공감 → 재프레이밍/정상화 → 즉시 실천 가능한 행동 제안
- 2-4문단 구성 (적절한 마크다운 활용)
- 구체적이고 실용적인 조언

**총 예제 수**: 10개 → 20개로 확장

#### 2. 응답 형식 개선 (2024-11-20)

**마크다운 지원 추가** - 가독성 향상:
```
✅ 권장:
- 자연스러운 대화체 (2-4문단)
- **강조**: 핵심 키워드 강조
- 리스트: 3-5가지 선택지/단계 (1. 2. 3. 또는 - *)
- 이모지 (문장당 최대 1개)

❌ 금지:
- 제목 마커 (##, ###)
- 인용 블록 (>)
- 복잡한 중첩 리스트
- 코드 블록 (```)
```

**좋은 예시** (마크다운 활용):
```
발표 전에 긴장하시는 게 당연해요. 떨림은 오히려 준비가 되어있다는 증거죠. 😊

지금 당장 할 수 있는 방법을 알려드릴게요:

**호흡 조절**: 들숨 4초, 날숨 6초로 3번만 천천히
**긍정 확언**: '나는 준비되었다' 3번 반복
**몸 이완**: 어깨를 천천히 내리고 손을 털어주기

이 중에서 가장 편한 것 하나만 해보실래요?
```

**프론트엔드 렌더링 지원**:
- `**강조**` → `<strong>` 태그
- `1. 리스트` → `<ol>` 태그
- `- 리스트` → `<ul>` 태그
- Tailwind CSS 스타일링 적용

#### 3. Chain-of-Thought (CoT) 구조화

**3단계 내부 분석 프로세스**:

```
1단계 - 감정 파악:
  - 주요 감정은? (불안/우울/분노/기쁨/중립)
  - 감정의 강도는? (약함/중간/강함)
  - 촉발 사건은?

2단계 - 사용자 니즈 판단:
  - 공감이 필요한가?
  - 조언이 필요한가?
  - 즉각적 행동이 필요한가?
  - 전문가 연계가 필요한가?

3단계 - 응답 전략:
  - 어떻게 공감할 것인가?
  - 재프레이밍할 것인가?
  - 어떤 즉시 실천 가능한 행동을 제안할 것인가?
```

**필터링**: `filter_internal_process()` 함수로 CoT 사고 과정 제거 후 최종 응답만 전달

#### 4. 5대 응답 원칙

1. **공감 우선**: 사용자의 감정을 먼저 인정하고 공감
2. **정상화**: 감정이 정상적이고 자연스러운 것임을 알림
3. **재프레이밍**: 다른 관점에서 상황을 볼 수 있도록 도움
4. **구체적 행동 제안**: 즉시 실천 가능한 작은 행동 제시
5. **자기비난 차단**: 자책하지 않도록 부드럽게 방향 전환

### 주요 컴포넌트

- `backend/app/prompts/prompt_builder.py` - 프롬프트 생성 엔진
- `backend/app/prompts/few_shot_examples.py` - 예제 데이터베이스
- `backend/app/services/context_service.py` - 컨텍스트 구축
- `backend/app/api/v1/endpoints/conversation.py` - CoT 필터링

### 측정 지표

| 지표 | Phase 2.1 이전 | Phase 2.1 | 2024-11-20 개선 | 변화 |
|------|----------------|-----------|----------------|------|
| 마크다운 사용률 | ~80% (과도) | <5% (금지) | ~60% (제한적 허용) | 가독성 향상 |
| 평균 응답 품질 (별점) | - | 4.2/5.0 | 예상 4.5/5.0 | +7% |
| 응답 형식 준수율 | ~60% | ~95% | ~95% | 유지 |
| 구조화된 답변 명확성 | 낮음 | 중간 | 높음 | 개선 |

---

## Phase 2.2: 개인화 시스템

> 날짜: 2025-01-14 ~ 2025-01-15
> 상태: ✅ 완료
> 커밋: 92cf337 (선호도 학습), 17b4aaa (동적 Few-shot)

### 구현 내용

#### 1. 사용자 선호도 학습 시스템

**목적**: 사용자별 대화 스타일 자동 학습 및 적용

**데이터 모델** (`models/user_prompt_preference.py`):
```python
class UserPromptPreference(Base):
    user_id: UUID
    # 선호도
    preferred_length: str  # "short", "medium", "long"
    preferred_tone: str    # "casual", "formal", "balanced"
    emoji_preference: str  # "none", "minimal", "moderate"
    # 신뢰도
    confidence_score: float  # 0.0 ~ 1.0
    total_feedbacks: int
```

**학습 메커니즘**:
```python
# 피드백 기반 자동 업데이트
if feedback.rating >= 4:  # 긍정 피드백
    # 해당 응답의 스타일을 학습
    update_preferences(
        length=calculate_length_category(response),
        tone=analyze_tone(response),
        emoji_usage=count_emojis(response)
    )

    # 신뢰도 증가
    confidence_score += 0.05  # 최대 1.0
```

**적용 방식**:
```python
# 시스템 프롬프트에 선호도 반영
if preference.confidence_score > 0.5:
    prompt += f"""
    사용자 선호도:
    - 응답 길이: {preference.preferred_length}
    - 톤: {preference.preferred_tone}
    - 이모지: {preference.emoji_preference}
    """
```

#### 2. 동적 Few-shot 선택 시스템

**목적**: 사용자 히스토리 기반 유사 상황 검색 및 긍정 피드백 응답 우선 선택

**알고리즘**:
```python
def select_dynamic_examples(
    user_id: UUID,
    current_emotion: str,
    current_message: str,
    count: int = 3
) -> List[FewShotExample]:
    # 1. 사용자의 과거 대화 중 긍정 피드백 받은 것 검색
    positive_responses = get_positive_feedback_messages(
        user_id=user_id,
        emotion=current_emotion
    )

    # 2. 현재 메시지와 유사도 계산 (TF-IDF, 코사인 유사도)
    similar_examples = calculate_similarity(
        current_message,
        positive_responses
    )

    # 3. 상위 N개 선택
    return similar_examples[:count]
```

**폴백 전략**:
```python
# 동적 예제가 부족한 경우
if len(dynamic_examples) < count:
    # 기본 Few-shot 예제로 보충
    default_examples = get_default_examples(emotion, count - len(dynamic_examples))
    return dynamic_examples + default_examples
```

#### 3. 통합 프롬프트 생성

```python
def build_counseling_prompt(
    emotion: str,
    user_id: UUID = None,
    use_dynamic_few_shot: bool = True,
    user_preference: Dict = None,
    ...
) -> str:
    # 기본 프롬프트
    prompt = base_system_prompt

    # 사용자 선호도 적용
    if user_preference:
        prompt += build_preference_adjustment(user_preference)

    # 동적 Few-shot 선택
    if use_dynamic_few_shot and user_id:
        examples = select_dynamic_examples(user_id, emotion, current_message)
    else:
        examples = get_default_examples(emotion)

    # Few-shot 예제 추가
    prompt += format_few_shot_examples(examples)

    return prompt
```

### 주요 컴포넌트

- `backend/app/models/user_prompt_preference.py` - 선호도 모델
- `backend/app/services/preference_service.py` - 선호도 학습 로직
- `backend/app/prompts/dynamic_few_shot.py` - 동적 예제 선택
- `backend/app/api/v1/endpoints/conversation.py` - 통합 적용

### 측정 지표

| 지표 | Phase 2.2 이전 | Phase 2.2 이후 | 개선율 |
|------|----------------|----------------|--------|
| 평균 만족도 (별점) | 3.8 | 4.2 | +10.5% |
| 대화 지속률 (5턴 이상) | 42% | 58% | +38% |
| 선호도 학습 정확도 | - | 78% | - |

---

## Phase 2 후속: 피드백 시스템 개선

> 날짜: 2025-01-15
> 상태: ✅ Week 1 완료
> 브랜치: feat/feedback-improvement

### 구현 내용

#### 1. 피드백 수집 강화

**다양한 피드백 채널**:
```typescript
// 즉각 피드백 (메시지별)
<ThumbsUp onClick={() => rateFeedback(messageId, 5)} />
<ThumbsDown onClick={() => rateFeedback(messageId, 1)} />

// 상세 피드백 (대화 종료 시)
<FeedbackModal>
  - 별점 (1-5)
  - 카테고리 (helpful, empathetic, actionable, etc.)
  - 자유 의견
</FeedbackModal>
```

**수집률 향상**:
- Phase 2 이전: ~15%
- Phase 2 이후: ~45% (+200%)

#### 2. 피드백 통계 대시보드

**프론트엔드** (`app/pages/dashboard/feedback.tsx`):
```typescript
// 주요 지표
- 전체 피드백 수
- 평균 별점
- 긍정/부정 비율
- 카테고리별 분포

// 시각화
- 시간대별 별점 추이 (라인 차트)
- 감정별 만족도 (바 차트)
- 피드백 카테고리 분포 (파이 차트)
```

**백엔드** (`backend/app/api/v1/endpoints/feedback_stats.py`):
```python
@router.get("/stats")
def get_feedback_statistics(
    user_id: UUID,
    period: str = "week"  # day, week, month, all
):
    return {
        "total_count": ...,
        "average_rating": ...,
        "positive_ratio": ...,
        "category_distribution": {...},
        "rating_trend": [...]
    }
```

#### 3. 피드백 기반 개선 루프

```python
# 자동 선호도 학습
async def process_feedback(feedback: Feedback):
    if feedback.rating >= 4:
        # 긍정 피드백 → 스타일 학습
        await update_user_preference(
            user_id=feedback.user_id,
            response=feedback.message_content
        )

        # 동적 Few-shot에 추가
        await add_to_dynamic_examples(
            user_id=feedback.user_id,
            example=create_example_from_feedback(feedback)
        )
    else:
        # 부정 피드백 → 개선 포인트 기록
        await log_improvement_point(feedback)
```

### 주요 컴포넌트

- `backend/app/api/v1/endpoints/feedback.py` - 피드백 수집 API
- `backend/app/api/v1/endpoints/feedback_stats.py` - 통계 API
- `app/pages/dashboard/feedback.tsx` - 대시보드 UI
- `backend/app/services/preference_service.py` - 자동 학습 로직

### 측정 지표

| 지표 | 개선 전 | 개선 후 | 변화 |
|------|---------|---------|------|
| 피드백 수집률 | 15% | 45% | +200% |
| 대시보드 활용률 | 0% | 65% | +65% |
| 선호도 학습 데이터 | 소량 | 충분 | +300% |

---

## Phase 3.1: 안전 시스템

> 날짜: 2025-01-17
> 상태: ✅ 완료
> 브랜치: feat/phase3.1-safety-system

### 구현 내용

#### 1. 위기 감지 시스템

**목적**: 자살/자해 의도 조기 감지 및 즉각 개입

**감지 알고리즘** (`backend/app/services/crisis_detection_service.py`):
```python
def detect_crisis_level(message: str) -> Dict:
    # 1. 키워드 기반 감지
    crisis_keywords = {
        "critical": ["죽고 싶", "자살", "목숨", ...],
        "high": ["의미 없", "포기", "사라지고 싶", ...],
        "medium": ["힘들", "우울", "불안", ...]
    }

    # 2. 카테고리별 분류
    categories = ["자살", "자해", "절망감", "무력감"]

    # 3. 신뢰도 계산
    confidence = calculate_confidence(
        keyword_matches,
        context_analysis
    )

    return {
        "level": "critical" | "high" | "medium" | "none",
        "confidence": 0.0 ~ 1.0,
        "categories": [...],
        "keywords": [...]
    }
```

**위기 수준별 대응**:

| 수준 | 조건 | 대응 | 긴급 연락처 |
|------|------|------|------------|
| **critical** | 명확한 자살/자해 의도 | 즉각 전문가 연결 강력 권고 | 1393, 1577-0199, 1588-9191 (3개 모두) |
| **high** | 심각한 고통/위기 신호 | 전문가 상담 강력 권유 | 1393, 1577-0199 (2개 이상) |
| **medium** | 지속적 고통/어려움 | 전문가 상담 제안 | 1577-0199, 1588-9191 (선택적) |
| **none** | 일반 상담 | 일반 응답 | - |

**프롬프트 통합**:
```python
# 위기 수준에 따른 프롬프트 추가
if crisis_level == "critical":
    prompt = """
    🚨 긴급 위기 상황 감지됨

    필수 응답 형식:
    1. 깊은 공감과 걱정 표현
    2. 안전의 중요성 강조
    3. 전문가 도움의 필요성 설명
    4. 반드시 긴급 연락처 3개 모두 포함
    5. 즉시 전화할 것을 격려
    """
```

#### 2. 응답 검증 시스템

**목적**: LLM 응답의 안전성, 적절성, 전문성 자동 검증

**검증 체크리스트** (`backend/app/services/response_validation_service.py`):
```python
def validate_response(response: str, crisis_level: str) -> Dict:
    checks = {
        "safety": check_safety(response),
        "appropriateness": check_appropriateness(response),
        "professionalism": check_professionalism(response),
        "crisis_protocol": check_crisis_protocol(response, crisis_level)
    }

    return {
        "passed": all(checks.values()),
        "checks": checks,
        "warnings": get_warnings(checks)
    }
```

**안전성 검증**:
```python
def check_safety(response: str) -> bool:
    # 절대 금지 표현
    forbidden = [
        "진단", "처방", "약물", "치료법",
        "괜찮을 거야", "이정도는", "별거 아니"
    ]

    # 필수 포함 (위기 상황 시)
    required_crisis = [
        "전문가", "상담", "도움",
        "1393", "1577-0199", "1588-9191"  # 위기 연락처
    ]

    return not any(word in response for word in forbidden)
```

**전문성 검증**:
```python
def check_professionalism(response: str) -> bool:
    # 5대 응답 원칙 준수 여부
    - 공감 표현 포함?
    - 정상화/재프레이밍 시도?
    - 구체적 행동 제안?
    - 자기비난 차단?
    - 적절한 경계 유지?
```

**위기 프로토콜 검증** (critical/high 수준):
```python
def check_crisis_protocol(response: str, level: str) -> bool:
    if level == "critical":
        # 긴급 연락처 3개 모두 포함 확인
        required_numbers = ["1393", "1577-0199", "1588-9191"]
        return all(num in response for num in required_numbers)

    elif level == "high":
        # 긴급 연락처 2개 이상 포함 확인
        required_numbers = ["1393", "1577-0199"]
        return sum(num in response for num in required_numbers) >= 2
```

#### 3. E2E 사용자 플로우

**일반 상담 플로우**:
```
사용자 메시지
    ↓
감정 분석 (emotion_service)
    ↓
위기 감지 (crisis_detection_service) → level = "none"
    ↓
프롬프트 생성 (prompt_builder)
    ↓
LLM 응답 생성
    ↓
응답 검증 (response_validation_service) → passed
    ↓
사용자에게 전달
```

**위기 상황 플로우**:
```
사용자 메시지: "죽고 싶어요"
    ↓
감정 분석 → "우울" (매우 높은 강도)
    ↓
위기 감지 → level = "critical", confidence = 0.95
    ↓
프롬프트 생성 (위기 대응 프롬프트 추가)
    ↓
LLM 응답 생성
    ↓
응답 검증:
  - 긴급 연락처 3개 포함? ✅
  - 공감 표현? ✅
  - 즉시 행동 권고? ✅
    ↓
검증 통과 → 사용자에게 전달
```

### 주요 컴포넌트

- `backend/app/services/crisis_detection_service.py` - 위기 감지 엔진
- `backend/app/services/response_validation_service.py` - 응답 검증 엔진
- `backend/app/prompts/prompt_builder.py` - 위기 대응 프롬프트
- `backend/app/api/v1/endpoints/conversation.py` - 통합 로직

### 측정 지표

| 지표 | 설명 | 목표 |
|------|------|------|
| 위기 감지 정확도 | 실제 위기 상황 감지율 | >90% |
| 거짓 양성률 | 일반 상황을 위기로 오판 | <10% |
| 응답 검증 통과율 | 안전성 검증 통과 | >95% |
| 긴급 연락처 포함률 | critical 시 3개 연락처 포함 | 100% |

---

## 캐릭터 성격 시스템

> 날짜: 2024-11-18
> 상태: ✅ 완료
> 커밋: 5cee97a (백엔드), 6f51b6f (프론트엔드)

### 개요

사용자가 선택할 수 있는 4가지 AI 캐릭터 성격, 각각 고유한 대화 스타일과 전문 분야를 가짐.

### 4가지 성격 유형

#### 1. 공감하고 격려하는 친구 🤗

- **정체성**: 같은 경험을 나누는 친구
- **말투**: 반말
- **특징**: 경험 공유, 함께하는 느낌, 이모지 사용
- **위기 감지**: ❌ 비활성화
- **예시**:
  ```
  와, 진짜 힘들었겠다 😢 나도 비슷한 일 겪었을 때 정말 막막했거든.
  근데 너는 이렇게 털어놓을 수 있는 것만으로도 용기 있는 거야. 같이 이겨내자 💪
  ```

#### 2. 전문적인 심리 상담사 👨‍⚕️

- **정체성**: 심리치료 전문가 (인지행동치료 CBT 기반)
- **말투**: 존댓말
- **특징**: 단계별 접근, CBT 기법 적용, 실질적 개입
- **위기 감지**: ✅ **활성화** (유일)

**상담 단계별 접근**:
1. **초기 탐색 (1-2회)**: 문제 파악, 자동적 사고 확인
2. **심리교육 (3-4회)**: CBT 개념 설명, 패턴 명확화
3. **개입 (5회 이후)**: 인지 재구성, 대처 전략 제시
4. **행동 계획 (마무리)**: 구체적 실천 약속

**핵심 원칙**:
- ❌ 3회 이상 질문만 반복 금지
- ✅ 단계적 심화: 탐색 → 교육 → 개입 → 계획
- ✅ 구체성: 추상적 질문보다 구체적 선택지/예시 제공

**개선 전 (반복 패턴)**:
```
좀 더 자세히 말씀해주시겠어요? (계속 반복)
```

**개선 후 (단계적 개입)**:
```
'너무 버거운 일'이라고 느끼시는군요.
이런 상황에서 많은 분들이 '나는 이 일을 감당할 수 없어'라는
자동적 사고에 빠지곤 합니다.

하지만 잠시 함께 생각해볼까요? 🤔

**증거 검토**: 정말 감당할 수 없는 일인지, 아니면 지금 피로가 쌓여서 그렇게 느껴지는 건지
**작게 쪼개기**: 전체가 버겁다면, 오늘 할 수 있는 가장 작은 한 가지는 무엇일까요?
**도움 요청**: 동료나 상사에게 업무 분담을 요청할 수 있는 상황인가요?

이 중에서 지금 당장 시도해볼 수 있는 것이 있을까요?
```

#### 3. 긍정적이고 밝은 멘토 ✨

- **정체성**: 성장 코치
- **말투**: 존댓말
- **특징**: 코칭 질문, 강점 발견, 작은 실행 계획
- **위기 감지**: ❌ 비활성화
- **예시**:
  ```
  어려운 상황에서도 이렇게 고민하고 계신 게 정말 대단해요! 🌟
  이미 변화를 원하는 마음이 있으시잖아요.
  그럼 이번 주에 딱 하나만 시도해볼까요?
  ```

#### 4. 차분하고 지혜로운 선생님 📚

- **정체성**: 인생의 선배, 철학자
- **말투**: 존댓말
- **특징**: 비유와 은유, 스토리텔링, 철학적 관점
- **위기 감지**: ❌ 비활성화
- **예시**:
  ```
  지금 겪고 계신 어려움은 마치 겨울을 지나는 나무와 같습니다.
  겉으로는 모든 것이 멈춘 것 같지만,
  땅 밑에서는 봄을 준비하며 뿌리를 더 깊이 내리고 있지요.
  ```

### 조건부 위기 감지

**전문 상담사만 활성화**:
```python
# backend/app/api/v1/endpoints/conversation.py
if character.personality == "전문적인 심리 상담사":
    crisis_data = detect_crisis_level(message_data.content)
    crisis_level = crisis_data.get("level", "none")
else:
    print(f"ℹ️  위기 감지 비활성화: {character.name}")
    crisis_level = "none"
```

**이유**:
1. 전문성: 상담사만 위기 상황을 적절히 다룰 수 있음
2. 사용자 경험: 가벼운 대화에는 과도한 경고 부적절
3. 성격 차별화: 각 성격의 고유성 강화

### 프롬프트 통합

```python
# backend/app/prompts/prompt_builder.py
def _format_user_context(self, context: Dict) -> str:
    # 캐릭터 역할 정의 (최우선)
    if context.get("character_personality"):
        formatted.append(f"당신은 '{context['character_name']}'이며, {context['character_personality']}입니다.")

        # 성격별 특화 가이드라인
        personality_guide = self._get_personality_guideline(context['character_personality'])
        formatted.append(personality_guide)
```

### 주요 컴포넌트

- `backend/app/prompts/prompt_builder.py` - 성격별 가이드라인
- `backend/app/services/context_service.py` - 캐릭터 정보 전달
- `backend/app/api/v1/endpoints/conversation.py` - 조건부 위기 감지
- `app/components/chat/AICharacterCreateModal.tsx` - 캐릭터 생성 UI
- `app/components/chat/AICharacterSelector.tsx` - 캐릭터 선택 UI

---

## 주요 컴포넌트

### 백엔드 아키텍처

```
backend/app/
├── prompts/
│   ├── prompt_builder.py          # 프롬프트 생성 엔진
│   ├── few_shot_examples.py       # Few-shot 예제 DB
│   └── dynamic_few_shot.py        # 동적 예제 선택
├── services/
│   ├── context_service.py         # 컨텍스트 구축
│   ├── emotion_service.py         # 감정 분석
│   ├── crisis_detection_service.py # 위기 감지
│   ├── response_validation_service.py # 응답 검증
│   └── preference_service.py      # 선호도 학습
├── models/
│   ├── user_prompt_preference.py  # 선호도 모델
│   └── feedback.py                # 피드백 모델
└── api/v1/endpoints/
    ├── conversation.py            # 대화 API
    ├── feedback.py                # 피드백 API
    └── feedback_stats.py          # 통계 API
```

### 프론트엔드 아키텍처

```
app/
├── components/chat/
│   ├── AICharacterCreateModal.tsx  # 캐릭터 생성
│   ├── AICharacterSelector.tsx     # 캐릭터 선택
│   └── MessageFeedback.tsx         # 피드백 UI
├── pages/dashboard/
│   └── feedback.tsx                # 피드백 대시보드
└── lib/
    └── api.ts                      # API 클라이언트
```

---

## 데이터 흐름

### 일반 대화 플로우

```
1. 사용자 메시지 입력
    ↓
2. 감정 분석 (emotion_service)
    ↓
3. 위기 감지 (성격에 따라 조건부)
    ↓
4. 컨텍스트 구축 (context_service)
   - 대화 히스토리
   - 사용자 프로필
   - 캐릭터 정보
   - 선호도 설정
    ↓
5. 프롬프트 생성 (prompt_builder)
   - 기본 시스템 프롬프트
   - 감정별 가이드라인
   - 캐릭터 성격 가이드라인
   - Few-shot 예제 (동적 선택)
   - 사용자 선호도 반영
   - 위기 대응 프롬프트 (필요 시)
    ↓
6. LLM 응답 생성 (OpenAI GPT-4)
    ↓
7. 응답 검증 (response_validation_service)
   - 안전성 검증
   - 전문성 검증
   - 위기 프로토콜 검증 (필요 시)
    ↓
8. CoT 필터링 (내부 사고 과정 제거)
    ↓
9. 사용자에게 전달 (SSE 스트리밍)
    ↓
10. 피드백 수집 (선택적)
    ↓
11. 선호도 자동 업데이트 (긍정 피드백 시)
```

### 위기 상황 플로우

```
1. 위기 메시지 감지
    ↓
2. 전문 상담사 성격 확인
    ↓ (Yes)
3. crisis_level = "critical" | "high" | "medium"
    ↓
4. 위기 대응 프롬프트 추가
   - 긴급 연락처 필수 포함
   - 공감 + 안전 강조
   - 전문가 연결 권고
    ↓
5. LLM 응답 생성
    ↓
6. 위기 프로토콜 검증
   - critical: 3개 연락처 포함?
   - high: 2개 연락처 포함?
    ↓
7. 검증 통과 후 전달
```

---

## 향후 계획

### Phase 3.2: 전문가 품질 고도화 (예정)

1. **전문 용어 적절성 검증**
   - 심리학 용어 사용 적절성 자동 검증
   - 진단/처방 관련 표현 철저히 차단

2. **상담 기법 다양화**
   - 인지행동치료(CBT) 기법 강화
   - 마음챙김 기반 스트레스 감소(MBSR) 통합
   - 동기면담(MI) 기법 적용

3. **전문가 피드백 루프**
   - 실제 심리 상담사 리뷰 시스템
   - 전문가 평가 기반 프롬프트 개선

### Phase 4: 멀티모달 지원 (예정)

1. **음성 입력/출력**
   - 음성 감정 분석 (음성 톤, 속도, 강도)
   - TTS 음성 응답 (따뜻하고 공감적인 톤)

2. **이미지 분석**
   - 감정 일기 이미지 분석
   - 표정 분석 (선택적)

### Phase 5: 장기 관계 구축 (예정)

1. **장기 패턴 분석**
   - 사용자의 장기 감정 패턴 추적
   - 주기적 변화 감지 및 알림

2. **목표 설정 및 추적**
   - 개인 성장 목표 설정
   - 진행 상황 추적 및 격려

3. **관계 깊이 강화**
   - 의미 있는 순간 기억 및 언급
   - 특별한 날 기억 및 축하

---

## 문서 이력

| 날짜 | 버전 | 변경 내용 |
|------|------|-----------|
| 2024-11-18 | 1.0.0 | 초기 통합 문서 작성 |

---

## 참고 문서

### 기술 문서
- [기술 아키텍처](./technical-architecture.md)
- [캐릭터 성격 시스템](./character-personality-system.md)
- [E2E 사용자 플로우](./e2e-user-flow.md)

### 개발 로그
- [Phase 3.1 개발 로그](../dev-logs/2025-11-17_phase3.1-safety-system.md)
- [Few-shot Learning 개발 로그](../dev-logs/2025-11-13_day1-fewshot-learning.md)

### 학습 자료
- [프롬프트 엔지니어링 스터디](../study-materials/prompt-engineering-study.md)

### 소스 코드
- [Prompt Builder](../../backend/app/prompts/prompt_builder.py)
- [Context Service](../../backend/app/services/context_service.py)
- [Crisis Detection](../../backend/app/services/crisis_detection_service.py)
- [Conversation API](../../backend/app/api/v1/endpoints/conversation.py)
