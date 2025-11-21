import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    content: "매일 감정을 기록하면서 나를 더 잘 이해하게 되었어요. AI 코치의 따뜻한 조언이 정말 큰 위로가 됩니다.",
    author: "김민지",
    role: "직장인, 3년차",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1"
  },
  {
    content: "불안한 마음이 들 때마다 마음쉼표를 찾아요. 익명으로 솔직하게 털어놓을 수 있어서 너무 좋아요.",
    author: "이준호",
    role: "대학생",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2"
  },
  {
    content: "감정 패턴 분석 기능이 정말 유용해요. 제가 언제 스트레스를 받는지 알게 되니 관리하기도 쉬워졌어요.",
    author: "박서연",
    role: "프리랜서",
    rating: 4,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3"
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-neutral-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">
            사용자들의 생생한 이야기
          </h2>
          <p className="text-lg text-neutral-600">
            마음쉼표와 함께 긍정적인 변화를 경험한 분들의 후기입니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 relative">
              <Quote className="absolute top-6 right-6 w-8 h-8 text-primary-100" />
              
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-neutral-200"}`}
                  />
                ))}
              </div>

              <p className="text-neutral-700 mb-6 leading-relaxed min-h-[80px]">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full bg-neutral-100"
                />
                <div>
                  <p className="font-bold text-neutral-900">{testimonial.author}</p>
                  <p className="text-sm text-neutral-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
