import { Mail, MessageCircle } from "lucide-react";

export function QnAContact() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary-900 to-primary-800 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-xl">
          {/* Decorative Circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-4">
              원하시는 답변을 찾지 못하셨나요?
            </h2>
            <p className="text-primary-100 mb-8 max-w-xl mx-auto">
              궁금한 점이 더 있으시다면 언제든 문의해 주세요.<br />
              마음쉼표 팀이 빠르고 친절하게 답변해 드리겠습니다.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-primary-700 rounded-xl font-semibold hover:bg-primary-50 transition-colors shadow-lg shadow-black/10">
                <MessageCircle className="w-5 h-5" />
                1:1 채팅 상담하기
              </button>
              <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-700 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors border border-primary-600">
                <Mail className="w-5 h-5" />
                이메일 문의하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
