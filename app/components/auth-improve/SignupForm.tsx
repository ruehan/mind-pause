import { Link } from "react-router";
import { Button } from "~/components/Button";
import { Input } from "~/components/Input";
import { Mail, Lock, User, Check } from "lucide-react";
import { useState } from "react";

export function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return 0;
    let strength = 0;
    if (pwd.length >= 8) strength += 1;
    if (/[A-Z]/.test(pwd)) strength += 1;
    if (/[0-9]/.test(pwd)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 1;
    return strength;
  };

  const strength = getPasswordStrength(password);

  return (
    <div className="space-y-6 animate-fade-in">
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 z-10" />
            <Input
              type="text"
              placeholder="이름 (닉네임)"
              value={name}
              onChange={setName}
              className="pl-10 py-6 bg-neutral-50 border-neutral-200 focus:bg-white transition-colors"
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 z-10" />
            <Input
              type="email"
              placeholder="이메일 주소"
              value={email}
              onChange={setEmail}
              className="pl-10 py-6 bg-neutral-50 border-neutral-200 focus:bg-white transition-colors"
            />
          </div>
          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 z-10" />
              <Input
                type="password"
                placeholder="비밀번호 (8자 이상)"
                value={password}
                onChange={setPassword}
                className="pl-10 py-6 bg-neutral-50 border-neutral-200 focus:bg-white transition-colors"
              />
            </div>
            {/* Password Strength Indicator */}
            <div className="flex gap-1 h-1">
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`flex-1 rounded-full transition-colors duration-300 ${
                    strength >= level
                      ? strength <= 2
                        ? "bg-red-400"
                        : strength === 3
                        ? "bg-yellow-400"
                        : "bg-green-500"
                      : "bg-neutral-100"
                  }`}
                ></div>
              ))}
            </div>
            <p className="text-xs text-neutral-500 text-right">
              {strength === 0 && "비밀번호를 입력해주세요"}
              {strength > 0 && strength <= 2 && "비밀번호가 약합니다"}
              {strength === 3 && "적절한 비밀번호입니다"}
              {strength === 4 && "아주 강력한 비밀번호입니다"}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative flex items-center">
              <input type="checkbox" className="peer sr-only" />
              <div className="w-5 h-5 border-2 border-neutral-300 rounded peer-checked:bg-primary-600 peer-checked:border-primary-600 transition-all"></div>
              <Check className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 left-1 top-1 transition-opacity" />
            </div>
            <span className="text-sm text-neutral-600 leading-tight pt-0.5">
              <Link to="/terms" className="text-primary-600 hover:underline">이용약관</Link> 및 <Link to="/privacy" className="text-primary-600 hover:underline">개인정보처리방침</Link>에 동의합니다.
            </span>
          </label>
        </div>

        <Button variant="primary" size="lg" className="w-full py-6 text-lg shadow-primary hover:shadow-primary-strong transition-all duration-300">
          회원가입 완료
        </Button>
      </form>

      <p className="text-center text-neutral-600">
        이미 계정이 있으신가요?{" "}
        <Link to="?mode=login" className="text-primary-600 font-bold hover:underline">
          로그인하기
        </Link>
      </p>
    </div>
  );
}
