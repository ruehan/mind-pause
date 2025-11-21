import { useState, useEffect, useRef } from "react";

interface EmotionSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export const emotionData = {
  "-3": { emoji: "😭", label: "매우 안좋음", color: "#ef4444", bg: "bg-error-50", border: "border-error-200" },
  "-2": { emoji: "😢", label: "안좋음", color: "#f97316", bg: "bg-orange-50", border: "border-orange-200" },
  "-1": { emoji: "😕", label: "조금 안좋음", color: "#f59e0b", bg: "bg-warning-50", border: "border-warning-200" },
  "0": { emoji: "😐", label: "보통", color: "#94a3b8", bg: "bg-neutral-50", border: "border-neutral-200" },
  "1": { emoji: "🙂", label: "조금 좋음", color: "#84cc16", bg: "bg-lime-50", border: "border-lime-200" },
  "2": { emoji: "😊", label: "좋음", color: "#22c55e", bg: "bg-success-50", border: "border-success-200" },
  "3": { emoji: "😄", label: "매우 좋음", color: "#10b981", bg: "bg-emerald-50", border: "border-emerald-200" },
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
      const timer = setTimeout(() => setShowChangeEffect(false), 300);
      setPrevValue(value);
      return () => clearTimeout(timer);
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
    <div className="w-full flex flex-col items-center">
      {/* Question */}
      <label className="block text-h4 font-bold text-neutral-800 mb-10 text-center">
        오늘 기분은 어떠신가요?
      </label>

      {/* Emotion Display */}
      <div className="text-center mb-10 relative group">
        <div className="absolute inset-0 bg-white/50 rounded-full blur-3xl scale-150 opacity-50 group-hover:scale-175 transition-transform duration-700"></div>
        
        <div
          className={`relative z-10 text-8xl mb-6 transition-all duration-300 transform ${
            showChangeEffect ? "animate-bounce-subtle scale-125" : "scale-100"
          } ${isDragging ? "scale-110" : ""} cursor-grab active:cursor-grabbing`}
        >
          {emotion.emoji}
        </div>

        {/* Particle effects on change */}
        {showChangeEffect && (
          <>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 text-4xl animate-float opacity-0 pointer-events-none">
              ✨
            </div>
            <div className="absolute top-10 left-0 text-3xl animate-float opacity-0 pointer-events-none" style={{ animationDelay: "0.1s" }}>
              💫
            </div>
            <div className="absolute top-10 right-0 text-3xl animate-float opacity-0 pointer-events-none" style={{ animationDelay: "0.2s" }}>
              ⭐
            </div>
          </>
        )}

        <div
          className={`inline-flex items-center px-6 py-3 rounded-2xl backdrop-blur-md border transition-all duration-300 shadow-lg ${
            showChangeEffect ? "scale-110 shadow-xl" : "scale-100"
          } ${emotion.bg} ${emotion.border}`}
        >
          <span className={`text-h3 font-bold`} style={{ color: emotion.color }}>
            {value > 0 ? "+" : ""}{value}
          </span>
          <div className="w-px h-6 bg-neutral-300 mx-4"></div>
          <span className="text-body-lg font-semibold text-neutral-700">{emotion.label}</span>
        </div>
      </div>

      {/* Arc Slider */}
      <div className="relative flex justify-center w-full max-w-[500px] overflow-visible">
        <svg
          ref={arcRef}
          viewBox="0 0 500 300"
          className="w-full h-auto cursor-pointer select-none touch-none drop-shadow-xl"
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
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="inner-shadow">
              <feOffset dx="0" dy="2" />
              <feGaussianBlur stdDeviation="2" result="offset-blur" />
              <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
              <feFlood floodColor="black" floodOpacity="0.2" result="color" />
              <feComposite operator="in" in="color" in2="inverse" result="shadow" />
              <feComposite operator="over" in="shadow" in2="SourceGraphic" />
            </filter>
          </defs>

          {/* Background arc (track) */}
          <path
            d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth="32"
            strokeLinecap="round"
            className="drop-shadow-inner"
          />

          {/* Colored arc with gradient (progress) */}
          <path
            d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`}
            fill="none"
            stroke="url(#arcGradient)"
            strokeWidth="24"
            strokeLinecap="round"
            opacity="0.9"
            filter="url(#glow)"
          />

          {/* Emoji markers at key positions */}
          {[-3, -2, -1, 0, 1, 2, 3].map((val) => {
            const angle = valueToAngle(val);
            const x = centerX + (radius + 45) * Math.cos((angle * Math.PI) / 180);
            const y = centerY - (radius + 45) * Math.sin((angle * Math.PI) / 180);
            const isSelected = val === value;

            return (
              <g key={val} onClick={(e) => { e.stopPropagation(); onChange(val); }} className="cursor-pointer group">
                <circle 
                  cx={x} 
                  cy={y} 
                  r={isSelected ? "24" : "18"} 
                  fill={isSelected ? "white" : "transparent"}
                  className="transition-all duration-300"
                  filter={isSelected ? "drop-shadow(0 4px 6px rgba(0,0,0,0.1))" : ""}
                />
                <text
                  x={x}
                  y={y}
                  fontSize={isSelected ? "32" : "24"}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={`transition-all duration-300 ${isSelected ? "opacity-100 scale-110" : "opacity-40 group-hover:opacity-70"}`}
                  style={{ cursor: "pointer" }}
                >
                  {emotionData[val.toString() as keyof typeof emotionData].emoji}
                </text>
              </g>
            );
          })}

          {/* Handle/Thumb */}
          <g filter="drop-shadow(0 4px 8px rgba(0,0,0,0.2))">
            <circle
              cx={handleX}
              cy={handleY}
              r={isDragging ? "24" : "20"}
              fill="white"
              stroke={emotion.color}
              strokeWidth="4"
              className="transition-all duration-200 cursor-grab active:cursor-grabbing"
            />
            {/* Inner handle dot */}
            <circle
              cx={handleX}
              cy={handleY}
              r="8"
              fill={emotion.color}
              className="transition-all duration-200 pointer-events-none"
            />
          </g>
        </svg>
      </div>

      {/* Labels */}
      <div className="flex justify-between w-full max-w-[400px] -mt-4 px-4">
        <span className="text-body-sm text-neutral-400 font-medium">부정적</span>
        <span className="text-body-sm text-neutral-400 font-medium">긍정적</span>
      </div>
    </div>
  );
}
