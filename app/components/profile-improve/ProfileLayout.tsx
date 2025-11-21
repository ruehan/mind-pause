import type { ReactNode } from "react";

interface ProfileLayoutProps {
  children: ReactNode;
}

export function ProfileLayout({ children }: ProfileLayoutProps) {
  return (
    <div className="relative min-h-full w-full">
      {/* Premium Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] right-[10%] w-[600px] h-[600px] bg-gradient-to-br from-primary-100/30 to-lavender-100/30 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-[10%] left-[10%] w-[500px] h-[500px] bg-gradient-to-tr from-mint-100/30 to-blue-100/30 rounded-full blur-3xl animate-pulse-slower" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 lg:p-8 max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
}
