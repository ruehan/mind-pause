import { useState } from "react";
import { AppLayout } from "../components/AppLayout";
import { SearchBar } from "../components/help/SearchBar";
import { CategorySidebar } from "../components/help/CategorySidebar";
import { FAQItem } from "../components/help/FAQItem";
import { ContactOptionCard } from "../components/help/ContactOptionCard";
import { PopularFAQSection } from "../components/help/PopularFAQSection";
import { VideoTutorialSection } from "../components/help/VideoTutorialSection";
import { Mail, MessageCircle, Phone } from "lucide-react";

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
    category: "감정 기록",
    question: "감정 기록을 어떻게 수정하나요?",
    shortAnswer:
      "감정 기록 페이지에서 해당 기록을 찾아 수정 버튼을 클릭하면 됩니다.",
    fullAnswer:
      "감정 기록을 수정하려면:\n\n1. 감정 기록 페이지로 이동하세요\n2. 수정하고 싶은 기록을 찾아 클릭합니다\n3. '수정하기' 버튼을 클릭하세요\n4. 내용을 수정한 후 '저장' 버튼을 누르면 됩니다\n\n과거 7일 이내의 기록만 수정 가능합니다.",
    isPopular: true,
  },
  {
    id: "2",
    category: "AI 채팅",
    question: "AI 코치는 어떻게 이용하나요?",
    shortAnswer: "채팅 페이지에서 AI와 대화를 시작하실 수 있습니다.",
    fullAnswer:
      "AI 코치 이용 방법:\n\n1. 상단 메뉴에서 '채팅' 탭을 클릭하세요\n2. 화면 하단의 입력창에 고민이나 질문을 입력합니다\n3. AI가 24시간 언제든지 답변을 제공합니다\n\n무료 플랜에서는 하루 10회까지 이용 가능합니다.",
    isPopular: true,
  },
  {
    id: "3",
    category: "계정",
    question: "계정을 삭제하려면 어떻게 하나요?",
    shortAnswer: "설정 > 계정 관리에서 계정 탈퇴를 진행하실 수 있습니다.",
    fullAnswer:
      "계정 삭제 절차:\n\n1. 프로필 > 설정으로 이동하세요\n2. '계정 관리' 섹션을 찾습니다\n3. '계정 탈퇴하기' 버튼을 클릭합니다\n4. 탈퇴 사유를 선택하고 확인합니다\n\n⚠️ 주의: 탈퇴 후 7일 이내 복구 가능하며, 이후 모든 데이터가 영구 삭제됩니다.",
    isPopular: true,
  },
  {
    id: "4",
    category: "커뮤니티",
    question: "커뮤니티 글이 삭제되었어요",
    shortAnswer:
      "커뮤니티 가이드라인을 위반한 게시물은 관리자에 의해 삭제될 수 있습니다.",
    fullAnswer:
      "게시물 삭제 사유:\n\n• 욕설, 비방, 혐오 표현\n• 개인정보 노출\n• 상업적 광고\n• 불법 정보 유포\n\n게시물이 부당하게 삭제되었다고 생각하신다면 고객센터로 문의해주세요.",
    isPopular: false,
  },
  {
    id: "5",
    category: "챌린지",
    question: "챌린지를 중도에 포기할 수 있나요?",
    shortAnswer: "네, 가능합니다. 챌린지 카드에서 포기하기를 선택하세요.",
    fullAnswer:
      "챌린지 포기 방법:\n\n1. 챌린지 페이지에서 진행 중인 챌린지를 찾습니다\n2. 챌린지 카드의 '포기하기' 버튼을 클릭합니다\n3. 확인 메시지에서 '확인'을 누릅니다\n\n포기하면 해당 챌린지의 진행 기록이 초기화되며, 언제든지 다시 시작할 수 있습니다.",
    isPopular: false,
  },
  {
    id: "6",
    category: "감정 기록",
    question: "감정 기록은 얼마나 보관되나요?",
    shortAnswer: "모든 감정 기록은 영구적으로 보관됩니다.",
    fullAnswer:
      "감정 기록 보관:\n\n• 모든 기록은 계정이 유지되는 한 영구 보관됩니다\n• 언제든지 과거 기록을 조회할 수 있습니다\n• 데이터는 암호화되어 안전하게 저장됩니다\n• 백업 기능을 통해 내보내기도 가능합니다",
    isPopular: true,
  },
];

const mockVideoTutorials = [
  {
    id: "v1",
    title: "마음쉼표 시작하기",
    description: "회원가입부터 첫 감정 기록까지, 5분 만에 시작하는 방법",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "5:23",
    thumbnail: "https://placehold.co/400x225/6366F1/FFFFFF?text=Tutorial+1",
  },
  {
    id: "v2",
    title: "AI 코치 활용법",
    description: "AI 코치와 효과적으로 대화하는 방법과 팁",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "7:15",
    thumbnail: "https://placehold.co/400x225/A78BFA/FFFFFF?text=Tutorial+2",
  },
  {
    id: "v3",
    title: "커뮤니티 이용하기",
    description: "안전하고 따뜻한 커뮤니티 참여 가이드",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "4:50",
    thumbnail: "https://placehold.co/400x225/34D399/FFFFFF?text=Tutorial+3",
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
    // Scroll to the FAQ in the list
    const element = document.getElementById(`faq-${faqId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
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

  // Get popular FAQs for the top section
  const popularFAQs = mockFAQs.filter((faq) => faq.isPopular);

  return (
    <AppLayout>
      <div className="flex h-full -mx-4 sm:-mx-6 lg:-mx-8 -my-6">
        {/* Category Sidebar - Desktop */}
        <div className="hidden lg:block w-64">
          <CategorySidebar
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 lg:p-8 bg-neutral-50 overflow-y-auto">
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
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Popular FAQ Section */}
        <PopularFAQSection faqs={popularFAQs} onViewDetail={handleViewDetail} />

        {/* Video Tutorials */}
        <VideoTutorialSection tutorials={mockVideoTutorials} />

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
              <h2 className="text-h3 text-neutral-900 mb-6">
                카테고리별 질문
              </h2>
              {filteredFAQs.length > 0 ? (
                <div className="space-y-3">
                  {filteredFAQs.map((faq) => (
                    <div key={faq.id} id={`faq-${faq.id}`}>
                      <FAQItem
                        question={faq.question}
                        shortAnswer={faq.shortAnswer}
                        fullAnswer={faq.fullAnswer}
                        isPopular={faq.isPopular}
                        category={faq.category}
                      />
                    </div>
                  ))}
                </div>
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
                  icon={Mail}
                  title="이메일"
                  details="답변: 24시간 이내"
                  action={{
                    label: "문의하기 →",
                    onClick: handleEmailInquiry,
                  }}
                />
                <ContactOptionCard
                  icon={MessageCircle}
                  title="1:1 채팅"
                  details="답변: 즉시"
                  action={{
                    label: "채팅 시작 →",
                    onClick: handleStartChat,
                  }}
                />
                <ContactOptionCard
                  icon={Phone}
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
        </div>
      </div>
    </AppLayout>
  );
}
