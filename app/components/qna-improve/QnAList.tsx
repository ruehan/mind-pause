import { QnAItem } from "./QnAItem";

const qnaData = [
  {
    category: "서비스 이용",
    question: "마음쉼표는 어떤 서비스인가요?",
    answer: "마음쉼표는 AI 기술을 활용하여 사용자의 감정을 분석하고, 맞춤형 케어 솔루션을 제공하는 멘탈 헬스케어 플랫폼입니다. 일기 쓰기, 감정 분석, 명상 추천 등 다양한 기능을 통해 마음의 평온을 찾도록 도와드립니다."
  },
  {
    category: "계정 관리",
    question: "비밀번호를 잊어버렸어요. 어떻게 해야 하나요?",
    answer: "로그인 화면 하단의 '비밀번호 찾기' 링크를 클릭하시면, 가입하신 이메일 주소로 비밀번호 재설정 링크를 보내드립니다. 이메일이 도착하지 않는다면 스팸 메일함을 확인해 주세요."
  },
  {
    category: "서비스 이용",
    question: "AI 감정 분석은 얼마나 정확한가요?",
    answer: "마음쉼표의 AI는 수만 건의 감정 데이터를 학습하여 높은 정확도로 감정을 분석합니다. 하지만 AI의 분석은 참고용이며, 전문적인 의학적 진단을 대체할 수는 없습니다. 심각한 심리적 어려움을 겪고 계시다면 전문가와의 상담을 권장합니다."
  },
  {
    category: "결제/구독",
    question: "무료로 이용할 수 있나요?",
    answer: "네, 기본적인 감정 일기 작성과 간단한 분석 기능은 무료로 제공됩니다. 더 심층적인 AI 분석과 프리미엄 명상 콘텐츠를 이용하시려면 '마음쉼표 플러스' 구독이 필요합니다."
  },
  {
    category: "개인정보",
    question: "제 일기 내용은 안전하게 보관되나요?",
    answer: "물론입니다. 작성하신 모든 일기와 감정 데이터는 강력한 암호화 기술로 보호되며, 본인 외에는 누구도 열람할 수 없습니다. 마음쉼표는 사용자의 개인정보 보호를 최우선으로 생각합니다."
  },
  {
    category: "서비스 이용",
    question: "모바일 앱도 있나요?",
    answer: "현재는 웹 서비스로 제공되고 있으며, 모바일 브라우저에서도 최적화된 화면으로 이용하실 수 있습니다. 추후 iOS 및 Android 전용 앱 출시를 준비하고 있습니다."
  }
];

export function QnAList() {
  return (
    <section className="py-12 bg-neutral-50/50">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="space-y-4">
          {qnaData.map((item, index) => (
            <QnAItem 
              key={index}
              question={item.question}
              answer={item.answer}
              category={item.category}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
