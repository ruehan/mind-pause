import { useState, useEffect } from "react";
import { Button } from "../Button";
import type { LucideIcon } from "lucide-react";

interface ActiveChallengeCardProps {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  progress: number;
  currentDay: number;
  totalDays: number;
  todayTask: string;
  todayCompleted: boolean;
  reward: string;
  daysRemaining: number;
  onComplete: () => void;
  onGiveUp: () => void;
}

export function ActiveChallengeCard({
  icon: Icon,
  title,
  description,
  progress,
  currentDay,
  totalDays,
  todayTask,
  todayCompleted,
  reward,
  daysRemaining,
  onComplete,
  onGiveUp,
}: ActiveChallengeCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  // Animate progress bar on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);

  // Show celebration when completing today's task
  const handleTaskComplete = () => {
    if (!todayCompleted) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 1000);
    }
    onComplete();
  };

  return (
    <div
      className="glass rounded-xl shadow-soft hover:shadow-elevation-3 p-6 mb-4 transition-all duration-300 transform hover:-translate-y-1 border border-white/20 relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hover gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br from-primary-50/0 via-lavender-50/0 to-mint-50/0 transition-all duration-500 ${
        isHovered ? "from-primary-50/30 via-lavender-50/20 to-mint-50/30" : ""
      }`}></div>

      {/* Celebration particles */}
      {showCelebration && (
        <>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl animate-bounce-subtle pointer-events-none">
            🎉
          </div>
          <div className="absolute top-1/3 left-1/3 text-2xl animate-float opacity-0 pointer-events-none">
            ✨
          </div>
          <div className="absolute top-1/3 right-1/3 text-2xl animate-float opacity-0 pointer-events-none" style={{ animationDelay: "0.1s" }}>
            ⭐
          </div>
          <div className="absolute bottom-1/3 left-1/4 text-2xl animate-float opacity-0 pointer-events-none" style={{ animationDelay: "0.2s" }}>
            💫
          </div>
        </>
      )}

      {/* Content wrapper */}
      <div className="relative z-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <h3 className={`text-h4 text-neutral-900 flex items-center gap-2 transition-all duration-300 ${
          isHovered ? "text-primary-700" : ""
        }`}>
          <Icon className={`w-6 h-6 text-primary-600 transition-all duration-300 ${
            isHovered ? "animate-bounce-subtle scale-110" : "animate-float"
          }`} />
          {title}
        </h3>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-neutral-500 hover:text-neutral-700 text-xl"
            aria-label="챌린지 메뉴 열기"
          >
            ⋮
          </button>
          {showMenu && (
            <div className="absolute right-0 top-8 bg-white shadow-lg rounded-lg border border-neutral-200 py-2 w-40 z-10">
              <button className="block w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
                상세 보기
              </button>
              <button className="block w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
                수정하기
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  onGiveUp();
                }}
                className="block w-full text-left px-4 py-2 text-sm text-error-600 hover:bg-neutral-50"
              >
                포기하기
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-body text-neutral-600 mb-4">{description}</p>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm transition-colors duration-300 ${
            isHovered ? "text-primary-700 font-medium" : "text-neutral-700"
          }`}>
            진행률: {progress}% ({currentDay}/{totalDays}일)
          </span>
        </div>
        <div className="w-full h-3 bg-neutral-200 rounded-full overflow-hidden relative">
          {/* Shimmer effect */}
          {isHovered && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
          )}
          <div
            className="h-full bg-gradient-to-r from-primary-500 via-primary-600 to-primary-500 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
            style={{ width: `${animatedProgress}%` }}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
          </div>
        </div>
      </div>

      {/* Today's Task */}
      <div className={`mb-4 p-3 rounded-lg transition-all duration-300 ${
        todayCompleted
          ? "bg-gradient-to-r from-primary-50 to-mint-50"
          : "bg-neutral-50 hover:bg-neutral-100"
      }`}>
        <p className="text-sm font-medium text-neutral-700 mb-2">오늘 실천:</p>
        <label className="flex items-center gap-2 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              checked={todayCompleted}
              onChange={handleTaskComplete}
              className="w-5 h-5 text-primary-600 rounded border-neutral-300 cursor-pointer transition-all duration-200 group-hover:scale-110"
            />
            {todayCompleted && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-primary-600 text-sm animate-scale-in">✓</span>
              </div>
            )}
          </div>
          <span className={`text-sm transition-all duration-300 ${
            todayCompleted
              ? "line-through text-neutral-500"
              : "text-neutral-700 group-hover:text-primary-700"
          }`}>
            {todayTask}
          </span>
          {todayCompleted && (
            <span className="text-xs text-neutral-500 ml-auto animate-scale-in">14:30 체크</span>
          )}
        </label>
      </div>

      {/* Metadata */}
      <div className="flex items-center gap-4 text-sm text-neutral-600 mb-4">
        <span className={`flex items-center gap-1 transition-all duration-300 ${
          progress >= 80 ? "animate-bounce-subtle scale-110" : ""
        }`}>
          🏅 보상: <span className={progress >= 80 ? "text-primary-700 font-semibold" : ""}>{reward}</span>
        </span>
        <span className="flex items-center gap-1">
          📅 남은 기간: <span className={daysRemaining <= 3 ? "text-error-600 font-semibold" : ""}>{daysRemaining}일</span>
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onGiveUp}
          className="text-body-sm text-neutral-600 hover:text-error-600 font-medium transition-all duration-200 hover:scale-105"
        >
          포기하기
        </button>
        <Button variant="primary" size="md" onClick={handleTaskComplete}>
          오늘 완료 체크 ✓
        </Button>
      </div>
      </div>
    </div>
  );
}
