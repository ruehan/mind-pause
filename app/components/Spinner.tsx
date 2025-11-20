interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "breathing" | "dots" | "ripple" | "spin";
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
  xl: "w-20 h-20",
};

const dotSizeClasses = {
  sm: "w-2 h-2",
  md: "w-3 h-3",
  lg: "w-4 h-4",
  xl: "w-5 h-5",
};

/**
 * 마음쉼표 브랜드 로딩 인디케이터
 *
 * @param variant
 * - breathing: 호흡하는 원 (기본, 브랜드 정체성)
 * - dots: 펄싱 도트 (간결한 상황)
 * - ripple: 물결 효과 (부드러운 느낌)
 * - spin: 회전 (빠른 로딩)
 */
export function Spinner({
  size = "md",
  variant = "breathing",
  className = "",
}: SpinnerProps) {
  // 호흡하는 원 - 마음쉼표의 핵심 아이덴티티
  if (variant === "breathing") {
    return (
      <div
        className={`${sizeClasses[size]} relative ${className}`}
        role="status"
        aria-label="로딩 중"
      >
        {/* 외부 원 - 그라데이션 */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-400 to-lavender-500 opacity-20 animate-[breathe_3s_ease-in-out_infinite]" />

        {/* 중간 원 */}
        <div className="absolute inset-[20%] rounded-full bg-gradient-to-br from-primary-500 to-lavender-600 opacity-40 animate-[breathe_3s_ease-in-out_infinite_0.5s]" />

        {/* 내부 원 */}
        <div className="absolute inset-[40%] rounded-full bg-gradient-to-br from-primary-600 to-lavender-700 animate-[breathe_3s_ease-in-out_infinite_1s]" />

        <span className="sr-only">로딩 중...</span>
      </div>
    );
  }

  // 펄싱 도트 - 간결한 버전
  if (variant === "dots") {
    return (
      <div
        className={`flex items-center gap-2 ${className}`}
        role="status"
        aria-label="로딩 중"
      >
        <div className={`${dotSizeClasses[size]} rounded-full bg-primary-500 animate-[pulse_1.4s_ease-in-out_infinite]`} />
        <div className={`${dotSizeClasses[size]} rounded-full bg-lavender-500 animate-[pulse_1.4s_ease-in-out_infinite_0.2s]`} />
        <div className={`${dotSizeClasses[size]} rounded-full bg-mint-500 animate-[pulse_1.4s_ease-in-out_infinite_0.4s]`} />
        <span className="sr-only">로딩 중...</span>
      </div>
    );
  }

  // 물결 효과 - 부드러운 확산
  if (variant === "ripple") {
    return (
      <div
        className={`${sizeClasses[size]} relative ${className}`}
        role="status"
        aria-label="로딩 중"
      >
        {/* 첫 번째 파동 */}
        <div className="absolute inset-0 rounded-full border-2 border-primary-400 animate-[rippleWave_2s_ease-out_infinite]" />

        {/* 두 번째 파동 */}
        <div className="absolute inset-0 rounded-full border-2 border-lavender-400 animate-[rippleWave_2s_ease-out_infinite_0.5s]" />

        {/* 세 번째 파동 */}
        <div className="absolute inset-0 rounded-full border-2 border-mint-400 animate-[rippleWave_2s_ease-out_infinite_1s]" />

        {/* 중심 점 */}
        <div className="absolute inset-[45%] rounded-full bg-gradient-to-br from-primary-500 to-lavender-600" />

        <span className="sr-only">로딩 중...</span>
      </div>
    );
  }

  // 회전 - 빠른 로딩용
  if (variant === "spin") {
    return (
      <div
        className={`${sizeClasses[size]} relative ${className}`}
        role="status"
        aria-label="로딩 중"
      >
        <div className="absolute inset-0 rounded-full border-3 border-primary-100 border-t-primary-600 animate-spin" />
        <span className="sr-only">로딩 중...</span>
      </div>
    );
  }

  return null;
}

interface SpinnerOverlayProps {
  message?: string;
  variant?: "breathing" | "dots" | "ripple" | "spin";
}

/**
 * 전체 화면 로딩 오버레이
 * 중요한 로딩 상태에 사용
 */
export function SpinnerOverlay({
  message = "로딩 중...",
  variant = "breathing"
}: SpinnerOverlayProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 shadow-elevation-3 flex flex-col items-center gap-4">
        <Spinner size="lg" variant={variant} />
        <p className="text-body text-neutral-700 font-medium">{message}</p>
      </div>
    </div>
  );
}

// CSS 커스텀 애니메이션을 위한 스타일 추가
// app.css에 아래 keyframes 추가 필요:
/*
@keyframes breathe {
  0%, 100% {
    transform: scale(0.95);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
}

@keyframes rippleWave {
  0% {
    transform: scale(0.5);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}
*/
