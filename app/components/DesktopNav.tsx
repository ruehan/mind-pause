import { Link, useLocation } from "react-router";
import { Home, Heart, MessageCircle, Trophy, User, Settings, Users, HelpCircle, BarChart3 } from "lucide-react";

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { path: "/", label: "홈", icon: Home },
  { path: "/dashboard", label: "대시보드", icon: BarChart3 },
  { path: "/emotion", label: "감정기록", icon: Heart },
  { path: "/chat", label: "AI 채팅", icon: MessageCircle },
  { path: "/community", label: "커뮤니티", icon: Users },
  { path: "/challenge", label: "챌린지", icon: Trophy },
  { path: "/help", label: "도움말", icon: HelpCircle },
  { path: "/profile", label: "프로필", icon: User },
];

export function DesktopNav() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-white border-r border-neutral-200 flex-col shadow-elevation-1 z-40">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-neutral-200">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-lavender-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-xl font-bold">,</span>
          </div>
          <span className="text-h5 font-bold text-neutral-900">마음쉼표</span>
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  active
                    ? "bg-primary-50 text-primary-700 shadow-sm"
                    : "text-neutral-700 hover:bg-neutral-50 hover:text-primary-600"
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-all duration-200 ${
                    active
                      ? "text-primary-600 scale-110"
                      : "text-neutral-500 group-hover:text-primary-600 group-hover:scale-105"
                  }`}
                />
                <span className="text-body font-medium">{item.label}</span>
                {active && (
                  <div className="ml-auto w-1.5 h-1.5 bg-primary-600 rounded-full animate-pulse"></div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-neutral-200">
        <Link
          to="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-700 hover:bg-neutral-50 hover:text-primary-600 transition-all duration-200 group"
        >
          <Settings className="w-5 h-5 text-neutral-500 group-hover:text-primary-600 transition-colors" />
          <span className="text-body font-medium">설정</span>
        </Link>
      </div>
    </aside>
  );
}
