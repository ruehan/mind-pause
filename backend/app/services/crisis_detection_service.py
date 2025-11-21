"""
위기 감지 서비스

사용자 메시지에서 자살, 자해, 폭력 등의 위기 신호를 감지하고
적절한 대응을 제공합니다.
"""
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone


# 위기 키워드 데이터베이스
CRISIS_KEYWORDS = {
    "high_risk": {
        "suicide": [
            "자살", "죽고 싶", "살고 싶지 않", "죽는 게 나", "목숨을 끊",
            "삶을 끝내", "세상을 떠나", "사라지고 싶", "없어지고 싶",
            "죽어버리고 싶", "자살하고 싶", "목을 매", "투신"
        ],
        "self_harm": [
            "자해", "칼로 긋", "손목을 긋", "베고 싶", "상처를 내",
            "피를 보", "몸을 해치", "스스로 다치"
        ],
        "violence": [
            "죽이고 싶", "해치고 싶", "때리고 싶", "폭력", "살해"
        ]
    },
    "medium_risk": {
        "hopelessness": [
            "희망이 없", "의미가 없", "소용이 없", "포기하고 싶",
            "끝이 없", "나아질 것 같지 않", "절망", "암담"
        ],
        "isolation": [
            "혼자", "외로", "아무도 없", "버려진", "고립", "단절",
            "나를 이해해주는 사람이 없", "혼자인 것 같"
        ],
        "worthlessness": [
            "쓸모가 없", "가치가 없", "존재 이유", "필요 없는 사람",
            "쓰레기 같", "한심", "무능"
        ]
    }
}

# 위기 응답 템플릿
CRISIS_RESPONSE_TEMPLATES = {
    "critical": """당신의 안전이 가장 중요합니다. 지금 힘든 생각이 드신다면, 전문가의 도움을 받으시길 강력히 권해드립니다.

📞 **긴급 상담 연락처** (24시간 운영):
• 자살예방상담전화: ☎️ 1393
• 정신건강위기상담: ☎️ 1577-0199
• 생명의 전화: ☎️ 1588-9191

저는 AI이기 때문에 이런 위기 상황에서는 전문 상담사의 도움이 훨씬 효과적입니다.

혼자가 아니에요. 도움을 요청하는 것은 용기 있는 일입니다. 지금 당장 위 번호 중 하나로 전화해 주세요.""",

    "high": """많이 힘드신 것 같아 정말 걱정됩니다. 지금 느끼시는 고통을 전문가와 함께 나누시는 것이 중요해 보입니다.

📞 **전문 상담 연락처**:
• 자살예방상담전화: ☎️ 1393 (24시간)
• 정신건강위기상담: ☎️ 1577-0199
• 생명의 전화: ☎️ 1588-9191

제가 도움이 되고 싶지만, 전문 상담사가 더 깊이 있는 도움을 드릴 수 있을 거예요. 혼자 견디지 마시고, 도움을 받으세요.""",

    "medium": """많이 힘드신 것 같아요. 이런 감정들이 계속되신다면, 전문가와 함께 이야기 나누는 것을 고려해보시면 어떨까요?

필요하시면 상담 센터 정보를 안내해드릴 수 있어요.
• 정신건강복지센터: ☎️ 1577-0199
• 한국생명의전화: ☎️ 1588-9191

저도 최선을 다해 듣고 있지만, 전문가의 도움이 더 효과적일 수 있어요."""
}


def detect_crisis_level(message: str) -> Dict[str, Any]:
    """
    위기 수준 감지

    Args:
        message: 사용자 메시지

    Returns:
        {
            "level": "none" | "medium" | "high" | "critical",
            "categories": List[str],  # 감지된 위기 카테고리
            "keywords": List[str],    # 매칭된 키워드
            "confidence": float,      # 신뢰도 (0.0-1.0)
            "requires_intervention": bool,
            "detected_at": str
        }
    """
    # 메시지 정규화
    normalized_message = message.lower().strip()

    detected_categories = []
    matched_keywords = []
    max_risk_level = "none"

    # High risk 키워드 검사
    for category, keywords in CRISIS_KEYWORDS["high_risk"].items():
        for keyword in keywords:
            if keyword in normalized_message:
                detected_categories.append(f"high_risk.{category}")
                matched_keywords.append(keyword)
                max_risk_level = "high"

    # Medium risk 키워드 검사 (high risk가 없을 때만)
    if max_risk_level == "none":
        for category, keywords in CRISIS_KEYWORDS["medium_risk"].items():
            for keyword in keywords:
                if keyword in normalized_message:
                    detected_categories.append(f"medium_risk.{category}")
                    matched_keywords.append(keyword)
                    max_risk_level = "medium"

    # 신뢰도 계산
    confidence = min(len(matched_keywords) * 0.3, 1.0)  # 키워드 많을수록 신뢰도 높음

    # Critical 판정 (여러 high risk 키워드 또는 강한 표현)
    if max_risk_level == "high":
        # 자살 + 자해 동시 언급 또는 3개 이상 키워드
        if len(matched_keywords) >= 3:
            max_risk_level = "critical"
            confidence = 1.0
        # 명시적 자살 의도 표현
        elif any(kw in normalized_message for kw in ["자살하고 싶", "죽고 싶", "목숨을 끊"]):
            max_risk_level = "critical"
            confidence = 1.0

    return {
        "level": max_risk_level,
        "categories": list(set(detected_categories)),  # 중복 제거
        "keywords": list(set(matched_keywords)),
        "confidence": round(confidence, 2),
        "requires_intervention": max_risk_level in ["high", "critical"],
        "detected_at": datetime.now(timezone.utc).isoformat()
    }


def get_crisis_response(crisis_level: str, user_name: Optional[str] = None) -> str:
    """
    위기 수준에 맞는 응답 반환

    Args:
        crisis_level: 위기 수준 ("none", "medium", "high", "critical")
        user_name: 사용자 이름 (선택적, 개인화용)

    Returns:
        위기 응답 메시지
    """
    if crisis_level == "critical":
        response = CRISIS_RESPONSE_TEMPLATES["critical"]
    elif crisis_level == "high":
        response = CRISIS_RESPONSE_TEMPLATES["high"]
    elif crisis_level == "medium":
        response = CRISIS_RESPONSE_TEMPLATES["medium"]
    else:
        return ""

    # 개인화 (이름이 있으면 추가)
    if user_name:
        response = f"{user_name}님, {response}"

    return response


def should_log_crisis_detection(crisis_data: Dict[str, Any]) -> bool:
    """
    위기 감지 결과를 로깅해야 하는지 판단

    Args:
        crisis_data: detect_crisis_level() 반환값

    Returns:
        로깅 필요 여부
    """
    # High/Critical은 항상 로깅
    if crisis_data["level"] in ["high", "critical"]:
        return True

    # Medium도 신뢰도 높으면 로깅
    if crisis_data["level"] == "medium" and crisis_data["confidence"] >= 0.7:
        return True

    return False


def get_professional_referral_message(
    duration_days: Optional[int] = None,
    symptom_severity: Optional[str] = None
) -> str:
    """
    전문가 연계 메시지 생성

    Args:
        duration_days: 증상 지속 기간 (일)
        symptom_severity: 증상 심각도 ("mild", "moderate", "severe")

    Returns:
        전문가 연계 안내 메시지
    """
    base_message = """전문가와 상담하시는 것을 고려해보시면 좋겠어요.

**상담 받을 수 있는 곳**:
• 정신건강복지센터: ☎️ 1577-0199
• 한국심리상담협회: https://krcpa.or.kr
• 지역 정신건강복지센터 (보건소 연계)

상담은 약점이 아니라 자신을 돌보는 현명한 선택이에요."""

    # 기간 기반 메시지 추가
    if duration_days and duration_days >= 14:
        base_message = f"""2주 이상 이런 감정이 계속되고 계시군요. {base_message}"""

    # 심각도 기반 메시지 추가
    if symptom_severity == "severe":
        base_message = f"""일상생활이 많이 힘드실 것 같아 걱정됩니다. {base_message}

만약 지금 당장 도움이 필요하시다면:
• 자살예방상담전화: ☎️ 1393 (24시간)"""

    return base_message


# 테스트용 함수
def test_crisis_detection():
    """위기 감지 테스트"""
    test_cases = [
        ("오늘 날씨가 좋네요", "none"),
        ("요즘 조금 우울해요", "none"),
        ("희망이 없는 것 같아요", "medium"),
        ("아무도 나를 이해해주지 않아요. 너무 외로워요", "medium"),
        ("더 이상 살고 싶지 않아요", "high"),
        ("자살하고 싶어요", "critical"),
        ("죽고 싶어요. 자해도 생각 중이에요", "critical"),
    ]

    print("=" * 60)
    print("위기 감지 테스트")
    print("=" * 60)

    for message, expected_level in test_cases:
        result = detect_crisis_level(message)
        status = "✅" if result["level"] == expected_level else "❌"
        print(f"\n{status} 메시지: \"{message}\"")
        print(f"   예상: {expected_level}, 결과: {result['level']}")
        print(f"   신뢰도: {result['confidence']}")
        print(f"   키워드: {result['keywords']}")

        if result["requires_intervention"]:
            print(f"\n   🚨 위기 응답:\n{get_crisis_response(result['level'])[:100]}...")

    print("\n" + "=" * 60)
    print("테스트 완료")
    print("=" * 60)


if __name__ == "__main__":
    test_crisis_detection()
