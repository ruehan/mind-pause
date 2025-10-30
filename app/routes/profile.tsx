import { useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { SettingsNav } from "../components/profile/SettingsNav";
import { ProfileHeader } from "../components/profile/ProfileHeader";
import { ProfileStatistics } from "../components/profile/ProfileStatistics";
import { BadgeShowcase, defaultBadges } from "../components/challenge/BadgeShowcase";
import { ProfileImageSection } from "../components/profile/ProfileImageSection";
import { SocialLoginCard } from "../components/profile/SocialLoginCard";
import { NotificationCheckbox } from "../components/profile/NotificationCheckbox";
import { Button } from "../components/Button";

export function meta() {
  return [
    { title: "프로필 설정 - 마음쉼표" },
    {
      name: "description",
      content: "나의 프로필과 설정을 관리하세요",
    },
  ];
}

export default function Profile() {
  const [activeSection, setActiveSection] = useState<
    "profile" | "stats" | "notification" | "security" | "account" | "data" | "info"
  >("profile");

  // Mock user data
  const [nickname, setNickname] = useState("마음쉼표");
  const [profileImage, setProfileImage] = useState<string>();
  const [emailNotifications, setEmailNotifications] = useState({
    dailyReminder: false,
    weeklySummary: true,
    newComment: true,
    like: false,
    challenge: true,
  });

  const handleImageChange = (file: File) => {
    // TODO: Upload image to server
    const reader = new FileReader();
    reader.onload = (e) => {
      setProfileImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    console.log("Uploading image:", file);
  };

  const handleImageDelete = () => {
    setProfileImage(undefined);
    console.log("Deleting profile image");
  };

  const handleSaveProfile = () => {
    console.log("Saving profile:", { nickname, profileImage });
    alert("변경사항이 저장되었습니다");
  };

  const handleSaveNotifications = () => {
    console.log("Saving notifications:", emailNotifications);
    alert("알림 설정이 저장되었습니다");
  };

  const handleSocialConnect = (provider: string) => {
    console.log("Connecting to:", provider);
    // TODO: Implement OAuth flow
  };

  const handleSocialDisconnect = (provider: string) => {
    console.log("Disconnecting from:", provider);
    // TODO: Implement disconnect
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />

      <main className="flex-1 flex">
        {/* Desktop Sidebar Navigation */}
        <div className="hidden lg:block">
          <SettingsNav
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 lg:p-8 max-w-6xl mx-auto w-full">
          {/* Profile Overview Section */}
          {activeSection === "profile" && (
            <div className="space-y-8">
              {/* Profile Header */}
              <ProfileHeader
                nickname={nickname}
                email="hangyu@example.com"
                joinDate="2024년 1월 1일"
                profileImage={profileImage}
                completionPercentage={75}
              />

              {/* Statistics */}
              <ProfileStatistics
                totalEmotionLogs={125}
                averageEmotionScore={2.3}
                challengeCompletionRate={87}
                communityLikes={42}
                communityComments={18}
                currentStreak={5}
              />

              {/* Badges */}
              <BadgeShowcase badges={defaultBadges} />
            </div>
          )}

          {/* Stats Detail Section */}
          {activeSection === "stats" && (
            <div>
              <h1 className="text-h2 text-neutral-900 mb-6 flex items-center gap-2">
                📊 상세 통계
              </h1>
              <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
                <p className="text-body text-neutral-600">
                  상세 통계 기능은 곧 제공될 예정입니다.
                </p>
              </div>
            </div>
          )}

          {/* Notification Section */}
          {activeSection === "notification" && (
            <div>
              <h1 className="text-h2 text-neutral-900 mb-6 flex items-center gap-2">
                🔔 알림 설정
              </h1>

              <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 mb-6">
                <h3 className="text-h4 text-neutral-900 mb-4">📧 이메일 알림</h3>
                <div className="space-y-4">
                  <NotificationCheckbox
                    label="매일 감정 기록 리마인더 (오후 8시)"
                    checked={emailNotifications.dailyReminder}
                    onChange={(checked) =>
                      setEmailNotifications({
                        ...emailNotifications,
                        dailyReminder: checked,
                      })
                    }
                  />
                  <NotificationCheckbox
                    label="주간 감정 요약 리포트 (일요일 오전 10시)"
                    checked={emailNotifications.weeklySummary}
                    onChange={(checked) =>
                      setEmailNotifications({
                        ...emailNotifications,
                        weeklySummary: checked,
                      })
                    }
                  />
                  <NotificationCheckbox
                    label="새로운 댓글 알림"
                    checked={emailNotifications.newComment}
                    onChange={(checked) =>
                      setEmailNotifications({
                        ...emailNotifications,
                        newComment: checked,
                      })
                    }
                  />
                  <NotificationCheckbox
                    label="공감 알림"
                    checked={emailNotifications.like}
                    onChange={(checked) =>
                      setEmailNotifications({
                        ...emailNotifications,
                        like: checked,
                      })
                    }
                  />
                  <NotificationCheckbox
                    label="챌린지 시작 및 완료 알림"
                    checked={emailNotifications.challenge}
                    onChange={(checked) =>
                      setEmailNotifications({
                        ...emailNotifications,
                        challenge: checked,
                      })
                    }
                  />
                </div>
              </div>

              <div className="text-center">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleSaveNotifications}
                >
                  변경사항 저장
                </Button>
              </div>
            </div>
          )}

          {/* Security Section */}
          {activeSection === "security" && (
            <div>
              <h1 className="text-h2 text-neutral-900 mb-6 flex items-center gap-2">
                🔒 보안 설정
              </h1>

              <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
                <h3 className="text-h4 text-neutral-900 mb-4">🔑 비밀번호 변경</h3>
                <p className="text-body text-neutral-600 mb-6">
                  비밀번호 변경 기능은 곧 제공될 예정입니다.
                </p>
              </div>
            </div>
          )}

          {/* Account Section */}
          {activeSection === "account" && (
            <div>
              <h1 className="text-h2 text-neutral-900 mb-6 flex items-center gap-2">
                🌐 계정 관리
              </h1>

              <div className="bg-red-50 rounded-xl border-2 border-red-200 p-6">
                <h3 className="text-h4 text-red-700 font-bold mb-4 flex items-center gap-2">
                  ⚠️ 계정 탈퇴
                </h3>
                <div className="text-sm text-neutral-700 space-y-2 mb-4">
                  <p>탈퇴 시 주의사항:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>모든 감정 기록 및 데이터가 영구적으로 삭제됩니다</li>
                    <li>커뮤니티 게시글 및 댓글은 익명 처리됩니다</li>
                    <li>탈퇴 후 30일간 재가입이 제한됩니다</li>
                    <li>탈퇴 후 7일 이내 복구 가능 (이후 영구 삭제)</li>
                  </ul>
                </div>
                <Button
                  variant="ghost"
                  size="lg"
                  className="w-full bg-red-600 text-white hover:bg-red-700"
                  onClick={() => alert("계정 탈퇴 기능은 곧 제공될 예정입니다")}
                >
                  계정 탈퇴하기
                </Button>
              </div>
            </div>
          )}

          {/* Data Section */}
          {activeSection === "data" && (
            <div>
              <h1 className="text-h2 text-neutral-900 mb-6 flex items-center gap-2">
                📊 데이터 관리
              </h1>
              <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
                <p className="text-body text-neutral-600">
                  데이터 내보내기 및 삭제 기능은 곧 제공될 예정입니다.
                </p>
              </div>
            </div>
          )}

          {/* Info Section */}
          {activeSection === "info" && (
            <div>
              <h1 className="text-h2 text-neutral-900 mb-6 flex items-center gap-2">
                ℹ️ 앱 정보
              </h1>
              <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
                <div className="space-y-4 text-body text-neutral-700">
                  <div>
                    <p className="font-semibold">앱 버전</p>
                    <p className="text-neutral-600">1.0.0</p>
                  </div>
                  <div>
                    <p className="font-semibold">마지막 업데이트</p>
                    <p className="text-neutral-600">2024년 1월 15일</p>
                  </div>
                  <div className="pt-4 border-t border-neutral-200 space-y-2">
                    <button className="block text-primary-600 hover:text-primary-700">
                      이용약관
                    </button>
                    <button className="block text-primary-600 hover:text-primary-700">
                      개인정보 처리방침
                    </button>
                    <button className="block text-primary-600 hover:text-primary-700">
                      오픈소스 라이선스
                    </button>
                    <button className="block text-primary-600 hover:text-primary-700">
                      고객센터 문의
                    </button>
                  </div>
                  <p className="text-sm text-neutral-500 pt-4">
                    © 2024 마음쉼표. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
