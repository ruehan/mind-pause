import { useState } from "react";
import { User, Lock, Globe, Heart, MessageCircle, Link2, MoreVertical } from "lucide-react";

interface RecentComment {
  author: string;
  content: string;
  timestamp: string;
}

interface PostCardProps {
  id: string;
  author: string;
  isAnonymous: boolean;
  timestamp: string;
  title: string;
  content: string;
  imageUrl?: string | null;
  tags: string[];
  likeCount: number;
  commentCount: number;
  isLiked?: boolean;
  isAuthor?: boolean;
  recentComments?: RecentComment[];
  onClick?: () => void;
  onLike?: (postId: string, currentlyLiked: boolean) => Promise<void>;
}

// Emotion tag color mapping
const emotionTagColors: Record<string, string> = {
  "불안": "bg-error-100 text-error-700 hover:bg-error-200",
  "우울": "bg-neutral-200 text-neutral-700 hover:bg-neutral-300",
  "스트레스": "bg-orange-100 text-orange-700 hover:bg-orange-200",
  "행복": "bg-mint-100 text-mint-700 hover:bg-mint-200",
  "감사": "bg-primary-100 text-primary-700 hover:bg-primary-200",
  "걱정": "bg-lavender-100 text-lavender-700 hover:bg-lavender-200",
  "분노": "bg-error-100 text-error-700 hover:bg-error-200",
  "외로움": "bg-neutral-200 text-neutral-700 hover:bg-neutral-300",
  "희망": "bg-mint-100 text-mint-700 hover:bg-mint-200",
  "자책": "bg-orange-100 text-orange-700 hover:bg-orange-200",
  "직장스트레스": "bg-orange-100 text-orange-700 hover:bg-orange-200",
  "실수": "bg-lavender-100 text-lavender-700 hover:bg-lavender-200",
  "대처방법": "bg-mint-100 text-mint-700 hover:bg-mint-200",
  "공유": "bg-primary-100 text-primary-700 hover:bg-primary-200",
  "무기력": "bg-neutral-200 text-neutral-700 hover:bg-neutral-300",
  "조언구함": "bg-lavender-100 text-lavender-700 hover:bg-lavender-200",
};

const getTagColor = (tag: string): string => {
  return emotionTagColors[tag] || "bg-primary-50 text-primary-700 hover:bg-primary-100";
};

export function PostCard({
  id,
  author,
  isAnonymous,
  timestamp,
  title,
  content,
  imageUrl,
  tags,
  likeCount,
  commentCount,
  isLiked = false,
  isAuthor = false,
  recentComments = [],
  onClick,
  onLike,
}: PostCardProps) {
  const [liked, setLiked] = useState(isLiked);
  const [likes, setLikes] = useState(likeCount);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isLiking || !onLike) return;

    const previousLiked = liked;
    const previousLikes = likes;

    // 낙관적 업데이트
    if (liked) {
      setLikes(likes - 1);
      setLiked(false);
    } else {
      setLikes(likes + 1);
      setLiked(true);
      setShowLikeAnimation(true);
      setTimeout(() => setShowLikeAnimation(false), 600);
    }

    try {
      setIsLiking(true);
      await onLike(id, previousLiked);
    } catch (error) {
      // 에러 시 이전 상태로 복구
      setLiked(previousLiked);
      setLikes(previousLikes);
    } finally {
      setIsLiking(false);
    }
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  // HTML 태그 제거하여 순수 텍스트만 추출
  const getPlainText = (html: string) => {
    return html.replace(/<[^>]*>/g, '').trim();
  };

  return (
    <article
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`bg-white rounded-lg border border-neutral-200 transition-all duration-300 cursor-pointer p-4 hover:shadow-md hover:border-primary-300 ${
        isHovered ? "bg-neutral-50" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-medium text-primary-600">
            {author[0]}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-neutral-900">
              {author}
            </span>
            {isAnonymous && (
              <Lock className="w-3 h-3 text-neutral-500" />
            )}
            <span className="text-xs text-neutral-500">· {timestamp}</span>
          </div>

          {/* Title */}
          <h3 className="text-base font-semibold text-neutral-900 mb-1 line-clamp-1">
            {title}
          </h3>

          {/* Content Preview */}
          <div className="overflow-hidden transition-all duration-300">
            <p
              className={`text-sm text-neutral-600 transition-all duration-300 ${
                isHovered ? "line-clamp-4" : "line-clamp-1"
              }`}
            >
              {getPlainText(content)}
            </p>
          </div>

          {/* Post Actions */}
          <div className="flex items-center gap-6 pt-4 mt-4 border-t border-neutral-100">
            {/* Like Button */}
            <button
              onClick={handleLike}
              disabled={isLiking}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 transform relative
                ${liked
                  ? "bg-error-50 text-error-500 font-semibold scale-105"
                  : "text-neutral-600 hover:bg-neutral-50 hover:scale-110"
                }
                ${isLiking ? "opacity-50 cursor-not-allowed" : ""}
              `}
              aria-label={liked ? "좋아요 취소" : "좋아요"}
            >
              <div className="relative">
                <Heart className={`w-5 h-5 transition-all duration-300 ${
                  liked ? "fill-current animate-bounce-subtle" : ""
                }`} />
                {showLikeAnimation && (
                  <>
                    <Heart className="absolute top-0 left-0 w-5 h-5 fill-current text-error-500 animate-ping" />
                    <div className="absolute -top-2 -right-2 text-lg animate-bounce">💕</div>
                  </>
                )}
              </div>
              <span className={`text-sm transition-all duration-300 ${
                liked ? "font-semibold" : ""
              }`}>{likes}</span>
            </button>

            {/* Comment Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-neutral-600 hover:bg-neutral-50 hover:text-primary-600 transition-colors"
              aria-label="댓글 보기"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">{commentCount}</span>
            </button>
          </div>

          {/* 확장 시 추가 정보 */}
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              isHovered && recentComments && recentComments.length > 0
                ? "max-h-96 opacity-100 mt-4"
                : "max-h-0 opacity-0 mt-0"
            }`}
          >
            <div className="pt-4 border-t border-neutral-100">
              <div className="space-y-3">
                {recentComments.slice(0, 2).map((comment, index) => (
                  <div
                    key={index}
                    className="bg-neutral-50 rounded-lg p-3 hover:bg-neutral-100 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-neutral-900">
                        {comment.author}
                      </span>
                      <span className="text-xs text-neutral-500">
                        {comment.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-700 line-clamp-2">
                      {comment.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
