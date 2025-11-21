import { Heart, MessageCircle, Clock, User } from "lucide-react";

interface Comment {
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
  imageUrl: string | null;
  tags: string[];
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  isAuthor: boolean;
  recentComments: Comment[];
  onClick: () => void;
  onLike: (id: string, isLiked: boolean) => void;
}

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
  isLiked,
  isAuthor,
  recentComments,
  onClick,
  onLike,
}: PostCardProps) {
  // Remove HTML tags for preview
  const previewContent = content.replace(/<[^>]+>/g, "").slice(0, 150) + (content.length > 150 ? "..." : "");

  return (
    <div 
      onClick={onClick}
      className="
        group relative bg-white/80 backdrop-blur-md 
        rounded-2xl border border-white/50 shadow-sm hover:shadow-xl 
        transition-all duration-300 ease-out hover:-translate-y-1 cursor-pointer overflow-hidden
      "
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center shadow-inner
              ${isAnonymous ? "bg-neutral-100 text-neutral-400" : "bg-gradient-to-br from-primary-100 to-primary-200 text-primary-600"}
            `}>
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-body-sm font-bold text-neutral-900">
                {isAnonymous ? "익명" : author}
                {isAuthor && <span className="ml-2 text-xs px-2 py-0.5 bg-primary-50 text-primary-600 rounded-full border border-primary-100">나</span>}
              </p>
              <div className="flex items-center gap-1 text-caption text-neutral-500">
                <Clock className="w-3 h-3" />
                <span>{timestamp}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mb-4">
          <h3 className="text-h4 font-bold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors">
            {title}
          </h3>
          <p className="text-body text-neutral-600 line-clamp-3 leading-relaxed">
            {previewContent}
          </p>
        </div>

        {/* Image Preview (if any) */}
        {imageUrl && (
          <div className="mb-4 rounded-xl overflow-hidden h-48 w-full bg-neutral-100">
            <img src={imageUrl} alt="Post attachment" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
          <div className="flex items-center gap-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLike(id, isLiked);
              }}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200
                ${isLiked 
                  ? "bg-red-50 text-red-500 ring-1 ring-red-100" 
                  : "text-neutral-500 hover:bg-neutral-50 hover:text-red-500"
                }
              `}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
              <span className="text-sm font-medium">{likeCount}</span>
            </button>
            
            <div className="flex items-center gap-1.5 text-neutral-500 px-3 py-1.5">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm font-medium">{commentCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
