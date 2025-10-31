import { useState, useEffect } from "react";

interface EmotionSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const emotionData = {
  "-5": { emoji: "😭", label: "매우 안좋음", color: "bg-error-500" },
  "-4": { emoji: "😢", label: "안좋음", color: "bg-error-500" },
  "-3": { emoji: "😟", label: "조금 안좋음", color: "bg-orange-600" },
  "-2": { emoji: "😕", label: "약간 안좋음", color: "bg-orange-600" },
  "-1": { emoji: "😐", label: "조금 그럼", color: "bg-neutral-500" },
  "0": { emoji: "😐", label: "보통", color: "bg-neutral-500" },
  "1": { emoji: "🙂", label: "조금 좋음", color: "bg-neutral-500" },
  "2": { emoji: "😊", label: "좋음", color: "bg-emerald-500" },
  "3": { emoji: "😄", label: "꽤 좋음", color: "bg-emerald-500" },
  "4": { emoji: "😁", label: "매우 좋음", color: "bg-mint-500" },
  "5": { emoji: "🥰", label: "최고로 좋음", color: "bg-mint-500" },
};

export function EmotionSlider({ value, onChange }: EmotionSliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [prevValue, setPrevValue] = useState(value);
  const [showChangeEffect, setShowChangeEffect] = useState(false);
  const emotion = emotionData[value.toString() as keyof typeof emotionData];

  useEffect(() => {
    if (value !== prevValue) {
      setShowChangeEffect(true);
      setTimeout(() => setShowChangeEffect(false), 300);
      setPrevValue(value);
    }
  }, [value, prevValue]);

  return (
    <div className="w-full">
      {/* Question */}
      <label className="block text-body font-medium text-neutral-700 mb-6 transition-all duration-300 hover:text-primary-600">
        오늘 기분은 어떠신가요?
      </label>

      {/* Emotion Display */}
      <div className="text-center mb-8 relative">
        <div
          className={`text-6xl mb-3 transition-all duration-300 ${
            showChangeEffect ? "animate-bounce-subtle scale-125" : "animate-scale-in scale-100"
          } ${isDragging ? "scale-110" : ""}`}
        >
          {emotion.emoji}
        </div>

        {/* Particle effects on change */}
        {showChangeEffect && (
          <>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 text-2xl animate-float opacity-0">
              ✨
            </div>
            <div className="absolute top-0 left-1/3 text-xl animate-float opacity-0" style={{ animationDelay: "0.1s" }}>
              💫
            </div>
            <div className="absolute top-0 right-1/3 text-xl animate-float opacity-0" style={{ animationDelay: "0.2s" }}>
              ⭐
            </div>
          </>
        )}

        <div
          className={`inline-block px-4 py-2 rounded-full text-white transition-all duration-300 ${emotion.color} ${
            showChangeEffect ? "scale-110 shadow-lg" : "scale-100"
          }`}
        >
          <span className="text-h5 font-bold">{value > 0 ? "+" : ""}{value}</span>
          <span className="text-body ml-2">({emotion.label})</span>
        </div>
      </div>

      {/* Slider Container */}
      <div className="relative px-4">
        {/* Emoji Labels */}
        <div className="flex justify-between mb-3 px-2">
          <span className={`text-2xl transition-all duration-300 cursor-pointer hover:scale-125 ${
            value === -5 || value === -4 ? "scale-125 animate-bounce-subtle" : "opacity-50"
          }`}>😭</span>
          <span className={`text-2xl transition-all duration-300 cursor-pointer hover:scale-125 ${
            value === -3 || value === -2 || value === -1 ? "scale-125 animate-bounce-subtle" : "opacity-50"
          }`}>😢</span>
          <span className={`text-2xl transition-all duration-300 cursor-pointer hover:scale-125 ${
            value === 0 ? "scale-125 animate-bounce-subtle" : "opacity-50"
          }`}>😐</span>
          <span className={`text-2xl transition-all duration-300 cursor-pointer hover:scale-125 ${
            value === 1 || value === 2 || value === 3 ? "scale-125 animate-bounce-subtle" : "opacity-50"
          }`}>😊</span>
          <span className={`text-2xl transition-all duration-300 cursor-pointer hover:scale-125 ${
            value === 4 || value === 5 ? "scale-125 animate-bounce-subtle" : "opacity-50"
          }`}>🥰</span>
        </div>

        {/* Slider Track */}
        <div className="relative h-3 bg-gradient-to-r from-error-500 via-neutral-500 to-mint-500 rounded-full shadow-inner overflow-hidden">
          {/* Progress fill effect */}
          <div
            className="absolute top-0 left-0 h-full bg-white/20 transition-all duration-300"
            style={{
              width: `${((value + 5) / 10) * 100}%`,
            }}
          />

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
              isDragging ? "border-primary-600 scale-125 shadow-primary" : "border-primary-500 scale-100"
            }`}
            style={{
              left: `calc(${((value + 5) / 10) * 100}% - 1rem)`,
            }}
          >
            {/* Glow effect on drag */}
            {isDragging && (
              <div className="absolute inset-0 rounded-full bg-primary-400/30 animate-ping"></div>
            )}
          </div>
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
