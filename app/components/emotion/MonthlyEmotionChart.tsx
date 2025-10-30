interface MonthDataPoint {
  date: string;
  value: number;
}

interface MonthlyEmotionChartProps {
  data: MonthDataPoint[];
  title?: string;
}

export function MonthlyEmotionChart({
  data,
  title = "월간 감정 추이",
}: MonthlyEmotionChartProps) {
  const width = 500;
  const height = 240;
  const padding = 35;

  const minValue = -5;
  const maxValue = 5;

  // Calculate positions
  const xScale = (index: number) =>
    padding + (index / (data.length - 1)) * (width - 2 * padding);
  const yScale = (value: number) =>
    height -
    padding -
    ((value - minValue) / (maxValue - minValue)) * (height - 2 * padding);

  // Generate path for line
  const linePath = data
    .map((point, index) => {
      const x = xScale(index);
      const y = yScale(point.value);
      return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    })
    .join(" ");

  // Generate path for gradient area
  const areaPath =
    linePath +
    ` L ${xScale(data.length - 1)} ${yScale(minValue)} L ${xScale(0)} ${yScale(
      minValue
    )} Z`;

  return (
    <div className="glass-strong rounded-2xl shadow-soft p-6 border border-white/20">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">📊</span>
        <h3 className="text-h4 text-neutral-900">{title}</h3>
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto"
          style={{ minWidth: "400px" }}
        >
          {/* Grid lines */}
          {[...Array(11)].map((_, i) => {
            const value = minValue + i;
            const y = yScale(value);
            return (
              <g key={i}>
                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke={value === 0 ? "#94a3b8" : "#e2e8f0"}
                  strokeWidth={value === 0 ? 2 : 1}
                  strokeDasharray={value === 0 ? "none" : "4"}
                />
                <text
                  x={padding - 10}
                  y={y + 5}
                  fontSize="12"
                  fill="#64748b"
                  textAnchor="end"
                >
                  {value > 0 ? "+" : ""}
                  {value}
                </text>
              </g>
            );
          })}

          {/* Area gradient */}
          <defs>
            <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Area fill */}
          <path d={areaPath} fill="url(#areaGradient)" />

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#6366f1"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {data.map((point, index) => {
            const x = xScale(index);
            const y = yScale(point.value);
            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r="5"
                  fill="#ffffff"
                  stroke="#6366f1"
                  strokeWidth="2"
                  className="hover:r-7 transition-all cursor-pointer"
                />
                {/* Tooltip on hover */}
                <title>
                  {point.date}: {point.value > 0 ? "+" : ""}
                  {point.value}
                </title>
              </g>
            );
          })}

          {/* X-axis labels */}
          {data.map((point, index) => {
            if (index % Math.ceil(data.length / 7) === 0 || index === data.length - 1) {
              const x = xScale(index);
              const y = height - padding + 20;
              return (
                <text
                  key={`label-${index}`}
                  x={x}
                  y={y}
                  fontSize="11"
                  fill="#64748b"
                  textAnchor="middle"
                >
                  {point.date}
                </text>
              );
            }
            return null;
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 text-body-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-mint-500"></div>
          <span className="text-neutral-600">긍정적</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-neutral-400"></div>
          <span className="text-neutral-600">보통</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-error-500"></div>
          <span className="text-neutral-600">부정적</span>
        </div>
      </div>
    </div>
  );
}
