import { useState, useEffect } from "react";
import { DashboardLayout } from "~/components/dashboard-improve/DashboardLayout";
import { OverviewStats } from "~/components/dashboard-improve/OverviewStats";
import { EmotionChart } from "~/components/dashboard-improve/EmotionChart";
import { RecentActivityFeed } from "~/components/dashboard-improve/RecentActivityFeed";
import { FeedbackStatsCard } from "~/components/dashboard-improve/FeedbackStatsCard";
import { TokenUsageCard } from "~/components/dashboard-improve/TokenUsageCard";
import { getUserDashboard, type UserDashboard as UserDashboardData } from "~/lib/api";
import { useAuth } from "~/contexts/AuthContext";
import { Spinner } from "~/components/Spinner";
import type { Route } from "./+types/dashboard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "대시보드 - 마음쉼표" },
    { name: "description", content: "나의 감정 변화와 성장을 한눈에 확인해보세요" },
  ];
}

export default function DashboardImprove() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<UserDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const data = await getUserDashboard();
        setDashboardData(data);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[calc(100vh-100px)]">
          <Spinner size="lg" variant="breathing" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">
            반가워요, {user?.nickname || "사용자"}님! 👋
          </h1>
          <p className="text-neutral-600 mt-2">
            오늘도 마음 챙김을 위한 여정을 함께해요.
          </p>
        </div>

        {/* Overview Stats */}
        {dashboardData && <OverviewStats summary={dashboardData.summary} />}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (Chart) */}
          <div className="lg:col-span-2 h-96">
            <EmotionChart initialData={dashboardData?.emotion_trend} />
          </div>

          {/* Right Column (Activity Feed) */}
          <div className="lg:col-span-1">
            {dashboardData && <RecentActivityFeed activities={dashboardData.recent_activities} />}
          </div>
        </div>

        {/* Feedback Stats Section */}
        <FeedbackStatsCard initialData={dashboardData?.feedback_stats} />

        {/* Token Usage Section */}
        <TokenUsageCard initialData={dashboardData?.token_usage} />
      </div>
    </DashboardLayout>
  );
}
