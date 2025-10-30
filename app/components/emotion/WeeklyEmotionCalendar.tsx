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
  return (
    <div className="glass-strong rounded-2xl shadow-soft p-6 border border-white/20">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">📈</span>
        <h3 className="text-h4 text-neutral-900">이번 주 감정</h3>
      </div>

      {/* Weekly Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {weekData.map((day, index) => (
          <div
            key={index}
            className={`text-center p-2 rounded-lg transition-all duration-200 ${
              day.hasRecord
                ? "bg-gradient-to-br from-primary-50 to-lavender-50 hover:scale-105"
                : "bg-neutral-100"
            }`}
          >
            <div className="text-caption text-neutral-500 mb-1">{day.day}</div>
            <div
              className={`text-2xl ${
                day.hasRecord ? "animate-scale-in" : "opacity-30"
              }`}
            >
              {day.emoji}
            </div>
            {day.hasRecord && (
              <div
                className={`text-caption font-medium mt-1 ${
                  day.value > 0
                    ? "text-mint-600"
                    : day.value < 0
                    ? "text-error-600"
                    : "text-neutral-600"
                }`}
              >
                {day.value > 0 ? "+" : ""}
                {day.value}
              </div>
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
