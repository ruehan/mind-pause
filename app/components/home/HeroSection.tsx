import { Heart } from "lucide-react";
import { Button } from "../Button";
import { useState, useEffect } from "react";

export function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Mouse-follow effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleCTAClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Ripple effect
    const button = e.currentTarget;
    const ripple = document.createElement("span");
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.classList.add("ripple");

    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  };

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.querySelector("#features");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-lavender-50">
      {/* Mesh Gradient Overlay with parallax */}
      <div
        className="absolute inset-0 gradient-mesh opacity-40 animate-gradient bg-[length:200%_200%]"
        style={{
          transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`
        }}
      ></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:col-span-3">
            <h1 className="text-h1 text-gradient-primary mb-6 animate-fade-in font-bold">
              마음의 쉼표,
              <br />
              당신의 감정을 돌보세요
            </h1>
            <p className="text-body-lg text-neutral-600 mb-8 animate-fade-in">
              AI 기반 감정 케어로 매일을 더 따뜻하게
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Button
                variant="gradient"
                size="lg"
                href="/login?mode=signup"
                onClick={handleCTAClick as any}
              >
                무료로 시작하기 →
              </Button>
              <Button
                variant="glass"
                size="lg"
                href="#features"
                onClick={handleSmoothScroll as any}
              >
                체험해보기
              </Button>
            </div>
          </div>

          {/* Hero Illustration */}
          <div className="relative animate-fade-in lg:col-span-2">
            <div className="relative w-full aspect-square max-w-md mx-auto lg:max-w-sm">
              {/* Decorative circles with enhanced parallax */}
              <div
                className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary-200 rounded-full opacity-60 blur-3xl animate-pulse-slow"
                style={{
                  transform: `translate(${mousePosition.x * -0.02}px, ${mousePosition.y * -0.02}px)`
                }}
              ></div>
              <div
                className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-lavender-200 rounded-full opacity-60 blur-3xl animate-pulse-slow"
                style={{
                  animationDelay: "1s",
                  transform: `translate(${mousePosition.x * 0.015}px, ${mousePosition.y * 0.015}px)`
                }}
              ></div>
              <div
                className="absolute top-1/2 left-1/2 w-48 h-48 bg-mint-200 rounded-full opacity-40 blur-3xl animate-pulse-slow"
                style={{
                  animationDelay: "2s",
                  transform: `translate(calc(-50% + ${mousePosition.x * -0.025}px), calc(-50% + ${mousePosition.y * -0.025}px))`
                }}
              ></div>

              {/* Center illustration placeholder */}
              <div className="relative z-10 flex items-center justify-center h-full">
                <div
                  className="glass-strong rounded-2xl shadow-soft hover:shadow-primary transition-all duration-300 p-8 w-full max-w-sm transform hover:-translate-y-2 hover:scale-105 cursor-pointer"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <div className="flex items-center justify-center mb-6">
                    <div
                      className={`w-24 h-24 gradient-primary rounded-full flex items-center justify-center shadow-primary animate-float transition-transform duration-300 ${
                        isHovering ? "scale-110 rotate-12" : ""
                      }`}
                    >
                      <Heart
                        className={`w-12 h-12 text-white transition-all duration-300 ${
                          isHovering ? "animate-pulse" : ""
                        }`}
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="h-3 bg-neutral-200 rounded-full mb-3 animate-pulse"></div>
                    <div className="h-3 bg-neutral-200 rounded-full w-3/4 mx-auto animate-pulse" style={{ animationDelay: "150ms" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
