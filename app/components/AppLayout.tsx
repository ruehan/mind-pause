import type { ReactNode } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { DesktopNav } from "./DesktopNav";
import { BottomNav } from "./BottomNav";
import { useAuth } from "../contexts/AuthContext";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // 로딩이 완료되고 사용자가 없으면 홈페이지로 리다이렉트
    if (!isLoading && !user) {
      navigate("/");
    }
  }, [user, isLoading, navigate]);

  // 로딩 중이거나 인증되지 않은 상태면 로딩 표시
  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-body text-neutral-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // 리다이렉트 중에는 아무것도 렌더링하지 않음
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Desktop Navigation */}
      <DesktopNav />

      {/* Main Content */}
      <main className="md:ml-64 pb-16 md:pb-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
