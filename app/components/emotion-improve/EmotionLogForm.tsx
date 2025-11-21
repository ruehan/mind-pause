import { useState } from "react";
import { Edit, Lightbulb, Sparkles } from "lucide-react";
import { EmotionSlider, emotionData } from "./EmotionSlider";
import { ImmediateFeedbackModal } from "../emotion/ImmediateFeedbackModal"; // Reuse existing modal for now, or create new one if needed
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
      <div className="glass-strong rounded-3xl shadow-xl p-8 sm:p-10 border border-white/60 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-400 via-lavender-400 to-mint-400"></div>
        
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="p-3 bg-primary-50 rounded-2xl">
            <Edit className="w-6 h-6 text-primary-600" />
          </div>
          <h2 className="text-h2 text-neutral-900 font-bold">오늘의 감정 기록하기</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Emotion Slider */}
          <EmotionSlider value={emotionValue} onChange={setEmotionValue} />

          <div className="border-t border-neutral-100"></div>

          {/* Note Input with Prominent Prompt */}
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-lavender-100 flex items-center justify-center shadow-sm">
                <span className="text-xl">💭</span>
              </div>
              <div className="flex-grow">
                <label className="block text-h4 font-bold text-neutral-800 mb-2">
                  오늘 어떤 일이 있었나요?
                </label>
                <p className="text-body text-neutral-500 mb-4">
                  오늘 하루의 경험과 감정을 자유롭게 기록해보세요.
                </p>
                
                <div className="relative">
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="예: 오늘은 회의에서 좋은 아이디어를 제안했고, 팀원들이 긍정적으로 반응해줘서 기분이 좋았어요..."
                    maxLength={maxChars}
                    rows={6}
                    className="w-full px-6 py-5 rounded-2xl bg-white/50 border-2 border-neutral-200 text-body text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-400 resize-none transition-all duration-200 shadow-inner"
                  />
                  <div className="absolute bottom-4 right-4 flex items-center gap-2">
                    <span
                      className={`text-caption font-medium px-2 py-1 rounded-md ${
                        charCount > maxChars * 0.9
                          ? "bg-warning-100 text-warning-700"
                          : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {charCount}/{maxChars}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Prompts */}
          <div className="bg-gradient-to-br from-primary-50/50 to-lavender-50/50 rounded-2xl p-6 border border-primary-100/50">
            <label className="block text-h4 font-bold text-neutral-800 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary-500 fill-primary-500" />
              <span>AI 프롬프트 선택</span>
              <span className="text-body-sm text-neutral-400 font-normal ml-2">(선택사항)</span>
            </label>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {aiPrompts.map((prompt) => (
                <div 
                  key={prompt}
                  onClick={() => handlePromptToggle(prompt)}
                  className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 flex items-center gap-3 ${
                    selectedPrompts.includes(prompt)
                      ? "bg-white border-primary-400 shadow-md scale-[1.02]"
                      : "bg-white/60 border-transparent hover:bg-white hover:border-primary-200 hover:shadow-sm"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedPrompts.includes(prompt)
                      ? "border-primary-500 bg-primary-500"
                      : "border-neutral-300"
                  }`}>
                    {selectedPrompts.includes(prompt) && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-body-sm font-medium ${
                    selectedPrompts.includes(prompt) ? "text-primary-900" : "text-neutral-600"
                  }`}>
                    {prompt}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 flex items-center gap-2 text-body-sm text-primary-700 bg-white/50 px-4 py-2 rounded-lg inline-flex">
              <Lightbulb className="w-4 h-4" />
              선택한 프롬프트를 바탕으로 AI가 맞춤형 피드백을 제공합니다
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={handleCancel}
              className="flex-1 h-14 text-base font-medium text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100"
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="flex-[2] h-14 text-lg font-bold shadow-lg hover:shadow-primary-500/30 transition-all hover:-translate-y-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span> 기록 중...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  기록하기 <span className="text-xl">→</span>
                </span>
              )}
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
