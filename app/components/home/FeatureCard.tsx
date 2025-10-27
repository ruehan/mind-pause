interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transform hover:-translate-y-1 transition-all duration-300 border border-neutral-100">
      <div className="flex flex-col items-center text-center">
        {/* Icon */}
        <div className="text-6xl mb-4">{icon}</div>

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
