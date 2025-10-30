import ReactNiceAvatar from "react-nice-avatar";
import { ClientOnly } from "../ClientOnly";

interface AvatarPreviewProps {
  options: Record<string, string>;
  size?: number;
  className?: string;
}

export function AvatarPreview({
  options,
  size = 160,
  className = "",
}: AvatarPreviewProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="rounded-full shadow-primary ring-4 ring-primary-200 animate-float overflow-hidden">
        <ClientOnly
          fallback={
            <div
              style={{ width: `${size}px`, height: `${size}px` }}
              className="bg-neutral-200 flex items-center justify-center"
            >
              <span className="text-neutral-400">로딩중...</span>
            </div>
          }
        >
          <ReactNiceAvatar
            style={{ width: `${size}px`, height: `${size}px` }}
            {...options}
          />
        </ClientOnly>
      </div>
    </div>
  );
}
