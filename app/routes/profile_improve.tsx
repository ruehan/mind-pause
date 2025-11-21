import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { DashboardLayout } from "~/components/dashboard-improve/DashboardLayout";
import { ProfileLayout } from "~/components/profile-improve/ProfileLayout";
import { SettingsNav } from "~/components/profile-improve/SettingsNav";
import { ProfileHeader } from "~/components/profile-improve/ProfileHeader";
import { ProfileStatistics } from "~/components/profile-improve/ProfileStatistics";
import { BadgeShowcase, defaultBadges } from "~/components/profile-improve/BadgeShowcase";
import { NotificationCheckbox } from "~/components/profile/NotificationCheckbox"; // Reuse existing
import { Button } from "~/components/Button";
import { useToast } from "~/components/ToastProvider";
import { ConfirmDialog } from "~/components/ConfirmDialog";
import { useAuth } from "~/contexts/AuthContext";
import type { Route } from "./+types/profile_improve";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "프로필 설정 - 마음쉼표" },
    { name: "description", content: "나의 프로필과 설정을 관리하세요" },
  ];
}

export default function ProfileImprove() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const toast = useToast();
  
  const [activeSection, setActiveSection] = useState<
    "profile" | "stats" | "notification" | "security" | "account" | "data" | "info"
  >("profile");
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSavingNotifications, setIsSavingNotifications] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const [nickname, setNickname] = useState(user?.nickname || "");
  const [profileImage, setProfileImage] = useState<string | undefined>(user?.profile_image_url || undefined);

  useEffect(() => {
    if (user) {
      setNickname(user.nickname);
      setProfileImage(user.profile_image_url || undefined);
    }
  }, [user]);

  const [emailNotifications, setEmailNotifications] = useState({
    dailyReminder: false,
    weeklySummary: true,
    newComment: true,
    like: false,
    challenge: true,
  });

  const handleSaveNotifications = async () => {
    setIsSavingNotifications(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("저장 완료", "알림 설정이 저장되었습니다.");
    } catch (error) {
      toast.error("오류", "저장 중 문제가 발생했습니다.");
    } finally {
      setIsSavingNotifications(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("로그아웃", "성공적으로 로그아웃되었습니다.");
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("탈퇴 처리됨", "7일 이내 복구 가능합니다.");
      setIsDeleteDialogOpen(false);
      navigate("/");
    } catch (error) {
      toast.error("오류", "탈퇴 처리 중 문제가 발생했습니다.");
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <DashboardLayout>
      <ProfileLayout>
        <div className="animate-fade-in space-y-8">
          {/* Header Section */}
          <ProfileHeader
            nickname={nickname}
            email={user?.is_anonymous ? "게스트 계정" : (user?.email || "이메일 없음")}
            joinDate={user?.created_at ? new Date(user.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }) : "2024.01.01"}
            profileImage={profileImage}
            completionPercentage={75}
          />

          {/* Navigation Tabs */}
          <SettingsNav
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />

          {/* Main Content */}
          <div className="min-h-[400px]">
            {activeSection === "profile" && (
              <div className="animate-fade-in">
                <ProfileStatistics
                  totalEmotionLogs={125}
                  averageEmotionScore={2.3}
                  challengeCompletionRate={87}
                  communityLikes={42}
                  communityComments={18}
                  currentStreak={5}
                />
                <BadgeShowcase badges={defaultBadges} />
              </div>
            )}

            {activeSection === "notification" && (
              <div className="animate-fade-in">
                <h2 className="text-h2 font-bold text-neutral-900 mb-6">알림 설정</h2>
                <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/50 shadow-sm p-6 mb-6">
                  <h3 className="text-h4 font-bold text-neutral-900 mb-4">이메일 알림</h3>
                  <div className="space-y-4">
                    <NotificationCheckbox
                      label="매일 감정 기록 리마인더 (오후 8시)"
                      checked={emailNotifications.dailyReminder}
                      onChange={(checked) => setEmailNotifications({ ...emailNotifications, dailyReminder: checked })}
                    />
                    <NotificationCheckbox
                      label="주간 감정 요약 리포트 (일요일 오전 10시)"
                      checked={emailNotifications.weeklySummary}
                      onChange={(checked) => setEmailNotifications({ ...emailNotifications, weeklySummary: checked })}
                    />
                    <NotificationCheckbox
                      label="새로운 댓글 알림"
                      checked={emailNotifications.newComment}
                      onChange={(checked) => setEmailNotifications({ ...emailNotifications, newComment: checked })}
                    />
                    <NotificationCheckbox
                      label="공감 알림"
                      checked={emailNotifications.like}
                      onChange={(checked) => setEmailNotifications({ ...emailNotifications, like: checked })}
                    />
                    <NotificationCheckbox
                      label="챌린지 시작 및 완료 알림"
                      checked={emailNotifications.challenge}
                      onChange={(checked) => setEmailNotifications({ ...emailNotifications, challenge: checked })}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <Button
                    variant="primary"
                    onClick={handleSaveNotifications}
                    loading={isSavingNotifications}
                  >
                    변경사항 저장
                  </Button>
                </div>
              </div>
            )}

            {activeSection === "account" && (
              <div className="animate-fade-in space-y-6">
                <h2 className="text-h2 font-bold text-neutral-900 mb-6">계정 관리</h2>
                
                <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/50 shadow-sm p-6">
                  <h3 className="text-h4 font-bold text-neutral-900 mb-2">로그아웃</h3>
                  <p className="text-body-sm text-neutral-600 mb-4">
                    현재 기기에서 로그아웃합니다.
                  </p>
                  <Button variant="secondary" onClick={handleLogout}>
                    로그아웃
                  </Button>
                </div>

                <div className="bg-red-50/80 backdrop-blur-md rounded-2xl border border-red-100 p-6">
                  <h3 className="text-h4 font-bold text-red-700 mb-2">계정 탈퇴</h3>
                  <p className="text-body-sm text-red-600/80 mb-4">
                    탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
                  </p>
                  <Button 
                    variant="ghost" 
                    className="bg-red-100 text-red-700 hover:bg-red-200"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    계정 탈퇴하기
                  </Button>
                </div>
              </div>
            )}

            {/* Placeholder for other sections */}
            {["stats", "security", "data", "info"].includes(activeSection) && (
              <div className="animate-fade-in">
                <h2 className="text-h2 font-bold text-neutral-900 mb-6">
                  {activeSection === "stats" && "통계 및 분석"}
                  {activeSection === "security" && "보안 설정"}
                  {activeSection === "data" && "데이터 관리"}
                  {activeSection === "info" && "앱 정보"}
                </h2>
                <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/50 shadow-sm p-12 text-center">
                  <div className="text-4xl mb-4">🚧</div>
                  <h3 className="text-h4 font-bold text-neutral-900 mb-2">준비 중인 기능입니다</h3>
                  <p className="text-body text-neutral-500">
                    더 나은 서비스를 위해 열심히 준비하고 있습니다.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <ConfirmDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          title="정말 탈퇴하시겠습니까?"
          description="계정을 탈퇴하면 모든 데이터가 삭제됩니다. 이 작업은 되돌릴 수 없습니다."
          confirmText="탈퇴하기"
          cancelText="취소"
          variant="danger"
          onConfirm={handleDeleteAccount}
          loading={isDeletingAccount}
        />
      </ProfileLayout>
    </DashboardLayout>
  );
}
