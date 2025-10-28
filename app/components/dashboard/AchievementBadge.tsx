interface AchievementBadgeProps {
  icon: string;
  value: string;
  label: string;
  onClick?: () => void;
}

export function AchievementBadge({
  icon,
  value,
  label,
  onClick,
}: AchievementBadgeProps) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 text-center hover:shadow-md hover:scale-102 transition-all duration-200"
    >
      {/* Icon */}
      <div className="text-4xl mb-2">{icon}</div>

      {/* Value */}
      <p className="text-lg font-bold text-neutral-900 mb-1">{value}</p>

      {/* Label */}
      <p className="text-sm text-neutral-600">{label}</p>
    </button>
  );
}
