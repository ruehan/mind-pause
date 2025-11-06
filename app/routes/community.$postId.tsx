import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { AppLayout } from "../components/AppLayout";
import { Button } from "../components/Button";
import { useToast } from "../components/ToastProvider";
import { useAuth } from "../contexts/AuthContext";
import * as api from "../lib/api";

export function meta() {
  return [
    { title: "게시글 - 마음쉼표" },
    {
      name: "description",
      content: "커뮤니티 게시글",
    },
  ];
}

export default function CommunityPost() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();

  const [post, setPost] = useState<api.Post | null>(null);
  const [comments, setComments] = useState<api.Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [commentContent, setCommentContent] = useState("");
  const [isAnonymousComment, setIsAnonymousComment] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 게시글 및 댓글 로드
  useEffect(() => {
    if (postId) {
      loadPostAndComments();
    }
  }, [postId]);

  const loadPostAndComments = async () => {
    if (!postId) return;

    try {
      setIsLoading(true);
      const [postData, commentsData] = await Promise.all([
        api.getPost(postId),
        api.getComments(postId),
      ]);
      setPost(postData);
      setComments(commentsData.comments);
    } catch (error) {
      if (error instanceof api.UnauthorizedError) {
        toast.error("로그인 필요", "게시글을 보려면 로그인이 필요합니다");
        navigate("/login");
        return;
      }
      console.error("게시글 로드 오류:", error);
      toast.error("오류", "게시글을 불러오는 중 오류가 발생했습니다");
      navigate("/community");
    } finally {
      setIsLoading(false);
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

  const handleLikePost = async () => {
    if (!user) {
      toast.error("로그인 필요", "좋아요를 하려면 로그인이 필요합니다");
      return;
    }
    if (!post) return;

    try {
      if (post.is_liked) {
        await api.deleteLike(post.id);
        setPost({
          ...post,
          is_liked: false,
          num_likes: post.num_likes - 1,
        });
      } else {
        await api.createLike({ post_id: post.id });
        setPost({
          ...post,
          is_liked: true,
          num_likes: post.num_likes + 1,
        });
      }
    } catch (error) {
      console.error("좋아요 처리 오류:", error);
      toast.error("오류", "좋아요 처리 중 오류가 발생했습니다");
    }
  };

  const handleLikeComment = async (commentId: string, isLiked: boolean, currentLikes: number) => {
    if (!user) {
      toast.error("로그인 필요", "좋아요를 하려면 로그인이 필요합니다");
      return;
    }

    try {
      if (isLiked) {
        await api.deleteLike(undefined, commentId);
      } else {
        await api.createLike({ comment_id: commentId });
      }

      // 댓글 목록 업데이트
      setComments(comments.map(comment =>
        comment.id === commentId
          ? {
              ...comment,
              is_liked: !isLiked,
              num_likes: isLiked ? (comment.num_likes || 0) - 1 : (comment.num_likes || 0) + 1,
            }
          : comment
      ));
    } catch (error) {
      console.error("좋아요 처리 오류:", error);
      toast.error("오류", "좋아요 처리 중 오류가 발생했습니다");
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("로그인 필요", "댓글을 작성하려면 로그인이 필요합니다");
      navigate("/login");
      return;
    }

    if (!commentContent.trim()) {
      toast.error("입력 오류", "댓글 내용을 입력해주세요");
      return;
    }

    if (!postId) return;

    try {
      setIsSubmitting(true);
      const newComment = await api.createComment({
        post_id: postId,
        content: commentContent,
        is_anonymous: isAnonymousComment,
      });

      setComments([...comments, newComment]);
      setCommentContent("");
      setIsAnonymousComment(false);

      // 게시글의 댓글 수 업데이트
      if (post) {
        setPost({
          ...post,
          num_comments: post.num_comments + 1,
        });
      }

      toast.success("성공", "댓글이 작성되었습니다");
    } catch (error) {
      console.error("댓글 작성 오류:", error);
      toast.error("오류", "댓글 작성 중 오류가 발생했습니다");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async () => {
    if (!post || !postId) return;

    if (!confirm("정말 이 게시글을 삭제하시겠습니까?")) {
      return;
    }

    try {
      await api.deletePost(postId);
      toast.success("성공", "게시글이 삭제되었습니다");
      navigate("/community");
    } catch (error) {
      console.error("게시글 삭제 오류:", error);
      toast.error("오류", "게시글 삭제 중 오류가 발생했습니다");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("정말 이 댓글을 삭제하시겠습니까?")) {
      return;
    }

    try {
      await api.deleteComment(commentId);
      setComments(comments.filter(c => c.id !== commentId));

      // 게시글의 댓글 수 업데이트
      if (post) {
        setPost({
          ...post,
          num_comments: post.num_comments - 1,
        });
      }

      toast.success("성공", "댓글이 삭제되었습니다");
    } catch (error) {
      console.error("댓글 삭제 오류:", error);
      toast.error("오류", "댓글 삭제 중 오류가 발생했습니다");
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
        </div>
      </AppLayout>
    );
  }

  if (!post) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-body text-neutral-600">게시글을 찾을 수 없습니다</p>
          <Button variant="secondary" onClick={() => navigate("/community")} className="mt-4">
            목록으로 돌아가기
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/community")}
          className="mb-4"
        >
          ← 목록으로
        </Button>
      </div>

      {/* Post Content */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
          {/* Post Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-h4 text-primary-600">
                  {post.is_anonymous ? "🙈" : post.user?.nickname?.[0] || "?"}
                </span>
              </div>
              <div>
                <p className="text-body-sm font-medium text-neutral-900">
                  {post.is_anonymous ? "익명" : post.user?.nickname || "알 수 없음"}
                </p>
                <p className="text-caption text-neutral-500">
                  {formatDate(post.created_at)}
                </p>
              </div>
            </div>

            {user?.id === post.user_id && !post.is_anonymous && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDeletePost}
                className="text-error-600 hover:bg-error-50"
              >
                삭제
              </Button>
            )}
          </div>

          {/* Post Title */}
          <h1 className="text-h3 text-neutral-900 mb-4">{post.title}</h1>

          {/* Post Content */}
          <div
            className="text-body text-neutral-700 mb-6 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Post Actions */}
          <div className="flex items-center gap-4 pt-4 border-t border-neutral-200">
            <button
              onClick={handleLikePost}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                post.is_liked
                  ? "bg-primary-50 text-primary-600"
                  : "bg-neutral-50 text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              <span>{post.is_liked ? "❤️" : "🤍"}</span>
              <span className="text-body-sm">{post.num_likes}</span>
            </button>
            <div className="flex items-center gap-2 text-neutral-600">
              <span>💬</span>
              <span className="text-body-sm">{post.num_comments}</span>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="text-h4 text-neutral-900 mb-4">
            댓글 {comments.length}개
          </h2>

          {/* Comment Form */}
          {user ? (
            <form onSubmit={handleSubmitComment} className="mb-6">
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="댓글을 입력하세요..."
                className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                rows={3}
              />
              <div className="flex items-center justify-between mt-2">
                <label className="flex items-center gap-2 text-body-sm text-neutral-600">
                  <input
                    type="checkbox"
                    checked={isAnonymousComment}
                    onChange={(e) => setIsAnonymousComment(e.target.checked)}
                    className="rounded border-neutral-300"
                  />
                  익명으로 작성
                </label>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isSubmitting || !commentContent.trim()}
                >
                  {isSubmitting ? "작성 중..." : "댓글 작성"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="mb-6 p-4 bg-neutral-50 rounded-lg text-center">
              <p className="text-body-sm text-neutral-600 mb-2">
                댓글을 작성하려면 로그인이 필요합니다
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate("/login")}
              >
                로그인하기
              </Button>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-body text-neutral-500 text-center py-8">
                아직 댓글이 없습니다. 첫 댓글을 작성해보세요!
              </p>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-4 bg-neutral-50 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-body-sm text-primary-600">
                          {comment.is_anonymous ? "🙈" : comment.user?.nickname?.[0] || "?"}
                        </span>
                      </div>
                      <div>
                        <p className="text-body-sm font-medium text-neutral-900">
                          {comment.is_anonymous ? "익명" : comment.user?.nickname || "알 수 없음"}
                        </p>
                        <p className="text-caption text-neutral-500">
                          {formatDate(comment.created_at)}
                        </p>
                      </div>
                    </div>

                    {user?.id === comment.user_id && !comment.is_anonymous && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-caption text-error-600 hover:text-error-700"
                      >
                        삭제
                      </button>
                    )}
                  </div>

                  <p className="text-body text-neutral-700 mb-2 ml-10">
                    {comment.content}
                  </p>

                  <div className="flex items-center gap-2 ml-10">
                    <button
                      onClick={() => handleLikeComment(comment.id, comment.is_liked || false, comment.num_likes || 0)}
                      className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                        comment.is_liked
                          ? "text-primary-600"
                          : "text-neutral-500 hover:text-neutral-700"
                      }`}
                    >
                      <span className="text-sm">{comment.is_liked ? "❤️" : "🤍"}</span>
                      <span className="text-caption">{comment.num_likes || 0}</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
