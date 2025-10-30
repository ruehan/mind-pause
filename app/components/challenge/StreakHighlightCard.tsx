import { Flame, Trophy, Target } from "lucide-react";

interface StreakHighlightCardProps {
  currentStreak: number;
  longestStreak: number;
  todayCompleted: number;
  todayTotal: number;
}

export function StreakHighlightCard({
  currentStreak,
  longestStreak,
  todayCompleted,
  todayTotal,
}: StreakHighlightCardProps) {
  const isStreakActive = currentStreak > 0;
  const allCompletedToday = todayCompleted === todayTotal && todayTotal > 0;

  return (
    <div className="glass-strong rounded-2xl shadow-soft p-6 border border-white/20 bg-gradient-to-br from-primary-50 via-white to-lavender-50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-h4 text-neutral-900 flex items-center gap-2">
          <Flame className="w-6 h-6 text-accent-500 animate-pulse" />
          연속 달성 스트릭
        </h3>
        {isStreakActive && (
          <span className="text-body-sm px-3 py-1 bg-accent-100 text-accent-700 rounded-full font-bold">
            진행 중 🔥
          </span>
        )}
      </div>

      {/* Current Streak - Large Display */}
      <div className="text-center mb-6 p-6 bg-white/50 rounded-xl">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Flame className="w-12 h-12 text-accent-500 animate-bounce" />
          <div className="text-6xl font-bold bg-gradient-to-r from-accent-500 to-error-500 bg-clip-text text-transparent">
            {currentStreak}
          </div>
          <span className="text-h3 text-neutral-600">일</span>
        </div>
        <p className="text-body text-neutral-600">연속으로 챌린지를 완료했어요!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Today's Progress */}
        <div className="p-4 bg-gradient-to-br from-mint-50 to-mint-100 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-mint-600" />
            <p className="text-body-sm font-medium text-neutral-700">오늘 완료</p>
          </div>
          <p className="text-h3 font-bold text-mint-600">
            {todayCompleted}/{todayTotal}
          </p>
          {allCompletedToday && (
            <p className="text-caption text-mint-600 mt-1">완벽! 🎉</p>
          )}
        </div>

        {/* Longest Streak */}
        <div className="p-4 bg-gradient-to-br from-primary-50 to-lavender-100 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-primary-600" />
            <p className="text-body-sm font-medium text-neutral-700">최고 기록</p>
          </div>
          <p className="text-h3 font-bold text-primary-600">{longestStreak}일</p>
          {currentStreak === longestStreak && currentStreak > 0 && (
            <p className="text-caption text-primary-600 mt-1">신기록! 🏆</p>
          )}
        </div>
      </div>

      {/* Motivation Message */}
      <div className="p-4 bg-gradient-to-r from-accent-50 to-error-50 rounded-lg border-l-4 border-accent-500">
        <p className="text-body-sm text-neutral-700 leading-relaxed">
          {currentStreak === 0 && "오늘부터 새로운 스트릭을 시작해보세요! 💪"}
          {currentStreak > 0 && currentStreak < 7 && "좋은 습관을 만들어가고 있어요! 계속 진행해보세요! 🌟"}
          {currentStreak >= 7 && currentStreak < 14 && "일주일 연속 달성! 정말 대단해요! 🎯"}
          {currentStreak >= 14 && currentStreak < 30 && "2주 연속! 이미 습관이 자리잡았어요! 🔥"}
          {currentStreak >= 30 && "한 달 연속 달성! 챌린지 마스터이시네요! 👑"}
        </p>
      </div>
    </div>
  );
}
