import { CheckCircle2 } from "lucide-react";

const audiences = [
  {
    title: "감정 기록 습관을 만들고 싶은 분",
    description: "하루 5분, 간단한 기록으로 나를 이해하는 시간을 가져보세요",
  },
  {
    title: "AI와 편하게 대화하고 싶은 분",
    description: "판단 없이 경청하는 AI 코치와 마음을 나눠보세요",
  },
  {
    title: "데이터로 나를 이해하고 싶은 분",
    description: "감정의 패턴을 발견하고 긍정적인 변화를 만들어가요",
  },
  {
    title: "익명으로 공감받고 싶은 분",
    description: "비슷한 경험을 가진 사람들과 안전하게 소통하세요",
  },
];

export function TargetAudienceSection() {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-white to-lavender-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-h2 font-bold text-neutral-900 mb-4">
            이런 분들께 추천합니다
          </h2>
          <p className="text-body-lg text-neutral-600">
            마음쉼표는 감정을 돌보고 싶은 모든 분들을 위한 공간입니다
          </p>
        </div>

        {/* Audience Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {audiences.map((audience, index) => (
            <div
              key={index}
              className="glass rounded-2xl p-6 hover:shadow-soft transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex gap-4">
                {/* Check Icon */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-h4 font-semibold text-neutral-900 mb-2">
                    {audience.title}
                  </h3>
                  <p className="text-body text-neutral-600 leading-relaxed">
                    {audience.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Message */}
        <div className="mt-12 text-center animate-fade-in" style={{ animationDelay: "400ms" }}>
          <p className="text-body-lg text-neutral-600 max-w-2xl mx-auto">
            지금 바로 시작하세요.
            <br className="hidden sm:block" />
            <span className="text-primary-600 font-semibold"> 첫 걸음을 내딛는 용기</span>만 있으면 됩니다
          </p>
        </div>
      </div>
    </section>
  );
}
