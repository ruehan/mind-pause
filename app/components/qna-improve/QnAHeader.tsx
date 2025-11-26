import { HelpCircle } from "lucide-react";

export function QnAHeader() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-lavender-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-mint-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-white/50 shadow-sm mb-8 animate-fade-in-up">
          <HelpCircle className="w-4 h-4 text-primary-600" />
          <span className="text-sm font-medium text-primary-700">자주 묻는 질문</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6 tracking-tight animate-fade-in-up animation-delay-100">
          궁금한 점이 있으신가요?
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-lavender-600">
            마음쉼표가 답변해 드립니다
          </span>
        </h1>

        <p className="text-lg text-neutral-600 max-w-2xl mx-auto mb-10 animate-fade-in-up animation-delay-200">
          서비스 이용부터 계정 관리까지, 자주 묻는 질문들을 모았습니다.
          <br className="hidden md:block" />
          원하시는 답변을 찾지 못하셨다면 언제든 문의해 주세요.
        </p>
      </div>
    </section>
  );
}
