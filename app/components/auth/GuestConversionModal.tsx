import { useState } from "react";
import { useNavigate } from "react-router";
import { Input } from "../Input";
import { Button } from "../Button";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../ToastProvider";
import * as api from "../../lib/api";

interface GuestConversionModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export function GuestConversionModal({
  isOpen,
  onClose,
  message = "이 기능은 정회원만 사용할 수 있습니다",
}: GuestConversionModalProps) {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    nickname?: string;
    password?: string;
    passwordConfirm?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: typeof errors = {};

    if (!email) {
      newErrors.email = "이메일을 입력해주세요";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다";
    }

    if (!nickname) {
      newErrors.nickname = "닉네임을 입력해주세요";
    } else if (nickname.length < 2 || nickname.length > 100) {
      newErrors.nickname = "닉네임은 2-100자로 입력해주세요";
    }

    if (!password) {
      newErrors.password = "비밀번호를 입력해주세요";
    } else if (password.length < 8) {
      newErrors.password = "비밀번호는 최소 8자 이상이어야 합니다";
    } else if (!/(?=.*[0-9])(?=.*[a-zA-Z])/.test(password)) {
      newErrors.password = "비밀번호는 최소 1개의 숫자와 문자를 포함해야 합니다";
    }

    if (!passwordConfirm) {
      newErrors.passwordConfirm = "비밀번호 확인을 입력해주세요";
    } else if (password !== passwordConfirm) {
      newErrors.passwordConfirm = "비밀번호가 일치하지 않습니다";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      await api.convertGuest({ email, nickname, password });
      await refreshUser(); // 사용자 정보 갱신
      showToast("정회원 전환이 완료되었습니다!", { type: "success" });
      onClose();
      navigate("/dashboard");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "정회원 전환에 실패했습니다";
      showToast(errorMessage, { type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-elevation-3 p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-lavender-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✨</span>
          </div>
          <h2 className="text-h3 text-neutral-900 mb-2">정회원으로 업그레이드</h2>
          <p className="text-body text-neutral-600">{message}</p>
        </div>

        {/* Benefits */}
        <div className="bg-primary-50 rounded-xl p-4 mb-6">
          <h3 className="text-body-sm font-semibold text-neutral-900 mb-3">
            🎉 정회원 혜택
          </h3>
          <ul className="space-y-2 text-body-sm text-neutral-700">
            <li className="flex items-start gap-2">
              <span className="text-primary-600">✓</span>
              <span>무제한 AI 대화 및 캐릭터 생성</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600">✓</span>
              <span>커뮤니티 글쓰기 및 댓글 작성</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600">✓</span>
              <span>챌린지 참여 및 보상 획득</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600">✓</span>
              <span>모든 데이터 영구 보관</span>
            </li>
          </ul>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <Input
            type="text"
            label="닉네임"
            placeholder="닉네임 (2-100자)"
            value={nickname}
            onChange={(value) => {
              setNickname(value);
              if (errors.nickname) {
                setErrors({ ...errors, nickname: undefined });
              }
            }}
            error={errors.nickname}
            required
          />

          <Input
            type="password"
            label="비밀번호"
            placeholder="비밀번호 (8자 이상, 숫자+문자)"
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

          <Input
            type="password"
            label="비밀번호 확인"
            placeholder="비밀번호를 다시 입력하세요"
            value={passwordConfirm}
            onChange={(value) => {
              setPasswordConfirm(value);
              if (errors.passwordConfirm) {
                setErrors({ ...errors, passwordConfirm: undefined });
              }
            }}
            error={errors.passwordConfirm}
            required
          />

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              size="lg"
              className="flex-1"
              onClick={onClose}
              disabled={isLoading}
            >
              나중에
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? "전환 중..." : "정회원 전환"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
