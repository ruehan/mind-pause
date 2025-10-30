import { useState } from "react";
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

  return (
    <div className="glass rounded-xl shadow-soft hover:shadow-elevation-3 p-6 mb-4 transition-all duration-300 transform hover:-translate-y-1 border border-white/20">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-h4 text-neutral-900 flex items-center gap-2">
          <Icon className="w-6 h-6 text-primary-600 animate-float" />
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
          <span className="text-sm text-neutral-700">
            진행률: {progress}% ({currentDay}/{totalDays}일)
          </span>
        </div>
        <div className="w-full h-3 bg-neutral-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Today's Task */}
      <div className="mb-4 p-3 bg-neutral-50 rounded-lg">
        <p className="text-sm font-medium text-neutral-700 mb-2">오늘 실천:</p>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={todayCompleted}
            onChange={onComplete}
            className="w-5 h-5 text-primary-600 rounded border-neutral-300 cursor-pointer"
          />
          <span className={`text-sm ${todayCompleted ? "line-through text-neutral-500" : "text-neutral-700"}`}>
            {todayTask}
          </span>
          {todayCompleted && (
            <span className="text-xs text-neutral-500 ml-auto">14:30 체크</span>
          )}
        </label>
      </div>

      {/* Metadata */}
      <div className="flex items-center gap-4 text-sm text-neutral-600 mb-4">
        <span className="flex items-center gap-1">
          🏅 보상: {reward}
        </span>
        <span className="flex items-center gap-1">
          📅 남은 기간: {daysRemaining}일
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onGiveUp}
          className="text-body-sm text-neutral-600 hover:text-neutral-700 font-medium transition-colors"
        >
          포기하기
        </button>
        <Button variant="primary" size="md" onClick={onComplete}>
          오늘 완료 체크 ✓
        </Button>
      </div>
    </div>
  );
}
