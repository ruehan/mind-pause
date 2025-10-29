import { Heart } from "lucide-react";
import { Button } from "../Button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-lavender-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-h1 text-neutral-900 mb-6 animate-fade-in">
              마음의 쉼표,
              <br />
              당신의 감정을 돌보세요
            </h1>
            <p className="text-body-lg text-neutral-600 mb-8 animate-fade-in">
              AI 기반 감정 케어로 매일을 더 따뜻하게
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up">
              <Button variant="primary" size="lg" href="/login?mode=signup">
                무료로 시작하기 →
              </Button>
              <Button variant="secondary" size="lg" href="#features">
                체험해보기
              </Button>
            </div>
          </div>

          {/* Hero Illustration */}
          <div className="relative animate-fade-in">
            <div className="relative w-full aspect-square max-w-md mx-auto">
              {/* Decorative circles */}
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary-200 rounded-full opacity-60 blur-3xl animate-pulse-slow"></div>
              <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-lavender-200 rounded-full opacity-60 blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }}></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-mint-200 rounded-full opacity-40 blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }}></div>

              {/* Center illustration placeholder */}
              <div className="relative z-10 flex items-center justify-center h-full">
                <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-lavender-500 rounded-full flex items-center justify-center shadow-lg">
                      <Heart className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="h-3 bg-neutral-200 rounded-full mb-3"></div>
                    <div className="h-3 bg-neutral-200 rounded-full w-3/4 mx-auto"></div>
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
