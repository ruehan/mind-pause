import { useState, useEffect } from "react";
import { AppLayout } from "../components/AppLayout";
import { useAuth } from "../contexts/AuthContext";
import { StatCard } from "../components/dashboard/StatCard";
import { AchievementBadge } from "../components/dashboard/AchievementBadge";
import { ActivityStatsCard } from "../components/dashboard/ActivityStatsCard";
import { RecentActivityTimeline } from "../components/dashboard/RecentActivityTimeline";
import { FeedbackStatsCard } from "../components/dashboard/FeedbackStatsCard";
import { FileText, Flame, MessageCircle, Trophy, Heart, BarChart3 } from "lucide-react";
import { getUserDashboard, type UserDashboard as UserDashboardData } from "../lib/api";

export function meta() {
  return [
    { title: "마음 대시보드 - 마음쉼표" },
    {
      name: "description",
      content: "나의 감정 변화와 성장을 한눈에 확인해보세요",
    },
  ];
}

export default function Dashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<UserDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  // 대시보드 데이터 로드
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

  // 실제 데이터 기반 성과 계산
  const getAchievements = () => {
    if (!dashboardData) return [];

    const achievements = [];
    const { summary } = dashboardData;

    // 연속 기록 달성
    if (summary.current_best_streak >= 7) {
      achievements.push({
        icon: Flame,
        value: `${summary.current_best_streak}일 연속`,
        label: "기록 달성"
      });
    }

    // 감정 기록
    if (summary.total_emotion_logs > 0) {
      achievements.push({
        icon: FileText,
        value: `${summary.total_emotion_logs}회`,
        label: "감정 기록"
      });
    }

    // AI 대화
    if (summary.total_conversations > 0) {
      achievements.push({
        icon: MessageCircle,
        value: `${summary.total_conversations}회`,
        label: "AI 대화"
      });
    }

    // 공감 받음
    if (summary.total_likes_received > 0) {
      achievements.push({
        icon: Heart,
        value: `${summary.total_likes_received}개`,
        label: "공감 받음"
      });
    }

    // 챌린지 완료
    if (summary.completed_challenges > 0) {
      achievements.push({
        icon: Trophy,
        value: `${summary.completed_challenges}개`,
        label: "챌린지 완료"
      });
    }

    // 커뮤니티 활동
    if (summary.total_posts + summary.total_comments > 0) {
      achievements.push({
        icon: BarChart3,
        value: `${summary.total_posts + summary.total_comments}개`,
        label: "커뮤니티 활동"
      });
    }

    return achievements;
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-body text-neutral-600">대시보드 로딩 중...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="bg-gradient-to-br from-primary-50 via-white to-lavender-50 relative -mx-4 sm:-mx-6 lg:-mx-8 -my-6 px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
        {/* Mesh Gradient Overlay */}
        <div className="absolute inset-0 gradient-mesh opacity-20 animate-gradient bg-[length:200%_200%] pointer-events-none"></div>

        <div className="relative z-10">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">📊</span>
            <div>
              <h1 className="text-h2 text-neutral-900">
                {user?.nickname ? `안녕하세요, ${user.nickname}님!` : '마음 대시보드'}
              </h1>
              <p className="text-body text-neutral-600 mt-1">
                나의 감정 변화와 성장을 한눈에 확인해보세요
              </p>
            </div>
          </div>
        </div>

        {/* Date Range Selector - 향후 기능 추가 예정 */}

        {/* Summary Stats Row */}
        {dashboardData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <StatCard
              icon={FileText}
              title="감정 기록"
              value={`${dashboardData.summary.total_emotion_logs}회`}
              subtitle={`이번 주: ${dashboardData.summary.emotion_logs_this_week}회`}
              trend={`이번 달: ${dashboardData.summary.emotion_logs_this_month}회`}
            />
            <StatCard
              icon={MessageCircle}
              title="커뮤니티 활동"
              value={`${dashboardData.summary.total_posts + dashboardData.summary.total_comments}개`}
              subtitle={`게시글: ${dashboardData.summary.total_posts} · 댓글: ${dashboardData.summary.total_comments}`}
              trend={`❤️ ${dashboardData.summary.total_likes_received}개 받음`}
            />
            <StatCard
              icon={Flame}
              title="챌린지 연속 기록"
              value={dashboardData.summary.current_best_streak > 0 ? `${dashboardData.summary.current_best_streak}일 연속` : "기록 없음"}
              subtitle={`진행 중: ${dashboardData.summary.active_challenges}개`}
              trend={`완료: ${dashboardData.summary.completed_challenges}개 🏆`}
            />
          </div>
        )}

        {/* Emotion Trend Chart - 향후 차트 데이터 API 추가 예정 */}

        {/* Three-Column Grid - 향후 기능 추가 예정 */}

        {/* Two-Column Analytics - 향후 감정 분석 기능 추가 예정 */}

        {/* AI Insights Card - 향후 AI 분석 기능 추가 예정 */}

        {/* Monthly Achievements Grid */}
        {dashboardData && getAchievements().length > 0 && (
          <div className="glass rounded-xl shadow-soft hover:shadow-elevation-3 transition-all duration-300 p-6 border border-white/20 mb-6">
            <h2 className="text-h4 text-neutral-900 mb-6 flex items-center gap-2">
              🏅 이번 달 성과
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {getAchievements().map((achievement, index) => (
                <AchievementBadge
                  key={index}
                  icon={achievement.icon}
                  value={achievement.value}
                  label={achievement.label}
                />
              ))}
            </div>
          </div>
        )}

        {/* Activity Stats Card */}
        {dashboardData && (
          <div className="mb-6">
            <ActivityStatsCard summary={dashboardData.summary} />
          </div>
        )}

        {/* Feedback Stats Card */}
        <div className="mb-6">
          <FeedbackStatsCard />
        </div>

        {/* Recent Activity Timeline */}
        {dashboardData && (
          <div className="mb-6">
            <RecentActivityTimeline activities={dashboardData.recent_activities} />
          </div>
        )}
        </div>
      </div>
    </AppLayout>
  );
}
