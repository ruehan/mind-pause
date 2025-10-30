import { useState } from "react";
import { Link, useLocation } from "react-router";
import {
  Home,
  Heart,
  MessageCircle,
  Trophy,
  Users,
  User,
  LogIn,
  HelpCircle,
  AlertTriangle,
  Shield,
  ChevronLeft,
  ChevronRight,
  Code,
} from "lucide-react";

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { path: "/", label: "홈", icon: Home },
  { path: "/emotion", label: "감정기록", icon: Heart },
  { path: "/chat", label: "AI 채팅", icon: MessageCircle },
  { path: "/challenge", label: "챌린지", icon: Trophy },
  { path: "/community", label: "커뮤니티", icon: Users },
  { path: "/profile", label: "프로필", icon: User },
  { path: "/login", label: "로그인", icon: LogIn },
  { path: "/help", label: "도움말", icon: HelpCircle },
  { path: "/error?type=404", label: "에러", icon: AlertTriangle },
  { path: "/admin", label: "관리자", icon: Shield },
];

export function DevSidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path.split("?")[0]);
  };

  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-neutral-900/95 backdrop-blur-sm border-r border-neutral-700 transition-all duration-300 z-50 ${
        isExpanded ? "w-56" : "w-16"
      }`}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-700">
        {isExpanded && (
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-primary-400" />
            <span className="text-body-sm font-semibold text-white">
              Dev Navigation
            </span>
          </div>
        )}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-lg hover:bg-neutral-800 transition-colors text-neutral-400 hover:text-white"
          title={isExpanded ? "접기" : "펼치기"}
        >
          {isExpanded ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="p-2 overflow-y-auto h-[calc(100vh-4rem)]">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  active
                    ? "bg-primary-600 text-white shadow-lg"
                    : "text-neutral-300 hover:bg-neutral-800 hover:text-white"
                }`}
                title={!isExpanded ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isExpanded && (
                  <span className="text-body-sm font-medium">{item.label}</span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Footer Note */}
        {isExpanded && (
          <div className="mt-6 px-3 py-2 text-caption text-neutral-500 border-t border-neutral-700">
            <p className="mb-1">🚧 개발 전용</p>
            <p>배포 시 제거 예정</p>
          </div>
        )}
      </nav>
    </div>
  );
}
