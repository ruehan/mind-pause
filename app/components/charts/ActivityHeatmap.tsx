import { useState } from "react";

interface HeatmapData {
  date: string;
  value: number;
}

interface ActivityHeatmapProps {
  data: HeatmapData[];
  weeks?: number;
}

export function ActivityHeatmap({ data, weeks = 12 }: ActivityHeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<HeatmapData | null>(null);

  // Create grid data
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const cellSize = 14;
  const cellGap = 3;

  // Get intensity color based on value
  const getColor = (value: number) => {
    if (value === 0) return "bg-neutral-100";
    if (value <= 2) return "bg-primary-200";
    if (value <= 5) return "bg-primary-400";
    if (value <= 8) return "bg-primary-600";
    return "bg-primary-800";
  };

  // Create weeks array
  const weeksData = [];
  for (let week = 0; week < weeks; week++) {
    const weekData = [];
    for (let day = 0; day < 7; day++) {
      const index = week * 7 + day;
      const cellData = data[index] || { date: "", value: 0 };
      weekData.push(cellData);
    }
    weeksData.push(weekData);
  }

  return (
    <div className="relative">
      {/* Day labels */}
      <div className="flex mb-2">
        <div style={{ width: cellSize + cellGap }} />
        {days.map((day, index) => (
          <div
            key={index}
            className="text-xs text-neutral-600 text-center"
            style={{ width: cellSize + cellGap, marginLeft: index === 0 ? 0 : cellGap }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Heatmap grid */}
      <div className="flex gap-1">
        {weeksData.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.map((cell, dayIndex) => (
              <div
                key={dayIndex}
                className={`rounded-sm transition-all duration-200 cursor-pointer hover:ring-2 hover:ring-primary-400 ${getColor(
                  cell.value
                )}`}
                style={{ width: cellSize, height: cellSize }}
                onMouseEnter={() => setHoveredCell(cell)}
                onMouseLeave={() => setHoveredCell(null)}
                title={`${cell.date}: ${cell.value}회`}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-4">
        <span className="text-xs text-neutral-600">적음</span>
        <div className="flex gap-1">
          {[0, 2, 5, 8, 10].map((value) => (
            <div
              key={value}
              className={`rounded-sm ${getColor(value)}`}
              style={{ width: cellSize, height: cellSize }}
            />
          ))}
        </div>
        <span className="text-xs text-neutral-600">많음</span>
      </div>

      {/* Tooltip */}
      {hoveredCell && hoveredCell.date && (
        <div className="absolute z-10 bg-neutral-900 text-white px-3 py-2 rounded-lg shadow-lg text-sm pointer-events-none animate-fade-in">
          <div className="font-medium">{hoveredCell.date}</div>
          <div className="text-primary-300">{hoveredCell.value}회 활동</div>
        </div>
      )}
    </div>
  );
}
