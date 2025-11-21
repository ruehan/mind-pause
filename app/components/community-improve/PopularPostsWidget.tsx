import { TrendingUp, Heart, MessageCircle } from "lucide-react";
import type { Post } from "~/lib/api";

interface PopularPostsWidgetProps {
  posts: Post[];
  onPostClick: (id: string) => void;
}

export function PopularPostsWidget({ posts, onPostClick }: PopularPostsWidgetProps) {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/50 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
          <TrendingUp className="w-5 h-5" />
        </div>
        <h3 className="text-h4 font-bold text-neutral-900">
          인기 게시글
        </h3>
      </div>
      
      <div className="space-y-1">
        {posts.map((post, index) => (
          <button
            key={post.id}
            onClick={() => onPostClick(post.id)}
            className="w-full text-left p-3 rounded-xl hover:bg-white hover:shadow-md transition-all duration-200 group"
          >
            <div className="flex items-start gap-3">
              <span className={`
                flex items-center justify-center w-6 h-6 rounded-full text-sm font-bold
                ${index < 3 ? "bg-primary-100 text-primary-600" : "bg-neutral-100 text-neutral-500"}
              `}>
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
  );
}
