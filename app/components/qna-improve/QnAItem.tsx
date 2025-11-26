import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface QnAItemProps {
  question: string;
  answer: string;
  category?: string;
}

export function QnAItem({ question, answer, category }: QnAItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className={`group rounded-2xl transition-all duration-300 border ${
        isOpen 
          ? "bg-white border-primary-100 shadow-lg shadow-primary-500/5" 
          : "bg-white/60 border-white/60 hover:bg-white hover:border-primary-50 hover:shadow-md"
      }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-start justify-between p-6 text-left"
      >
        <div className="flex-1 pr-8">
          {category && (
            <span className="inline-block px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-600 text-xs font-medium mb-3">
              {category}
            </span>
          )}
          <h3 className={`text-lg font-semibold transition-colors ${
            isOpen ? "text-primary-700" : "text-neutral-900 group-hover:text-primary-700"
          }`}>
            {question}
          </h3>
        </div>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
          isOpen ? "bg-primary-100 text-primary-600 rotate-180" : "bg-neutral-100 text-neutral-500 group-hover:bg-primary-50 group-hover:text-primary-600"
        }`}>
          <ChevronDown className="w-5 h-5" />
        </div>
      </button>
      
      <div 
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-6 pt-0">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-neutral-200 to-transparent mb-4" />
            <p className="text-neutral-600 leading-relaxed whitespace-pre-line">
              {answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
