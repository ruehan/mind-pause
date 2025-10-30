import { useState } from "react";
import { Edit, Lightbulb } from "lucide-react";
import { EmotionSlider } from "./EmotionSlider";
import { Button } from "../Button";
import { Checkbox } from "../Checkbox";

const aiPrompts = [
  "오늘 하루 어떤 일이 있었나요?",
  "지금 가장 힘든 감정은 무엇인가요?",
  "오늘 감사한 일이 있다면?",
  "내일은 어떤 하루를 보내고 싶나요?",
];

export function EmotionLogForm() {
  const [emotionValue, setEmotionValue] = useState(0);
  const [note, setNote] = useState("");
  const [selectedPrompts, setSelectedPrompts] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    // API 호출: 감정 기록 저장
    // POST /api/emotions
    // Body: { emotionValue, note, selectedPrompts }
    try {
      // TODO: 실제 API 엔드포인트 연결 필요
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 성공 시 폼 초기화 또는 페이지 이동
      setEmotionValue(0);
      setNote("");
      setSelectedPrompts([]);
    } catch (error) {
      // 에러 처리
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
    <div className="glass-strong rounded-2xl shadow-soft hover:shadow-elevation-3 transition-all duration-300 p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-6">
        <Edit className="w-6 h-6 text-primary-600 animate-float" />
        <h2 className="text-h3 text-gradient-primary font-bold">오늘의 감정 기록하기</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Emotion Slider */}
        <EmotionSlider value={emotionValue} onChange={setEmotionValue} />

        <div className="border-t border-neutral-200"></div>

        {/* Note Input */}
        <div>
          <label className="block text-body font-medium text-neutral-700 mb-3">
            오늘 하루를 간단히 기록해주세요{" "}
            <span className="text-neutral-500 font-normal">(선택)</span>
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="오늘은 어떤 하루였나요? 자유롭게 기록해보세요..."
            maxLength={maxChars}
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-neutral-300 text-body text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none transition-all duration-200"
          />
          <div className="flex justify-end mt-2">
            <span
              className={`text-caption ${
                charCount > maxChars * 0.9
                  ? "text-warning"
                  : "text-neutral-500"
              }`}
            >
              {charCount}/{maxChars}자
            </span>
          </div>
        </div>

        <div className="border-t border-neutral-200"></div>

        {/* AI Prompts */}
        <div>
          <label className="block text-body font-medium text-neutral-700 mb-4">
            AI 프롬프트 선택{" "}
            <span className="text-neutral-500 font-normal">(선택)</span>
          </label>
          <div className="space-y-3">
            {aiPrompts.map((prompt) => (
              <Checkbox
                key={prompt}
                label={prompt}
                checked={selectedPrompts.includes(prompt)}
                onChange={() => handlePromptToggle(prompt)}
              />
            ))}
          </div>
          <div className="flex items-center gap-2 mt-3">
            <Lightbulb className="w-4 h-4 text-neutral-500" />
            <p className="text-body-sm text-neutral-500">
              선택한 프롬프트로 AI가 맞춤형 피드백을 제공합니다
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="ghost"
            size="lg"
            onClick={handleCancel}
            className="flex-1"
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? "기록 중..." : "기록하기 →"}
          </Button>
        </div>
      </form>
    </div>
  );
}
