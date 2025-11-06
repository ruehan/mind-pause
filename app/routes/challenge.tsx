import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AppLayout } from "../components/AppLayout";
import * as api from "~/lib/api";
import type { Challenge, UserChallenge, ChallengeTemplate } from "~/lib/api";
import { ChallengeCard } from "~/components/challenge/ChallengeCard";
import { ChallengeCreateForm } from "~/components/challenge/ChallengeCreateForm";
import { AlertTriangle, Plus } from "lucide-react";

export function meta() {
  return [
    { title: "챌린지 - 마음쉼표" },
    {
      name: "description",
      content: "감정 기록 챌린지에 도전하고 꾸준한 습관을 만들어보세요",
    },
  ];
}

export default function ChallengePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 모든 챌린지 목록
  const [allChallenges, setAllChallenges] = useState<Challenge[]>([]);

  // 내가 참여한 챌린지 목록
  const [myChallenges, setMyChallenges] = useState<UserChallenge[]>([]);

  // 내가 생성한 챌린지 목록 (승인 대기 포함)
  const [myCreatedChallenges, setMyCreatedChallenges] = useState<Challenge[]>(
    []
  );

  // 참여 중인 챌린지 ID 세트
  const [joinedChallengeIds, setJoinedChallengeIds] = useState<Set<string>>(
    new Set()
  );

  // 챌린지 생성 관련
  const [templates, setTemplates] = useState<ChallengeTemplate[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 병렬로 데이터 로드
      const [
        challengesRes,
        myChallengesRes,
        myCreatedRes,
        templatesRes,
      ] = await Promise.all([
        api.getChallenges(),
        api.getMyChallenges(),
        api.getMyCreatedChallenges(),
        api.getChallengeTemplates(),
      ]);

      setAllChallenges(challengesRes.challenges);
      setMyChallenges(myChallengesRes.user_challenges);
      setMyCreatedChallenges(myCreatedRes.challenges);
      setTemplates(templatesRes.templates);

      // 참여 중인 챌린지 ID 세트 생성
      const joinedIds = new Set(
        myChallengesRes.user_challenges.map((uc) => uc.challenge_id)
      );
      setJoinedChallengeIds(joinedIds);
    } catch (err) {
      console.error("Failed to load challenges:", err);
      setError("챌린지 데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinChallenge = async (challengeId: string) => {
    try {
      await api.joinChallenge(challengeId);

      // 데이터 새로고침
      await loadData();

      // 성공 메시지
      alert("챌린지에 성공적으로 참여했습니다! 🎉");
    } catch (err: any) {
      console.error("Failed to join challenge:", err);

      // 에러 메시지 처리
      if (err.message?.includes("이미 참여 중인 챌린지")) {
        alert("이미 참여 중인 챌린지입니다.");
      } else {
        alert("챌린지 참여에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  const handleCreateChallenge = async (
    templateId: string,
    startDate: string,
    endDate: string
  ) => {
    try {
      await api.createChallenge({
        template_id: templateId,
        start_date: startDate,
        end_date: endDate,
      });

      // 폼 닫기
      setShowCreateForm(false);

      // 데이터 새로고침
      await loadData();

      // 성공 메시지
      alert(
        "챌린지 신청이 완료되었습니다! 관리자 승인 후 다른 사용자들이 참여할 수 있습니다. ✨"
      );
    } catch (err: any) {
      console.error("Failed to create challenge:", err);
      throw new Error(
        err.message || "챌린지 생성에 실패했습니다. 다시 시도해주세요."
      );
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-body text-neutral-600">로딩 중...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="glass-strong rounded-3xl shadow-elevation-2 border border-error-300 p-8">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-error-600" />
            <h2 className="text-h3 text-error-900 font-bold">오류 발생</h2>
          </div>
          <p className="text-body text-neutral-700 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="btn-primary px-6 py-2 rounded-2xl"
          >
            다시 시도
          </button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-h1 text-neutral-900 font-bold mb-3">
          챌린지 🏆
        </h1>
        <p className="text-body-lg text-neutral-600">
          감정 기록 챌린지에 도전하고 꾸준한 습관을 만들어보세요
        </p>
      </div>

      {/* 내가 참여한 챌린지 */}
      {myChallenges.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-h2 text-neutral-900 font-bold">
              내 챌린지
            </h2>
            <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-body-sm font-semibold">
              {myChallenges.length}개 진행 중
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myChallenges.map((uc) => (
              <ChallengeCard
                key={uc.id}
                id={uc.challenge.id}
                title={uc.challenge.title}
                description={uc.challenge.description}
                icon={uc.challenge.icon || "🎯"}
                challengeType={uc.challenge.challenge_type}
                durationDays={uc.challenge.duration_days}
                targetCount={uc.challenge.target_count}
                participantsCount={uc.challenge.participants_count}
                isJoined={true}
                currentStreak={uc.current_streak}
                completedCount={uc.completed_count}
                progressPercentage={uc.progress_percentage}
              />
            ))}
          </div>
        </section>
      )}

      {/* 승인 대기 중인 챌린지 */}
      {myCreatedChallenges.filter((c) => c.status === "pending").length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-h2 text-neutral-900 font-bold">
              승인 대기 중인 챌린지
            </h2>
            <span className="px-3 py-1 bg-warning-100 text-warning-700 rounded-full text-body-sm font-semibold">
              {myCreatedChallenges.filter((c) => c.status === "pending").length}
              개 대기 중
            </span>
          </div>

          <div className="glass-strong rounded-3xl shadow-elevation-2 border border-warning-200 p-6 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⏳</span>
              <div className="flex-1">
                <h3 className="text-body font-bold text-neutral-900 mb-1">
                  관리자 승인 대기 중
                </h3>
                <p className="text-body-sm text-neutral-600">
                  생성한 챌린지가 관리자의 승인을 기다리고 있습니다. 승인이
                  완료되면 다른 사용자들이 참여할 수 있습니다.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myCreatedChallenges
              .filter((c) => c.status === "pending")
              .map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  id={challenge.id}
                  title={challenge.title}
                  description={challenge.description}
                  icon={challenge.icon || "🎯"}
                  challengeType={challenge.challenge_type}
                  durationDays={challenge.duration_days}
                  targetCount={challenge.target_count}
                  participantsCount={challenge.participants_count}
                  isJoined={true}
                />
              ))}
          </div>
        </section>
      )}

      {/* 참여 가능한 챌린지 */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-h2 text-neutral-900 font-bold">
              모든 챌린지
            </h2>
            <span className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-body-sm font-semibold">
              {allChallenges.length}개
            </span>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn-primary px-4 py-2 rounded-2xl flex items-center gap-2 font-semibold"
          >
            <Plus className="w-5 h-5" />
            새 챌린지 만들기
          </button>
        </div>

        {/* 챌린지 생성 폼 */}
        {showCreateForm && (
          <div className="mb-8">
            <ChallengeCreateForm
              templates={templates}
              onSubmit={handleCreateChallenge}
              onCancel={() => setShowCreateForm(false)}
            />
          </div>
        )}

        {allChallenges.length === 0 ? (
          <div className="glass-strong rounded-3xl shadow-elevation-2 border border-white/40 p-12 text-center">
            <span className="text-6xl mb-4 block">🎯</span>
            <h3 className="text-h3 text-neutral-900 font-bold mb-2">
              아직 챌린지가 없습니다
            </h3>
            <p className="text-body text-neutral-600">
              곧 새로운 챌린지가 추가될 예정입니다
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allChallenges.map((challenge) => {
              const isJoined = joinedChallengeIds.has(challenge.id);
              const userChallenge = myChallenges.find(
                (uc) => uc.challenge_id === challenge.id
              );

              return (
                <ChallengeCard
                  key={challenge.id}
                  id={challenge.id}
                  title={challenge.title}
                  description={challenge.description}
                  icon={challenge.icon || "🎯"}
                  challengeType={challenge.challenge_type}
                  durationDays={challenge.duration_days}
                  targetCount={challenge.target_count}
                  participantsCount={challenge.participants_count}
                  isJoined={isJoined}
                  currentStreak={userChallenge?.current_streak}
                  completedCount={userChallenge?.completed_count}
                  progressPercentage={userChallenge?.progress_percentage}
                  onJoin={!isJoined ? handleJoinChallenge : undefined}
                />
              );
            })}
          </div>
        )}
      </section>
    </AppLayout>
  );
}
