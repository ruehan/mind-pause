import { useState } from "react";
import type { Challenge } from "../../lib/api";
import { approveChallenge, rejectChallenge } from "../../lib/api";

interface ChallengeManagementPanelProps {
  challenges: Challenge[];
  onChallengeUpdate?: () => void;
}

export function ChallengeManagementPanel({ challenges, onChallengeUpdate }: ChallengeManagementPanelProps) {
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [processing, setProcessing] = useState<string | null>(null);

  const handleApprove = async (challengeId: string) => {
    if (processing || !confirm("이 챌린지를 승인하시겠습니까?")) return;

    try {
      setProcessing(challengeId);
      await approveChallenge(challengeId);
      alert("챌린지가 승인되었습니다.");
      onChallengeUpdate?.();
    } catch (error: any) {
      alert(error.message || "챌린지 승인에 실패했습니다.");
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (challengeId: string) => {
    if (processing || !rejectReason.trim()) {
      alert("거부 사유를 입력해주세요.");
      return;
    }

    try {
      setProcessing(challengeId);
      await rejectChallenge(challengeId, { reason: rejectReason });
      alert("챌린지가 거부되었습니다.");
      setRejectingId(null);
      setRejectReason("");
      onChallengeUpdate?.();
    } catch (error: any) {
      alert(error.message || "챌린지 거부에 실패했습니다.");
    } finally {
      setProcessing(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ko-KR');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
      <div className="p-6">
        <h2 className="text-h3 text-neutral-900 mb-4">승인 대기 챌린지</h2>

        {challenges.length === 0 ? (
          <div className="text-center py-8 text-body text-neutral-600">
            승인 대기 중인 챌린지가 없습니다.
          </div>
        ) : (
          <div className="space-y-4">
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                className="border border-neutral-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {challenge.icon && <span className="text-2xl">{challenge.icon}</span>}
                      <h3 className="text-h4 text-neutral-900">{challenge.title}</h3>
                    </div>
                    <p className="text-body text-neutral-600 mb-2">{challenge.description}</p>
                    <div className="flex items-center gap-4 text-small text-neutral-500">
                      <span>📅 {formatDate(challenge.start_date)} ~ {formatDate(challenge.end_date)}</span>
                      <span>⏱️ {challenge.duration_days}일</span>
                      {challenge.reward_badge && (
                        <span>🏆 {challenge.reward_badge}</span>
                      )}
                    </div>
                  </div>
                </div>

                {rejectingId === challenge.id ? (
                  <div className="mt-4 space-y-3">
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="거부 사유를 입력해주세요"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows={3}
                      disabled={processing === challenge.id}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReject(challenge.id)}
                        disabled={processing === challenge.id || !rejectReason.trim()}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {processing === challenge.id ? "처리 중..." : "거부 확인"}
                      </button>
                      <button
                        onClick={() => {
                          setRejectingId(null);
                          setRejectReason("");
                        }}
                        disabled={processing === challenge.id}
                        className="px-4 py-2 bg-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-300 disabled:opacity-50"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleApprove(challenge.id)}
                      disabled={processing === challenge.id}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processing === challenge.id ? "처리 중..." : "✓ 승인"}
                    </button>
                    <button
                      onClick={() => setRejectingId(challenge.id)}
                      disabled={processing === challenge.id}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                    >
                      ✗ 거부
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
