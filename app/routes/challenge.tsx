import { useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { StatCard } from "../components/dashboard/StatCard";
import { ChallengeFilterTabs } from "../components/challenge/ChallengeFilterTabs";
import { ActiveChallengeCard } from "../components/challenge/ActiveChallengeCard";
import { RecommendedChallengeCard } from "../components/challenge/RecommendedChallengeCard";
import { Brain, Footprints, Moon, BookOpen, Coffee, Droplet, Music, Sunrise, Trophy, Target, CheckCircle, Flame } from "lucide-react";

export function meta() {
  return [
    { title: "챌린지 - 마음쉼표" },
    {
      name: "description",
      content: "작은 실천으로 만드는 긍정적인 변화",
    },
  ];
}

// Mock data
const mockActiveChallenges = [
  {
    id: "1",
    icon: Brain,
    title: "명상 5분",
    description: "매일 5분 명상으로 마음의 평화를 찾아보세요",
    progress: 40,
    currentDay: 2,
    totalDays: 5,
    todayTask: "아침 명상 5분 완료하기",
    todayCompleted: false,
    reward: "명상 마스터 배지",
    daysRemaining: 3,
  },
  {
    id: "2",
    icon: Footprints,
    title: "매일 산책 30분",
    description: "규칙적인 산책으로 스트레스를 낮추고 활력을 되찾으세요",
    progress: 60,
    currentDay: 3,
    totalDays: 5,
    todayTask: "30분 산책 완료",
    todayCompleted: true,
    reward: "걸음 챔피언 배지",
    daysRemaining: 2,
  },
];

const mockRecommendedChallenges = [
  {
    id: "r1",
    icon: Moon,
    title: "수면 루틴",
    duration: "7일 챌린지",
    participants: 234,
  },
  {
    id: "r2",
    icon: BookOpen,
    title: "독서 10분",
    duration: "5일 챌린지",
    participants: 156,
  },
  {
    id: "r3",
    icon: Coffee,
    title: "카페인 줄이기",
    duration: "7일 챌린지",
    participants: 98,
  },
  {
    id: "r4",
    icon: Droplet,
    title: "물 8잔 마시기",
    duration: "5일 챌린지",
    participants: 189,
  },
  {
    id: "r5",
    icon: Music,
    title: "음악 감상",
    duration: "3일 챌린지",
    participants: 145,
  },
  {
    id: "r6",
    icon: Sunrise,
    title: "아침 루틴",
    duration: "7일 챌린지",
    participants: 210,
  },
];

export default function Challenge() {
  const [activeFilter, setActiveFilter] = useState<
    "progress" | "completed" | "upcoming" | "popular"
  >("progress");

  const [activeChallenges, setActiveChallenges] = useState(
    mockActiveChallenges
  );

  const handleCompleteChallenge = (id: string) => {
    setActiveChallenges(
      activeChallenges.map((c) =>
        c.id === id ? { ...c, todayCompleted: !c.todayCompleted } : c
      )
    );
    console.log("Challenge completed:", id);
  };

  const handleGiveUpChallenge = (id: string) => {
    if (
      confirm(
        "챌린지를 포기하시겠습니까? 여기까지 오느라 수고했어요!"
      )
    ) {
      setActiveChallenges(activeChallenges.filter((c) => c.id !== id));
      console.log("Challenge given up:", id);
    }
  };

  const handleStartChallenge = (challengeId: string) => {
    console.log("Starting challenge:", challengeId);
    alert("챌린지를 시작합니다!");
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Trophy className="w-10 h-10 text-primary-600" />
            <div>
              <h1 className="text-h2 text-neutral-900">챌린지</h1>
              <p className="text-body text-neutral-600 mt-1">
                작은 실천으로 만드는 긍정적인 변화
              </p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <ChallengeFilterTabs
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        {/* Summary Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard
            icon={Target}
            title="진행중 챌린지"
            value="2개"
            subtitle="목표: 5개"
          />
          <StatCard
            icon={CheckCircle}
            title="이번 주 성취"
            value="3개"
            subtitle="목표: 5개"
          />
          <StatCard
            icon={Flame}
            title="연속 달성"
            value="5일 연속"
            subtitle="최고: 14일"
          />
        </div>

        {/* Active Challenges */}
        {activeFilter === "progress" && (
          <div className="mb-8">
            <h2 className="text-h3 text-neutral-900 mb-4">🎯 진행중 챌린지</h2>
            {activeChallenges.length > 0 ? (
              activeChallenges.map((challenge) => (
                <ActiveChallengeCard
                  key={challenge.id}
                  {...challenge}
                  onComplete={() => handleCompleteChallenge(challenge.id)}
                  onGiveUp={() => handleGiveUpChallenge(challenge.id)}
                />
              ))
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-12 text-center">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-h4 text-neutral-700 mb-2">
                  아직 진행중인 챌린지가 없어요
                </h3>
                <p className="text-body text-neutral-600 mb-6">
                  새로운 챌린지를 시작해보세요!
                </p>
                <button
                  onClick={() => setActiveFilter("popular")}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  챌린지 둘러보기 →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Completed Challenges */}
        {activeFilter === "completed" && (
          <div className="mb-8">
            <h2 className="text-h3 text-neutral-900 mb-4">✅ 완료한 챌린지</h2>
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-12 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-h4 text-neutral-700 mb-2">
                완료한 챌린지가 없어요
              </h3>
              <p className="text-body text-neutral-600">
                챌린지를 완료하고 보상을 받아보세요!
              </p>
            </div>
          </div>
        )}

        {/* Recommended Challenges */}
        {(activeFilter === "upcoming" || activeFilter === "popular") && (
          <div>
            <h2 className="text-h3 text-neutral-900 mb-4">💡 추천 챌린지</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {mockRecommendedChallenges.map((challenge) => (
                <RecommendedChallengeCard
                  key={challenge.id}
                  {...challenge}
                  onStart={() => handleStartChallenge(challenge.id)}
                />
              ))}
            </div>
            <div className="text-center">
              <button className="text-body text-primary-600 hover:text-primary-700 font-medium transition-colors">
                더 많은 챌린지 보기 →
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
