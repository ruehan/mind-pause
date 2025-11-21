import { User, Sparkles, BarChart3, Bell, Shield, Database, Info } from "lucide-react";

interface SettingsNavProps {
  activeSection: string;
  onSectionChange: (section: any) => void;
}

export function SettingsNav({ activeSection, onSectionChange }: SettingsNavProps) {
  const menuItems = [
    { id: "profile", label: "프로필", icon: User },
    { id: "stats", label: "통계", icon: BarChart3 },
    { id: "notification", label: "알림", icon: Bell },
    { id: "security", label: "보안", icon: Shield },
    { id: "data", label: "데이터", icon: Database },
    { id: "info", label: "정보", icon: Info },
  ];

  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
      <nav className="flex items-center gap-2 min-w-max">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-200 border
              ${activeSection === item.id
                ? "bg-neutral-900 text-white border-neutral-900 shadow-lg shadow-neutral-900/20 font-bold"
                : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300"
              }
            `}
          >
            <item.icon className={`w-4 h-4 ${activeSection === item.id ? "text-white" : "text-neutral-400"}`} />
            <span className="text-sm whitespace-nowrap">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
