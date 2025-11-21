import { Link } from "react-router";
import { Button } from "~/components/Button";
import { Input } from "~/components/Input";
import { Mail, Lock, Github, Chrome } from "lucide-react";
import { useState } from "react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="space-y-6 animate-fade-in">
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 z-10" />
            <Input
              type="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={setEmail}
              className="pl-10 py-6 bg-neutral-50 border-neutral-200 focus:bg-white transition-colors"
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

        <Button variant="primary" size="lg" className="w-full py-6 text-lg shadow-primary hover:shadow-primary-strong transition-all duration-300">
          로그인하기
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

      <div className="grid grid-cols-2 gap-4">
        <button className="flex items-center justify-center gap-2 px-4 py-3 border border-neutral-200 rounded-xl hover:bg-neutral-50 hover:border-neutral-300 transition-all duration-200">
          <Chrome className="w-5 h-5" />
          <span className="font-medium text-neutral-700">Google</span>
        </button>
        <button className="flex items-center justify-center gap-2 px-4 py-3 border border-neutral-200 rounded-xl hover:bg-neutral-50 hover:border-neutral-300 transition-all duration-200">
          <Github className="w-5 h-5" />
          <span className="font-medium text-neutral-700">GitHub</span>
        </button>
      </div>

      <p className="text-center text-neutral-600">
        아직 계정이 없으신가요?{" "}
        <Link to="?mode=signup" className="text-primary-600 font-bold hover:underline">
          3초 만에 회원가입
        </Link>
      </p>
    </div>
  );
}
