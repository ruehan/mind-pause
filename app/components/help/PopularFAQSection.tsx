import { TrendingUp } from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  shortAnswer: string;
}

interface PopularFAQSectionProps {
  faqs: FAQ[];
  onViewDetail: (id: string) => void;
}

export function PopularFAQSection({
  faqs,
  onViewDetail,
}: PopularFAQSectionProps) {
  return (
    <div className="glass-strong rounded-2xl shadow-soft p-6 lg:p-8 mb-8 border border-accent-200 bg-gradient-to-br from-accent-50 via-white to-error-50">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-500 to-error-500 flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-h3 text-neutral-900">인기 질문</h2>
          <p className="text-body-sm text-neutral-600">
            다른 사용자들이 가장 많이 찾는 질문이에요
          </p>
        </div>
      </div>

      {/* Popular FAQ Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {faqs.slice(0, 4).map((faq, index) => (
          <button
            key={faq.id}
            onClick={() => onViewDetail(faq.id)}
            className="text-left bg-white/70 rounded-xl p-5 border border-white/50 hover:shadow-md hover:bg-white transition-all duration-200 group"
          >
            {/* Badge Number */}
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-500 to-error-500 flex items-center justify-center flex-shrink-0">
                <span className="text-body font-bold text-white">
                  {index + 1}
                </span>
              </div>
              <h4 className="text-body font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">
                {faq.question}
              </h4>
            </div>

            {/* Short Answer */}
            <p className="text-body-sm text-neutral-600 line-clamp-2 ml-11">
              {faq.shortAnswer}
            </p>

            {/* View More Indicator */}
            <div className="mt-3 ml-11">
              <span className="text-caption text-primary-600 font-medium group-hover:underline">
                자세히 보기 →
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* View All Button */}
      {faqs.length > 4 && (
        <div className="text-center mt-6">
          <button className="text-body text-primary-600 hover:text-primary-700 font-medium transition-colors">
            모든 인기 질문 보기 ({faqs.length}개) →
          </button>
        </div>
      )}
    </div>
  );
}
