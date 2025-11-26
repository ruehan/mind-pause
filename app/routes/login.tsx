import { useSearchParams } from "react-router";
import { AuthLayout } from "~/components/auth-improve/AuthLayout";
import { LoginForm } from "~/components/auth-improve/LoginForm";
import { SignupForm } from "~/components/auth-improve/SignupForm";
import type { Route } from "./+types/login";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "로그인 - 마음쉼표" },
    { name: "description", content: "마음쉼표에 로그인하고 AI 기반 감정 케어를 시작하세요" },
  ];
}

export default function LoginImprove() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "login";
  const isLogin = mode === "login";

  return (
    <AuthLayout
      title={isLogin ? "다시 오셨군요! 👋" : "마음쉼표 시작하기 ✨"}
      subtitle={
        isLogin
          ? "오늘 하루는 어떠셨나요? 당신의 이야기를 들려주세요."
          : "간편하게 가입하고 나만의 AI 감정 코치를 만나보세요."
      }
    >
      {isLogin ? <LoginForm /> : <SignupForm />}
    </AuthLayout>
  );
}
