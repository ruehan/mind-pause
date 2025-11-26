import { useEffect, useState } from "react";
import { ThumbsUp, ThumbsDown, MessageSquare, Star } from "lucide-react";
import { getFeedbackStats, type FeedbackStats } from "~/lib/api";
import { Spinner } from "~/components/Spinner";

export function FeedbackStatsCard({ initialData }: { initialData?: FeedbackStats }) {
  const [stats, setStats] = useState<FeedbackStats | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState(30);

  useEffect(() => {
    // 초기 데이터가 있고, 날짜 변경이 없는 경우 (기본값 30일) 패치 스킵
    if (initialData && days === 30 && !stats) {
        setStats(initialData);
        setLoading(false);
        return;
    }

    // 이미 데이터가 있고 날짜가 30일이면 스킵
    if (initialData && days === 30 && stats === initialData) {
        return;
    }

    loadStats();
  }, [days, initialData]);

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
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
        <div className="flex items-center justify-center h-64">
          <Spinner size="lg" variant="breathing" />
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
        <p className="text-sm text-red-600 text-center">{error || "데이터를 불러올 수 없습니다"}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-all duration-300 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-neutral-900">AI 응답 피드백 통계 💬</h3>
          <p className="text-sm text-neutral-500 mt-1">AI와의 대화 품질을 확인해보세요</p>
        </div>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="px-4 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white hover:border-neutral-300 transition-colors"
        >
          <option value={7}>최근 7일</option>
          <option value={30}>최근 30일</option>
          <option value={90}>최근 90일</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Total Feedbacks */}
        <div className="text-center p-4 bg-primary-50 rounded-xl border border-primary-100 hover:border-primary-200 transition-colors">
          <MessageSquare className="w-8 h-8 mx-auto mb-2 text-primary-600" />
          <p className="text-2xl font-bold text-primary-900">{stats.total_feedbacks}</p>
          <p className="text-sm text-primary-700 font-medium">총 피드백</p>
        </div>

        {/* Positive */}
        <div className="text-center p-4 bg-mint-50 rounded-xl border border-mint-100 hover:border-mint-200 transition-colors">
          <ThumbsUp className="w-8 h-8 mx-auto mb-2 text-mint-600" />
          <p className="text-2xl font-bold text-mint-900">{stats.positive_feedbacks}</p>
          <p className="text-sm text-mint-700 font-medium">도움됨</p>
        </div>

        {/* Negative */}
        <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-100 hover:border-orange-200 transition-colors">
          <ThumbsDown className="w-8 h-8 mx-auto mb-2 text-orange-600" />
          <p className="text-2xl font-bold text-orange-900">{stats.negative_feedbacks}</p>
          <p className="text-sm text-orange-700 font-medium">아쉬워요</p>
        </div>

        {/* Average Rating */}
        <div className="text-center p-4 bg-lavender-50 rounded-xl border border-lavender-100 hover:border-lavender-200 transition-colors">
          <Star className="w-8 h-8 mx-auto mb-2 text-lavender-600" />
          <p className="text-2xl font-bold text-lavender-900">
            {stats.average_rating ? stats.average_rating.toFixed(1) : "N/A"}
          </p>
          <p className="text-sm text-lavender-700 font-medium">평균 별점</p>
        </div>
      </div>

      {/* Positive Ratio Progress Bar */}
      <div className="mb-6 bg-neutral-50 rounded-xl p-4 border border-neutral-100">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-semibold text-neutral-700">긍정 피드백 비율</span>
          <span className="text-sm font-bold text-mint-600">{stats.positive_ratio}%</span>
        </div>
        <div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-mint-500 to-mint-600 transition-all duration-700 ease-out rounded-full"
            style={{ width: `${stats.positive_ratio}%` }}
          ></div>
        </div>
      </div>

      {/* Recent Feedbacks */}
      {stats.recent_feedbacks.length > 0 && (
        <div>
          <h4 className="text-base font-semibold text-neutral-800 mb-3">최근 피드백</h4>
          <div className="space-y-2">
            {stats.recent_feedbacks.map((feedback) => (
              <div
                key={feedback.id}
                className={`p-4 rounded-xl border transition-all duration-200 ${
                  feedback.is_helpful
                    ? "bg-mint-50 border-mint-200 hover:border-mint-300"
                    : "bg-orange-50 border-orange-200 hover:border-orange-300"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {feedback.is_helpful ? (
                    <ThumbsUp className="w-4 h-4 text-mint-600" />
                  ) : (
                    <ThumbsDown className="w-4 h-4 text-orange-600" />
                  )}
                  <span
                    className={`text-sm font-semibold ${
                      feedback.is_helpful ? "text-mint-700" : "text-orange-700"
                    }`}
                  >
                    {feedback.is_helpful ? "도움됨" : "아쉬워요"}
                  </span>
                  <span className="text-xs text-neutral-500 ml-auto">
                    {new Date(feedback.created_at).toLocaleDateString("ko-KR", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                {feedback.feedback_text && (
                  <p className="text-sm text-neutral-700 mt-2 pl-6">{feedback.feedback_text}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {stats.total_feedbacks === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 mx-auto mb-4 text-neutral-300" />
          <p className="text-base font-medium text-neutral-600">아직 피드백이 없습니다</p>
          <p className="text-sm text-neutral-400 mt-2">
            AI와 대화하고 피드백을 남겨주세요!
          </p>
        </div>
      )}
    </div>
  );
}
