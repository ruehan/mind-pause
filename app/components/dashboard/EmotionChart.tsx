import { useState } from "react";
import { TrendingUp, Download } from "lucide-react";
import { Button } from "../Button";

interface DataPoint {
  date: string;
  value: number;
}

interface EmotionChartProps {
  data: DataPoint[];
  onExport?: () => void;
}

export function EmotionChart({ data, onExport }: EmotionChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const maxValue = 5;
  const minValue = -5;
  const range = maxValue - minValue;

  // Calculate position for each point (percentage)
  const getYPosition = (value: number) => {
    return ((maxValue - value) / range) * 100;
  };

  return (
    <div className="glass rounded-xl shadow-soft hover:shadow-elevation-3 transition-all duration-300 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-h4 text-neutral-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary-600 animate-float" />
          감정 변화 추이
        </h2>
        {onExport && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onExport}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            내보내기
          </Button>
        )}
      </div>

      {/* Chart Container */}
      <div className="relative w-full h-80 bg-neutral-50 rounded-lg p-4">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-neutral-500 py-4">
          <span>+5</span>
          <span>+3</span>
          <span>+1</span>
          <span>0</span>
          <span>-1</span>
          <span>-3</span>
          <span>-5</span>
        </div>

        {/* Chart Area */}
        <div className="ml-12 h-full relative">
          {/* Grid lines */}
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="absolute w-full border-t border-neutral-200"
              style={{ top: `${(i / 6) * 100}%` }}
            />
          ))}

          {/* Data points and line */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            {/* Line path */}
            <polyline
              fill="none"
              stroke="#5B8CFF"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={data
                .map((point, index) => {
                  const x = (index / (data.length - 1)) * 100;
                  const y = getYPosition(point.value);
                  return `${x},${y}`;
                })
                .join(" ")}
            />

            {/* Gradient fill area */}
            <defs>
              <linearGradient id="emotionGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#5B8CFF" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#5B8CFF" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            <polygon
              fill="url(#emotionGradient)"
              points={
                `0,100 ${data
                  .map((point, index) => {
                    const x = (index / (data.length - 1)) * 100;
                    const y = getYPosition(point.value);
                    return `${x},${y}`;
                  })
                  .join(" ")} 100,100`
              }
            />

            {/* Data points */}
            {data.map((point, index) => {
              const x = (index / (data.length - 1)) * 100;
              const y = getYPosition(point.value);
              const isHovered = hoveredPoint === index;
              return (
                <g key={index}>
                  <circle
                    cx={`${x}%`}
                    cy={`${y}%`}
                    r={isHovered ? "7" : "5"}
                    fill="#5B8CFF"
                    className="transition-all duration-200 cursor-pointer"
                    onMouseEnter={() => setHoveredPoint(index)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  {isHovered && (
                    <g>
                      <circle
                        cx={`${x}%`}
                        cy={`${y}%`}
                        r="10"
                        fill="#5B8CFF"
                        opacity="0.2"
                        className="animate-pulse"
                      />
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* X-axis labels */}
        <div className="absolute bottom-0 left-12 right-0 flex justify-between text-xs text-neutral-500 mt-2">
          {data.map((point, index) => (
            <span key={index}>{point.date}</span>
          ))}
        </div>

        {/* Tooltip */}
        {hoveredPoint !== null && (
          <div
            className="absolute z-10 bg-neutral-900 text-white px-3 py-2 rounded-lg shadow-lg text-sm animate-fade-in"
            style={{
              left: `${((hoveredPoint / (data.length - 1)) * 100)}%`,
              top: `${getYPosition(data[hoveredPoint].value)}%`,
              transform: "translate(-50%, -120%)",
            }}
          >
            <div className="font-medium">{data[hoveredPoint].date}</div>
            <div className="text-primary-300">
              {data[hoveredPoint].value > 0 ? "+" : ""}
              {data[hoveredPoint].value}점
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-2 h-2 bg-neutral-900 rotate-45"></div>
          </div>
        )}
      </div>
    </div>
  );
}
