import { Users, Calendar, Trophy, CheckCircle2, Circle } from "lucide-react";

interface ChallengeCardProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  challengeType: string;
  durationDays: number;
  targetCount: number;
  participantsCount: number;
  isJoined: boolean;
  currentStreak?: number;
  completedCount?: number;
  progressPercentage?: number;
  onJoin?: (id: string) => void;
}

export function ChallengeCard({
  id,
  title,
  description,
  icon,
  challengeType,
  durationDays,
  targetCount,
  participantsCount,
  isJoined,
  currentStreak,
  completedCount,
  progressPercentage,
  onJoin,
}: ChallengeCardProps) {
  return (
    <div className="group relative bg-white/80 backdrop-blur-md rounded-2xl border border-white/50 shadow-sm hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 overflow-hidden">
      {/* Progress Bar Background (for joined challenges) */}
      {isJoined && progressPercentage !== undefined && (
        <div 
          className="absolute bottom-0 left-0 h-1.5 bg-primary-100 w-full"
        >
          <div 
            className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-1000 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-50 to-lavender-50 flex items-center justify-center text-2xl shadow-inner">
            {icon}
          </div>
          {isJoined ? (
            <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              참여중
            </span>
          ) : (
            <span className="px-3 py-1 bg-neutral-100 text-neutral-500 rounded-full text-xs font-medium">
              {durationDays}일 코스
            </span>
          )}
        </div>

        {/* Content */}
        <div className="mb-6">
          <h3 className="text-h4 font-bold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors">
            {title}
          </h3>
          <p className="text-body-sm text-neutral-600 line-clamp-2 h-10">
            {description}
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-caption text-neutral-500 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span>{participantsCount}명</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Trophy className="w-4 h-4" />
              <span>{targetCount}회 목표</span>
            </div>
          </div>
        </div>

        {/* Action / Progress */}
        {isJoined ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm font-medium">
              <span className="text-primary-700">진행률</span>
              <span className="text-primary-600">{Math.round(progressPercentage || 0)}%</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <Calendar className="w-3 h-3" />
              <span>{currentStreak}일 연속 달성 중!</span>
            </div>
          </div>
        ) : (
          <button
            onClick={() => onJoin?.(id)}
            className="w-full py-3 bg-neutral-900 text-white rounded-xl font-bold hover:bg-primary-600 transition-colors shadow-lg shadow-neutral-900/20 hover:shadow-primary-600/30"
          >
            도전하기
          </button>
        )}
      </div>
    </div>
  );
}
