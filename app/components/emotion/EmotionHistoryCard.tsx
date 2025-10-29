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
    <div className="bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-md transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-neutral-500" />
          <span className="text-body font-medium text-neutral-700">
            {date} ({day})
          </span>
        </div>
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-body-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            수정
          </button>
        )}
      </div>

      {/* Emotion */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-4xl">{emotionEmoji}</span>
        <div>
          <span className="text-h5 font-bold text-neutral-900">
            {emotionValue > 0 ? "+" : ""}
            {emotionValue}
          </span>
          <span className="text-body text-neutral-600 ml-2">
            ({emotionLabel})
          </span>
        </div>
      </div>

      {/* User Note */}
      {note && (
        <p className="text-body text-neutral-700 mb-4 leading-relaxed">
          "{note}"
        </p>
      )}

      {/* AI Feedback */}
      {aiFeedback && (
        <div className="bg-primary-50 rounded-lg p-4 border-l-4 border-primary-500">
          <div className="flex items-start gap-2">
            <Bot className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-label font-medium text-primary-700 mb-1">
                AI 피드백
              </p>
              <p className="text-body-sm text-neutral-700 leading-relaxed">
                {aiFeedback}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
