import { useState } from "react";
import { Link } from "react-router";
import { Menu, X } from "lucide-react";
import { Button } from "./Button";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="마음쉼표 로고" className="w-14 h-14 rounded-lg" />
            <span className="text-xl font-bold text-neutral-900 tracking-tight">
              마음쉼표
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="/#about"
              className="text-body text-neutral-700 hover:text-primary-600 transition-colors"
            >
              서비스 소개
            </a>
            <a
              href="/#features"
              className="text-body text-neutral-700 hover:text-primary-600 transition-colors"
            >
              기능
            </a>
            <Link
              to="/qna"
              className="text-body text-neutral-700 hover:text-primary-600 transition-colors"
            >
              자주 묻는 질문
            </Link>
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" href="/login" size="sm">
              로그인
            </Button>
            <Button variant="primary" href="/login?mode=signup" size="sm">
              시작하기
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="메뉴 열기"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-neutral-700" />
            ) : (
              <Menu className="w-6 h-6 text-neutral-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-neutral-200 animate-fade-in">
            <nav className="flex flex-col space-y-4">
              <a
                href="/#about"
                className="text-body text-neutral-700 hover:text-primary-600 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                서비스 소개
              </a>
              <a
                href="/#features"
                className="text-body text-neutral-700 hover:text-primary-600 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                기능
              </a>
              <Link
                to="/qna"
                className="text-body text-neutral-700 hover:text-primary-600 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                자주 묻는 질문
              </Link>
              <div className="pt-4 flex flex-col space-y-3">
                <Button variant="ghost" href="/login" size="md">
                  로그인
                </Button>
                <Button variant="primary" href="/login?mode=signup" size="md">
                  시작하기
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
