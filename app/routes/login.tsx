import { Link, useSearchParams } from "react-router";
import { LoginForm } from "../components/auth/LoginForm";
import { SignupForm } from "../components/auth/SignupForm";

export function meta() {
  return [
    { title: "로그인 - 마음쉼표" },
    {
      name: "description",
      content: "마음쉼표에 로그인하고 AI 기반 감정 케어를 시작하세요",
    },
  ];
}

export default function Login() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "login";

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-lavender-50 relative">
      {/* Mesh Gradient Overlay */}
      <div className="absolute inset-0 gradient-mesh opacity-30 animate-gradient bg-[length:200%_200%]"></div>
      {/* Simple Header */}
      <header className="border-b border-neutral-200 bg-white relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link
              to="/"
              className="flex items-center text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-body">뒤로</span>
            </Link>

            <Link to="/" className="flex items-center ml-8">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-lavender-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">,</span>
              </div>
              <span className="ml-2 text-h5 font-bold text-neutral-900">
                마음쉼표
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          {/* Left Illustration (Desktop Only) */}
          <div className="hidden lg:block lg:col-span-2">
            <div className="relative">
              {/* Decorative circles */}
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary-200 rounded-full opacity-60 blur-3xl animate-pulse-slow"></div>
              <div
                className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-lavender-200 rounded-full opacity-60 blur-3xl animate-pulse-slow"
                style={{ animationDelay: "1s" }}
              ></div>

              {/* Center illustration */}
              <div className="relative z-10 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-lg p-12 max-w-sm">
                  <div className="flex items-center justify-center mb-8">
                    <div className="w-32 h-32 bg-gradient-to-br from-primary-400 to-lavender-500 rounded-full flex items-center justify-center shadow-lg">
                      <svg
                        className="w-16 h-16 text-white"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-neutral-200 rounded-full"></div>
                    <div className="h-4 bg-neutral-200 rounded-full w-3/4"></div>
                    <div className="h-4 bg-neutral-200 rounded-full w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="lg:col-span-3">
            {mode === "signup" ? <SignupForm /> : <LoginForm />}
          </div>
        </div>
      </main>
    </div>
  );
}
