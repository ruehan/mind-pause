import type { Route } from "./+types/qna";
import { Header } from "~/components/Header";
import { Footer } from "~/components/Footer";
import { QnAHeader } from "~/components/qna-improve/QnAHeader";
import { QnAList } from "~/components/qna-improve/QnAList";
import { QnAContact } from "~/components/qna-improve/QnAContact";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "자주 묻는 질문 - 마음쉼표" },
    { name: "description", content: "마음쉼표 서비스 이용에 대해 궁금한 점을 확인해보세요." },
  ];
}

export default function QnAImprove() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <QnAHeader />
        <QnAList />
        <QnAContact />
      </main>
      <Footer />
    </div>
  );
}
