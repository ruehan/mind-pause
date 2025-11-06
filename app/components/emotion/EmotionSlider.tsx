import { useState, useEffect, useRef } from "react";

interface EmotionSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export const emotionData = {
  "-3": { emoji: "😭", label: "매우 안좋음", color: "#ef4444" },
  "-2": { emoji: "😢", label: "안좋음", color: "#f97316" },
  "-1": { emoji: "😕", label: "조금 안좋음", color: "#f59e0b" },
  "0": { emoji: "😐", label: "보통", color: "#94a3b8" },
  "1": { emoji: "🙂", label: "조금 좋음", color: "#84cc16" },
  "2": { emoji: "😊", label: "좋음", color: "#22c55e" },
  "3": { emoji: "😄", label: "매우 좋음", color: "#10b981" },
};

export function EmotionSlider({ value, onChange }: EmotionSliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [prevValue, setPrevValue] = useState(value);
  const [showChangeEffect, setShowChangeEffect] = useState(false);
  const arcRef = useRef<SVGSVGElement>(null);
  const emotion = emotionData[value.toString() as keyof typeof emotionData];

  useEffect(() => {
    if (value !== prevValue) {
      setShowChangeEffect(true);
      setTimeout(() => setShowChangeEffect(false), 300);
      setPrevValue(value);
    }
  }, [value, prevValue]);

  // Arc configuration
  const centerX = 250;
  const centerY = 280;
  const radius = 180;
  const startAngle = 180; // Start from left (π)
  const endAngle = 0;     // End at right (0)

  // Convert value (-3 to 3) to angle
  const valueToAngle = (val: number) => {
    const normalized = (val + 3) / 6; // 0 to 1
    return startAngle - (normalized * (startAngle - endAngle));
  };

  // Convert angle to value
  const angleToValue = (angle: number) => {
    const normalized = (startAngle - angle) / (startAngle - endAngle);
    const rawValue = (normalized * 6) - 3;
    return Math.round(Math.max(-3, Math.min(3, rawValue)));
  };

  // Get color for value
  const getColorForValue = (val: number) => {
    return emotionData[val.toString() as keyof typeof emotionData].color;
  };

  // Handle mouse/touch events
  const handleInteraction = (clientX: number, clientY: number) => {
    if (!arcRef.current) return;

    const rect = arcRef.current.getBoundingClientRect();
    const x = clientX - rect.left - centerX;
    const y = clientY - rect.top - centerY;

    let angle = Math.atan2(-y, x) * (180 / Math.PI);
    if (angle < 0) angle += 360;

    // Constrain to semicircle (0-180 degrees)
    if (angle > 180) {
      angle = Math.abs(angle - 360);
    }

    const newValue = angleToValue(angle);
    onChange(newValue);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleInteraction(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleInteraction(e.clientX, e.clientY);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    const touch = e.touches[0];
    handleInteraction(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      const touch = e.touches[0];
      handleInteraction(touch.clientX, touch.clientY);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Calculate handle position
  const currentAngle = valueToAngle(value);
  const handleX = centerX + radius * Math.cos((currentAngle * Math.PI) / 180);
  const handleY = centerY - radius * Math.sin((currentAngle * Math.PI) / 180);

  // Create gradient stops for the arc
  const gradientStops = [
    { offset: "0%", color: "#ef4444" },    // -3: red
    { offset: "25%", color: "#f97316" },   // -2: orange
    { offset: "40%", color: "#f59e0b" },   // -1: amber
    { offset: "50%", color: "#94a3b8" },   // 0: gray
    { offset: "60%", color: "#84cc16" },   // 1: lime
    { offset: "75%", color: "#22c55e" },   // 2: green
    { offset: "100%", color: "#10b981" },  // 3: emerald
  ];

  return (
    <div className="w-full">
      {/* Question */}
      <label className="block text-h4 font-semibold text-neutral-700 mb-8 text-center">
        오늘 기분은 어떠신가요?
      </label>

      {/* Emotion Display */}
      <div className="text-center mb-8 relative">
        <div
          className={`text-7xl mb-4 transition-all duration-300 ${
            showChangeEffect ? "animate-bounce-subtle scale-125" : "animate-scale-in scale-100"
          } ${isDragging ? "scale-110" : ""}`}
        >
          {emotion.emoji}
        </div>

        {/* Particle effects on change */}
        {showChangeEffect && (
          <>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 text-3xl animate-float opacity-0">
              ✨
            </div>
            <div className="absolute top-0 left-1/3 text-2xl animate-float opacity-0" style={{ animationDelay: "0.1s" }}>
              💫
            </div>
            <div className="absolute top-0 right-1/3 text-2xl animate-float opacity-0" style={{ animationDelay: "0.2s" }}>
              ⭐
            </div>
          </>
        )}

        <div
          className={`inline-block px-6 py-3 rounded-2xl text-white transition-all duration-300 shadow-lg ${
            showChangeEffect ? "scale-110 shadow-xl" : "scale-100"
          }`}
          style={{ backgroundColor: emotion.color }}
        >
          <span className="text-h3 font-bold">{value > 0 ? "+" : ""}{value}</span>
          <span className="text-body-lg ml-3 font-medium">({emotion.label})</span>
        </div>
      </div>

      {/* Arc Slider */}
      <div className="relative flex justify-center">
        <svg
          ref={arcRef}
          width="500"
          height="300"
          className="cursor-pointer select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <defs>
            <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              {gradientStops.map((stop, index) => (
                <stop key={index} offset={stop.offset} stopColor={stop.color} />
              ))}
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Background arc (lighter) */}
          <path
            d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="24"
            strokeLinecap="round"
          />

          {/* Colored arc with gradient */}
          <path
            d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`}
            fill="none"
            stroke="url(#arcGradient)"
            strokeWidth="20"
            strokeLinecap="round"
            opacity="0.9"
          />

          {/* Emoji markers at key positions */}
          {[-3, -2, -1, 0, 1, 2, 3].map((val) => {
            const angle = valueToAngle(val);
            const x = centerX + (radius + 35) * Math.cos((angle * Math.PI) / 180);
            const y = centerY - (radius + 35) * Math.sin((angle * Math.PI) / 180);
            const isSelected = val === value;

            return (
              <g key={val}>
                <text
                  x={x}
                  y={y}
                  fontSize={isSelected ? "32" : "24"}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={`transition-all duration-300 ${isSelected ? "opacity-100" : "opacity-40"}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => onChange(val)}
                >
                  {emotionData[val.toString() as keyof typeof emotionData].emoji}
                </text>
              </g>
            );
          })}

          {/* Handle/Thumb */}
          <circle
            cx={handleX}
            cy={handleY}
            r={isDragging ? "22" : "18"}
            fill="white"
            stroke={emotion.color}
            strokeWidth="4"
            className="transition-all duration-200 drop-shadow-lg"
            filter={isDragging ? "url(#glow)" : ""}
          />

          {/* Inner handle dot */}
          <circle
            cx={handleX}
            cy={handleY}
            r="8"
            fill={emotion.color}
            className="transition-all duration-200"
          />
        </svg>
      </div>

      {/* Value labels */}
      <div className="flex justify-between px-12 mt-4">
        <span className="text-body-sm text-neutral-500 font-medium">매우 안좋음</span>
        <span className="text-body-sm text-neutral-500 font-medium">보통</span>
        <span className="text-body-sm text-neutral-500 font-medium">매우 좋음</span>
      </div>
    </div>
  );
}
