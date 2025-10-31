import { useState, useEffect } from "react";

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  color?: "primary" | "mint" | "lavender" | "accent";
  showPercentage?: boolean;
  animated?: boolean;
  height?: "sm" | "md" | "lg";
}

const colorClasses = {
  primary: "bg-primary-500",
  mint: "bg-mint-500",
  lavender: "bg-lavender-500",
  accent: "bg-accent-500",
};

const heightClasses = {
  sm: "h-2",
  md: "h-4",
  lg: "h-6",
};

export function ProgressBar({
  value,
  max,
  label,
  color = "primary",
  showPercentage = true,
  animated = true,
  height = "md",
}: ProgressBarProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const percentage = Math.min((value / max) * 100, 100);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayValue(percentage);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayValue(percentage);
    }
  }, [percentage, animated]);

  return (
    <div className="w-full">
      {/* Label and Percentage */}
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <span className="text-body-sm font-medium text-neutral-700">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="text-body-sm font-semibold text-neutral-900">
              {value}/{max} ({Math.round(percentage)}%)
            </span>
          )}
        </div>
      )}

      {/* Progress Bar */}
      <div className={`w-full bg-neutral-200 rounded-full overflow-hidden ${heightClasses[height]}`}>
        <div
          className={`${colorClasses[color]} ${heightClasses[height]} rounded-full transition-all duration-1000 ease-out relative overflow-hidden`}
          style={{ width: `${displayValue}%` }}
        >
          {/* Shimmer effect */}
          {animated && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
          )}
        </div>
      </div>
    </div>
  );
}

interface CircularProgressProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  color?: "primary" | "mint" | "lavender" | "accent";
  showLabel?: boolean;
}

const strokeColors = {
  primary: "#5B8CFF",
  mint: "#4ECDC4",
  lavender: "#A78BFA",
  accent: "#F59E0B",
};

export function CircularProgress({
  value,
  max,
  size = 120,
  strokeWidth = 8,
  color = "primary",
  showLabel = true,
}: CircularProgressProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const percentage = Math.min((value / max) * 100, 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayValue / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayValue(percentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
        />

        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColors[color]}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Center label */}
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <div className="text-h3 font-bold text-neutral-900">
            {Math.round(percentage)}%
          </div>
          <div className="text-body-sm text-neutral-600">
            {value}/{max}
          </div>
        </div>
      )}
    </div>
  );
}
