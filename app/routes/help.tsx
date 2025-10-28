import { useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { SearchBar } from "../components/help/SearchBar";
import { CategorySidebar } from "../components/help/CategorySidebar";
import { FAQItem } from "../components/help/FAQItem";
import { ContactOptionCard } from "../components/help/ContactOptionCard";

export function meta() {
  return [
    { title: "도움말 - 마음쉼표" },
    {
      name: "description",
      content: "자주 묻는 질문과 도움말을 확인하세요",
    },
  ];
}

// Mock data
const mockFAQs = [
  {
    id: "1",
    category: "emotion_log",
    question: "감정 기록을 어떻게 수정하나요?",
    shortAnswer:
      "감정 기록 페이지에서 해당 기록을 찾아 수정 버튼을 클릭하면 됩니다.",
    isPopular: true,
  },
  {
    id: "2",
    category: "ai_coach",
    question: "AI 코치는 어떻게 이용하나요?",
    shortAnswer: "채팅 페이지에서 AI와 대화를 시작하실 수 있습니다.",
    isPopular: true,
  },
  {
    id: "3",
    category: "account",
    question: "계정을 삭제하려면 어떻게 하나요?",
    shortAnswer: "설정 > 계정 관리에서 계정 탈퇴를 진행하실 수 있습니다.",
    isPopular: true,
  },
  {
    id: "4",
    category: "community",
    question: "커뮤니티 글이 삭제되었어요",
    shortAnswer:
      "커뮤니티 가이드라인을 위반한 게시물은 관리자에 의해 삭제될 수 있습니다.",
    isPopular: false,
  },
  {
    id: "5",
    category: "challenge",
    question: "챌린지를 중도에 포기할 수 있나요?",
    shortAnswer: "네, 가능합니다. 챌린지 카드에서 포기하기를 선택하세요.",
    isPopular: false,
  },
];

export default function Help() {
  const [activeCategory, setActiveCategory] = useState("getting_started");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log("Searching for:", query);
    // TODO: Implement search functionality
  };

  const handleViewDetail = (faqId: string) => {
    console.log("Viewing FAQ detail:", faqId);
    // TODO: Navigate to FAQ detail page or show modal
  };

  const handleEmailInquiry = () => {
    console.log("Opening email inquiry modal");
    // TODO: Open email inquiry modal
  };

  const handleStartChat = () => {
    console.log("Starting 1:1 chat");
    // TODO: Navigate to chat or open chat widget
  };

  // Filter FAQs by category
  const filteredFAQs = mockFAQs.filter(
    (faq) => activeCategory === "getting_started" || faq.category === activeCategory
  );

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">ℹ️</span>
            <div>
              <h1 className="text-h2 text-neutral-900">도움말</h1>
              <p className="text-body text-neutral-600 mt-1">
                무엇을 도와드릴까요?
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Category Sidebar - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <CategorySidebar
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>

          {/* Category List - Mobile */}
          <div className="lg:hidden mb-6">
            <CategorySidebar
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>

          {/* FAQ List */}
          <div className="flex-1">
            <div className="mb-8">
              <h2 className="text-h3 text-neutral-900 mb-4 flex items-center gap-2">
                ❓ 자주 묻는 질문
              </h2>
              {filteredFAQs.length > 0 ? (
                <>
                  {filteredFAQs.map((faq) => (
                    <FAQItem
                      key={faq.id}
                      question={faq.question}
                      shortAnswer={faq.shortAnswer}
                      isPopular={faq.isPopular}
                      onViewDetail={() => handleViewDetail(faq.id)}
                    />
                  ))}
                  <div className="text-center mt-4">
                    <button className="text-body text-primary-600 hover:text-primary-700 font-medium transition-colors">
                      더보기 →
                    </button>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-12 text-center">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-h4 text-neutral-700 mb-2">
                    검색 결과가 없습니다
                  </h3>
                  <p className="text-body text-neutral-600">
                    다른 검색어로 시도해보세요
                  </p>
                </div>
              )}
            </div>

            {/* Contact Options */}
            <div className="mb-8">
              <h2 className="text-h3 text-neutral-900 mb-2">💬 문의하기</h2>
              <p className="text-body text-neutral-600 mb-6">
                찾으시는 답변이 없으신가요? 언제든 문의해주세요!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ContactOptionCard
                  icon="📧"
                  title="이메일"
                  details="답변: 24시간 이내"
                  action={{
                    label: "문의하기 →",
                    onClick: handleEmailInquiry,
                  }}
                />
                <ContactOptionCard
                  icon="💬"
                  title="1:1 채팅"
                  details="답변: 즉시"
                  action={{
                    label: "채팅 시작 →",
                    onClick: handleStartChat,
                  }}
                />
                <ContactOptionCard
                  icon="📞"
                  title="전화"
                  details="평일 9-18시"
                  action={{
                    label: "010-1234-5678",
                    href: "tel:010-1234-5678",
                  }}
                />
              </div>
            </div>

            {/* Useful Links */}
            <div>
              <h2 className="text-h3 text-neutral-900 mb-4 flex items-center gap-2">
                📚 유용한 링크
              </h2>
              <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-sm text-primary-600 hover:underline"
                    >
                      • 이용약관
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm text-primary-600 hover:underline"
                    >
                      • 개인정보 처리방침
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm text-primary-600 hover:underline"
                    >
                      • 커뮤니티 가이드라인
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm text-primary-600 hover:underline"
                    >
                      • 앱 사용 가이드 (PDF 다운로드)
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm text-primary-600 hover:underline"
                    >
                      • 오픈소스 라이선스
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm text-primary-600 hover:underline"
                    >
                      • 공지사항
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
