import React from "react";
import { Header } from "~/components/Header";
import { Footer } from "~/components/Footer";

interface EmotionLayoutProps {
  children: React.ReactNode;
}

export function EmotionLayout({ children }: EmotionLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 font-sans text-neutral-900">
      <Header />
      
      <main className="flex-grow relative">
        {/* Background Elements */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary-200/30 rounded-full blur-[100px] animate-float" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-lavender-200/30 rounded-full blur-[120px] animate-float" style={{ animationDelay: "2s" }} />
          <div className="absolute top-[40%] left-[20%] w-[300px] h-[300px] bg-mint-100/40 rounded-full blur-[80px] animate-pulse-slow" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}
