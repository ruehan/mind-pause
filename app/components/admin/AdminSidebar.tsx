interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function AdminSidebar({
  activeSection,
  onSectionChange,
}: AdminSidebarProps) {
  const menuItems = [
    { id: "dashboard", icon: "📊", label: "대시보드" },
    { id: "users", icon: "👥", label: "사용자 관리" },
    { id: "content", icon: "💬", label: "컨텐츠 관리" },
    { id: "challenges", icon: "🏆", label: "챌린지 관리" },
    { id: "reports", icon: "⚠️", label: "신고 관리" },
    { id: "analytics", icon: "📈", label: "통계/분석" },
    { id: "logs", icon: "🐛", label: "에러 로그" },
    { id: "settings", icon: "⚙️", label: "시스템 설정" },
  ];

  return (
    <aside className="w-64 bg-neutral-800 text-white min-h-screen">
      <div className="p-4">
        <h2 className="text-h4 mb-4 flex items-center gap-2">
          📊 대시보드
        </h2>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`
                w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3
                ${
                  activeSection === item.id
                    ? "bg-neutral-700 border-l-4 border-primary-500"
                    : "hover:bg-neutral-700/50"
                }
              `}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}
