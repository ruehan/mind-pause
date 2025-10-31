import { useState } from "react";
import { AppLayout } from "../components/AppLayout";
import { StatCard } from "../components/dashboard/StatCard";
import { EmotionChart } from "../components/dashboard/EmotionChart";
import { AIInsightCard } from "../components/dashboard/AIInsightCard";
import { AchievementBadge } from "../components/dashboard/AchievementBadge";
import { RecentChatCard } from "../components/dashboard/RecentChatCard";
import { ChallengeProgressCard } from "../components/dashboard/ChallengeProgressCard";
import { TodayTasksWidget } from "../components/dashboard/TodayTasksWidget";
import { Smile, FileText, Flame, MessageCircle, Trophy, BarChart3, Target, TrendingUp, Heart } from "lucide-react";

export function meta() {
  return [
    { title: "마음 대시보드 - 마음쉼표" },
    {
      name: "description",
      content: "나의 감정 변화와 성장을 한눈에 확인해보세요",
    },
  ];
}

// Mock data
const mockChartData = [
  { date: "1/8", value: 0 },
  { date: "1/10", value: -1 },
  { date: "1/12", value: 1 },
  { date: "1/14", value: 2 },
  { date: "1/16", value: 3 },
  { date: "1/18", value: 2 },
  { date: "1/20", value: 4 },
];

const mockEmotionFrequency = [
  { emoji: "😊", label: "좋음", count: 8 },
  { emoji: "🙂", label: "조금 좋음", count: 7 },
  { emoji: "😐", label: "보통", count: 5 },
  { emoji: "😢", label: "안좋음", count: 3 },
];

const mockActivitySummary = [
  { icon: MessageCircle, label: "AI 대화", count: 12 },
  { icon: FileText, label: "커뮤니티 글", count: 5 },
  { icon: Heart, label: "공감 보냄", count: 34 },
  { icon: Trophy, label: "챌린지 완료", count: 3 },
  { icon: BarChart3, label: "성찰 일기", count: 18 },
];

const mockAchievements = [
  { icon: Flame, value: "7일 연속", label: "기록 달성" },
  { icon: FileText, value: "23일 기록", label: "목표 달성" },
  { icon: MessageCircle, value: "12회 대화", label: "AI 코칭" },
  { icon: Heart, value: "34회 공감", label: "나눔 실천" },
  { icon: Target, value: "3개 완료", label: "챌린지" },
  { icon: TrendingUp, value: "+0.5점", label: "감정 향상" },
];

const mockRecentChats = [
  {
    id: "1",
    title: "오늘의 스트레스 대처법",
    summary: "업무 스트레스에 대해 이야기했어요. AI 코치가 호흡 명상을 추천했습니다.",
    date: "2시간 전",
    emotionChange: "+1.5",
  },
  {
    id: "2",
    title: "주말 계획 세우기",
    summary: "즐거운 주말을 보내기 위한 활동들을 함께 계획했어요.",
    date: "어제",
    emotionChange: "+2.0",
  },
  {
    id: "3",
    title: "불안감 해소하기",
    summary: "앞으로의 일에 대한 불안감을 나누고 긍정적 시각을 찾았어요.",
    date: "2일 전",
    emotionChange: "+0.8",
  },
];

const mockChallenges = [
  {
    id: "1",
    title: "아침 명상 루틴",
    progress: 5,
    total: 7,
    streak: 5,
    category: "명상",
  },
  {
    id: "2",
    title: "30분 산책하기",
    progress: 3,
    total: 7,
    streak: 3,
    category: "운동",
  },
];

const mockTodayTasks = [
  {
    id: "1",
    title: "아침 명상 5분",
    type: "challenge" as const,
    completed: true,
  },
  {
    id: "2",
    title: "30분 산책하기",
    type: "challenge" as const,
    completed: false,
    time: "오후 6시",
  },
  {
    id: "3",
    title: "오늘의 감정 기록",
    type: "reminder" as const,
    completed: false,
    time: "오후 9시",
  },
];

export default function Dashboard() {
  const [activeFilter, setActiveFilter] = useState<
    "7d" | "30d" | "90d" | "all"
  >("30d");

  const filters = [
    { id: "7d" as const, label: "7일" },
    { id: "30d" as const, label: "30일" },
    { id: "90d" as const, label: "90일" },
    { id: "all" as const, label: "전체" },
  ];

  const handleExport = () => {
    console.log("Export data");
    // TODO: Implement export functionality
  };

  const handleViewInsight = () => {
    console.log("View insight detail");
    // TODO: Navigate to insight detail page
  };

  const handleAchievementClick = () => {
    console.log("Achievement clicked");
    // TODO: Show achievement detail modal
  };

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
              <h1 className="text-h2 text-neutral-900">마음 대시보드</h1>
              <p className="text-body text-neutral-600 mt-1">
                나의 감정 변화와 성장을 한눈에 확인해보세요
              </p>
            </div>
          </div>
        </div>

        {/* Date Range Selector */}
        <div className="glass rounded-lg shadow-soft hover:shadow-elevation-2 transition-all duration-300 p-4 mb-6 border border-white/20">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${activeFilter === filter.id
                      ? "bg-primary-500 text-white shadow-sm"
                      : "text-neutral-700 hover:bg-neutral-100"
                    }
                  `}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <span className="text-sm text-neutral-600">2024년 1월</span>
          </div>
        </div>

        {/* Summary Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard
            icon={Smile}
            title="평균 감정 점수"
            value="+2.3"
            subtitle="이번 달: +2.3"
            trend="지난 달: +1.8"
          />
          <StatCard
            icon={FileText}
            title="기록 일수"
            value="23일"
            subtitle="이번 달: 23/31"
            trend="목표: 25일"
          />
          <StatCard
            icon={Flame}
            title="연속 기록"
            value="7일 연속"
            subtitle="최고 기록: 14일"
            trend="현재: 7일 🔥"
          />
        </div>

        {/* Emotion Trend Chart */}
        <div className="mb-6">
          <EmotionChart data={mockChartData} onExport={handleExport} />
        </div>

        {/* Three-Column Grid: Today Tasks, Recent Chats, Challenge Progress */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <TodayTasksWidget
            tasks={mockTodayTasks}
            onTaskToggle={(taskId) => console.log("Task toggled:", taskId)}
          />
          <RecentChatCard
            chats={mockRecentChats}
            onViewAll={() => console.log("View all chats")}
          />
          <ChallengeProgressCard
            challenges={mockChallenges}
            onViewAll={() => console.log("View all challenges")}
          />
        </div>

        {/* Two-Column Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Emotion Frequency Card */}
          <div className="glass rounded-xl shadow-soft hover:shadow-elevation-3 transition-all duration-300 transform hover:-translate-y-1 p-6 border border-white/20">
            <h2 className="text-h4 text-neutral-900 mb-4 flex items-center gap-2">
              🎯 자주 느낀 감정
            </h2>
            <div className="space-y-3">
              {mockEmotionFrequency.map((emotion, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{emotion.emoji}</span>
                    <span className="text-body text-neutral-700">
                      {emotion.label}
                    </span>
                  </div>
                  <span className="text-body font-semibold text-neutral-900">
                    {emotion.count}회
                  </span>
                </div>
              ))}
            </div>
            <button className="mt-4 text-body-sm text-primary-600 hover:text-primary-700 font-medium transition-colors">
              감정 패턴 분석 →
            </button>
          </div>

          {/* Activity Summary Card */}
          <div className="glass rounded-xl shadow-soft hover:shadow-elevation-3 transition-all duration-300 transform hover:-translate-y-1 p-6 border border-white/20">
            <h2 className="text-h4 text-neutral-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-primary-600 animate-float" />
              활동 요약
            </h2>
            <div className="space-y-3">
              {mockActivitySummary.map((activity, index) => {
                const ActivityIcon = activity.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <ActivityIcon className="w-5 h-5 text-primary-600" />
                      <span className="text-body text-neutral-700">
                        {activity.label}
                      </span>
                    </div>
                    <span className="text-body font-semibold text-neutral-900">
                      {activity.count}회
                    </span>
                  </div>
                );
              })}
            </div>
            <button className="mt-4 text-body-sm text-primary-600 hover:text-primary-700 font-medium transition-colors">
              활동 상세 →
            </button>
          </div>
        </div>

        {/* AI Insights Card */}
        <div className="mb-6">
          <AIInsightCard
            weeklyChange={{
              icon: Target,
              title: "이번 주 변화",
              content:
                "지난 주보다 평균 감정 점수가 +0.5점 상승했어요! 특히 주말에 감정이 긍정적으로 변화했네요.",
            }}
            pattern={{
              icon: BarChart3,
              title: "패턴 발견",
              content:
                "평일 오후 시간대에 감정이 낮아지는 경향이 있어요.\n💡 제안: 오후 3시에 5분 명상 루틴을 추천드립니다.",
            }}
            achievement={{
              icon: Trophy,
              title: "성취",
              content:
                "7일 연속 기록 달성! 꾸준한 자기 돌봄을 실천하고 계시네요 👏",
            }}
            onViewDetail={handleViewInsight}
          />
        </div>

        {/* Monthly Achievements Grid */}
        <div className="glass rounded-xl shadow-soft hover:shadow-elevation-3 transition-all duration-300 p-6 border border-white/20">
          <h2 className="text-h4 text-neutral-900 mb-6 flex items-center gap-2">
            🏅 이번 달 성과
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {mockAchievements.map((achievement, index) => (
              <AchievementBadge
                key={index}
                icon={achievement.icon}
                value={achievement.value}
                label={achievement.label}
                onClick={handleAchievementClick}
              />
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
