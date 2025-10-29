import {
  Home,
  Edit,
  MessageCircle,
  Users,
  Trophy,
  BarChart3,
  Settings,
  Lock,
  CreditCard,
  HelpCircle,
  Folder,
} from "lucide-react";

interface CategorySidebarProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategorySidebar({
  activeCategory,
  onCategoryChange,
}: CategorySidebarProps) {
  const categories = [
    { id: "getting_started", icon: Home, label: "시작하기" },
    { id: "emotion_log", icon: Edit, label: "감정 기록" },
    { id: "ai_coach", icon: MessageCircle, label: "AI 코치" },
    { id: "community", icon: Users, label: "커뮤니티" },
    { id: "challenge", icon: Trophy, label: "챌린지" },
    { id: "dashboard", icon: BarChart3, label: "대시보드" },
    { id: "settings", icon: Settings, label: "설정" },
    { id: "account", icon: Lock, label: "계정/보안" },
    { id: "payment", icon: CreditCard, label: "결제/구독" },
    { id: "other", icon: HelpCircle, label: "기타" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4">
      <h3 className="text-h4 text-neutral-900 mb-4 flex items-center gap-2">
        <Folder className="w-5 h-5 text-primary-600" />
        카테고리
      </h3>
      <div className="space-y-1">
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`
                w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center gap-2
                ${
                  activeCategory === category.id
                    ? "bg-primary-50 border-l-4 border-primary-500 text-primary-700 font-medium"
                    : "hover:bg-neutral-100 text-neutral-700"
                }
              `}
            >
              <IconComponent className="w-4 h-4" />
              <span className="text-sm">{category.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
