import type { LucideIcon } from "lucide-react";

interface AchievementBadgeProps {
  icon: LucideIcon;
  value: string;
  label: string;
  onClick?: () => void;
}

export function AchievementBadge({
  icon: Icon,
  value,
  label,
  onClick,
}: AchievementBadgeProps) {
  return (
    <button
      onClick={onClick}
      className="glass rounded-lg shadow-soft hover:shadow-primary p-4 text-center hover:scale-105 transition-all duration-300 transform border border-white/20"
    >
      {/* Icon */}
      <div className="mb-2 flex justify-center">
        <Icon className="w-10 h-10 text-primary-600 animate-float" />
      </div>

      {/* Value */}
      <p className="text-lg font-bold text-neutral-900 mb-1">{value}</p>

      {/* Label */}
      <p className="text-sm text-neutral-600">{label}</p>
    </button>
  );
}
