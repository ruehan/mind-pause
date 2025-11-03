import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Input } from "../Input";
import { Button } from "../Button";
import { Checkbox } from "../Checkbox";
import { SocialLoginButtons } from "./SocialLoginButtons";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../ToastProvider";

export function SignupForm() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { showToast } = useToast();

  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [errors, setErrors] = useState<{
    nickname?: string;
    email?: string;
    password?: string;
    terms?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: {
      nickname?: string;
      email?: string;
      password?: string;
      terms?: string;
    } = {};

    if (!nickname) {
      newErrors.nickname = "닉네임을 입력해주세요";
    } else if (nickname.length < 2) {
      newErrors.nickname = "닉네임은 2자 이상이어야 합니다";
    }

    if (!email) {
      newErrors.email = "이메일을 입력해주세요";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다";
    }

    if (!password) {
      newErrors.password = "비밀번호를 입력해주세요";
    } else if (password.length < 8) {
      newErrors.password = "비밀번호는 8자 이상이어야 합니다";
    } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
      newErrors.password = "비밀번호는 영문과 숫자를 포함해야 합니다";
    }

    if (!agreeTerms || !agreePrivacy) {
      newErrors.terms = "필수 약관에 동의해주세요";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      await signup(email, nickname, password);
      showToast("회원가입 성공! 로그인되었습니다.", "success");
      navigate("/dashboard");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "회원가입에 실패했습니다";

      // 에러 메시지에 따라 적절한 필드에 에러 표시
      if (errorMessage.includes("이메일")) {
        setErrors({ email: errorMessage });
      } else if (errorMessage.includes("닉네임")) {
        setErrors({ nickname: errorMessage });
      } else {
        setErrors({ email: errorMessage });
      }

      showToast(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="glass-strong rounded-2xl shadow-soft hover:shadow-elevation-3 transition-all duration-300 p-8 sm:p-12">
        {/* Title */}
        <h1 className="text-h2 text-neutral-900 mb-2 text-center">
          마음쉼표와 함께
        </h1>
        <p className="text-body text-neutral-600 mb-8 text-center">
          시작해보세요
        </p>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nickname Input */}
          <Input
            type="text"
            label="닉네임"
            placeholder="닉네임을 입력하세요"
            value={nickname}
            onChange={(value) => {
              setNickname(value);
              if (errors.nickname) {
                setErrors({ ...errors, nickname: undefined });
              }
            }}
            error={errors.nickname}
            helperText={!errors.nickname ? "2자 이상" : undefined}
            required
          />

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
            helperText={
              !errors.password ? "8자 이상, 영문+숫자 조합" : undefined
            }
            required
          />

          {/* Terms Agreement */}
          <div className="space-y-3 pt-2">
            <Checkbox
              label="이용약관 동의"
              checked={agreeTerms}
              onChange={(checked) => {
                setAgreeTerms(checked);
                if (errors.terms) {
                  setErrors({ ...errors, terms: undefined });
                }
              }}
              required
              link={{ text: "보기", href: "/terms" }}
            />
            <Checkbox
              label="개인정보처리방침 동의"
              checked={agreePrivacy}
              onChange={(checked) => {
                setAgreePrivacy(checked);
                if (errors.terms) {
                  setErrors({ ...errors, terms: undefined });
                }
              }}
              required
              link={{ text: "보기", href: "/privacy" }}
            />
            {errors.terms && (
              <p className="text-body-sm text-error mt-2">{errors.terms}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "가입 중..." : "회원가입"}
          </Button>
        </form>

        {/* Social Login */}
        <SocialLoginButtons />

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-body-sm text-neutral-600">
            이미 계정이 있으신가요?{" "}
            <Link
              to="/login?mode=login"
              className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
