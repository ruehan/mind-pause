import { useState } from "react";
import { AdminHeader } from "../components/admin/AdminHeader";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import { AdminStatCard } from "../components/admin/AdminStatCard";
import { UserManagementTable } from "../components/admin/UserManagementTable";
import { ContentModerationPanel } from "../components/admin/ContentModerationPanel";
import { NotificationSender } from "../components/admin/NotificationSender";
import { ActivityChart } from "../components/admin/ActivityChart";
import { LogViewer } from "../components/admin/LogViewer";
import { Users, FileText, MessageSquare, Trophy } from "lucide-react";

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

// Mock DAU data
const mockDAUData = [
  { date: "1/1", value: 450 },
  { date: "1/2", value: 520 },
  { date: "1/3", value: 480 },
  { date: "1/4", value: 610 },
  { date: "1/5", value: 580 },
  { date: "1/6", value: 630 },
  { date: "1/7", value: 720 },
  { date: "1/8", value: 690 },
  { date: "1/9", value: 710 },
  { date: "1/10", value: 780 },
  { date: "1/11", value: 750 },
  { date: "1/12", value: 820 },
  { date: "1/13", value: 790 },
  { date: "1/14", value: 850 },
];

// Mock users data
const mockUsers = [
  {
    id: "1",
    name: "김민수",
    email: "minsu@example.com",
    joinDate: "2024-01-10",
    status: "active" as const,
    emotionLogs: 45,
    lastActive: "2시간 전",
  },
  {
    id: "2",
    name: "이지은",
    email: "jieun@example.com",
    joinDate: "2024-01-08",
    status: "active" as const,
    emotionLogs: 32,
    lastActive: "1일 전",
  },
  {
    id: "3",
    name: "박서준",
    email: "seojun@example.com",
    joinDate: "2024-01-05",
    status: "inactive" as const,
    emotionLogs: 12,
    lastActive: "7일 전",
  },
  {
    id: "4",
    name: "최유진",
    email: "yujin@example.com",
    joinDate: "2024-01-12",
    status: "active" as const,
    emotionLogs: 28,
    lastActive: "3시간 전",
  },
  {
    id: "5",
    name: "정하늘",
    email: "haneul@example.com",
    joinDate: "2023-12-20",
    status: "banned" as const,
    emotionLogs: 5,
    lastActive: "15일 전",
  },
];

// Mock reports data
const mockReports = [
  {
    id: "r1",
    contentType: "post" as const,
    contentId: "post123",
    contentPreview: "이 게시글은 부적절한 내용을 포함하고 있습니다...",
    reportReason: "욕설 및 비방",
    reportCount: 5,
    reportedBy: ["user1@email.com", "user2@email.com", "user3@email.com"],
    status: "pending" as const,
    createdAt: "2024-01-15 14:30",
  },
  {
    id: "r2",
    contentType: "comment" as const,
    contentId: "comment456",
    contentPreview: "스팸성 광고 댓글입니다. 클릭하세요!",
    reportReason: "스팸/광고",
    reportCount: 3,
    reportedBy: ["user4@email.com", "user5@email.com"],
    status: "pending" as const,
    createdAt: "2024-01-15 12:15",
  },
  {
    id: "r3",
    contentType: "post" as const,
    contentId: "post789",
    contentPreview: "개인정보가 노출된 게시글입니다.",
    reportReason: "개인정보 노출",
    reportCount: 8,
    reportedBy: ["user6@email.com", "user7@email.com"],
    status: "approved" as const,
    createdAt: "2024-01-14 18:45",
  },
];

// Mock logs data
const mockLogs = [
  {
    id: "l1",
    timestamp: "2024-01-15 15:30:25",
    level: "error" as const,
    message: "Database connection timeout",
    source: "API Server",
    details: "Connection to database 'mindpause_db' timed out after 30 seconds",
  },
  {
    id: "l2",
    timestamp: "2024-01-15 15:28:10",
    level: "warning" as const,
    message: "High memory usage detected",
    source: "System Monitor",
    details: "Memory usage: 85% (3.4GB / 4GB)",
  },
  {
    id: "l3",
    timestamp: "2024-01-15 15:25:00",
    level: "info" as const,
    message: "User authentication successful",
    source: "Auth Service",
  },
  {
    id: "l4",
    timestamp: "2024-01-15 15:20:45",
    level: "critical" as const,
    message: "Payment gateway API failure",
    source: "Payment Service",
    details: "Failed to process payment for order #12345",
  },
  {
    id: "l5",
    timestamp: "2024-01-15 15:15:30",
    level: "info" as const,
    message: "Scheduled backup completed",
    source: "Backup Service",
  },
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
                  icon={Users}
                  title="총 사용자"
                  value={mockStats.users.total}
                  change={mockStats.users.change}
                />
                <AdminStatCard
                  icon={FileText}
                  title="감정 기록수"
                  value={mockStats.emotions.total}
                  change={mockStats.emotions.change}
                />
                <AdminStatCard
                  icon={MessageSquare}
                  title="커뮤니티"
                  value={mockStats.community.total}
                  change={mockStats.community.change}
                />
                <AdminStatCard
                  icon={Trophy}
                  title="챌린지"
                  value={mockStats.challenges.total}
                  change={mockStats.challenges.change}
                />
              </div>

              {/* DAU Chart */}
              <div className="mb-8">
                <ActivityChart data={mockDAUData} />
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

          {/* Users Section */}
          {activeSection === "users" && (
            <div>
              <h1 className="text-h2 text-neutral-900 mb-6">👥 사용자 관리</h1>
              <UserManagementTable users={mockUsers} />
            </div>
          )}

          {/* Reports Section */}
          {activeSection === "reports" && (
            <div>
              <h1 className="text-h2 text-neutral-900 mb-6">🚨 신고 관리</h1>
              <ContentModerationPanel reports={mockReports} />
            </div>
          )}

          {/* Analytics Section */}
          {activeSection === "analytics" && (
            <div>
              <h1 className="text-h2 text-neutral-900 mb-6">📊 통계 및 분석</h1>
              <div className="space-y-6">
                <ActivityChart data={mockDAUData} title="일일 활성 사용자 (DAU)" />
                <ActivityChart
                  data={mockDAUData.map((d) => ({ ...d, value: Math.round(d.value * 0.7) }))}
                  title="일일 감정 기록 수"
                />
              </div>
            </div>
          )}

          {/* Logs Section */}
          {activeSection === "logs" && (
            <div>
              <h1 className="text-h2 text-neutral-900 mb-6">📋 로그 관리</h1>
              <LogViewer logs={mockLogs} />
            </div>
          )}

          {/* Settings Section */}
          {activeSection === "settings" && (
            <div>
              <h1 className="text-h2 text-neutral-900 mb-6">⚙️ 시스템 설정</h1>
              <div className="space-y-6">
                <NotificationSender />
                <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
                  <h2 className="text-h3 text-neutral-900 mb-4">기타 설정</h2>
                  <p className="text-body text-neutral-600">
                    추가 시스템 설정 기능은 곧 제공될 예정입니다.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Other Sections - Coming Soon */}
          {!["dashboard", "users", "reports", "analytics", "logs", "settings"].includes(activeSection) && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-6xl mb-4">🚧</div>
                <h2 className="text-h3 text-neutral-700 mb-2">준비 중입니다</h2>
                <p className="text-body text-neutral-600">
                  {activeSection === "content" && "컨텐츠 관리 기능은 곧 제공될 예정입니다."}
                  {activeSection === "challenges" && "챌린지 관리 기능은 곧 제공될 예정입니다."}
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
