import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { TrendingUp, Clock, PenLine } from "lucide-react";
import { DashboardLayout } from "~/components/dashboard-improve/DashboardLayout";
import { CommunityLayout } from "~/components/community-improve/CommunityLayout";
import { CommunityHeader } from "~/components/community-improve/CommunityHeader";
import { PostCard } from "~/components/community-improve/PostCard";
import { PopularPostsWidget } from "~/components/community-improve/PopularPostsWidget";
import { Spinner } from "~/components/Spinner";
import { useToast } from "~/components/ToastProvider";
import { useAuth } from "~/contexts/AuthContext";
import * as api from "~/lib/api";
import type { Route } from "./+types/community";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "커뮤니티 - 마음쉼표" },
    { name: "description", content: "함께 나누고 공감하는 따뜻한 공간" },
  ];
}

// HTML에서 첫 번째 이미지 URL 추출
const extractFirstImage = (htmlContent: string): string | null => {
  const imgRegex = /<img[^>]+src="([^">]+)"/i;
  const match = htmlContent.match(imgRegex);
  return match ? match[1] : null;
};

export default function CommunityImprove() {
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
      // Optimistic update or reload
      loadPosts();
    } catch (error) {
      console.error("좋아요 오류:", error);
      toast.error("오류", "좋아요 처리 중 오류가 발생했습니다");
    }
  };

  return (
    <DashboardLayout>
      <CommunityLayout>
        <CommunityHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchSubmit={handleSearch}
          onClearSearch={handleClearSearch}
          onWriteClick={handleWritePost}
          activeSearch={activeSearch}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search Result Header */}
            {activeSearch && (
              <div className="mb-6 p-4 bg-white/60 backdrop-blur border border-primary-200 rounded-xl animate-fade-in">
                <p className="text-body text-neutral-700">
                  <span className="font-bold text-primary-700">"{activeSearch}"</span> 검색 결과
                  <button
                    onClick={handleClearSearch}
                    className="ml-3 text-sm text-primary-600 hover:text-primary-700 underline font-medium"
                  >
                    전체 글 보기
                  </button>
                </p>
              </div>
            )}

            {/* Sort Tabs */}
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => setSortBy("popular")}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-200
                  ${sortBy === "popular"
                    ? "bg-primary-600 text-white shadow-md shadow-primary-200"
                    : "bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-200"
                  }
                `}
              >
                <TrendingUp className="w-4 h-4" />
                인기순
              </button>
              <button
                onClick={() => setSortBy("latest")}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-200
                  ${sortBy === "latest"
                    ? "bg-primary-600 text-white shadow-md shadow-primary-200"
                    : "bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-200"
                  }
                `}
              >
                <Clock className="w-4 h-4" />
                최신순
              </button>
            </div>

            {/* Posts Grid */}
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Spinner size="xl" variant="breathing" />
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20 bg-white/60 backdrop-blur rounded-2xl border border-neutral-200/60">
                <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                  📝
                </div>
                {activeSearch ? (
                  <>
                    <p className="text-h4 font-bold text-neutral-900 mb-2">
                      검색 결과가 없습니다
                    </p>
                    <p className="text-body text-neutral-500 mb-6">
                      다른 검색어로 시도해보거나 새로운 글을 작성해보세요.
                    </p>
                    <button
                      onClick={handleClearSearch}
                      className="text-primary-600 font-medium hover:underline"
                    >
                      전체 글 보기
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-h4 font-bold text-neutral-900 mb-2">
                      아직 게시글이 없습니다
                    </p>
                    <p className="text-body text-neutral-500 mb-6">
                      첫 번째 글의 주인공이 되어보세요!
                    </p>
                    <button
                      onClick={handleWritePost}
                      className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors"
                    >
                      글쓰기
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => {
                  const imageUrl = extractFirstImage(post.content);
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
                      authorProfileImage={!post.is_anonymous ? post.user?.profile_image_url : null}
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

                {/* Load More Button */}
                <div className="text-center pt-8">
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    className="
                      px-8 py-3 bg-white border border-neutral-200 rounded-xl 
                      text-neutral-600 font-medium hover:bg-neutral-50 hover:border-primary-300 hover:text-primary-600
                      transition-all duration-200 shadow-sm
                    "
                  >
                    더보기
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block space-y-6">
            <div className="sticky top-6 space-y-6">
              {/* Popular Posts */}
              <PopularPostsWidget posts={popularPosts} onPostClick={handlePostClick} />

              {/* Community Guidelines */}
              <div className="bg-gradient-to-br from-primary-50 to-lavender-50 rounded-2xl p-6 border border-primary-100 shadow-sm">
                <h3 className="text-body font-bold text-neutral-900 mb-4 flex items-center gap-2">
                  <span>🛡️</span> 커뮤니티 가이드
                </h3>
                <ul className="space-y-3 text-sm text-neutral-600">
                  <li className="flex items-start gap-2">
                    <span className="text-primary-500 font-bold">•</span>
                    <span>서로 존중하고 배려하는 언어를 사용해주세요.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-500 font-bold">•</span>
                    <span>개인정보 공유는 신중하게 해주세요.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-500 font-bold">•</span>
                    <span>고민을 나눌 때는 따뜻한 위로를 건네주세요.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Floating Write Button */}
        <button
          onClick={handleWritePost}
          className="
            md:hidden fixed bottom-20 right-6 w-14 h-14 
            bg-gradient-to-r from-primary-500 to-primary-600 
            text-white rounded-full shadow-lg shadow-primary-500/40 
            flex items-center justify-center 
            hover:scale-105 active:scale-95 transition-all duration-200 z-50
          "
          aria-label="글쓰기"
        >
          <PenLine className="w-6 h-6" />
        </button>
      </CommunityLayout>
    </DashboardLayout>
  );
}
