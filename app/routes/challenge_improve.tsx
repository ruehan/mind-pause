import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { DashboardLayout } from "~/components/dashboard-improve/DashboardLayout";
import { ChallengeLayout } from "~/components/challenge-improve/ChallengeLayout";
import { ChallengeHeader } from "~/components/challenge-improve/ChallengeHeader";
import { ChallengeFilter } from "~/components/challenge-improve/ChallengeFilter";
import { ChallengeCard } from "~/components/challenge-improve/ChallengeCard";
import { ChallengeCreateForm } from "~/components/challenge/ChallengeCreateForm"; // Reuse existing form for now
import { Spinner } from "~/components/Spinner";
import { useToast } from "~/components/ToastProvider";
import * as api from "~/lib/api";
import type { Challenge, UserChallenge, ChallengeTemplate } from "~/lib/api";
import type { Route } from "./+types/challenge_improve";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "챌린지 - 마음쉼표" },
    { name: "description", content: "감정 기록 챌린지에 도전하고 꾸준한 습관을 만들어보세요" },
  ];
}

export default function ChallengeImprove() {
  const navigate = useNavigate();
  const toast = useToast();
  
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"all" | "my" | "pending">("all");
  
  // Data states
  const [allChallenges, setAllChallenges] = useState<Challenge[]>([]);
  const [myChallenges, setMyChallenges] = useState<UserChallenge[]>([]);
  const [myCreatedChallenges, setMyCreatedChallenges] = useState<Challenge[]>([]);
  const [joinedChallengeIds, setJoinedChallengeIds] = useState<Set<string>>(new Set());
  const [templates, setTemplates] = useState<ChallengeTemplate[]>([]);
  
  // UI states
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [challengesRes, myChallengesRes, myCreatedRes, templatesRes] = await Promise.all([
        api.getChallenges(),
        api.getMyChallenges(),
        api.getMyCreatedChallenges(),
        api.getChallengeTemplates(),
      ]);

      setAllChallenges(challengesRes.challenges);
      setMyChallenges(myChallengesRes.user_challenges);
      setMyCreatedChallenges(myCreatedRes.challenges);
      setTemplates(templatesRes.templates);

      const joinedIds = new Set(myChallengesRes.user_challenges.map((uc) => uc.challenge_id));
      setJoinedChallengeIds(joinedIds);
    } catch (err) {
      console.error("Failed to load challenges:", err);
      toast.error("오류", "챌린지 데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinChallenge = async (challengeId: string) => {
    try {
      await api.joinChallenge(challengeId);
      await loadData();
      toast.success("참여 완료", "챌린지에 성공적으로 참여했습니다! 🎉");
    } catch (err: any) {
      console.error("Failed to join challenge:", err);
      if (err.message?.includes("이미 참여 중인 챌린지")) {
        toast.info("알림", "이미 참여 중인 챌린지입니다.");
      } else {
        toast.error("오류", "챌린지 참여에 실패했습니다.");
      }
    }
  };

  const handleCreateChallenge = async (templateId: string, startDate: string, endDate: string) => {
    try {
      await api.createChallenge({
        template_id: templateId,
        start_date: startDate,
        end_date: endDate,
      });
      setShowCreateForm(false);
      await loadData();
      toast.success("신청 완료", "챌린지 신청이 완료되었습니다! 관리자 승인 후 공개됩니다.");
    } catch (err: any) {
      console.error("Failed to create challenge:", err);
      toast.error("오류", "챌린지 생성에 실패했습니다.");
    }
  };

  // Filter logic
  const getFilteredChallenges = () => {
    if (activeFilter === "my") {
      // Return challenges I joined
      return allChallenges.filter(c => joinedChallengeIds.has(c.id));
    }
    if (activeFilter === "pending") {
      return myCreatedChallenges.filter(c => c.status === "pending");
    }
    return allChallenges;
  };

  const filteredChallenges = getFilteredChallenges();

  return (
    <DashboardLayout>
      <ChallengeLayout>
        <ChallengeHeader onCreateClick={() => setShowCreateForm(true)} />

        {/* Create Form Modal/Section */}
        {showCreateForm && (
          <div className="mb-8 animate-fade-in">
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-neutral-200">
              <h3 className="text-h3 font-bold mb-4">새 챌린지 만들기</h3>
              <ChallengeCreateForm
                templates={templates}
                onSubmit={handleCreateChallenge}
                onCancel={() => setShowCreateForm(false)}
              />
            </div>
          </div>
        )}

        <ChallengeFilter 
          activeFilter={activeFilter} 
          onFilterChange={setActiveFilter}
          counts={{
            all: allChallenges.length,
            my: myChallenges.length,
            pending: myCreatedChallenges.filter(c => c.status === "pending").length
          }}
        />

        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="xl" variant="breathing" />
          </div>
        ) : filteredChallenges.length === 0 ? (
          <div className="text-center py-20 bg-white/60 backdrop-blur rounded-2xl border border-neutral-200/60">
            <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
              🎯
            </div>
            <h3 className="text-h4 font-bold text-neutral-900 mb-2">
              해당하는 챌린지가 없습니다
            </h3>
            <p className="text-body text-neutral-500">
              새로운 챌린지를 만들어보세요!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChallenges.map((challenge) => {
              const isJoined = joinedChallengeIds.has(challenge.id);
              const userChallenge = myChallenges.find((uc) => uc.challenge_id === challenge.id);

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
                  onJoin={handleJoinChallenge}
                />
              );
            })}
          </div>
        )}
      </ChallengeLayout>
    </DashboardLayout>
  );
}
