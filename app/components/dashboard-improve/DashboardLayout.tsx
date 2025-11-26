import { Link, useLocation } from "react-router";
import { 
  LayoutDashboard, 
  BarChart3, 
  MessageCircle, 
  Trophy, 
  Settings, 
  LogOut, 
  Bell,
  Search,
  Menu,
  X,
  Heart,
  HelpCircle
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "~/contexts/AuthContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigation = [
    { name: "대시보드", href: "/dashboard", icon: LayoutDashboard },
    { name: "감정 기록", href: "/emotion", icon: Heart },
    { name: "마음 대화", href: "/chat", icon: MessageCircle },
    { name: "커뮤니티", href: "/community", icon: MessageCircle },
    { name: "챌린지", href: "/challenge", icon: Trophy },
    { name: "설정", href: "/profile", icon: Settings },
  ];

  return (
    <div className="h-screen bg-neutral-50 flex overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-neutral-200 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-neutral-100">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="마음쉼표 로고" className="w-14 h-14 rounded-lg" />
              <span className="text-xl font-bold text-neutral-900 tracking-tight">마음쉼표</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? "bg-primary-50 text-primary-600 font-medium shadow-sm" 
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? "text-primary-600" : "text-neutral-400"}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Logout */}
          <div className="p-4 border-t border-neutral-100">
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold overflow-hidden">
                {user?.profile_image_url ? (
                  <img src={user.profile_image_url} alt={user.nickname} className="w-full h-full object-cover" />
                ) : (
                  user?.nickname?.[0] || "U"
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 truncate">
                  {user?.nickname || "사용자"}
                </p>
                <p className="text-xs text-neutral-500 truncate">
                  {user?.is_anonymous ? "게스트 계정" : (user?.email || "이메일 없음")}
                </p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              로그아웃
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-neutral-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
            <div className="flex items-center gap-4">
              <button 
                className="lg:hidden p-2 -ml-2 text-neutral-500 hover:text-neutral-700"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
              
              {/* Search Bar (Optional) */}
              <div className="hidden md:flex items-center relative">
                <Search className="absolute left-3 w-4 h-4 text-neutral-400" />
                <input 
                  type="text" 
                  placeholder="검색..." 
                  className="pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all w-64"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link 
                to="/qna_dashboard"
                className="p-2 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
                title="자주 묻는 질문"
              >
                <HelpCircle className="w-5 h-5" />
              </Link>
              <button className="relative p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50 rounded-full transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
