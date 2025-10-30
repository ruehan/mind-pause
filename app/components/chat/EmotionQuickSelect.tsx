import { Smile, Meh, Frown, Heart, Zap } from "lucide-react";

interface EmotionOption {
  icon: typeof Smile;
  label: string;
  value: string;
  color: string;
}

interface EmotionQuickSelectProps {
  onSelect: (emotion: string) => void;
}

const emotions: EmotionOption[] = [
  { icon: Smile, label: "좋아요", value: "happy", color: "mint" },
  { icon: Heart, label: "사랑해요", value: "love", color: "error" },
  { icon: Meh, label: "그저 그래요", value: "neutral", color: "neutral" },
  { icon: Frown, label: "힘들어요", value: "sad", color: "primary" },
  { icon: Zap, label: "스트레스", value: "stressed", color: "accent" },
];

export function EmotionQuickSelect({ onSelect }: EmotionQuickSelectProps) {
  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-primary-50 to-lavender-50 rounded-xl border border-primary-100">
      <p className="text-body font-medium text-neutral-800 mb-3 flex items-center gap-2">
        💭 오늘 기분이 어떠세요?
      </p>
      <div className="flex flex-wrap gap-2">
        {emotions.map((emotion) => {
          const Icon = emotion.icon;
          return (
            <button
              key={emotion.value}
              onClick={() => onSelect(emotion.value)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg
                transition-all duration-200 hover:scale-105
                ${
                  emotion.color === "mint"
                    ? "bg-mint-100 hover:bg-mint-200 text-mint-700"
                    : emotion.color === "error"
                    ? "bg-error-100 hover:bg-error-200 text-error-700"
                    : emotion.color === "neutral"
                    ? "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
                    : emotion.color === "primary"
                    ? "bg-primary-100 hover:bg-primary-200 text-primary-700"
                    : "bg-accent-100 hover:bg-accent-200 text-accent-700"
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span className="text-body-sm font-medium">{emotion.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
