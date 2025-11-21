import { useState, useEffect } from "react";
import { Bot, Volume2, FileText, Heart, Sparkles } from "lucide-react";
import { Button } from "../Button";
import { useToast } from "../ToastProvider";
import { getUserAIPreferences, saveUserAIPreferences, type UserAIPreferenceUpdate } from "~/lib/api";

interface AIPreference {
  tone: string;
  length: string;
  empathy_level: string;
}

const toneOptions = [
  { value: "friendly", label: "친근하게", description: "편안하고 따뜻한 말투", icon: "😊" },
  { value: "professional", label: "공식적으로", description: "격식있고 예의바른 말투", icon: "🎩" },
  { value: "casual", label: "편하게", description: "가벼운 친구같은 말투", icon: "👋" },
];

const lengthOptions = [
  { value: "concise", label: "간결하게", description: "핵심만 간단히", icon: "⚡" },
  { value: "balanced", label: "적절하게", description: "필요한 만큼 설명", icon: "⚖️" },
  { value: "detailed", label: "상세하게", description: "충분한 설명과 예시", icon: "📚" },
];

const empathyOptions = [
  { value: "high", label: "높음", description: "깊은 공감과 위로", icon: "💝" },
  { value: "medium", label: "보통", description: "적절한 공감과 조언", icon: "🤝" },
  { value: "low", label: "낮음", description: "객관적 분석 중심", icon: "🔍" },
];

export function AIPreferenceSection() {
  const toast = useToast();
  const [preferences, setPreferences] = useState<AIPreference>({
    tone: "friendly",
    length: "balanced",
    empathy_level: "medium",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      setIsLoading(true);
      const data = await getUserAIPreferences();
      setPreferences({
        tone: data.tone,
        length: data.length,
        empathy_level: data.empathy_level,
      });
    } catch (error) {
      console.error("Failed to load preferences:", error);
      toast.error("설정 불러오기 실패", "AI 응답 설정을 불러오는데 실패했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferenceChange = (key: keyof AIPreference, value: string) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await saveUserAIPreferences(preferences);
      toast.success("설정이 저장되었습니다", "AI가 이제 당신의 선호에 맞춰 응답합니다");
      setHasChanges(false);
    } catch (error) {
      console.error("Failed to save preferences:", error);
      toast.error("저장 실패", "설정 저장 중 오류가 발생했습니다");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setPreferences({
      tone: "friendly",
      length: "balanced",
      empathy_level: "medium",
    });
    setHasChanges(true);
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-neutral-200 rounded w-1/3"></div>
        <div className="h-64 bg-neutral-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-h3 text-neutral-900 mb-2 flex items-center gap-2">
          <Bot className="w-6 h-6 text-primary-600" />
          AI 응답 스타일 설정
        </h2>
        <p className="text-body text-neutral-600">
          AI가 당신에게 맞는 방식으로 응답하도록 설정하세요
        </p>
      </div>

      {/* Tone Setting */}
      <div className="glass rounded-xl p-6 shadow-soft">
        <div className="flex items-center gap-2 mb-4">
          <Volume2 className="w-5 h-5 text-primary-600" />
          <h3 className="text-h4 text-neutral-900">말투</h3>
        </div>
        <p className="text-sm text-neutral-600 mb-4">AI가 어떤 말투로 대화할지 선택하세요</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {toneOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handlePreferenceChange("tone", option.value)}
              className={`
                p-4 rounded-lg border-2 text-left transition-all duration-200
                ${preferences.tone === option.value
                  ? "border-primary-500 bg-primary-50 shadow-md"
                  : "border-neutral-200 bg-white hover:border-primary-300 hover:bg-primary-25"
                }
              `}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{option.icon}</span>
                <span className={`font-medium ${
                  preferences.tone === option.value ? "text-primary-700" : "text-neutral-900"
                }`}>
                  {option.label}
                </span>
              </div>
              <p className="text-sm text-neutral-600">{option.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Length Setting */}
      <div className="glass rounded-xl p-6 shadow-soft">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-primary-600" />
          <h3 className="text-h4 text-neutral-900">응답 길이</h3>
        </div>
        <p className="text-sm text-neutral-600 mb-4">AI 응답이 얼마나 자세한지 선택하세요</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {lengthOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handlePreferenceChange("length", option.value)}
              className={`
                p-4 rounded-lg border-2 text-left transition-all duration-200
                ${preferences.length === option.value
                  ? "border-primary-500 bg-primary-50 shadow-md"
                  : "border-neutral-200 bg-white hover:border-primary-300 hover:bg-primary-25"
                }
              `}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{option.icon}</span>
                <span className={`font-medium ${
                  preferences.length === option.value ? "text-primary-700" : "text-neutral-900"
                }`}>
                  {option.label}
                </span>
              </div>
              <p className="text-sm text-neutral-600">{option.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Empathy Setting */}
      <div className="glass rounded-xl p-6 shadow-soft">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-primary-600" />
          <h3 className="text-h4 text-neutral-900">공감 수준</h3>
        </div>
        <p className="text-sm text-neutral-600 mb-4">AI가 얼마나 공감적으로 응답할지 선택하세요</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {empathyOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handlePreferenceChange("empathy_level", option.value)}
              className={`
                p-4 rounded-lg border-2 text-left transition-all duration-200
                ${preferences.empathy_level === option.value
                  ? "border-primary-500 bg-primary-50 shadow-md"
                  : "border-neutral-200 bg-white hover:border-primary-300 hover:bg-primary-25"
                }
              `}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{option.icon}</span>
                <span className={`font-medium ${
                  preferences.empathy_level === option.value ? "text-primary-700" : "text-neutral-900"
                }`}>
                  {option.label}
                </span>
              </div>
              <p className="text-sm text-neutral-600">{option.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="glass rounded-xl p-6 shadow-soft bg-gradient-to-br from-lavender-50 to-mint-50">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary-600" />
          <h3 className="text-h4 text-neutral-900">미리보기</h3>
        </div>
        <p className="text-sm text-neutral-600 mb-4">선택한 설정으로 AI가 응답하는 예시입니다</p>

        <div className="bg-white rounded-lg p-4 border border-primary-200">
          <p className="text-body text-neutral-800 leading-relaxed">
            {getPreviewText(preferences)}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <Button
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className="flex-1"
        >
          {isSaving ? "저장 중..." : "변경사항 저장"}
        </Button>
        <Button
          onClick={handleReset}
          variant="secondary"
          disabled={isSaving}
          className="flex-1"
        >
          기본값으로 재설정
        </Button>
      </div>

      {hasChanges && (
        <p className="text-sm text-amber-600 text-center">
          💡 변경사항이 있습니다. 저장 버튼을 눌러 적용하세요
        </p>
      )}
    </div>
  );
}

function getPreviewText(preferences: AIPreference): string {
  const examples = {
    // tone
    friendly_concise_high: "오늘 힘드셨나봐요. 괜찮아요, 저와 함께 천천히 이야기 나눠봐요. 😊",
    friendly_balanced_high: "오늘 하루가 많이 힘드셨군요. 저와 함께 차근차근 이야기 나누면서 마음을 정리해보는 건 어떨까요? 당신의 감정은 충분히 이해되고 소중해요.",
    friendly_detailed_high: "오늘 하루가 정말 힘드셨나봐요. 그런 마음이 드는 건 너무나 자연스럽고 당연한 일이에요. 제가 여기 있으니 편하게 마음을 털어놓으세요. 함께 천천히 이야기 나누면서 하나씩 정리해보면, 분명 마음이 한결 가벼워질 거예요. 💙",

    professional_concise_medium: "오늘 어려움을 겪으신 것 같습니다. 무엇이 도움이 될까요?",
    professional_balanced_medium: "오늘 여러 어려움을 겪으신 것으로 보입니다. 구체적으로 어떤 부분이 힘드셨는지 말씀해주시면, 함께 해결방안을 찾아보겠습니다.",
    professional_detailed_medium: "오늘 하루 동안 여러 어려움을 겪으신 것으로 이해됩니다. 현재 상황을 명확히 파악하기 위해 구체적인 상황을 말씀해주시면 감사하겠습니다. 그에 따라 적절한 대응방안을 함께 모색해보도록 하겠습니다.",

    casual_concise_low: "힘든 날이었네요. 뭐가 문제였어요?",
    casual_balanced_low: "오늘 좀 힘들었나봐요. 구체적으로 어떤 일이 있었는지 얘기해보면 해결책이 보일 수도 있어요.",
    casual_detailed_low: "오늘 힘든 일이 있었나봐요. 어떤 상황이었는지 차근차근 얘기해보면, 제가 객관적으로 분석해드릴게요. 상황을 명확히 이해하면 어떻게 대처하면 좋을지 같이 생각해볼 수 있을 거예요.",
  };

  const key = `${preferences.tone}_${preferences.length}_${preferences.empathy_level}`;
  return examples[key as keyof typeof examples] ||
    "설정에 맞는 응답 예시를 준비중입니다. 조합을 조정해보세요!";
}
