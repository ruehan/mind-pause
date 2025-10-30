import type { LucideIcon } from "lucide-react";

interface AdminStatCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  change: number;
}

export function AdminStatCard({
  icon: Icon,
  title,
  value,
  change,
}: AdminStatCardProps) {
  const isPositive = change >= 0;

  return (
    <div className="glass rounded-lg shadow-soft hover:shadow-elevation-3 transition-all duration-300 transform hover:-translate-y-1 p-6 border border-white/20">
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-10 h-10 text-primary-600 animate-float" />
        <span
          className={`text-sm font-semibold ${
            isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {isPositive ? "+" : ""}
          {change}%
        </span>
      </div>
      <h3 className="text-sm text-neutral-600 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-neutral-900">{value}</p>
    </div>
  );
}
