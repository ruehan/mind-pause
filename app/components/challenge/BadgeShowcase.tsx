import { Trophy, Award, Star, Zap, Target, Crown, Medal, Flame } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  earned: boolean;
  earnedDate?: string;
}

interface BadgeShowcaseProps {
  badges: Badge[];
}

export function BadgeShowcase({ badges }: BadgeShowcaseProps) {
  const earnedBadges = badges.filter((b) => b.earned);
  const lockedBadges = badges.filter((b) => !b.earned);

  return (
    <div className="glass-strong rounded-2xl shadow-soft p-6 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-h4 text-neutral-900 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-accent-500" />
            획득한 배지
          </h3>
          <p className="text-body-sm text-neutral-600 mt-1">
            {earnedBadges.length}/{badges.length}개 달성
          </p>
        </div>
        <div className="text-right">
          <div className="text-h3 font-bold text-primary-600">
            {Math.round((earnedBadges.length / badges.length) * 100)}%
          </div>
          <p className="text-caption text-neutral-500">완료율</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-gradient-to-r from-accent-500 to-primary-500 rounded-full transition-all duration-500"
          style={{ width: `${(earnedBadges.length / badges.length) * 100}%` }}
        />
      </div>

      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <div className="mb-6">
          <h4 className="text-body font-medium text-neutral-700 mb-3">🏆 달성 배지</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {earnedBadges.map((badge) => {
              const Icon = badge.icon;
              return (
                <div
                  key={badge.id}
                  className={`p-4 rounded-lg bg-gradient-to-br ${badge.color} hover:scale-105 transform transition-all duration-200 cursor-pointer group`}
                  title={badge.description}
                >
                  <div className="flex flex-col items-center text-center">
                    <Icon className="w-8 h-8 mb-2 animate-bounce" />
                    <p className="text-body-sm font-medium text-neutral-800 mb-1">
                      {badge.name}
                    </p>
                    {badge.earnedDate && (
                      <p className="text-caption text-neutral-600">{badge.earnedDate}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Locked Badges */}
      {lockedBadges.length > 0 && (
        <div>
          <h4 className="text-body font-medium text-neutral-700 mb-3">
            🔒 미달성 배지 ({lockedBadges.length}개)
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {lockedBadges.map((badge) => {
              const Icon = badge.icon;
              return (
                <div
                  key={badge.id}
                  className="p-4 rounded-lg bg-neutral-100 hover:bg-neutral-150 transition-colors cursor-pointer group relative"
                  title={badge.description}
                >
                  <div className="flex flex-col items-center text-center opacity-50 group-hover:opacity-70 transition-opacity">
                    <Icon className="w-8 h-8 mb-2 text-neutral-400" />
                    <p className="text-body-sm font-medium text-neutral-600 mb-1">
                      {badge.name}
                    </p>
                    <p className="text-caption text-neutral-500">{badge.description}</p>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-2xl">🔒</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {badges.length === 0 && (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🏅</div>
          <p className="text-body text-neutral-600">
            챌린지를 완료하고 배지를 획득해보세요!
          </p>
        </div>
      )}
    </div>
  );
}

// Default badges configuration
export const defaultBadges: Badge[] = [
  {
    id: "first-challenge",
    name: "첫 걸음",
    description: "첫 챌린지 완료",
    icon: Star,
    color: "from-mint-100 to-mint-200",
    earned: true,
    earnedDate: "2024-01-10",
  },
  {
    id: "streak-7",
    name: "일주일 챔피언",
    description: "7일 연속 달성",
    icon: Flame,
    color: "from-accent-100 to-accent-200",
    earned: true,
    earnedDate: "2024-01-15",
  },
  {
    id: "streak-14",
    name: "2주 마스터",
    description: "14일 연속 달성",
    icon: Zap,
    color: "from-primary-100 to-primary-200",
    earned: false,
  },
  {
    id: "streak-30",
    name: "한 달 전설",
    description: "30일 연속 달성",
    icon: Crown,
    color: "from-accent-100 to-error-200",
    earned: false,
  },
  {
    id: "complete-5",
    name: "도전자",
    description: "챌린지 5개 완료",
    icon: Target,
    color: "from-lavender-100 to-lavender-200",
    earned: true,
    earnedDate: "2024-01-12",
  },
  {
    id: "complete-10",
    name: "성취가",
    description: "챌린지 10개 완료",
    icon: Award,
    color: "from-mint-100 to-primary-200",
    earned: false,
  },
  {
    id: "complete-20",
    name: "챌린지 마스터",
    description: "챌린지 20개 완료",
    icon: Trophy,
    color: "from-accent-100 to-accent-200",
    earned: false,
  },
  {
    id: "perfect-week",
    name: "완벽한 한 주",
    description: "일주일 모든 챌린지 완료",
    icon: Medal,
    color: "from-error-100 to-error-200",
    earned: false,
  },
];
