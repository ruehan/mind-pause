import { useEffect, useState } from "react";
import { ThumbsUp, ThumbsDown, MessageSquare, Star } from "lucide-react";
import { getFeedbackStats, type FeedbackStats } from "~/lib/api";

export function FeedbackStatsCard() {
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState(30);

  useEffect(() => {
    loadStats();
  }, [days]);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFeedbackStats(days);
      setStats(data);
    } catch (err) {
      setError("통계를 불러오는데 실패했습니다");
      console.error("Failed to load feedback stats:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="glass rounded-xl shadow-soft p-6 animate-pulse">
        <div className="h-6 bg-neutral-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-neutral-200 rounded"></div>
          <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="glass rounded-xl shadow-soft p-6">
        <p className="text-body-sm text-red-600">{error || "데이터를 불러올 수 없습니다"}</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl shadow-soft hover:shadow-primary transition-all duration-300 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-h3 font-bold text-neutral-900">AI 응답 피드백 통계</h3>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="px-3 py-1.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value={7}>최근 7일</option>
          <option value={30}>최근 30일</option>
          <option value={90}>최근 90일</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Total Feedbacks */}
        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
          <MessageSquare className="w-8 h-8 mx-auto mb-2 text-blue-600" />
          <p className="text-2xl font-bold text-blue-900">{stats.total_feedbacks}</p>
          <p className="text-sm text-blue-700">총 피드백</p>
        </div>

        {/* Positive */}
        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
          <ThumbsUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
          <p className="text-2xl font-bold text-green-900">{stats.positive_feedbacks}</p>
          <p className="text-sm text-green-700">도움됨</p>
        </div>

        {/* Negative */}
        <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
          <ThumbsDown className="w-8 h-8 mx-auto mb-2 text-orange-600" />
          <p className="text-2xl font-bold text-orange-900">{stats.negative_feedbacks}</p>
          <p className="text-sm text-orange-700">아쉬워요</p>
        </div>

        {/* Average Rating */}
        <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg">
          <Star className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
          <p className="text-2xl font-bold text-yellow-900">
            {stats.average_rating ? stats.average_rating.toFixed(1) : "N/A"}
          </p>
          <p className="text-sm text-yellow-700">평균 별점</p>
        </div>
      </div>

      {/* Positive Ratio */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-neutral-700">긍정 피드백 비율</span>
          <span className="text-sm font-bold text-primary-600">{stats.positive_ratio}%</span>
        </div>
        <div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500 rounded-full"
            style={{ width: `${stats.positive_ratio}%` }}
          ></div>
        </div>
      </div>

      {/* Recent Feedbacks */}
      {stats.recent_feedbacks.length > 0 && (
        <div>
          <h4 className="text-body font-medium text-neutral-800 mb-3">최근 피드백</h4>
          <div className="space-y-2">
            {stats.recent_feedbacks.map((feedback) => (
              <div
                key={feedback.id}
                className={`p-3 rounded-lg border ${
                  feedback.is_helpful
                    ? "bg-green-50 border-green-200"
                    : "bg-orange-50 border-orange-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {feedback.is_helpful ? (
                    <ThumbsUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <ThumbsDown className="w-4 h-4 text-orange-600" />
                  )}
                  <span className={`text-sm font-medium ${
                    feedback.is_helpful ? "text-green-700" : "text-orange-700"
                  }`}>
                    {feedback.is_helpful ? "도움됨" : "아쉬워요"}
                  </span>
                  <span className="text-xs text-neutral-500 ml-auto">
                    {new Date(feedback.created_at).toLocaleDateString("ko-KR")}
                  </span>
                </div>
                {feedback.feedback_text && (
                  <p className="text-sm text-neutral-700 mt-1">{feedback.feedback_text}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {stats.total_feedbacks === 0 && (
        <div className="text-center py-8">
          <MessageSquare className="w-16 h-16 mx-auto mb-3 text-neutral-300" />
          <p className="text-body text-neutral-500">아직 피드백이 없습니다</p>
          <p className="text-sm text-neutral-400 mt-1">
            AI와 대화하고 피드백을 남겨주세요!
          </p>
        </div>
      )}
    </div>
  );
}
