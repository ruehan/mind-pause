import type { ReactNode } from "react";
import { DesktopNav } from "./DesktopNav";
import { BottomNav } from "./BottomNav";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
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
