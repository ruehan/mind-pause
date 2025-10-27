import { Link } from "react-router";

export function Footer() {
  return (
    <footer className="bg-neutral-50 border-t border-neutral-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-lavender-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">,</span>
              </div>
              <span className="text-h5 font-bold text-neutral-900">
                마음쉼표
              </span>
            </Link>
            <p className="text-body-sm text-neutral-600 max-w-md">
              AI 기반 감정 케어로 매일을 더 따뜻하게.
              <br />
              마음의 쉼표가 필요한 순간, 언제든 함께합니다.
            </p>
          </div>

          {/* Service Links */}
          <div>
            <h3 className="text-label font-semibold text-neutral-900 mb-4">
              서비스
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#features"
                  className="text-body-sm text-neutral-600 hover:text-primary-600 transition-colors"
                >
                  서비스 소개
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="text-body-sm text-neutral-600 hover:text-primary-600 transition-colors"
                >
                  기능
                </a>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-body-sm text-neutral-600 hover:text-primary-600 transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-label font-semibold text-neutral-900 mb-4">
              법적 고지
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/privacy"
                  className="text-body-sm text-neutral-600 hover:text-primary-600 transition-colors"
                >
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-body-sm text-neutral-600 hover:text-primary-600 transition-colors"
                >
                  이용약관
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-neutral-200">
          <p className="text-caption text-neutral-500 text-center">
            © 2025 Mind Pause. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
