export function SocialLoginButtons() {
  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth
    console.log("Google login clicked");
  };

  const handleKakaoLogin = () => {
    // TODO: Implement Kakao OAuth
    console.log("Kakao login clicked");
  };

  return (
    <div className="space-y-3">
      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-200"></div>
        </div>
        <div className="relative flex justify-center text-body-sm">
          <span className="px-4 bg-white text-neutral-500">또는</span>
        </div>
      </div>

      {/* Google Login Button */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-neutral-300 rounded-lg bg-white text-neutral-700 hover:bg-neutral-50 transition-colors duration-200 text-body font-medium"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Google로 계속하기
      </button>

      {/* Kakao Login Button */}
      <button
        type="button"
        onClick={handleKakaoLogin}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-[#FEE500] text-[#000000] hover:bg-[#FDD835] transition-colors duration-200 text-body font-medium"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.8 5.1 4.5 6.6l-1.2 4.5c-.1.3.2.6.5.4l5.4-3.6c.3 0 .5 0 .8 0 5.523 0 10-3.477 10-7.8S17.523 3 12 3z" />
        </svg>
        Kakao로 계속하기
      </button>
    </div>
  );
}
