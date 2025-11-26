import { useEffect, useState } from "react";
import { Coins, TrendingUp, Calendar, AlertCircle, Sparkles } from "lucide-react";
import { getTokenUsageSummary, upgradeSubscription } from "~/lib/api";
import { Spinner } from "~/components/Spinner";
import { SubscriptionModal } from "~/components/subscription/SubscriptionModal";

interface TokenQuota {
  monthly_limit: number;
  monthly_used: number;
  monthly_remaining: number;
  daily_limit: number;
  daily_used: number;
  daily_remaining: number;
  bonus_tokens: number;
  last_reset_at: string;
}

interface TokenUsageSummary {
  current_month_total: number;
  current_week_total: number;
  today_total: number;
  quota: TokenQuota;
  tier: string;
  tier_name: string;
}

export function TokenUsageCard({ initialData }: { initialData?: TokenUsageSummary }) {
  const [summary, setSummary] = useState<TokenUsageSummary | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (initialData && !summary) {
        setSummary(initialData);
        setLoading(false);
        return;
    }
    
    if (!initialData) {
        loadTokenUsage();
    }
  }, [initialData]);

  const loadTokenUsage = async () => {
    try {
      setLoading(true);
      const data = await getTokenUsageSummary();
      setSummary(data);
      setError(null);
    } catch (err) {
      console.error("토큰 사용량 조회 실패:", err);
      setError("토큰 사용량을 불러올 수 없습니다");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex justify-center">
          <Spinner />
        </div>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center text-gray-500">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>{error || "데이터를 불러올 수 없습니다"}</span>
        </div>
      </div>
    );
  }

  const { quota } = summary;
  const usagePercent = (quota.monthly_used / quota.monthly_limit) * 100;
  const isLowQuota = usagePercent > 80;
  const isCriticalQuota = usagePercent > 95;

  // 리셋까지 남은 일수 계산
  const resetDate = new Date(quota.last_reset_at);
  resetDate.setMonth(resetDate.getMonth() + 1);
  const daysUntilReset = Math.ceil((resetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  // 티어별 색상
  const getTierColor = (tier: string) => {
    switch (tier) {
      case "PREMIUM":
        return "from-violet-500 to-purple-600";
      case "ENTERPRISE":
        return "from-amber-500 to-orange-600";
      default:
        return "from-mint-500 to-primary-600";
    }
  };

  const handleUpgrade = async (tier: "FREE" | "PREMIUM") => {
    try {
      await upgradeSubscription(tier);
      // 성공 시 데이터 새로고침
      await loadTokenUsage();
      alert("플랜이 변경되었습니다!");
    } catch (error) {
      console.error("업그레이드 실패:", error);
      throw error;
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
      {/* 헤더 */}
      <div className={`bg-gradient-to-r ${getTierColor(summary.tier)} p-6 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">이번 달 토큰 사용량</h3>
              <p className="text-sm text-white/80">{summary.tier_name} 플랜</p>
            </div>
          </div>
          {summary.tier === "FREE" && (
            <button 
              onClick={() => setShowModal(true)}
              className="bg-white text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200 text-sm"
            >
              업그레이드 →
            </button>
          )}
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="p-6 space-y-6">
        {/* 프로그레스 바 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              {quota.monthly_used.toLocaleString()} / {quota.monthly_limit.toLocaleString()} 토큰
            </span>
            <span className={`text-sm font-semibold ${
              isCriticalQuota ? "text-red-600" :
              isLowQuota ? "text-orange-600" :
              "text-primary-600"
            }`}>
              {usagePercent.toFixed(1)}%
            </span>
          </div>

          {/* 프로그레스 바 */}
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isCriticalQuota ? "bg-gradient-to-r from-red-500 to-red-600" :
                isLowQuota ? "bg-gradient-to-r from-orange-500 to-orange-600" :
                "bg-gradient-to-r from-primary-500 to-mint-500"
              }`}
              style={{ width: `${Math.min(usagePercent, 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-600">
              잔여: {quota.monthly_remaining.toLocaleString()} 토큰
              {quota.bonus_tokens > 0 && (
                <span className="ml-2 inline-flex items-center text-mint-600">
                  <Sparkles className="w-3 h-3 mr-1" />
                  보너스 +{quota.bonus_tokens.toLocaleString()}
                </span>
              )}
            </span>
            <span className="text-xs text-gray-500">
              {quota.monthly_remaining > 0 ? (
                `({((quota.monthly_remaining / quota.monthly_limit) * 100).toFixed(0)}% 남음)`
              ) : (
                "한도 초과"
              )}
            </span>
          </div>
        </div>

        {/* 경고 메시지 */}
        {isCriticalQuota && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-800">
              <p className="font-medium">토큰이 거의 소진되었습니다!</p>
              <p className="text-xs mt-1">플랜을 업그레이드하거나 다음 달까지 기다려주세요.</p>
            </div>
          </div>
        )}

        {/* 통계 카드 */}
        <div className="grid grid-cols-3 gap-4">
          {/* 오늘 사용량 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-medium text-gray-600">오늘</span>
            </div>
            <p className="text-lg font-bold text-gray-900">
              {summary.today_total.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              한도: {quota.daily_limit.toLocaleString()}
            </p>
          </div>

          {/* 이번 주 사용량 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-medium text-gray-600">이번 주</span>
            </div>
            <p className="text-lg font-bold text-gray-900">
              {summary.current_week_total.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              일평균: {Math.round(summary.current_week_total / 7).toLocaleString()}
            </p>
          </div>

          {/* 리셋 정보 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-medium text-gray-600">리셋</span>
            </div>
            <p className="text-lg font-bold text-gray-900">
              {daysUntilReset}일
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {resetDate.toLocaleDateString("ko-KR", { month: "short", day: "numeric" })}
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* 구독 모달 */}
    <SubscriptionModal
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      currentTier={summary.tier as "FREE" | "PREMIUM"}
      onUpgrade={handleUpgrade}
    />
    </>
  );
}
