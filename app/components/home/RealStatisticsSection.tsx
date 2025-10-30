import { Users, Heart, MessageCircle, Trophy } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "2,000+",
    label: "활성 사용자",
    color: "primary",
  },
  {
    icon: Heart,
    value: "15,000+",
    label: "감정 기록",
    color: "lavender",
  },
  {
    icon: MessageCircle,
    value: "8,000+",
    label: "AI 대화",
    color: "mint",
  },
  {
    icon: Trophy,
    value: "85%",
    label: "챌린지 완료율",
    color: "accent",
  },
];

export function StatisticsSection() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-h2 font-bold text-neutral-900 mb-4">
            함께 성장하는 커뮤니티
          </h2>
          <p className="text-body-lg text-neutral-600">
            2,000명이 마음쉼표와 함께 감정을 돌보고 있습니다
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
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
                      stat.color === "primary"
                        ? "bg-primary-100"
                        : stat.color === "lavender"
                        ? "bg-lavender-100"
                        : stat.color === "mint"
                        ? "bg-mint-100"
                        : "bg-accent-100"
                    }`}
                  >
                    <Icon
                      className={`w-8 h-8 ${
                        stat.color === "primary"
                          ? "text-primary-600"
                          : stat.color === "lavender"
                          ? "text-lavender-600"
                          : stat.color === "mint"
                          ? "text-mint-600"
                          : "text-accent-600"
                      }`}
                    />
                  </div>
                </div>

                {/* Value */}
                <div className="text-h2 font-bold text-gradient-primary mb-2">
                  {stat.value}
                </div>

                {/* Label */}
                <div className="text-body text-neutral-600">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Trust Message */}
        <div className="mt-12 text-center animate-fade-in" style={{ animationDelay: "400ms" }}>
          <p className="text-body-lg text-neutral-600 max-w-2xl mx-auto">
            매일 더 많은 분들이 마음쉼표를 통해
            <br className="hidden sm:block" />
            <span className="text-primary-600 font-semibold"> 감정을 돌보고 성장</span>하고 있습니다
          </p>
        </div>
      </div>
    </section>
  );
}
