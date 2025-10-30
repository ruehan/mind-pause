import { PlayCircle, Clock } from "lucide-react";

interface VideoTutorial {
  id: string;
  title: string;
  description: string;
  videoUrl: string; // YouTube embed URL
  duration: string;
  thumbnail?: string;
}

interface VideoTutorialSectionProps {
  tutorials: VideoTutorial[];
}

export function VideoTutorialSection({
  tutorials,
}: VideoTutorialSectionProps) {
  if (tutorials.length === 0) return null;

  return (
    <div className="mb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <PlayCircle className="w-6 h-6 text-primary-600" />
        <div>
          <h2 className="text-h3 text-neutral-900">비디오 튜토리얼</h2>
          <p className="text-body-sm text-neutral-600">
            영상으로 쉽게 배워보세요
          </p>
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutorials.map((tutorial) => (
          <div
            key={tutorial.id}
            className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow group"
          >
            {/* Video Embed or Thumbnail */}
            <div className="relative aspect-video bg-neutral-900">
              {tutorial.thumbnail ? (
                <img
                  src={tutorial.thumbnail}
                  alt={tutorial.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <iframe
                  src={tutorial.videoUrl}
                  title={tutorial.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}

              {/* Play Overlay (if using thumbnail) */}
              {tutorial.thumbnail && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <PlayCircle className="w-10 h-10 text-primary-600" />
                  </div>
                </div>
              )}

              {/* Duration Badge */}
              <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/70 rounded text-white text-caption">
                <Clock className="w-3 h-3" />
                <span>{tutorial.duration}</span>
              </div>
            </div>

            {/* Video Info */}
            <div className="p-4">
              <h3 className="text-body font-semibold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors">
                {tutorial.title}
              </h3>
              <p className="text-body-sm text-neutral-600 line-clamp-2">
                {tutorial.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
