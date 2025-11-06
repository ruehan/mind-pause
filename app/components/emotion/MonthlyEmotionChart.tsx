import { useState } from "react";

interface MonthDataPoint {
  date: string;
  value: number;
  day?: number;
  week?: number;
  hasData?: boolean; // 실제 감정 기록이 있는지 여부
}

interface MonthlyEmotionChartProps {
  data: MonthDataPoint[];
  title?: string;
}

export function MonthlyEmotionChart({
  data,
  title = "월간 감정 추이",
}: MonthlyEmotionChartProps) {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  // Generate full month calendar with all days
  const generateFullMonthCalendar = () => {
    // Use current month if no data, or first data point's month
    const now = new Date();
    let month: number;
    let year: number;

    if (data.length === 0) {
      month = now.getMonth() + 1; // JavaScript months are 0-indexed
      year = now.getFullYear();
    } else {
      const firstDate = data[0].date.split("/");
      month = parseInt(firstDate[0], 10); // Remove leading zeros
      year = now.getFullYear();
    }

    // Get first and last day of the month
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const lastDayOfMonth = new Date(year, month, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    // Create a map of existing data by date
    // Normalize keys to handle both "1/15" and "01/15" formats
    const dataMap = new Map<string, MonthDataPoint>();
    data.forEach(point => {
      const [m, d] = point.date.split("/").map(n => parseInt(n, 10));
      const normalizedKey = `${m}/${d}`;
      dataMap.set(normalizedKey, point);
    });

    // Generate all days of the month
    const allDays: MonthDataPoint[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month - 1, day);
      const dateKey = `${month}/${day}`;
      // Convert Sunday=0...Saturday=6 to Monday=0...Sunday=6
      const jsDay = currentDate.getDay();
      const dayOfWeek = (jsDay + 6) % 7; // 0 = Monday, 6 = Sunday

      if (dataMap.has(dateKey)) {
        const existingData = dataMap.get(dateKey)!;
        allDays.push({
          ...existingData,
          date: dateKey,
          day: dayOfWeek,
          week: Math.floor((day - 1) / 7),
          hasData: true,
        });
      } else {
        // Create empty placeholder
        allDays.push({
          date: dateKey,
          value: 0,
          day: dayOfWeek,
          week: Math.floor((day - 1) / 7),
          hasData: false,
        });
      }
    }

    return allDays;
  };

  const fullMonthData = generateFullMonthCalendar();

  // Organize data into weeks (7 days per row)
  const weeks: (MonthDataPoint | null)[][] = [];
  let currentWeek: (MonthDataPoint | null)[] = [];

  if (fullMonthData.length > 0 && fullMonthData[0]) {
    // Get the day of week for the first day of the month (0 = Monday)
    const firstDayOfWeek = fullMonthData[0].day || 0;

    // Fill empty days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(null);
    }

    // Add all days of the month
    fullMonthData.forEach((point, index) => {
      currentWeek.push(point);

      // Start new week after Sunday (when we have 7 days)
      if (currentWeek.length === 7) {
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    });

    // Fill remaining days of the last week
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }
  }

  // Get color based on emotion value
  const getColor = (day: MonthDataPoint | null) => {
    if (!day || !day.hasData) return "#f1f5f9"; // empty/no data
    const value = day.value;
    if (value >= 3) return "#10b981"; // 매우 좋음 - emerald
    if (value >= 2) return "#22c55e"; // 좋음 - green
    if (value >= 1) return "#84cc16"; // 조금 좋음 - lime
    if (value === 0) return "#94a3b8"; // 보통 - slate
    if (value >= -1) return "#f59e0b"; // 조금 안좋음 - amber
    if (value >= -2) return "#f97316"; // 안좋음 - orange
    return "#ef4444"; // 매우 안좋음 - red
  };

  const getLabel = (value: number) => {
    if (value >= 3) return "매우 좋음";
    if (value >= 2) return "좋음";
    if (value >= 1) return "조금 좋음";
    if (value === 0) return "보통";
    if (value >= -1) return "조금 안좋음";
    if (value >= -2) return "안좋음";
    return "매우 안좋음";
  };

  // Monday to Sunday (월요일부터 시작)
  const dayLabels = ["월", "화", "수", "목", "금", "토", "일"];

  return (
    <div className="glass-strong rounded-3xl shadow-elevation-2 p-8 border border-white/40">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">📊</span>
        <h3 className="text-h3 text-neutral-900 font-bold">{title}</h3>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white/50 p-6">
        <div className="flex gap-2 min-w-max">
          {/* Day labels column */}
          <div className="flex flex-col gap-2 pr-2">
            <div className="h-5"></div> {/* Spacer for alignment */}
            {dayLabels.map((day) => (
              <div
                key={day}
                className="h-5 flex items-center justify-end text-body-sm text-neutral-600 font-medium"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Heatmap grid - organized by week columns */}
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-2">
              {/* Week number or month label */}
              <div className="h-5 flex items-center justify-center text-caption text-neutral-500">
                {weekIndex === 0 && fullMonthData.length > 0 && (
                  <span>{fullMonthData[0].date.split("/")[0]}월</span>
                )}
              </div>

              {/* Days in this week */}
              {week.map((day, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className="relative group"
                  onMouseEnter={() => day?.hasData && setHoveredDay(weekIndex * 7 + dayIndex)}
                  onMouseLeave={() => setHoveredDay(null)}
                >
                  <div
                    className={`w-5 h-5 rounded transition-all duration-200 ${
                      day?.hasData ? "cursor-pointer hover:scale-125 hover:shadow-md" : ""
                    }`}
                    style={{
                      backgroundColor: getColor(day),
                      opacity: day ? 1 : 0.3,
                    }}
                  />

                  {/* Hover tooltip - only show for days with actual data */}
                  {day?.hasData && hoveredDay === weekIndex * 7 + dayIndex && (
                    <div className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-neutral-900 text-white text-body-sm rounded-lg shadow-xl whitespace-nowrap pointer-events-none">
                      <div className="font-semibold">{day.date}</div>
                      <div className="text-caption">
                        {day.value > 0 ? "+" : ""}{day.value} ({getLabel(day.value)})
                      </div>
                      {/* Arrow */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-900"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 p-4 bg-neutral-50/80 rounded-xl">
        <div className="flex items-center justify-between">
          <span className="text-body-sm text-neutral-600">감정 수준</span>
          <div className="flex items-center gap-2">
            <span className="text-caption text-neutral-500">매우 안좋음</span>
            <div className="flex gap-1">
              {[-3, -2, -1, 0, 1, 2, 3].map((val) => (
                <div
                  key={val}
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: getColor({ date: "", value: val, hasData: true }) }}
                  title={getLabel(val)}
                />
              ))}
            </div>
            <span className="text-caption text-neutral-500">매우 좋음</span>
          </div>
        </div>
      </div>
    </div>
  );
}
