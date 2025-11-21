import { Button } from "../Button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-lavender-600"></div>
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
      
      {/* Decorative Circles */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
          지금 바로 마음 챙김을 시작하세요
        </h2>
        <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
          하루 5분, 나를 위한 작은 습관이 <br className="sm:hidden" />
          더 단단한 내일을 만듭니다.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="secondary"
            size="lg"
            href="/login?mode=signup"
            className="bg-white text-primary-600 hover:bg-neutral-50 border-none shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            무료로 시작하기
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
        
        <p className="mt-6 text-primary-200 text-sm">
          ✨ 14일 무료 체험 · 언제든 해지 가능 · 카드 등록 불필요
        </p>
      </div>
    </section>
  );
}
