import { useState } from "react";

interface DataItem {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DataItem[];
  size?: number;
  thickness?: number;
}

export function DonutChart({ data, size = 200, thickness = 30 }: DonutChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedAngle = 0;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Chart */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const angle = (percentage / 100) * 360;
            const startAngle = accumulatedAngle;
            accumulatedAngle += angle;

            const isHovered = hoveredIndex === index;
            const adjustedRadius = isHovered ? radius + 5 : radius;
            const adjustedThickness = isHovered ? thickness + 5 : thickness;

            // Calculate arc path
            const startX = size / 2 + adjustedRadius * Math.cos((startAngle * Math.PI) / 180);
            const startY = size / 2 + adjustedRadius * Math.sin((startAngle * Math.PI) / 180);
            const endX = size / 2 + adjustedRadius * Math.cos(((startAngle + angle) * Math.PI) / 180);
            const endY = size / 2 + adjustedRadius * Math.sin(((startAngle + angle) * Math.PI) / 180);

            const largeArcFlag = angle > 180 ? 1 : 0;

            const pathData = [
              `M ${startX} ${startY}`,
              `A ${adjustedRadius} ${adjustedRadius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
            ].join(" ");

            return (
              <path
                key={index}
                d={pathData}
                fill="none"
                stroke={item.color}
                strokeWidth={adjustedThickness}
                strokeLinecap="round"
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                opacity={hoveredIndex === null || hoveredIndex === index ? 1 : 0.5}
              />
            );
          })}
        </svg>

        {/* Center Label */}
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <div className="text-h2 font-bold text-neutral-900">
            {hoveredIndex !== null ? data[hoveredIndex].value : total}
          </div>
          <div className="text-body-sm text-neutral-600">
            {hoveredIndex !== null ? data[hoveredIndex].label : "전체"}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3">
        {data.map((item, index) => (
          <button
            key={index}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 ${
              hoveredIndex === index
                ? "bg-neutral-100 scale-105"
                : "hover:bg-neutral-50"
            }`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="text-body-sm text-neutral-700">
              {item.label} ({Math.round((item.value / total) * 100)}%)
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
