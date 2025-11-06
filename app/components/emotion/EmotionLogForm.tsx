import { useState } from "react";
import { Edit, Lightbulb } from "lucide-react";
import { EmotionSlider, emotionData } from "./EmotionSlider";
import { ImmediateFeedbackModal } from "./ImmediateFeedbackModal";
import { Button } from "../Button";
import { Checkbox } from "../Checkbox";
import { useToast } from "../ToastProvider";
import * as api from "../../lib/api";

const aiPrompts = [
  "오늘 하루 어떤 일이 있었나요?",
  "지금 가장 힘든 감정은 무엇인가요?",
  "오늘 감사한 일이 있다면?",
  "내일은 어떤 하루를 보내고 싶나요?",
];

// Generate positive AI feedback based on emotion value
const generateAIFeedback = (emotionValue: number): string => {
  if (emotionValue >= 3) {
    return "정말 좋은 하루를 보내셨네요! 이런 긍정적인 감정을 잘 간직하시길 바랍니다. 행복한 순간들을 기억하는 것은 앞으로의 힘이 됩니다.";
  } else if (emotionValue >= 1) {
    return "오늘 하루를 잘 보내셨어요. 작은 긍정도 소중합니다. 이런 감정들이 쌓여 더 나은 내일을 만들어갑니다.";
  } else if (emotionValue >= -1) {
    return "평온한 하루를 보내셨군요. 때로는 이런 고요함도 필요합니다. 자신의 감정을 인식하는 것만으로도 훌륭해요.";
  } else if (emotionValue >= -3) {
    return "힘든 하루를 보내셨네요. 이런 감정을 기록하고 표현하는 것 자체가 용기입니다. 내일은 더 나은 하루가 되길 바랍니다.";
  } else {
    return "정말 힘든 시간을 보내고 계시네요. 이렇게 감정을 표현해주셔서 고마워요. 혼자가 아니라는 것을 기억해주세요. 필요하다면 전문가의 도움을 받는 것도 좋습니다.";
  }
};

interface EmotionLogFormProps {
  onSuccess?: () => void;
}

export function EmotionLogForm({ onSuccess }: EmotionLogFormProps = {}) {
  const toast = useToast();
  const [emotionValue, setEmotionValue] = useState(0);
  const [note, setNote] = useState("");
  const [selectedPrompts, setSelectedPrompts] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [aiFeedback, setAiFeedback] = useState("");
  const [submittedValue, setSubmittedValue] = useState(0);

  const handlePromptToggle = (prompt: string) => {
    setSelectedPrompts((prev) =>
      prev.includes(prompt)
        ? prev.filter((p) => p !== prompt)
        : [...prev, prompt]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      // 감정 데이터 가져오기
      const emotion = emotionData[emotionValue.toString() as keyof typeof emotionData];

      // Generate AI feedback based on emotion value
      const feedback = generateAIFeedback(emotionValue);

      // API 호출: 감정 기록 저장 (AI 피드백 포함)
      await api.createEmotionLog({
        emotion_value: emotionValue,
        emotion_label: emotion.label,
        emotion_emoji: emotion.emoji,
        note: note.trim() || undefined,
        ai_feedback: feedback,
      });

      setAiFeedback(feedback);
      setSubmittedValue(emotionValue);

      // Show immediate feedback modal
      setShowFeedback(true);

      // 성공 시 폼 초기화
      setEmotionValue(0);
      setNote("");
      setSelectedPrompts([]);

      toast.success("성공", "감정 기록이 저장되었습니다");

      // 부모 컴포넌트에 데이터 새로고침 요청
      onSuccess?.();
    } catch (error) {
      // 에러 처리
      console.error("Failed to save emotion:", error);
      toast.error("오류", "감정 기록 저장 중 오류가 발생했습니다");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setEmotionValue(0);
    setNote("");
    setSelectedPrompts([]);
  };

  const charCount = note.length;
  const maxChars = 500;

  return (
    <>
      <div className="glass-strong rounded-3xl shadow-elevation-2 hover:shadow-elevation-3 transition-all duration-300 p-8 sm:p-10 border border-white/40">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Edit className="w-7 h-7 text-primary-600 animate-float" />
          <h2 className="text-h2 text-gradient-primary font-bold">오늘의 감정 기록하기</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
        {/* Emotion Slider */}
        <EmotionSlider value={emotionValue} onChange={setEmotionValue} />

        <div className="border-t border-neutral-200"></div>

        {/* Note Input with Prominent Prompt */}
        <div>
          <div className="bg-gradient-to-r from-primary-50 via-lavender-50 to-mint-50 rounded-2xl p-6 mb-5 border-l-4 border-primary-500 shadow-sm">
            <label className="block text-h4 font-semibold text-primary-700 mb-2">
              💭 오늘 어떤 일이 있었나요?
            </label>
            <p className="text-body text-neutral-600">
              오늘 하루의 경험과 감정을 자유롭게 기록해보세요.
            </p>
          </div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="예: 오늘은 회의에서 좋은 아이디어를 제안했고, 팀원들이 긍정적으로 반응해줘서 기분이 좋았어요..."
            maxLength={maxChars}
            rows={5}
            className="w-full px-5 py-4 rounded-xl border-2 border-neutral-300 text-body text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none transition-all duration-200 shadow-sm hover:border-neutral-400"
          />
          <div className="flex justify-between items-center mt-3">
            <span className="text-body-sm text-neutral-500">
              {charCount === 0 ? "마음 편히 작성해주세요" : `${charCount}자 작성 중`}
            </span>
            <span
              className={`text-body-sm font-medium ${
                charCount > maxChars * 0.9
                  ? "text-warning"
                  : "text-neutral-500"
              }`}
            >
              {charCount}/{maxChars}
            </span>
          </div>
        </div>

        <div className="border-t border-neutral-200"></div>

        {/* AI Prompts */}
        <div>
          <label className="block text-h4 font-semibold text-neutral-700 mb-5">
            <span className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary-600" />
              AI 프롬프트 선택
              <span className="text-body-sm text-neutral-500 font-normal">(선택사항)</span>
            </span>
          </label>
          <div className="space-y-3 bg-neutral-50 rounded-xl p-5">
            {aiPrompts.map((prompt) => (
              <Checkbox
                key={prompt}
                label={prompt}
                checked={selectedPrompts.includes(prompt)}
                onChange={() => handlePromptToggle(prompt)}
              />
            ))}
          </div>
          <div className="flex items-start gap-2 mt-4 p-4 bg-primary-50/50 rounded-lg border border-primary-100">
            <Lightbulb className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
            <p className="text-body-sm text-primary-700">
              선택한 프롬프트를 바탕으로 AI가 맞춤형 피드백을 제공합니다
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6">
          <Button
            type="button"
            variant="ghost"
            size="lg"
            onClick={handleCancel}
            className="flex-1 h-14 text-base"
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="flex-1 h-14 text-base shadow-lg hover:shadow-xl"
            disabled={isSubmitting}
          >
            {isSubmitting ? "기록 중..." : "기록하기 →"}
          </Button>
        </div>
      </form>
    </div>

      {/* Immediate Feedback Modal */}
      <ImmediateFeedbackModal
        isOpen={showFeedback}
        onClose={() => setShowFeedback(false)}
        emotionValue={submittedValue}
        feedback={aiFeedback}
      />
    </>
  );
}
