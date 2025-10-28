import { useState } from "react";
import { AdminHeader } from "../components/admin/AdminHeader";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import { AdminStatCard } from "../components/admin/AdminStatCard";

export function meta() {
  return [
    { title: "관리자 콘솔 - 마음쉼표" },
    {
      name: "description",
      content: "마음쉼표 관리자 페이지",
    },
  ];
}

// Mock data
const mockStats = {
  users: {
    total: 1234,
    change: 12,
  },
  emotions: {
    total: 5678,
    change: 8,
  },
  community: {
    total: 2345,
    change: 15,
  },
  challenges: {
    total: 890,
    change: 5,
  },
};

const mockMetrics = [
  { label: "신규 가입", value: "156명 (어제)" },
  { label: "감정 기록률", value: "78% (활성 사용자)" },
  { label: "평균 세션 시간", value: "12분" },
  { label: "AI 채팅 사용률", value: "45%" },
  { label: "커뮤니티 참여율", value: "32%" },
];

export default function Admin() {
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <AdminHeader />

      <div className="flex flex-1">
        <AdminSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        <main className="flex-1 p-8">
          {/* Dashboard Section */}
          {activeSection === "dashboard" && (
            <div>
              <h1 className="text-h2 text-neutral-900 mb-6">📊 통계 대시보드</h1>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <AdminStatCard
                  icon="👥"
                  title="총 사용자"
                  value={mockStats.users.total}
                  change={mockStats.users.change}
                />
                <AdminStatCard
                  icon="📝"
                  title="감정 기록수"
                  value={mockStats.emotions.total}
                  change={mockStats.emotions.change}
                />
                <AdminStatCard
                  icon="💬"
                  title="커뮤니티"
                  value={mockStats.community.total}
                  change={mockStats.community.change}
                />
                <AdminStatCard
                  icon="🏆"
                  title="챌린지"
                  value={mockStats.challenges.total}
                  change={mockStats.challenges.change}
                />
              </div>

              {/* DAU Chart Placeholder */}
              <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-8">
                <h2 className="text-h3 text-neutral-900 mb-4">
                  📈 일일 활성 사용자 (DAU)
                </h2>
                <div className="h-64 flex items-center justify-center bg-neutral-50 rounded-lg">
                  <p className="text-neutral-500">차트 영역 (구현 예정)</p>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                <h2 className="text-h3 text-neutral-900 mb-4">📊 주요 지표</h2>
                <ul className="space-y-3">
                  {mockMetrics.map((metric, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-body text-neutral-700"
                    >
                      <span className="text-primary-600">•</span>
                      <span className="font-medium">{metric.label}:</span>
                      <span>{metric.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Other Sections - Coming Soon */}
          {activeSection !== "dashboard" && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-6xl mb-4">🚧</div>
                <h2 className="text-h3 text-neutral-700 mb-2">준비 중입니다</h2>
                <p className="text-body text-neutral-600">
                  {activeSection === "users" && "사용자 관리 기능은 곧 제공될 예정입니다."}
                  {activeSection === "content" && "컨텐츠 관리 기능은 곧 제공될 예정입니다."}
                  {activeSection === "challenges" && "챌린지 관리 기능은 곧 제공될 예정입니다."}
                  {activeSection === "reports" && "신고 관리 기능은 곧 제공될 예정입니다."}
                  {activeSection === "analytics" && "통계/분석 기능은 곧 제공될 예정입니다."}
                  {activeSection === "logs" && "에러 로그 기능은 곧 제공될 예정입니다."}
                  {activeSection === "settings" && "시스템 설정 기능은 곧 제공될 예정입니다."}
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
