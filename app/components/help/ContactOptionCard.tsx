import { Button } from "../Button";
import type { LucideIcon } from "lucide-react";

interface ContactOptionCardProps {
  icon: LucideIcon;
  title: string;
  details: string;
  action: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
}

export function ContactOptionCard({
  icon: Icon,
  title,
  details,
  action,
}: ContactOptionCardProps) {
  return (
    <div className="glass rounded-lg shadow-soft hover:shadow-elevation-3 p-6 text-center transition-all duration-300 transform hover:-translate-y-1 border border-white/20">
      <div className="mb-3 flex justify-center">
        <Icon className="w-10 h-10 text-primary-600 animate-float" />
      </div>
      <h4 className="text-lg font-semibold text-neutral-800 mb-1">{title}</h4>
      <p className="text-sm text-neutral-600 mb-4">{details}</p>
      {action.href ? (
        <a
          href={action.href}
          className="inline-block w-full px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
        >
          {action.label}
        </a>
      ) : (
        <Button
          variant="primary"
          size="md"
          onClick={action.onClick}
          className="w-full"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
