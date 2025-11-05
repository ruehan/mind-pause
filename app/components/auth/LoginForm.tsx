import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Input } from "../Input";
import { Button } from "../Button";
import { SocialLoginButtons } from "./SocialLoginButtons";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../ToastProvider";

export function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "이메일을 입력해주세요";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다";
    }

    if (!password) {
      newErrors.password = "비밀번호를 입력해주세요";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
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
      setErrors({ email: errorMessage });
      showToast(errorMessage, { type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="glass-strong rounded-2xl shadow-soft hover:shadow-elevation-3 transition-all duration-300 p-8 sm:p-12">
        {/* Title */}
        <h1 className="text-h2 text-neutral-900 mb-8 text-center">
          다시 만나서 반가워요!
        </h1>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <Input
            type="email"
            label="이메일"
            placeholder="example@email.com"
            value={email}
            onChange={(value) => {
              setEmail(value);
              if (errors.email) {
                setErrors({ ...errors, email: undefined });
              }
            }}
            error={errors.email}
            required
          />

          {/* Password Input */}
          <Input
            type="password"
            label="비밀번호"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(value) => {
              setPassword(value);
              if (errors.password) {
                setErrors({ ...errors, password: undefined });
              }
            }}
            error={errors.password}
            required
          />

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link
              to="/login?mode=forgot"
              className="text-body-sm text-primary-600 hover:text-primary-700 transition-colors"
            >
              비밀번호 찾기
            </Link>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </Button>
        </form>

        {/* Social Login */}
        <SocialLoginButtons />

        {/* Signup Link */}
        <div className="mt-6 text-center">
          <p className="text-body-sm text-neutral-600">
            계정이 없으신가요?{" "}
            <Link
              to="/login?mode=signup"
              className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
