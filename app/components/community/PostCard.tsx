import { useState } from "react";

interface PostCardProps {
  id: string;
  author: string;
  isAnonymous: boolean;
  timestamp: string;
  content: string;
  tags: string[];
  likeCount: number;
  commentCount: number;
  isLiked?: boolean;
  isAuthor?: boolean;
  onClick?: () => void;
}

export function PostCard({
  author,
  isAnonymous,
  timestamp,
  content,
  tags,
  likeCount,
  commentCount,
  isLiked = false,
  isAuthor = false,
  onClick,
}: PostCardProps) {
  const [liked, setLiked] = useState(isLiked);
  const [likes, setLikes] = useState(likeCount);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (liked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setLiked(!liked);
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <article
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 mb-4 hover:shadow-md transition-all duration-200 cursor-pointer"
    >
      {/* Post Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-lg">
            👤
          </div>

          {/* Author Info */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-neutral-800">
              {author}
            </span>
            <span className="text-lg">
              {isAnonymous ? "🔒" : "🌐"}
            </span>
            <span className="text-xs text-neutral-500">{timestamp}</span>
          </div>
        </div>

        {/* Menu Button */}
        <div className="relative">
          <button
            onClick={handleMenuClick}
            className="w-8 h-8 rounded hover:bg-neutral-100 flex items-center justify-center text-neutral-600 transition-colors"
          >
            ⋮
          </button>

          {isMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(false);
                }}
              />
              <div className="absolute right-0 top-10 w-40 bg-white shadow-lg rounded-lg border border-neutral-200 z-20">
                {isAuthor ? (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Edit post");
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-neutral-50 text-sm text-neutral-700 transition-colors"
                    >
                      수정
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Delete post");
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-error-50 text-sm text-error-500 transition-colors"
                    >
                      삭제
                    </button>
                  </>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Report post");
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-orange-50 text-sm text-orange-600 transition-colors"
                  >
                    신고
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("Hide post");
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-neutral-50 text-sm text-neutral-700 transition-colors"
                >
                  숨기기
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Post Content */}
      <p className="text-body text-neutral-700 leading-relaxed mb-3 line-clamp-4 whitespace-pre-wrap">
        {content}
      </p>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.slice(0, 5).map((tag, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                console.log("Tag clicked:", tag);
              }}
              className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm hover:bg-primary-100 transition-colors"
            >
              #{tag}
            </button>
          ))}
          {tags.length > 5 && (
            <span className="px-3 py-1 text-sm text-neutral-500">
              +{tags.length - 5}개
            </span>
          )}
        </div>
      )}

      {/* Post Actions */}
      <div className="flex items-center gap-6 pt-4 border-t border-neutral-100">
        {/* Like Button */}
        <button
          onClick={handleLike}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg transition-all
            ${liked
              ? "bg-error-50 text-error-500 font-semibold"
              : "text-neutral-600 hover:bg-neutral-50"
            }
          `}
        >
          <span className={liked ? "scale-110" : ""}>❤️</span>
          <span className="text-sm">{likes}</span>
        </button>

        {/* Comment Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log("Open comments");
          }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-neutral-600 hover:bg-neutral-50 hover:text-primary-600 transition-colors"
        >
          <span>💬</span>
          <span className="text-sm">{commentCount}</span>
        </button>

        {/* Share Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log("Share post");
          }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-neutral-600 hover:bg-neutral-50 hover:text-primary-600 transition-colors"
        >
          <span>🔗</span>
          <span className="text-sm">공유</span>
        </button>
      </div>
    </article>
  );
}
