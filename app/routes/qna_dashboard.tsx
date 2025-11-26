import type { Route } from "./+types/qna_dashboard";
import { DashboardLayout } from "~/components/dashboard-improve/DashboardLayout";
import { QnAList } from "~/components/qna-improve/QnAList";
import { QnAContact } from "~/components/qna-improve/QnAContact";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "자주 묻는 질문 - 마음쉼표 대시보드" },
    { name: "description", content: "마음쉼표 서비스 이용에 대해 궁금한 점을 확인해보세요." },
  ];
}

export default function QnADashboardImprove() {
  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header Section */}
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">
            자주 묻는 질문 💬
          </h1>
          <p className="text-neutral-600 mt-2">
            서비스 이용 중 궁금한 점이 있으신가요? 여기서 확인해보세요.
          </p>
        </div>

        {/* Q&A List - Reusing the component but adjusting container styles if needed */}
        <div className="-mx-4 sm:mx-0">
          <QnAList />
        </div>

        {/* Contact Section */}
        <QnAContact />
      </div>
    </DashboardLayout>
  );
}
