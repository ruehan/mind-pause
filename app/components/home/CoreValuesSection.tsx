import { Shield, Bot, LineChart, Gift } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "완벽한 프라이버시",
    description: "철저한 익명성 보장으로 안전하게 감정을 나눠요",
    color: "primary",
  },
  {
    icon: Bot,
    title: "24시간 AI 코치",
    description: "언제든 대화할 수 있는 따뜻한 AI가 함께해요",
    color: "lavender",
  },
  {
    icon: LineChart,
    title: "과학 기반 접근",
    description: "심리학 연구를 바탕으로 한 감정 케어 시스템",
    color: "mint",
  },
  {
    icon: Gift,
    title: "무료로 시작",
    description: "부담 없이 체험하고 필요한 만큼 사용하세요",
    color: "accent",
  },
];

export function CoreValuesSection() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-h2 font-bold text-neutral-900 mb-4">
            마음쉼표가 특별한 이유
          </h2>
          <p className="text-body-lg text-neutral-600">
            안전하고 과학적인 방법으로 당신의 감정을 돌봅니다
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div
                key={index}
                className="text-center animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-soft ${
                      value.color === "primary"
                        ? "bg-primary-100"
                        : value.color === "lavender"
                        ? "bg-lavender-100"
                        : value.color === "mint"
                        ? "bg-mint-100"
                        : "bg-accent-100"
                    }`}
                  >
                    <Icon
                      className={`w-8 h-8 ${
                        value.color === "primary"
                          ? "text-primary-600"
                          : value.color === "lavender"
                          ? "text-lavender-600"
                          : value.color === "mint"
                          ? "text-mint-600"
                          : "text-accent-600"
                      }`}
                    />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-h4 font-semibold text-neutral-900 mb-2">
                  {value.title}
                </h3>

                {/* Description */}
                <p className="text-body text-neutral-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
