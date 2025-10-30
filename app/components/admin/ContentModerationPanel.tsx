import { useState } from "react";
import { AlertTriangle, Check, X, Eye, Flag } from "lucide-react";

interface Report {
  id: string;
  contentType: "post" | "comment";
  contentId: string;
  contentPreview: string;
  reportReason: string;
  reportCount: number;
  reportedBy: string[];
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

interface ContentModerationPanelProps {
  reports: Report[];
}

export function ContentModerationPanel({ reports }: ContentModerationPanelProps) {
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");

  const filteredReports = reports.filter((report) =>
    filter === "all" ? true : report.status === filter
  );

  const getStatusBadge = (status: Report["status"]) => {
    const styles = {
      pending: "bg-accent-100 text-accent-700",
      approved: "bg-mint-100 text-mint-700",
      rejected: "bg-neutral-200 text-neutral-700",
    };
    const labels = {
      pending: "대기중",
      approved: "승인됨",
      rejected: "거부됨",
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getContentTypeBadge = (type: Report["contentType"]) => {
    const styles = {
      post: "bg-primary-100 text-primary-700",
      comment: "bg-lavender-100 text-lavender-700",
    };
    const labels = {
      post: "게시글",
      comment: "댓글",
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[type]}`}>
        {labels[type]}
      </span>
    );
  };

  const handleApprove = (reportId: string) => {
    console.log("Approving report:", reportId);
    // TODO: Implement approval logic
  };

  const handleReject = (reportId: string) => {
    console.log("Rejecting report:", reportId);
    // TODO: Implement rejection logic
  };

  const handleView = (reportId: string) => {
    console.log("Viewing report:", reportId);
    // TODO: Navigate to content detail
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-error-100 to-accent-100 flex items-center justify-center">
            <Flag className="w-5 h-5 text-error-600" />
          </div>
          <div>
            <h2 className="text-h3 text-neutral-900">콘텐츠 모더레이션</h2>
            <p className="text-body-sm text-neutral-600">
              신고된 게시글과 댓글을 관리하세요
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-body-sm font-medium transition-colors ${
              filter === "all"
                ? "bg-primary-600 text-white"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            전체
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-lg text-body-sm font-medium transition-colors ${
              filter === "pending"
                ? "bg-accent-600 text-white"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            대기중
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`px-4 py-2 rounded-lg text-body-sm font-medium transition-colors ${
              filter === "approved"
                ? "bg-mint-600 text-white"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            승인됨
          </button>
          <button
            onClick={() => setFilter("rejected")}
            className={`px-4 py-2 rounded-lg text-body-sm font-medium transition-colors ${
              filter === "rejected"
                ? "bg-neutral-600 text-white"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            거부됨
          </button>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="border border-neutral-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
          >
            {/* Report Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {getContentTypeBadge(report.contentType)}
                {getStatusBadge(report.status)}
                <div className="flex items-center gap-1 text-error-600">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-caption font-medium">
                    {report.reportCount}건 신고
                  </span>
                </div>
              </div>
              <span className="text-caption text-neutral-500">
                {report.createdAt}
              </span>
            </div>

            {/* Content Preview */}
            <div className="bg-neutral-50 rounded-lg p-3 mb-3">
              <p className="text-body text-neutral-700 line-clamp-2">
                {report.contentPreview}
              </p>
            </div>

            {/* Report Reason */}
            <div className="mb-3">
              <p className="text-body-sm text-neutral-600">
                <span className="font-medium">신고 사유:</span> {report.reportReason}
              </p>
              <p className="text-caption text-neutral-500 mt-1">
                신고자: {report.reportedBy.join(", ")}
              </p>
            </div>

            {/* Actions */}
            {report.status === "pending" && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleView(report.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors text-body-sm font-medium text-neutral-700"
                >
                  <Eye className="w-4 h-4" />
                  상세보기
                </button>
                <button
                  onClick={() => handleApprove(report.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-mint-600 text-white rounded-lg hover:bg-mint-700 transition-colors text-body-sm font-medium"
                >
                  <Check className="w-4 h-4" />
                  삭제 승인
                </button>
                <button
                  onClick={() => handleReject(report.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-error-600 text-white rounded-lg hover:bg-error-700 transition-colors text-body-sm font-medium"
                >
                  <X className="w-4 h-4" />
                  거부
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredReports.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-h4 text-neutral-700 mb-2">
            {filter === "pending" ? "처리할 신고가 없습니다" : "신고 내역이 없습니다"}
          </h3>
          <p className="text-body text-neutral-600">
            {filter === "pending" ? "모든 신고가 처리되었어요!" : "다른 필터를 선택해보세요"}
          </p>
        </div>
      )}
    </div>
  );
}
