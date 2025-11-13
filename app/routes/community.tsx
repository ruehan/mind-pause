import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Search, TrendingUp, Clock, Heart, MessageCircle, X } from "lucide-react";
import { AppLayout } from "../components/AppLayout";
import { PostCard } from "../components/community/PostCard";
import { Button } from "../components/Button";
import { useToast } from "../components/ToastProvider";
import { useAuth } from "../contexts/AuthContext";
import * as api from "../lib/api";

export function meta() {
  return [
    { title: "커뮤니티 - 마음쉼표" },
    {
      name: "description",
      content: "함께 나누고 공감하는 따뜻한 공간",
    },
  ];
}

// HTML에서 첫 번째 이미지 URL 추출
const extractFirstImage = (htmlContent: string): string | null => {
  const imgRegex = /<img[^>]+src="([^">]+)"/i;
  const match = htmlContent.match(imgRegex);
  return match ? match[1] : null;
};


export default function Community() {
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();

  const [posts, setPosts] = useState<api.Post[]>([]);
  const [popularPosts, setPopularPosts] = useState<api.Post[]>([]);
  const [postComments, setPostComments] = useState<Record<string, api.Comment[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "popular">("popular");
  const [page, setPage] = useState(1);
  const pageSize = 12;

  // 게시글 목록 로드
  useEffect(() => {
    loadPosts();
  }, [sortBy, page, activeSearch]);

  // 인기글 로드
  useEffect(() => {
    loadPopularPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const response = await api.getPosts(
        page,
        pageSize,
        sortBy,
        activeSearch || undefined
      );
      setPosts(response.posts);

      // 각 포스트의 최근 댓글 2개씩 가져오기
      const commentsMap: Record<string, api.Comment[]> = {};
      await Promise.all(
        response.posts.map(async (post) => {
          try {
            const commentResponse = await api.getComments(post.id);
            // 좋아요가 많은 순으로 정렬 후 최근 2개만 저장
            const sortedComments = commentResponse.comments
              .sort((a, b) => (b.num_likes || 0) - (a.num_likes || 0))
              .slice(0, 2);
            commentsMap[post.id] = sortedComments;
          } catch (error) {
            // 댓글 로드 실패는 무시 (빈 배열로 처리)
            commentsMap[post.id] = [];
          }
        })
      );
      setPostComments(commentsMap);
    } catch (error) {
      if (error instanceof api.UnauthorizedError) return;
      console.error("게시글 로드 오류:", error);
      toast.error("오류", "게시글을 불러오는 중 오류가 발생했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  const loadPopularPosts = async () => {
    try {
      const response = await api.getPosts(1, 5, "popular");
      setPopularPosts(response.posts);
    } catch (error) {
      console.error("인기글 로드 오류:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "방금 전";
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;

    return date.toLocaleDateString("ko-KR", { month: "long", day: "numeric" });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();

    // 검색어가 변경되면 첫 페이지로 리셋
    if (trimmedQuery !== activeSearch) {
      setPage(1);
    }

    setActiveSearch(trimmedQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setActiveSearch("");
    setPage(1);
  };

  const handleWritePost = () => {
    if (!user) {
      toast.error("로그인 필요", "글을 작성하려면 로그인이 필요합니다");
      navigate("/login");
      return;
    }
    navigate("/community/write");
  };

  const handlePostClick = (postId: string) => {
    navigate(`/community/${postId}`);
  };

  const handleLike = async (postId: string, currentlyLiked: boolean) => {
    if (!user) {
      toast.error("로그인 필요", "좋아요를 누르려면 로그인이 필요합니다");
      return;
    }

    try {
      if (currentlyLiked) {
        await api.deleteLike(postId);
      } else {
        await api.createLike({ post_id: postId, comment_id: undefined });
      }
    } catch (error) {
      console.error("좋아요 오류:", error);
      toast.error("오류", "좋아요 처리 중 오류가 발생했습니다");
      throw error; // PostCard에서 이전 상태로 복구하도록
    }
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header with Search */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-4xl">💬</span>
              <div>
                <h1 className="text-h2 text-neutral-900">커뮤니티</h1>
                <p className="text-body text-neutral-600 mt-1">
                  함께 나누고 공감하는 따뜻한 공간
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="게시글 검색..."
                  className="w-full pl-10 pr-10 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                {(searchQuery || activeSearch) && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                    aria-label="검색 초기화"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </form>

            {/* Write Button (Desktop) */}
            <div className="hidden md:block">
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search Result Header */}
            {activeSearch && (
              <div className="mb-4 p-4 bg-primary-50 border border-primary-200 rounded-lg">
                <p className="text-body text-neutral-700">
                  <span className="font-semibold text-primary-700">"{activeSearch}"</span> 검색 결과
                  <button
                    onClick={handleClearSearch}
                    className="ml-3 text-body-sm text-primary-600 hover:text-primary-700 underline"
                  >
                    전체 글 보기
                  </button>
                </p>
              </div>
            )}

            {/* Sort Tabs */}
            <div className="flex items-center gap-2 mb-6">
              <button
                onClick={() => setSortBy("popular")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  sortBy === "popular"
                    ? "bg-primary-100 text-primary-700"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                인기순
              </button>
              <button
                onClick={() => setSortBy("latest")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  sortBy === "latest"
                    ? "bg-primary-100 text-primary-700"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                <Clock className="w-4 h-4" />
                최신순
              </button>
            </div>

            {/* Posts Grid */}
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-neutral-200">
                {activeSearch ? (
                  <>
                    <p className="text-body text-neutral-600 mb-2">
                      <span className="font-semibold">"{activeSearch}"</span>에 대한 검색 결과가 없습니다.
                    </p>
                    <p className="text-body-sm text-neutral-500">
                      다른 검색어로 시도해보세요.
                    </p>
                    <Button
                      variant="secondary"
                      onClick={handleClearSearch}
                      className="mt-4"
                    >
                      전체 글 보기
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-body text-neutral-600">
                      아직 게시글이 없습니다. 첫 번째 글을 작성해보세요!
                    </p>
                    <Button
                      variant="primary"
                      onClick={handleWritePost}
                      className="mt-4"
                    >
                      글쓰기
                    </Button>
                  </>
                )}
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {posts.map((post) => {
                    const imageUrl = extractFirstImage(post.content);
                    // 해당 포스트의 댓글 데이터 가져오기
                    const comments = postComments[post.id] || [];
                    const recentComments = comments.map(comment => ({
                      author: comment.user?.nickname || "익명",
                      content: comment.content,
                      timestamp: formatDate(comment.created_at)
                    }));

                    return (
                      <PostCard
                        key={post.id}
                        id={post.id}
                        author={post.user?.nickname || "익명"}
                        isAnonymous={post.is_anonymous}
                        timestamp={formatDate(post.created_at)}
                        title={post.title}
                        content={post.content}
                        imageUrl={imageUrl}
                        tags={[]}
                        likeCount={post.num_likes}
                        commentCount={post.num_comments}
                        isLiked={post.is_liked || false}
                        isAuthor={user?.id === post.user_id}
                        recentComments={recentComments}
                        onClick={() => handlePostClick(post.id)}
                        onLike={handleLike}
                      />
                    );
                  })}
                </div>

                {/* Load More Button */}
                <div className="text-center mt-8">
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    className="px-6 py-3 bg-white border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50 hover:border-primary-300 font-medium transition-colors"
                  >
                    더보기 →
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Sidebar - Popular Posts */}
          <div className="hidden lg:block">
            <div className="sticky top-4 space-y-4">
              {/* Popular Posts Widget */}
              <div className="bg-white rounded-xl border border-neutral-200 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-primary-600" />
                  <h3 className="text-h4 text-neutral-900 font-semibold">
                    인기 게시글
                  </h3>
                </div>
                <div className="space-y-3">
                  {popularPosts.map((post, index) => (
                    <button
                      key={post.id}
                      onClick={() => handlePostClick(post.id)}
                      className="w-full text-left p-3 rounded-lg hover:bg-neutral-50 transition-colors group"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-h4 font-bold text-primary-500 min-w-[24px]">
                          {index + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-body-sm font-medium text-neutral-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
                            {post.title}
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-caption text-neutral-500">
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              {post.num_likes}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" />
                              {post.num_comments}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Community Guidelines */}
              <div className="bg-gradient-to-br from-primary-50 to-lavender-50 rounded-xl p-5 border border-primary-100">
                <h3 className="text-body-sm font-semibold text-neutral-900 mb-3">
                  📝 커뮤니티 가이드
                </h3>
                <ul className="space-y-2 text-caption text-neutral-600">
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600">•</span>
                    <span>서로 존중하고 배려해주세요</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600">•</span>
                    <span>개인정보 공유는 주의해주세요</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600">•</span>
                    <span>긍정적인 대화를 나눠요</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Write Button (Mobile) */}
      <button
        onClick={handleWritePost}
        className="md:hidden fixed bottom-20 right-4 w-14 h-14 bg-primary-500 text-white rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-primary-600 transition-colors z-10"
        aria-label="글쓰기"
      >
        ✏️
      </button>
    </AppLayout>
  );
}
