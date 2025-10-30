import { TrendingUp } from "lucide-react";

interface DataPoint {
  date: string;
  value: number;
}

interface ActivityChartProps {
  data: DataPoint[];
  title?: string;
}

export function ActivityChart({ data, title = "일일 활성 사용자 (DAU)" }: ActivityChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));
  const avgValue = Math.round(data.reduce((sum, d) => sum + d.value, 0) / data.length);

  // Calculate percentage for bar height
  const getBarHeight = (value: number) => {
    return ((value - minValue) / (maxValue - minValue)) * 100;
  };

  // Calculate trend
  const firstHalf = data.slice(0, Math.floor(data.length / 2));
  const secondHalf = data.slice(Math.floor(data.length / 2));
  const firstAvg = firstHalf.reduce((sum, d) => sum + d.value, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, d) => sum + d.value, 0) / secondHalf.length;
  const trendPercentage = Math.round(((secondAvg - firstAvg) / firstAvg) * 100);
  const isPositiveTrend = trendPercentage >= 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-mint-100 to-primary-100 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h2 className="text-h3 text-neutral-900">{title}</h2>
            <p className="text-body-sm text-neutral-600">
              지난 {data.length}일간의 활동 추이
            </p>
          </div>
        </div>

        {/* Trend Indicator */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          isPositiveTrend ? "bg-mint-50" : "bg-error-50"
        }`}>
          <TrendingUp className={`w-5 h-5 ${
            isPositiveTrend ? "text-mint-600" : "text-error-600 rotate-180"
          }`} />
          <span className={`text-h4 font-bold ${
            isPositiveTrend ? "text-mint-700" : "text-error-700"
          }`}>
            {isPositiveTrend ? "+" : ""}{trendPercentage}%
          </span>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <p className="text-caption text-neutral-600 mb-1">최고</p>
          <p className="text-h3 font-bold text-primary-600">{maxValue.toLocaleString()}</p>
        </div>
        <div className="text-center">
          <p className="text-caption text-neutral-600 mb-1">평균</p>
          <p className="text-h3 font-bold text-neutral-900">{avgValue.toLocaleString()}</p>
        </div>
        <div className="text-center">
          <p className="text-caption text-neutral-600 mb-1">최저</p>
          <p className="text-h3 font-bold text-neutral-600">{minValue.toLocaleString()}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-64 bg-neutral-50 rounded-lg p-4">
        {/* Grid Lines */}
        <div className="absolute inset-4 flex flex-col justify-between">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="border-t border-neutral-200" />
          ))}
        </div>

        {/* Bars */}
        <div className="relative h-full flex items-end justify-between gap-1">
          {data.map((point, index) => {
            const height = getBarHeight(point.value);
            const isHighest = point.value === maxValue;
            return (
              <div key={index} className="flex-1 flex flex-col items-center group">
                {/* Value Tooltip */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-2 bg-neutral-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  {point.value.toLocaleString()}명
                </div>

                {/* Bar */}
                <div
                  className={`w-full rounded-t transition-all duration-300 group-hover:opacity-80 ${
                    isHighest
                      ? "bg-gradient-to-t from-primary-500 to-accent-500"
                      : "bg-gradient-to-t from-primary-400 to-primary-500"
                  }`}
                  style={{ height: `${height}%` }}
                />

                {/* Date Label */}
                <p className="text-xs text-neutral-600 mt-2 truncate w-full text-center">
                  {point.date}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 text-body-sm text-neutral-600">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gradient-to-t from-primary-400 to-primary-500" />
          <span>일반</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gradient-to-t from-primary-500 to-accent-500" />
          <span>최고</span>
        </div>
      </div>
    </div>
  );
}
