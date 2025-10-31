import { useState, useEffect } from "react";
import { Target, TrendingUp } from "lucide-react";

interface Challenge {
  id: string;
  title: string;
  progress: number;
  total: number;
  streak: number;
  category: string;
}

interface ChallengeProgressCardProps {
  challenges: Challenge[];
  onViewAll?: () => void;
}

export function ChallengeProgressCard({
  challenges,
  onViewAll,
}: ChallengeProgressCardProps) {
  const [hoveredChallenge, setHoveredChallenge] = useState<string | null>(null);
  const [animatedProgress, setAnimatedProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    // Animate progress bars on mount
    const timer = setTimeout(() => {
      const progressMap: Record<string, number> = {};
      challenges.forEach((challenge) => {
        progressMap[challenge.id] = getProgressPercentage(challenge.progress, challenge.total);
      });
      setAnimatedProgress(progressMap);
    }, 100);
    return () => clearTimeout(timer);
  }, [challenges]);

  const getProgressPercentage = (progress: number, total: number) => {
    return Math.min((progress / total) * 100, 100);
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      운동: "primary",
      명상: "lavender",
      독서: "mint",
      사회활동: "accent",
    };
    return colors[category] || "primary";
  };

  return (
    <div className="glass rounded-xl shadow-soft hover:shadow-elevation-3 transition-all duration-300 p-6 border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-h4 text-neutral-900 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary-600 animate-float" />
          진행 중인 챌린지
        </h2>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-body-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            전체보기 →
          </button>
        )}
      </div>

      <div className="space-y-4">
        {challenges.map((challenge) => {
          const percentage = getProgressPercentage(
            challenge.progress,
            challenge.total
          );
          const colorClass = getCategoryColor(challenge.category);
          const isHovered = hoveredChallenge === challenge.id;
          const currentProgress = animatedProgress[challenge.id] || 0;

          return (
            <div
              key={challenge.id}
              className="space-y-2 p-3 rounded-lg transition-all duration-300 hover:bg-neutral-50 cursor-pointer relative overflow-hidden"
              onMouseEnter={() => setHoveredChallenge(challenge.id)}
              onMouseLeave={() => setHoveredChallenge(null)}
            >
              {/* Hover gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-r from-primary-50/0 to-mint-50/0 transition-all duration-500 ${
                isHovered ? "from-primary-50/30 to-mint-50/30" : ""
              }`}></div>

              <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`text-body font-semibold transition-colors duration-300 ${
                      isHovered ? "text-primary-700" : "text-neutral-900"
                    }`}>
                      {challenge.title}
                    </h3>
                    {challenge.streak > 0 && (
                      <span className={`text-body-xs bg-accent-100 text-accent-700 px-2 py-0.5 rounded-full flex items-center gap-1 transition-all duration-300 ${
                        isHovered ? "scale-110 animate-bounce-subtle" : ""
                      }`}>
                        🔥 {challenge.streak}일 연속
                      </span>
                    )}
                  </div>
                  <p className={`text-body-sm transition-colors duration-300 ${
                    isHovered ? "text-primary-600 font-medium" : "text-neutral-600"
                  }`}>
                    {challenge.progress}/{challenge.total}일 완료
                  </p>
                </div>
                <div className="relative w-16 h-16 flex-shrink-0 group">
                  {/* Circular Progress */}
                  <svg className={`w-16 h-16 transform -rotate-90 transition-all duration-300 ${
                    isHovered ? "scale-110" : ""
                  }`}>
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      className="text-neutral-200"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 28}`}
                      strokeDashoffset={`${
                        2 * Math.PI * 28 * (1 - currentProgress / 100)
                      }`}
                      className={`${
                        colorClass === "primary"
                          ? "text-primary-500"
                          : colorClass === "lavender"
                          ? "text-lavender-500"
                          : colorClass === "mint"
                          ? "text-mint-500"
                          : "text-accent-500"
                      } transition-all duration-1000 ease-out`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-body-sm font-bold transition-all duration-300 ${
                      isHovered ? "text-primary-700 scale-110" : "text-neutral-900"
                    }`}>
                      {Math.round(currentProgress)}%
                    </span>
                  </div>

                  {/* Glow effect on hover */}
                  {isHovered && (
                    <div className="absolute inset-0 rounded-full bg-primary-100/50 animate-ping pointer-events-none"></div>
                  )}
                </div>
              </div>

              {/* Progress Bar Alternative */}
              <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden relative">
                {/* Shimmer effect on hover */}
                {isHovered && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer"></div>
                )}
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden ${
                    colorClass === "primary"
                      ? "bg-primary-500"
                      : colorClass === "lavender"
                      ? "bg-lavender-500"
                      : colorClass === "mint"
                      ? "bg-mint-500"
                      : "bg-accent-500"
                  }`}
                  style={{ width: `${currentProgress}%` }}
                >
                  {/* Inner glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                </div>
              </div>
              </div>
            </div>
          );
        })}
      </div>

      {challenges.length === 0 && (
        <div className="text-center py-8">
          <Target className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <p className="text-body text-neutral-500">
            아직 진행 중인 챌린지가 없어요
          </p>
          <button className="mt-3 text-body-sm text-primary-600 hover:text-primary-700 font-medium">
            챌린지 시작하기 →
          </button>
        </div>
      )}
    </div>
  );
}
