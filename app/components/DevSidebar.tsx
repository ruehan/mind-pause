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
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path.split("?")[0]);
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-16 bg-neutral-900/95 backdrop-blur-sm border-r border-neutral-700 transition-all duration-300 z-50">
      {/* Header */}
      <div className="h-16 flex items-center justify-center border-b border-neutral-700">
        <Code className="w-5 h-5 text-primary-400" />
      </div>

      {/* Navigation Items */}
      <nav className="p-2 overflow-y-auto h-[calc(100vh-4rem)]">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <div key={item.path} className="relative group">
                <Link
                  to={item.path}
                  className={`flex items-center justify-center px-3 py-2.5 rounded-lg transition-all ${
                    active
                      ? "bg-primary-600 text-white shadow-lg"
                      : "text-neutral-300 hover:bg-neutral-800 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </Link>

                {/* Tooltip */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-body-sm font-medium rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-lg z-[60]">
                  {item.label}
                  {/* Arrow */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-primary-600"></div>
                </div>
              </div>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
