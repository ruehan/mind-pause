import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="glass rounded-xl p-6 shadow-soft hover:shadow-primary transform hover:-translate-y-2 transition-all duration-300 border border-white/20">
      <div className="flex flex-col items-center text-center">
        {/* Icon */}
        <div className="mb-4 flex items-center justify-center">
          <Icon className="w-16 h-16 text-primary-600 animate-float" />
        </div>

        {/* Title */}
        <h3 className="text-h4 text-neutral-900 mb-3">{title}</h3>

        {/* Description */}
        <p className="text-body-sm text-neutral-600 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
