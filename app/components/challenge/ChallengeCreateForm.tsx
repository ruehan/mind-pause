import { useState, useEffect } from "react";
import { Calendar, Target, AlertCircle } from "lucide-react";
import type { ChallengeTemplate } from "~/lib/api";

interface ChallengeCreateFormProps {
  templates: ChallengeTemplate[];
  onSubmit: (templateId: string, startDate: string, endDate: string) => Promise<void>;
  onCancel: () => void;
}

export function ChallengeCreateForm({
  templates,
  onSubmit,
  onCancel,
}: ChallengeCreateFormProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<ChallengeTemplate | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 템플릿 선택 시 기본 날짜 설정
  useEffect(() => {
    if (selectedTemplate) {
      const today = new Date();
      const start = new Date(today);
      const end = new Date(today);
      end.setDate(end.getDate() + selectedTemplate.default_duration_days);

      setStartDate(start.toISOString().split("T")[0]);
      setEndDate(end.toISOString().split("T")[0]);
    }
  }, [selectedTemplate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedTemplate) {
      setError("템플릿을 선택해주세요");
      return;
    }

    if (!startDate || !endDate) {
      setError("시작일과 종료일을 모두 입력해주세요");
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      setError("종료일은 시작일보다 이후여야 합니다");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(selectedTemplate.id, startDate, endDate);
    } catch (err: any) {
      setError(err.message || "챌린지 생성에 실패했습니다");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-strong rounded-3xl shadow-elevation-2 border border-white/40 p-8">
      <h2 className="text-h2 text-neutral-900 font-bold mb-6">
        새 챌린지 만들기
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 템플릿 선택 */}
        <div>
          <label className="block text-body-sm font-semibold text-neutral-700 mb-3">
            챌린지 템플릿 선택
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => setSelectedTemplate(template)}
                className={`p-4 rounded-2xl border-2 transition-all text-left ${
                  selectedTemplate?.id === template.id
                    ? "border-primary-500 bg-primary-50"
                    : "border-neutral-200 bg-white hover:border-primary-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{template.icon}</span>
                  <div className="flex-1">
                    <h3 className="text-body font-bold text-neutral-900 mb-1">
                      {template.title}
                    </h3>
                    <p className="text-body-sm text-neutral-600 mb-2">
                      {template.description}
                    </p>
                    <div className="flex items-center gap-3 text-body-xs text-neutral-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {template.default_duration_days}일
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        목표 {template.default_target_count}회
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 날짜 설정 */}
        {selectedTemplate && (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="startDate"
                className="block text-body-sm font-semibold text-neutral-700 mb-2"
              >
                시작일
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="endDate"
                className="block text-body-sm font-semibold text-neutral-700 mb-2"
              >
                종료일
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div className="glass-soft rounded-2xl p-4 border border-primary-200">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <div className="text-body-sm text-neutral-700">
                  <p className="font-semibold mb-1">승인 안내</p>
                  <p>
                    챌린지 생성 후 관리자의 승인이 완료되면 다른 사용자들이 참여할
                    수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 에러 메시지 */}
        {error && (
          <div className="glass-strong rounded-2xl p-4 border border-error-300">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-error-600" />
              <p className="text-body-sm text-error-700">{error}</p>
            </div>
          </div>
        )}

        {/* 버튼 */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 rounded-2xl border border-neutral-300 text-neutral-700 font-semibold hover:bg-neutral-50 transition-colors"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={!selectedTemplate || isSubmitting}
            className="flex-1 btn-primary px-6 py-3 rounded-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "생성 중..." : "챌린지 생성"}
          </button>
        </div>
      </form>
    </div>
  );
}
