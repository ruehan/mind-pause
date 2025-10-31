import type { LucideIcon } from "lucide-react";
import { useState } from "react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [tiltStyle, setTiltStyle] = useState({});

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.05)`,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTiltStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)",
    });
  };

  const handleClick = () => {
    // Pulse animation on click
    const card = document.activeElement;
    if (card) {
      card.classList.add("animate-pulse-once");
      setTimeout(() => card.classList.remove("animate-pulse-once"), 600);
    }
  };

  return (
    <div
      className="glass rounded-xl p-6 shadow-soft hover:shadow-primary transition-all duration-300 border border-white/20 cursor-pointer relative overflow-hidden group"
      style={tiltStyle}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 via-lavender-500/0 to-mint-500/0 group-hover:from-primary-500/10 group-hover:via-lavender-500/5 group-hover:to-mint-500/10 transition-all duration-500 rounded-xl"></div>

      <div className="flex flex-col items-center text-center relative z-10">
        {/* Icon */}
        <div className="mb-4 flex items-center justify-center">
          <div
            className={`transition-all duration-300 ${
              isHovered ? "scale-110 rotate-12" : "scale-100 rotate-0"
            }`}
          >
            <Icon
              className={`w-16 h-16 text-primary-600 transition-all duration-300 ${
                isHovered ? "animate-bounce-subtle" : "animate-float"
              }`}
            />
          </div>
        </div>

        {/* Title */}
        <h3
          className={`text-h4 text-neutral-900 mb-3 transition-all duration-300 ${
            isHovered ? "text-primary-700" : ""
          }`}
        >
          {title}
        </h3>

        {/* Description */}
        <p className="text-body-sm text-neutral-600 leading-relaxed">
          {description}
        </p>

        {/* Interactive indicator */}
        <div
          className={`mt-4 h-1 bg-primary-500 rounded-full transition-all duration-300 ${
            isHovered ? "w-full opacity-100" : "w-0 opacity-0"
          }`}
        ></div>
      </div>
    </div>
  );
}
