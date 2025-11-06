import { Calendar, Target, Users, TrendingUp } from "lucide-react";

interface ChallengeCardProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  challengeType: "streak" | "community";
  durationDays: number;
  targetCount: number;
  participantsCount: number;
  isJoined?: boolean;
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
  isJoined = false,
  currentStreak = 0,
  completedCount = 0,
  progressPercentage = 0,
  onJoin,
}: ChallengeCardProps) {
  return (
    <div className="glass-strong rounded-3xl shadow-elevation-2 border border-white/40 p-6 transition-all duration-300 hover:shadow-elevation-3 hover:border-primary-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-5xl">{icon}</span>
          <div>
            <h3 className="text-h4 text-neutral-900 font-bold">{title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`px-2 py-1 rounded-full text-body-xs font-semibold ${
                  challengeType === "streak"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-purple-100 text-purple-700"
                }`}
              >
                {challengeType === "streak" ? "연속 기록" : "커뮤니티"}
              </span>
              <span className="text-body-sm text-neutral-500">
                {durationDays}일 동안
              </span>
            </div>
          </div>
        </div>

        {isJoined && (
          <span className="px-3 py-1 bg-success-100 text-success-700 rounded-full text-body-sm font-semibold">
            참여 중
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-body text-neutral-600 mb-4">{description}</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-primary-600" />
          <div>
            <p className="text-body-xs text-neutral-500">목표</p>
            <p className="text-body-sm font-semibold text-neutral-900">
              {targetCount}회
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary-600" />
          <div>
            <p className="text-body-xs text-neutral-500">기간</p>
            <p className="text-body-sm font-semibold text-neutral-900">
              {durationDays}일
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-primary-600" />
          <div>
            <p className="text-body-xs text-neutral-500">참여자</p>
            <p className="text-body-sm font-semibold text-neutral-900">
              {participantsCount}명
            </p>
          </div>
        </div>
      </div>

      {/* Progress (if joined) */}
      {isJoined && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-success-600" />
              <span className="text-body-sm font-semibold text-neutral-900">
                진행률
              </span>
            </div>
            <span className="text-body-sm font-bold text-primary-600">
              {Math.round(progressPercentage)}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between mt-2">
            <p className="text-body-xs text-neutral-600">
              현재 연속: <span className="font-semibold">{currentStreak}일</span>
            </p>
            <p className="text-body-xs text-neutral-600">
              완료: <span className="font-semibold">{completedCount}</span> /{" "}
              {targetCount}
            </p>
          </div>
        </div>
      )}

      {/* Action Button */}
      {!isJoined && onJoin && (
        <button
          onClick={() => onJoin(id)}
          className="w-full btn-primary py-3 text-body font-semibold rounded-2xl transition-all duration-200"
        >
          챌린지 시작하기
        </button>
      )}

      {isJoined && (
        <div className="flex items-center justify-center py-2 text-body-sm text-success-600 font-semibold">
          화이팅! 계속 이어가세요 💪
        </div>
      )}
    </div>
  );
}
