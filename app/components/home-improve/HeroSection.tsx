import { Heart, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "../Button";
import { useState, useEffect } from "react";

export function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Mouse-follow effect for parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize coordinates -1 to 1
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-white">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top Right Gradient Blob */}
        <div 
          className="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] bg-gradient-to-br from-primary-100/40 to-lavender-100/40 rounded-full blur-3xl animate-pulse-slow"
          style={{
            transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * -20}px)`
          }}
        />
        
        {/* Bottom Left Gradient Blob */}
        <div 
          className="absolute -bottom-[20%] -left-[10%] w-[60vw] h-[60vw] bg-gradient-to-tr from-mint-100/30 to-primary-100/30 rounded-full blur-3xl animate-pulse-slow"
          style={{
            animationDelay: "1s",
            transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`
          }}
        />

        {/* Mesh Grid Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-primary-100 shadow-sm backdrop-blur-sm animate-fade-in">
              <Sparkles className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-medium text-neutral-600">AI 기반 감정 케어 서비스</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-neutral-900 leading-[1.1] animate-slide-up">
              마음의 쉼표, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-lavender-600 to-primary-600 animate-gradient bg-[length:200%_auto]">
                당신의 감정을
              </span> <br />
              돌보세요
            </h1>

            {/* Description */}
            <p className="text-xl text-neutral-600 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-slide-up" style={{ animationDelay: "100ms" }}>
              복잡한 일상 속에서 잠시 멈춰보세요. <br className="hidden sm:block" />
              AI 코치와 함께하는 하루 5분 감정 기록으로 더 단단한 마음을 만듭니다.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up" style={{ animationDelay: "200ms" }}>
              <Button
                variant="primary"
                size="lg"
                href="/login?mode=signup"
                className="rounded-full px-8 shadow-primary hover:shadow-primary-strong transition-all duration-300 hover:scale-105"
              >
                무료로 시작하기
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="secondary"
                size="lg"
                href="#features"
                className="rounded-full px-8 border-neutral-200 hover:bg-neutral-50"
              >
                서비스 둘러보기
              </Button>
            </div>

            {/* Social Proof / Trust Indicator */}
            <div className="pt-8 flex items-center justify-center lg:justify-start gap-4 animate-fade-in" style={{ animationDelay: "400ms" }}>
              <div className="flex -space-x-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-neutral-100 overflow-hidden">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} 
                      alt="User" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <p className="text-sm text-neutral-500">
                <span className="font-bold text-neutral-900">1,000+</span> 명의 사용자가 함께하고 있어요
              </p>
            </div>
          </div>

          {/* Right Illustration Area */}
          <div className="relative lg:h-[600px] flex items-center justify-center animate-fade-in" style={{ animationDelay: "200ms" }}>
            {/* Main 3D Card Effect */}
            <div 
              className="relative w-full max-w-md aspect-[4/5] perspective-1000"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div 
                className="w-full h-full relative transition-transform duration-500 ease-out preserve-3d"
                style={{
                  transform: `rotateY(${mousePosition.x * 5}deg) rotateX(${mousePosition.y * -5}deg)`
                }}
              >
                {/* Glass Card Background */}
                <div className="absolute inset-0 bg-white/40 backdrop-blur-xl rounded-[2rem] border border-white/50 shadow-2xl"></div>
                
                {/* Floating Elements */}
                <div className="absolute inset-0 p-8 flex flex-col justify-between">
                  {/* Top: Date & Weather */}
                  <div className="flex justify-between items-center">
                    <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                      <span className="text-sm font-semibold text-neutral-600">Today, 11월 21일</span>
                    </div>
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center animate-pulse-slow">
                      <span className="text-xl">☀️</span>
                    </div>
                  </div>

                  {/* Center: Emotion Visualization */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full">
                    <div className="relative inline-block">
                      <div className="w-32 h-32 bg-gradient-to-br from-primary-400 to-lavender-500 rounded-full flex items-center justify-center shadow-lg animate-float">
                        <Heart className="w-16 h-16 text-white fill-white/20" />
                      </div>
                      {/* Orbiting Elements */}
                      <div className="absolute top-0 left-0 w-full h-full animate-spin-slow">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-md text-xs font-bold text-primary-600">
                          평온함
                        </div>
                      </div>
                    </div>
                    <h3 className="mt-6 text-2xl font-bold text-neutral-800">오늘의 기분은 어떠신가요?</h3>
                    <p className="mt-2 text-neutral-500">당신의 이야기를 들려주세요</p>
                  </div>

                  {/* Bottom: AI Chat Preview */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm transform translate-y-4 hover:translate-y-2 transition-transform duration-300">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-primary-600">AI</span>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-700">
                          "오늘 하루는 어떠셨나요? 잠시 쉬어가도 괜찮아요. 🌿"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Decorators */}
              <div 
                className="absolute -top-10 -right-10 bg-white p-4 rounded-2xl shadow-xl animate-bounce-subtle"
                style={{ animationDelay: "1s" }}
              >
                <span className="text-2xl">✨</span>
              </div>
              <div 
                className="absolute -bottom-5 -left-5 bg-white p-4 rounded-2xl shadow-xl animate-bounce-subtle"
                style={{ animationDelay: "2s" }}
              >
                <span className="text-2xl">💪</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
