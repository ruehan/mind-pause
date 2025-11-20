import { User, Bell, Lock, Globe, BarChart3, Info, Settings as SettingsIcon, Bot } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface SettingsNavProps {
  activeSection:
    | "profile"
    | "ai-preference"
    | "notification"
    | "security"
    | "account"
    | "data"
    | "info"
    | "stats";
  onSectionChange: (
    section:
      | "profile"
      | "ai-preference"
      | "notification"
      | "security"
      | "account"
      | "data"
      | "info"
      | "stats"
  ) => void;
}

const navItems: Array<{ id: "profile" | "ai-preference" | "notification" | "security" | "account" | "data" | "info"; icon: LucideIcon; label: string }> = [
  { id: "profile" as const, icon: User, label: "프로필" },
  { id: "ai-preference" as const, icon: Bot, label: "AI 응답 설정" },
  { id: "notification" as const, icon: Bell, label: "알림" },
  { id: "security" as const, icon: Lock, label: "보안" },
  { id: "account" as const, icon: Globe, label: "계정" },
  { id: "data" as const, icon: BarChart3, label: "데이터" },
  { id: "info" as const, icon: Info, label: "정보" },
];

export function SettingsNav({
  activeSection,
  onSectionChange,
}: SettingsNavProps) {
  return (
    <nav className="w-64 bg-neutral-50 border-r border-neutral-200 p-4">
      <h2 className="text-h4 text-neutral-900 mb-4 flex items-center gap-2">
        <SettingsIcon className="w-5 h-5" />
        설정
      </h2>

      <div className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
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
              <Icon className="w-5 h-5" />
              <span className="text-body">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
