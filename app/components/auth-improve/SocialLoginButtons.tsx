import { Button } from "~/components/Button";

export function SocialLoginButtons() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="relative group">
          <Button
            type="button"
            variant="secondary"
            className="w-full py-3 border border-[#FEE500] bg-[#FEE500] text-black relative opacity-50 cursor-not-allowed"
            disabled
          >
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 absolute left-4"
              fill="currentColor"
            >
              <path d="M12 3C5.373 3 0 6.903 0 11.719c0 3.03 1.95 5.73 5.04 7.26-.22.82-.8 2.95-.91 3.39-.17.66.24.65.5.43.35-.29 3.86-2.62 4.5-3.06.6.09 1.23.14 1.87.14 6.627 0 12-3.903 12-8.719C24 6.903 18.627 3 12 3z" />
            </svg>
            <span className="text-sm font-medium">카카오</span>
          </Button>
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            준비중입니다
          </div>
        </div>
        <div className="relative group">
          <Button
            type="button"
            variant="secondary"
            className="w-full py-3 border border-neutral-200 bg-white relative opacity-50 cursor-not-allowed"
            disabled
          >
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 absolute left-4"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span className="text-sm font-medium text-neutral-700">Google</span>
          </Button>
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            준비중입니다
          </div>
        </div>
      </div>
      <p className="text-center text-xs text-neutral-400">
        소셜 로그인은 곧 제공될 예정입니다
      </p>
    </div>
  );
}
