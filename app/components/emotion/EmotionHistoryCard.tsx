import { Calendar, Bot } from "lucide-react";

interface EmotionHistoryCardProps {
  date: string;
  day: string;
  emotionValue: number;
  emotionLabel: string;
  emotionEmoji: string;
  note: string;
  aiFeedback?: string;
  onEdit?: () => void;
}

export function EmotionHistoryCard({
  date,
  day,
  emotionValue,
  emotionLabel,
  emotionEmoji,
  note,
  aiFeedback,
  onEdit,
}: EmotionHistoryCardProps) {
  return (
    <div className="glass-strong rounded-2xl shadow-elevation-1 hover:shadow-elevation-3 transition-all duration-300 transform hover:-translate-y-1 p-8 border border-white/40">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-primary-600" />
          <span className="text-body-lg font-semibold text-neutral-800">
            {date} ({day})
          </span>
        </div>
        {onEdit && (
          <button
            onClick={onEdit}
            className="px-4 py-2 text-body-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg font-medium transition-all"
          >
            수정
          </button>
        )}
      </div>

      {/* Emotion */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-6xl">{emotionEmoji}</span>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-h2 font-bold text-neutral-900">
              {emotionValue > 0 ? "+" : ""}
              {emotionValue}
            </span>
            <span className="text-body text-neutral-600">
              {emotionLabel}
            </span>
          </div>
          <div className="mt-1">
            <span className="inline-block px-3 py-1 bg-neutral-100 text-neutral-600 text-body-sm rounded-full">
              {emotionValue >= 3 ? "매우 긍정적" : emotionValue >= 1 ? "긍정적" : emotionValue >= -1 ? "보통" : emotionValue >= -3 ? "부정적" : "매우 부정적"}
            </span>
          </div>
        </div>
      </div>

      {/* User Note */}
      {note && (
        <div className="mb-6 p-5 bg-neutral-50 rounded-xl border border-neutral-200">
          <p className="text-body text-neutral-700 leading-relaxed italic">
            "{note}"
          </p>
        </div>
      )}

      {/* AI Feedback */}
      {aiFeedback && (
        <div className="bg-gradient-to-r from-primary-50 to-lavender-50 rounded-xl p-5 border-l-4 border-primary-500 shadow-sm">
          <div className="flex items-start gap-3">
            <Bot className="w-6 h-6 text-primary-600 flex-shrink-0 mt-0.5 animate-float" />
            <div className="flex-1">
              <p className="text-body font-semibold text-primary-700 mb-2">
                AI 피드백
              </p>
              <p className="text-body text-neutral-700 leading-relaxed">
                {aiFeedback}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
