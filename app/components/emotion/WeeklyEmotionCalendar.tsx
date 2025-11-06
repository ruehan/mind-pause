import { useState } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface DayEmotion {
  day: string;
  emoji: string;
  value: number;
  hasRecord: boolean;
  note?: string;
  date?: string;
}

interface WeeklyEmotionCalendarProps {
  weekData: DayEmotion[];
  averageValue?: number;
  lastWeekAverage?: number;
  showComparison?: boolean;
}

export function WeeklyEmotionCalendar({
  weekData,
  averageValue = 0,
  lastWeekAverage = 0,
  showComparison = true,
}: WeeklyEmotionCalendarProps) {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  // Calculate trend compared to previous day
  const getTrend = (index: number): "up" | "down" | "same" | null => {
    if (index === 0 || !weekData[index].hasRecord) return null;
    if (!weekData[index - 1].hasRecord) return null;

    const current = weekData[index].value;
    const previous = weekData[index - 1].value;

    if (current > previous) return "up";
    if (current < previous) return "down";
    return "same";
  };

  // Calculate comparison with last week
  const weekComparison = showComparison && lastWeekAverage !== 0
    ? averageValue - lastWeekAverage
    : null;

  // Get color for value
  const getColorClass = (value: number) => {
    if (value >= 2) return "text-emerald-600";
    if (value >= 1) return "text-lime-600";
    if (value >= -1) return "text-neutral-600";
    if (value >= -2) return "text-orange-600";
    return "text-error-600";
  };

  const getBgColorClass = (value: number) => {
    if (value >= 2) return "bg-emerald-50";
    if (value >= 1) return "bg-lime-50";
    if (value >= -1) return "bg-neutral-50";
    if (value >= -2) return "bg-orange-50";
    return "bg-error-50";
  };

  return (
    <div className="glass-strong rounded-3xl shadow-elevation-2 transition-all duration-300 p-8 border border-white/40">
      {/* Comparison Badge */}
      {weekComparison !== null && (
        <div className="flex justify-end mb-6">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
            weekComparison > 0 ? "bg-emerald-50" : weekComparison < 0 ? "bg-error-50" : "bg-neutral-50"
          }`}>
            {weekComparison > 0 ? (
              <>
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <span className="text-body font-semibold text-emerald-700">
                  지난주 대비 +{weekComparison.toFixed(1)}
                </span>
              </>
            ) : weekComparison < 0 ? (
              <>
                <TrendingDown className="w-5 h-5 text-error-600" />
                <span className="text-body font-semibold text-error-700">
                  지난주 대비 {weekComparison.toFixed(1)}
                </span>
              </>
            ) : (
              <>
                <Minus className="w-5 h-5 text-neutral-600" />
                <span className="text-body font-semibold text-neutral-700">
                  지난주와 동일
                </span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="relative">
        {/* Connection Line */}
        <div className="absolute top-[44px] left-8 right-8 h-1 bg-gradient-to-r from-error-200 via-neutral-200 to-emerald-200 rounded-full"></div>

        {/* Days Timeline */}
        <div className="relative flex justify-between items-start px-4">
          {weekData.map((day, index) => {
            const trend = getTrend(index);
            const isHovered = hoveredDay === index;

            return (
              <div
                key={index}
                className="relative flex flex-col items-center group"
                onMouseEnter={() => setHoveredDay(index)}
                onMouseLeave={() => setHoveredDay(null)}
              >
                {/* Emoji Container */}
                <div
                  className={`relative z-10 flex flex-col items-center transition-all duration-300 ${
                    isHovered ? "scale-125 -translate-y-2" : "scale-100"
                  }`}
                >
                  {/* Emoji */}
                  <div
                    className={`text-5xl mb-2 transition-all duration-300 ${
                      day.hasRecord ? "opacity-100" : "opacity-20 grayscale"
                    } ${isHovered ? "animate-bounce-subtle" : ""}`}
                  >
                    {day.emoji}
                  </div>

                  {/* Connection Dot */}
                  <div
                    className={`w-4 h-4 rounded-full border-4 border-white shadow-md transition-all duration-300 ${
                      day.hasRecord ? getBgColorClass(day.value).replace("bg-", "bg-") : "bg-neutral-200"
                    } ${isHovered ? "scale-150" : "scale-100"}`}
                    style={{
                      backgroundColor: day.hasRecord
                        ? day.value >= 2 ? "#10b981"
                        : day.value >= 1 ? "#84cc16"
                        : day.value >= -1 ? "#94a3b8"
                        : day.value >= -2 ? "#f97316"
                        : "#ef4444"
                        : "#d4d4d8"
                    }}
                  />
                </div>

                {/* Day Label and Value */}
                <div className="mt-6 text-center space-y-1">
                  <div className="text-body-sm font-medium text-neutral-600">
                    {day.day}
                  </div>
                  {day.hasRecord && (
                    <>
                      <div className={`text-body font-bold ${getColorClass(day.value)}`}>
                        {day.value > 0 ? "+" : ""}{day.value}
                      </div>

                      {/* Trend Indicator */}
                      {trend && (
                        <div className="flex justify-center">
                          {trend === "up" ? (
                            <TrendingUp className="w-4 h-4 text-emerald-600" />
                          ) : trend === "down" ? (
                            <TrendingDown className="w-4 h-4 text-error-600" />
                          ) : (
                            <Minus className="w-4 h-4 text-neutral-400" />
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Hover Tooltip */}
                {isHovered && day.hasRecord && day.note && (
                  <div className="absolute top-full mt-4 z-20 w-64 p-4 bg-white rounded-xl shadow-xl border border-neutral-200 pointer-events-none animate-scale-in">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{day.emoji}</span>
                      <div>
                        <div className="text-body-sm font-semibold text-neutral-700">
                          {day.date || day.day}
                        </div>
                        <div className={`text-body-sm font-bold ${getColorClass(day.value)}`}>
                          {day.value > 0 ? "+" : ""}{day.value} ({emotionData[day.value.toString() as keyof typeof emotionData]?.label || "보통"})
                        </div>
                      </div>
                    </div>
                    <div className="text-body-sm text-neutral-600 line-clamp-3 italic">
                      "{day.note}"
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Average Summary */}
      <div className="mt-8 p-6 bg-gradient-to-br from-primary-50 via-lavender-50 to-mint-50 rounded-2xl border border-primary-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-body-sm text-neutral-600 mb-1">이번 주 평균 감정</p>
            <div className="flex items-center gap-3">
              <p className={`text-h2 font-bold ${getColorClass(averageValue)}`}>
                {averageValue > 0 ? "+" : ""}
                {averageValue.toFixed(1)}
              </p>
              <span className="text-3xl">
                {averageValue >= 2 ? "😄" : averageValue >= 1 ? "😊" : averageValue >= -1 ? "😐" : averageValue >= -2 ? "😕" : "😢"}
              </span>
            </div>
          </div>

          <div className="text-right">
            <p className="text-body-sm text-neutral-600 mb-1">기록일</p>
            <p className="text-h3 font-bold text-neutral-700">
              {weekData.filter(d => d.hasRecord).length}/7일
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Emotion data mapping (should match EmotionSlider)
const emotionData = {
  "-3": { label: "매우 안좋음" },
  "-2": { label: "안좋음" },
  "-1": { label: "조금 안좋음" },
  "0": { label: "보통" },
  "1": { label: "조금 좋음" },
  "2": { label: "좋음" },
  "3": { label: "매우 좋음" },
};
