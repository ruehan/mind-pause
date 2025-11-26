import { Link, useNavigate } from "react-router";
import { Button } from "~/components/Button";
import { Input } from "~/components/Input";
import { Mail, Lock, Github, Chrome } from "lucide-react";
import { useState } from "react";
import { useAuth } from "~/contexts/AuthContext";
import { useToast } from "~/components/ToastProvider";
import { SocialLoginButtons } from "./SocialLoginButtons";

export function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      showToast("이메일과 비밀번호를 모두 입력해주세요", { type: "error" });
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
      showToast("로그인 성공!", { type: "success" });
      navigate("/dashboard");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "이메일 또는 비밀번호가 올바르지 않습니다";
      showToast(errorMessage, { type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 z-10" />
            <Input
              type="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={setEmail}
              className="pl-10 py-6 bg-neutral-50 border-neutral-200 focus:bg-white transition-colors"
              disabled={isLoading}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 z-10" />
            <Input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={setPassword}
              className="pl-10 py-6 bg-neutral-50 border-neutral-200 focus:bg-white transition-colors"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500 transition-colors" />
            <span className="text-neutral-500 group-hover:text-neutral-700">로그인 상태 유지</span>
          </label>
          <Link to="/forgot-password" className="text-primary-600 hover:text-primary-700 font-medium">
            비밀번호를 잊으셨나요?
          </Link>
        </div>

        <Button 
          type="submit" 
          variant="primary" 
          size="lg" 
          className="w-full py-6 text-lg shadow-primary hover:shadow-primary-strong transition-all duration-300"
          disabled={isLoading}
        >
          {isLoading ? "로그인 중..." : "로그인하기"}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-neutral-500">또는 소셜 계정으로 시작</span>
        </div>
      </div>

      <SocialLoginButtons />



      <p className="text-center text-neutral-600">
        아직 계정이 없으신가요?{" "}
        <Link to="?mode=signup" className="text-primary-600 font-bold hover:underline">
          회원가입
        </Link>
      </p>
    </div>
  );
}
