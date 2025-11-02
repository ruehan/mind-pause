import { Link, useLocation } from "react-router";
import { Heart, MessageCircle, Trophy, User, Users } from "lucide-react";

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { path: "/emotion", label: "감정기록", icon: Heart },
  { path: "/chat", label: "AI 채팅", icon: MessageCircle },
  { path: "/community", label: "커뮤니티", icon: Users },
  { path: "/challenge", label: "챌린지", icon: Trophy },
  { path: "/profile", label: "프로필", icon: User },
];

export function BottomNav() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200 shadow-elevation-2">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 ${
                active
                  ? "text-primary-600"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-6 h-6 transition-all duration-200 ${
                    active ? "scale-110" : "scale-100"
                  }`}
                />
                {active && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary-600 rounded-full animate-pulse"></div>
                )}
              </div>
              <span
                className={`text-xs mt-1 font-medium transition-all duration-200 ${
                  active ? "opacity-100" : "opacity-70"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Active indicator bar */}
      <div
        className="absolute top-0 left-0 h-0.5 bg-primary-600 transition-all duration-300 ease-out"
        style={{
          width: `${100 / navItems.length}%`,
          transform: `translateX(${
            navItems.findIndex((item) => isActive(item.path)) * 100
          }%)`,
        }}
      ></div>
    </nav>
  );
}
