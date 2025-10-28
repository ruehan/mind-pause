interface SettingsNavProps {
  activeSection:
    | "profile"
    | "notification"
    | "security"
    | "account"
    | "data"
    | "info";
  onSectionChange: (
    section:
      | "profile"
      | "notification"
      | "security"
      | "account"
      | "data"
      | "info"
  ) => void;
}

const navItems = [
  { id: "profile" as const, icon: "👤", label: "프로필" },
  { id: "notification" as const, icon: "🔔", label: "알림" },
  { id: "security" as const, icon: "🔒", label: "보안" },
  { id: "account" as const, icon: "🌐", label: "계정" },
  { id: "data" as const, icon: "📊", label: "데이터" },
  { id: "info" as const, icon: "ℹ️", label: "정보" },
];

export function SettingsNav({
  activeSection,
  onSectionChange,
}: SettingsNavProps) {
  return (
    <nav className="w-64 bg-neutral-50 border-r border-neutral-200 p-4">
      <h2 className="text-h4 text-neutral-900 mb-4 flex items-center gap-2">
        ⚙️ 설정
      </h2>

      <div className="space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`
              w-full flex items-center gap-3 p-4 rounded-lg text-left transition-all
              ${
                activeSection === item.id
                  ? "bg-white border-l-4 border-primary-500 font-semibold text-neutral-900 shadow-sm"
                  : "text-neutral-700 hover:bg-white hover:text-neutral-900"
              }
            `}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-body">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
