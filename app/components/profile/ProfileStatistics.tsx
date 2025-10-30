import { Heart, BookOpen, Target, MessageCircle, TrendingUp, Award } from "lucide-react";

interface ProfileStatisticsProps {
  totalEmotionLogs: number;
  averageEmotionScore: number;
  challengeCompletionRate: number;
  communityLikes: number;
  communityComments: number;
  currentStreak: number;
}

export function ProfileStatistics({
  totalEmotionLogs,
  averageEmotionScore,
  challengeCompletionRate,
  communityLikes,
  communityComments,
  currentStreak,
}: ProfileStatisticsProps) {
  const getEmotionScoreColor = (score: number): string => {
    if (score >= 2) return "text-mint-600";
    if (score >= 0) return "text-primary-600";
    if (score >= -2) return "text-neutral-600";
    return "text-orange-600";
  };

  const getEmotionScoreLabel = (score: number): string => {
    if (score >= 2) return "매우 긍정적";
    if (score >= 0) return "긍정적";
    if (score >= -2) return "보통";
    return "주의 필요";
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center gap-2">
        <Award className="w-6 h-6 text-primary-600" />
        <h3 className="text-h3 text-neutral-900">활동 통계</h3>
      </div>

      {/* Main Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Total Emotion Logs */}
        <div className="glass rounded-xl p-6 border border-white/20 hover:shadow-soft transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-body-sm text-neutral-600">총 감정 기록</p>
              <p className="text-h2 font-bold text-primary-600">
                {totalEmotionLogs}
                <span className="text-body text-neutral-600 ml-1">회</span>
              </p>
            </div>
          </div>
          <p className="text-caption text-neutral-500 mt-2">
            꾸준히 기록하고 있어요! 🌟
          </p>
        </div>

        {/* Average Emotion Score */}
        <div className="glass rounded-xl p-6 border border-white/20 hover:shadow-soft transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${averageEmotionScore >= 0 ? 'from-mint-500 to-mint-600' : 'from-orange-500 to-orange-600'} flex items-center justify-center`}>
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-body-sm text-neutral-600">평균 감정 점수</p>
              <p className={`text-h2 font-bold ${getEmotionScoreColor(averageEmotionScore)}`}>
                {averageEmotionScore > 0 ? '+' : ''}{averageEmotionScore.toFixed(1)}
              </p>
            </div>
          </div>
          <p className="text-caption text-neutral-500 mt-2">
            {getEmotionScoreLabel(averageEmotionScore)} 상태예요
          </p>
        </div>

        {/* Challenge Completion Rate */}
        <div className="glass rounded-xl p-6 border border-white/20 hover:shadow-soft transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-body-sm text-neutral-600">챌린지 완료율</p>
              <p className="text-h2 font-bold text-accent-600">
                {challengeCompletionRate}
                <span className="text-body text-neutral-600 ml-1">%</span>
              </p>
            </div>
          </div>
          {/* Mini Progress Bar */}
          <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-gradient-to-r from-accent-500 to-accent-600 rounded-full"
              style={{ width: `${challengeCompletionRate}%` }}
            />
          </div>
        </div>

        {/* Community Activity */}
        <div className="glass rounded-xl p-6 border border-white/20 hover:shadow-soft transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-lavender-500 to-lavender-600 flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-body-sm text-neutral-600">커뮤니티 활동</p>
              <p className="text-h3 font-bold text-lavender-600">활발</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-caption">
            <div className="flex items-center gap-1 text-neutral-700">
              <Heart className="w-3 h-3 text-error-500" />
              <span>공감 {communityLikes}개</span>
            </div>
            <div className="flex items-center gap-1 text-neutral-700">
              <MessageCircle className="w-3 h-3 text-primary-500" />
              <span>댓글 {communityComments}개</span>
            </div>
          </div>
        </div>
      </div>

      {/* Current Streak Highlight */}
      {currentStreak > 0 && (
        <div className="glass-strong rounded-xl p-6 border border-accent-200 bg-gradient-to-r from-accent-50 to-error-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl">🔥</div>
              <div>
                <p className="text-h4 font-bold text-neutral-900">
                  {currentStreak}일 연속 기록 중!
                </p>
                <p className="text-body-sm text-neutral-600">
                  꾸준함이 변화를 만들어요
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
