import { useState, useEffect } from "react";

interface EmotionSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const emotionData = {
  "-5": { emoji: "😭", label: "매우 안좋음", color: "bg-error" },
  "-4": { emoji: "😢", label: "안좋음", color: "bg-error-light" },
  "-3": { emoji: "😟", label: "조금 안좋음", color: "bg-warning" },
  "-2": { emoji: "😕", label: "약간 안좋음", color: "bg-warning-light" },
  "-1": { emoji: "😐", label: "조금 그럼", color: "bg-neutral-300" },
  "0": { emoji: "😐", label: "보통", color: "bg-neutral-400" },
  "1": { emoji: "🙂", label: "조금 좋음", color: "bg-mint-300" },
  "2": { emoji: "😊", label: "좋음", color: "bg-mint-400" },
  "3": { emoji: "😄", label: "꽤 좋음", color: "bg-mint-500" },
  "4": { emoji: "😁", label: "매우 좋음", color: "bg-mint-600" },
  "5": { emoji: "🥰", label: "최고로 좋음", color: "bg-mint-700" },
};

export function EmotionSlider({ value, onChange }: EmotionSliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const emotion = emotionData[value.toString() as keyof typeof emotionData];

  return (
    <div className="w-full">
      {/* Question */}
      <label className="block text-body font-medium text-neutral-700 mb-6">
        오늘 기분은 어떠신가요?
      </label>

      {/* Emotion Display */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-3 animate-scale-in">{emotion.emoji}</div>
        <div
          className={`inline-block px-4 py-2 rounded-full text-white ${emotion.color}`}
        >
          <span className="text-h5 font-bold">{value > 0 ? "+" : ""}{value}</span>
          <span className="text-body ml-2">({emotion.label})</span>
        </div>
      </div>

      {/* Slider Container */}
      <div className="relative px-4">
        {/* Emoji Labels */}
        <div className="flex justify-between mb-3 px-2">
          <span className="text-2xl">😭</span>
          <span className="text-2xl">😢</span>
          <span className="text-2xl">😐</span>
          <span className="text-2xl">😊</span>
          <span className="text-2xl">🥰</span>
        </div>

        {/* Slider Track */}
        <div className="relative h-3 bg-gradient-to-r from-error via-neutral-300 to-mint-500 rounded-full">
          {/* Slider Thumb */}
          <input
            type="range"
            min="-5"
            max="5"
            step="1"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />

          {/* Custom Thumb */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg border-4 transition-all duration-200 ${
              isDragging ? "border-primary-600 scale-110" : "border-primary-500"
            }`}
            style={{
              left: `calc(${((value + 5) / 10) * 100}% - 1rem)`,
            }}
          ></div>
        </div>

        {/* Number Labels */}
        <div className="flex justify-between mt-2 px-2">
          <span className="text-caption text-neutral-500">-5</span>
          <span className="text-caption text-neutral-500">-3</span>
          <span className="text-caption text-neutral-500">0</span>
          <span className="text-caption text-neutral-500">+3</span>
          <span className="text-caption text-neutral-500">+5</span>
        </div>
      </div>
    </div>
  );
}
