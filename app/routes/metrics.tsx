import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import * as api from "../lib/api";

export default function MetricsPage() {
  const navigate = useNavigate();
  const [overview, setOverview] = useState<api.MetricsOverview | null>(null);
  const [dailyMetrics, setDailyMetrics] = useState<api.DailyMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      const [overviewData, dailyData] = await Promise.all([
        api.getMetricsOverview(),
        api.getDailyMetrics(7),
      ]);
      setOverview(overviewData);
      setDailyMetrics(dailyData);
    } catch (err: any) {
      console.error("메트릭 로딩 실패:", err);
      if (err instanceof api.UnauthorizedError) {
        navigate("/auth/login");
      } else {
        setError("메트릭을 불러오는데 실패했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">메트릭 로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error || !overview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "데이터를 불러올 수 없습니다."}</p>
          <button
            onClick={loadMetrics}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-800 mb-2">📊 AI 대화 메트릭</h1>
          <p className="text-neutral-600">대화 품질과 성능을 한눈에 확인하세요</p>
        </div>

        {/* 통계 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* 대화 수 */}
          <StatCard
            title="총 대화 수"
            value={overview.total_conversations}
            icon="💬"
            color="blue"
          />

          {/* 메시지 수 */}
          <StatCard
            title="총 메시지 수"
            value={overview.total_messages}
            subtitle={`평균 ${overview.avg_messages_per_conversation}개/대화`}
            icon="✉️"
            color="green"
          />

          {/* 응답 시간 */}
          <StatCard
            title="평균 응답 시간"
            value={overview.avg_response_time_ms ? `${(overview.avg_response_time_ms / 1000).toFixed(2)}초` : "N/A"}
            subtitle={overview.min_response_time_ms && overview.max_response_time_ms
              ? `${(overview.min_response_time_ms / 1000).toFixed(2)}초 ~ ${(overview.max_response_time_ms / 1000).toFixed(2)}초`
              : undefined}
            icon="⚡"
            color="yellow"
          />

          {/* 피드백 비율 */}
          <StatCard
            title="만족도"
            value={`${overview.feedback_ratio.toFixed(1)}%`}
            subtitle={`👍 ${overview.positive_feedbacks} / 👎 ${overview.negative_feedbacks}`}
            icon="😊"
            color="purple"
          />
        </div>

        {/* 상세 통계 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* 토큰 사용량 */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-neutral-200">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">🎯 토큰 사용량</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">총 사용량</span>
                <span className="font-semibold text-neutral-800">{overview.total_tokens_used.toLocaleString()} tokens</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">평균 입력</span>
                <span className="font-semibold text-neutral-800">
                  {overview.avg_input_tokens ? `${overview.avg_input_tokens.toFixed(1)} tokens` : "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">평균 출력</span>
                <span className="font-semibold text-neutral-800">
                  {overview.avg_output_tokens ? `${overview.avg_output_tokens.toFixed(1)} tokens` : "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* 평가 통계 */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-neutral-200">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">⭐ 사용자 평가</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">평가 수</span>
                <span className="font-semibold text-neutral-800">{overview.total_ratings}개</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">평균 별점</span>
                <span className="font-semibold text-neutral-800">
                  {overview.average_rating ? `${overview.average_rating.toFixed(2)} / 5.0` : "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">피드백 수</span>
                <span className="font-semibold text-neutral-800">{overview.total_feedbacks}개</span>
              </div>
            </div>
          </div>
        </div>

        {/* 일일 트렌드 테이블 */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-800 mb-4">📈 최근 7일 트렌드</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-3 px-4 text-neutral-600 font-medium">날짜</th>
                  <th className="text-right py-3 px-4 text-neutral-600 font-medium">대화</th>
                  <th className="text-right py-3 px-4 text-neutral-600 font-medium">메시지</th>
                  <th className="text-right py-3 px-4 text-neutral-600 font-medium">응답시간</th>
                  <th className="text-right py-3 px-4 text-neutral-600 font-medium">피드백</th>
                  <th className="text-right py-3 px-4 text-neutral-600 font-medium">별점</th>
                </tr>
              </thead>
              <tbody>
                {dailyMetrics.map((metric) => (
                  <tr key={metric.date} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="py-3 px-4 text-neutral-800">{metric.date}</td>
                    <td className="py-3 px-4 text-right text-neutral-800">{metric.conversations}</td>
                    <td className="py-3 px-4 text-right text-neutral-800">{metric.messages}</td>
                    <td className="py-3 px-4 text-right text-neutral-800">
                      {metric.avg_response_time_ms ? `${(metric.avg_response_time_ms / 1000).toFixed(2)}s` : "-"}
                    </td>
                    <td className="py-3 px-4 text-right text-neutral-800">
                      <span className="text-green-600">👍 {metric.positive_feedbacks}</span>
                      {" / "}
                      <span className="text-red-600">👎 {metric.negative_feedbacks}</span>
                    </td>
                    <td className="py-3 px-4 text-right text-neutral-800">
                      {metric.avg_rating ? `⭐ ${metric.avg_rating.toFixed(2)}` : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// 통계 카드 컴포넌트
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  color: "blue" | "green" | "yellow" | "purple";
}

function StatCard({ title, value, subtitle, icon, color }: StatCardProps) {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200",
    green: "bg-green-50 border-green-200",
    yellow: "bg-yellow-50 border-yellow-200",
    purple: "bg-purple-50 border-purple-200",
  };

  return (
    <div className={`${colorClasses[color]} rounded-2xl shadow-sm p-6 border`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
      </div>
      <h3 className="text-sm text-neutral-600 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-neutral-800 mb-1">{value}</p>
      {subtitle && <p className="text-xs text-neutral-500">{subtitle}</p>}
    </div>
  );
}
