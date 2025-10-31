import { useState } from "react";

interface DayEmotion {
  day: string;
  emoji: string;
  value: number;
  hasRecord: boolean;
}

interface WeeklyEmotionCalendarProps {
  weekData: DayEmotion[];
  averageValue?: number;
}

export function WeeklyEmotionCalendar({
  weekData,
  averageValue = 0,
}: WeeklyEmotionCalendarProps) {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  return (
    <div className="glass-strong rounded-2xl shadow-soft hover:shadow-elevation-3 transition-all duration-300 p-6 border border-white/20">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl animate-float">📈</span>
        <h3 className="text-h4 text-neutral-900">이번 주 감정</h3>
      </div>

      {/* Weekly Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {weekData.map((day, index) => (
          <div
            key={index}
            onMouseEnter={() => setHoveredDay(index)}
            onMouseLeave={() => setHoveredDay(null)}
            onClick={() => setSelectedDay(selectedDay === index ? null : index)}
            className={`text-center p-2 rounded-lg transition-all duration-300 cursor-pointer relative overflow-hidden ${
              day.hasRecord
                ? "bg-gradient-to-br from-primary-50 to-lavender-50 hover:from-primary-100 hover:to-lavender-100"
                : "bg-neutral-100 hover:bg-neutral-200"
            } ${
              hoveredDay === index || selectedDay === index
                ? "scale-110 shadow-md ring-2 ring-primary-300"
                : "scale-100"
            }`}
          >
            {/* Shimmer effect on hover */}
            {hoveredDay === index && day.hasRecord && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            )}

            <div className="relative z-10">
              <div className={`text-caption mb-1 transition-colors duration-200 ${
                hoveredDay === index ? "text-primary-700 font-medium" : "text-neutral-500"
              }`}>
                {day.day}
              </div>
              <div
                className={`text-2xl transition-all duration-300 ${
                  day.hasRecord ? "animate-scale-in" : "opacity-30"
                } ${
                  hoveredDay === index ? "scale-125 animate-bounce-subtle" : ""
                }`}
              >
                {day.emoji}
              </div>
              {day.hasRecord && (
                <div
                  className={`text-caption font-medium mt-1 transition-all duration-300 ${
                    day.value > 0
                      ? "text-mint-600"
                      : day.value < 0
                      ? "text-error-600"
                      : "text-neutral-600"
                  } ${
                    hoveredDay === index ? "scale-110 font-bold" : ""
                  }`}
                >
                  {day.value > 0 ? "+" : ""}
                  {day.value}
                </div>
              )}
            </div>

            {/* Selected indicator */}
            {selectedDay === index && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-primary-500 rounded-full animate-pulse"></div>
            )}
          </div>
        ))}
      </div>

      {/* Average Emotion */}
      <div className="text-center p-3 bg-gradient-to-r from-primary-50 to-mint-50 rounded-lg">
        <p className="text-body-sm text-neutral-700 mb-1">이번 주 평균 감정</p>
        <p
          className={`text-h4 font-bold ${
            averageValue > 0
              ? "text-mint-600"
              : averageValue < 0
              ? "text-error-600"
              : "text-neutral-600"
          }`}
        >
          {averageValue > 0 ? "+" : ""}
          {averageValue.toFixed(1)}
        </p>
      </div>
    </div>
  );
}
