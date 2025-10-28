import { useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { PostCard } from "../components/community/PostCard";
import { FilterTabs } from "../components/community/FilterTabs";
import { Button } from "../components/Button";

export function meta() {
  return [
    { title: "커뮤니티 - 마음쉼표" },
    {
      name: "description",
      content: "함께 나누고 공감하는 따뜻한 공간",
    },
  ];
}

// Mock data
const mockPosts = [
  {
    id: "1",
    author: "익명123",
    isAnonymous: true,
    timestamp: "3시간 전",
    content:
      "오늘 회사에서 실수를 해서 너무 자책하고 있어요.\n\n팀 프로젝트에서 중요한 데이터를 잘못 보내서 팀장님께 지적을 받았어요. 다들 바쁜데 제 실수 때문에 일이 늦어졌고... 너무 미안하고 스스로가 한심하게 느껴져요. 이런 실수를 계속 반복하는 제가 싫어요 😢",
    tags: ["직장스트레스", "자책", "실수"],
    likeCount: 125,
    commentCount: 18,
    isLiked: false,
    isAuthor: false,
  },
  {
    id: "2",
    author: "마음쉼",
    isAnonymous: false,
    timestamp: "1일 전",
    content:
      "불안감이 심할 때 도움이 된 방법들 공유해요 💙\n\n1. 깊게 숨쉬기 (4-7-8 호흡법)\n2. 발바닥에 집중하며 천천히 걷기\n3. 좋아하는 음악 듣기\n4. 따뜻한 차 마시며 5분 멍때리기\n\n다들 어떤 방법 쓰시나요?",
    tags: ["불안", "대처방법", "공유"],
    likeCount: 342,
    commentCount: 67,
    isLiked: true,
    isAuthor: false,
  },
  {
    id: "3",
    author: "희망이",
    isAnonymous: false,
    timestamp: "2일 전",
    content:
      "요즘 아무것도 하기 싫고 무기력해요.\n\n일어나는 것부터 힘들고, 밥도 제대로 못 먹고 있어요. 친구들 만나는 것도 귀찮고... 이렇게 사는 게 맞나 싶어요. 혹시 비슷한 경험 있으신 분 계신가요?",
    tags: ["무기력", "우울", "조언구함"],
    likeCount: 89,
    commentCount: 23,
    isLiked: false,
    isAuthor: false,
  },
];

export default function Community() {
  const [activeFilter, setActiveFilter] = useState<
    "popular" | "latest" | "most-liked" | "most-commented"
  >("popular");

  const handleSearch = () => {
    console.log("Open search");
    // TODO: Implement search functionality
  };

  const handleWritePost = () => {
    console.log("Navigate to write post");
    // TODO: Navigate to write post page
  };

  const handlePostClick = (postId: string) => {
    console.log("Open post detail:", postId);
    // TODO: Navigate to post detail page
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-4xl">💬</span>
              <div>
                <h1 className="text-h2 text-neutral-900">커뮤니티</h1>
                <p className="text-body text-neutral-600 mt-1">
                  함께 나누고 공감하는 따뜻한 공간
                </p>
              </div>
            </div>

            {/* Write Button (Desktop) */}
            <div className="hidden sm:block">
              <Button
                variant="primary"
                size="lg"
                onClick={handleWritePost}
                className="flex items-center gap-2"
              >
                ✏️ 글쓰기
              </Button>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <FilterTabs
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          onSearch={handleSearch}
        />

        {/* Posts List */}
        <div className="max-w-4xl mx-auto">
          {mockPosts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              author={post.author}
              isAnonymous={post.isAnonymous}
              timestamp={post.timestamp}
              content={post.content}
              tags={post.tags}
              likeCount={post.likeCount}
              commentCount={post.commentCount}
              isLiked={post.isLiked}
              isAuthor={post.isAuthor}
              onClick={() => handlePostClick(post.id)}
            />
          ))}

          {/* Load More Button */}
          <div className="text-center mt-8 mb-8">
            <button className="text-body text-primary-600 hover:text-primary-700 font-medium transition-colors">
              더보기 →
            </button>
          </div>
        </div>

        {/* Floating Write Button (Mobile) */}
        <button
          onClick={handleWritePost}
          className="sm:hidden fixed bottom-20 right-4 w-14 h-14 bg-primary-500 text-white rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-primary-600 transition-colors z-10"
          aria-label="글쓰기"
        >
          ✏️
        </button>
      </main>

      <Footer />
    </div>
  );
}
