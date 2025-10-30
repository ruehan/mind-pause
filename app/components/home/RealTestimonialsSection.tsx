import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "김서연",
    age: 28,
    content: "AI 코치와 대화하면서 감정을 정리할 수 있어서 좋아요. 혼자 끙끙대던 문제들이 풀리는 느낌이에요.",
    rating: 5,
    date: "2025.01",
  },
  {
    name: "이준호",
    age: 34,
    content: "감정 기록을 하면서 내 마음의 패턴을 발견했어요. 데이터로 보니까 더 명확하게 이해되네요.",
    rating: 5,
    date: "2025.01",
  },
  {
    name: "박민지",
    age: 25,
    content: "챌린지 기능이 정말 도움돼요. 작은 목표들을 달성하면서 조금씩 나아지는 게 느껴져요.",
    rating: 5,
    date: "2024.12",
  },
  {
    name: "최수현",
    age: 31,
    content: "커뮤니티에서 비슷한 고민을 가진 사람들과 소통하니 혼자가 아니라는 걸 알게 됐어요.",
    rating: 5,
    date: "2024.12",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-white to-lavender-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-h2 font-bold text-neutral-900 mb-4">
            사용자들의 이야기
          </h2>
          <p className="text-body-lg text-neutral-600">
            마음쉼표와 함께한 분들의 진솔한 후기를 들어보세요
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="glass rounded-2xl p-6 hover:shadow-soft transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Quote Icon */}
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center">
                    <Quote className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Rating */}
                <div className="flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-accent-400 text-accent-400"
                    />
                  ))}
                </div>
              </div>

              {/* Content */}
              <p className="text-body text-neutral-700 mb-4 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author Info */}
              <div className="flex items-center justify-between text-body-sm text-neutral-500">
                <span className="font-medium">
                  {testimonial.name} ({testimonial.age}세)
                </span>
                <span>{testimonial.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
