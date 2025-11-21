import { emotionData } from "./EmotionSlider";

interface DayData {
  day: string;
  emoji: string;
  value: number;
  hasRecord: boolean;
  date?: string;
  note?: string;
}

interface WeeklyCalendarProps {
  weekData: DayData[];
  averageValue: number;
  lastWeekAverage: number;
  showComparison?: boolean;
}

export function WeeklyCalendar({
  weekData,
  averageValue,
  lastWeekAverage,
  showComparison = true,
}: WeeklyCalendarProps) {
  const diff = averageValue - lastWeekAverage;
  const isPositive = diff > 0;
  
  // Calculate average emotion data
  const avgEmotionKey = Math.round(averageValue).toString();
  const avgEmotion = emotionData[avgEmotionKey as keyof typeof emotionData] || emotionData["0"];

  return (
    <div className="glass rounded-3xl p-8 shadow-sm border border-white/60">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-8">
        <div>
          <h3 className="text-h3 font-bold text-neutral-900 mb-2">이번 주 감정 흐름</h3>
          <p className="text-body text-neutral-500">
            일주일 동안의 감정 변화를 한눈에 확인하세요.
          </p>
        </div>

        {/* Weekly Stats */}
        <div className="flex items-center gap-4 bg-white/50 px-6 py-3 rounded-2xl border border-white/60 shadow-sm">
          <div className="text-right">
            <p className="text-caption font-semibold text-neutral-500 uppercase tracking-wider">주간 평균</p>
            <div className="flex items-center justify-end gap-2">
              <span className="text-2xl font-bold text-neutral-800">
                {averageValue > 0 ? "+" : ""}{averageValue.toFixed(1)}
              </span>
              <span className="text-2xl">{avgEmotion.emoji}</span>
            </div>
          </div>
          
          {showComparison && (
            <div className={`px-3 py-1 rounded-lg text-caption font-bold ${
              isPositive ? "bg-success-50 text-success-700" : "bg-neutral-100 text-neutral-600"
            }`}>
              {isPositive ? "▲" : "▼"} {Math.abs(diff).toFixed(1)}
              <span className="font-normal ml-1">지난주 대비</span>
            </div>
          )}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 sm:gap-4">
        {weekData.map((data, index) => {
          const emotion = emotionData[data.value.toString() as keyof typeof emotionData];
          const isToday = new Date().getDay() === (index + 1) % 7; // Simple check, can be improved

          return (
            <div key={index} className="flex flex-col items-center gap-3 group">
              <span className={`text-caption font-medium ${isToday ? "text-primary-600 font-bold" : "text-neutral-400"}`}>
                {data.day}
              </span>
              
              <div className="relative w-full aspect-[3/4] sm:aspect-square">
                {data.hasRecord ? (
                  <div 
                    className={`w-full h-full rounded-2xl flex flex-col items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-md cursor-pointer border-2 ${emotion.bg} ${emotion.border}`}
                  >
                    <span className="text-2xl sm:text-3xl mb-1 filter drop-shadow-sm">{data.emoji}</span>
                    <span className={`text-caption font-bold hidden sm:block`} style={{ color: emotion.color }}>
                      {data.value > 0 ? "+" : ""}{data.value}
                    </span>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max max-w-[150px] bg-neutral-900 text-white text-xs p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      <p className="font-bold mb-1">{data.date}</p>
                      <p className="line-clamp-2">{data.note || "기록된 내용이 없습니다."}</p>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-900"></div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full rounded-2xl bg-neutral-100/50 border-2 border-dashed border-neutral-200 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-neutral-300"></div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
