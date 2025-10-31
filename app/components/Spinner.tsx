interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  color?: "primary" | "white" | "neutral";
  className?: string;
}

const sizeClasses = {
  sm: "w-4 h-4 border-2",
  md: "w-8 h-8 border-2",
  lg: "w-12 h-12 border-3",
  xl: "w-16 h-16 border-4",
};

const colorClasses = {
  primary: "border-primary-200 border-t-primary-600",
  white: "border-white/30 border-t-white",
  neutral: "border-neutral-200 border-t-neutral-600",
};

export function Spinner({
  size = "md",
  color = "primary",
  className = "",
}: SpinnerProps) {
  return (
    <div
      className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin ${className}`}
      role="status"
      aria-label="로딩 중"
    >
      <span className="sr-only">로딩 중...</span>
    </div>
  );
}

interface SpinnerOverlayProps {
  message?: string;
}

export function SpinnerOverlay({ message = "로딩 중..." }: SpinnerOverlayProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 shadow-elevation-3 flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-body text-neutral-700 font-medium">{message}</p>
      </div>
    </div>
  );
}
