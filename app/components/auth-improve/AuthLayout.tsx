import { Link } from "react-router";
import { ArrowLeft, Sparkles } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  image?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Visual Area (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-neutral-900">
        {/* Background Image/Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 to-neutral-900 z-0"></div>
        
        {/* Animated Shapes */}
        <div className="absolute top-[-20%] right-[-10%] w-[80%] h-[80%] bg-primary-600/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-lavender-600/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }}></div>

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col justify-between w-full h-full p-12 text-white">
          {/* Logo Area */}
          <Link to="/" className="flex items-center gap-3 group w-fit">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <span className="text-2xl font-bold">,</span>
            </div>
            <span className="text-xl font-bold tracking-tight">마음쉼표</span>
          </Link>

          {/* Main Visual Content */}
          <div className="space-y-8 max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
              <Sparkles className="w-4 h-4 text-primary-300" />
              <span className="text-sm font-medium text-primary-100">AI 감정 케어 파트너</span>
            </div>
            <h1 className="text-5xl font-bold leading-tight">
              당신의 감정을 <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-lavender-300">
                이해하고 치유하는
              </span> <br />
              가장 따뜻한 방법
            </h1>
            <p className="text-lg text-neutral-300 leading-relaxed">
              "마음쉼표는 단순한 기록을 넘어, 당신의 감정을 깊이 있게 이해하고 
              더 나은 내일을 위한 맞춤형 솔루션을 제공합니다."
            </p>
          </div>

          {/* Footer Area */}
          <div className="flex justify-between items-center text-sm text-neutral-400">
            <p>© 2024 Mind Pause. All rights reserved.</p>
            <div className="flex gap-4">
              <Link to="/privacy" className="hover:text-white transition-colors">개인정보처리방침</Link>
              <Link to="/terms" className="hover:text-white transition-colors">이용약관</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form Area */}
      <div className="w-full lg:w-1/2 flex flex-col relative">
        {/* Mobile Header */}
        <div className="lg:hidden p-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">,</div>
            <span className="font-bold text-neutral-900">마음쉼표</span>
          </Link>
        </div>

        {/* Back Button (Desktop) */}
        <div className="hidden lg:block absolute top-8 right-8">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors px-4 py-2 rounded-lg hover:bg-neutral-50"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>메인으로 돌아가기</span>
          </Link>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-24">
          <div className="w-full max-w-md space-y-8">
            {/* Form Header */}
            <div className="text-center lg:text-left space-y-2">
              <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">{title}</h2>
              <p className="text-neutral-500">{subtitle}</p>
            </div>

            {/* Form Content */}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
