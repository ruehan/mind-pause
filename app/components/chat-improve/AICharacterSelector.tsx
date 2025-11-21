import { useState, useEffect } from "react";
import { Check, Plus } from "lucide-react";
import { AvatarPreview } from "../chat/AvatarPreview";
import * as api from "~/lib/api";

interface AICharacterSelectorProps {
  activeCharacterId?: string;
  onSelect: (character: api.AICharacter) => void;
  onCreateNew: () => void;
}

export function AICharacterSelector({ activeCharacterId, onSelect, onCreateNew }: AICharacterSelectorProps) {
  const [characters, setCharacters] = useState<api.AICharacter[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = async () => {
    try {
      setIsLoading(true);
      const data = await api.getAICharacters();
      setCharacters(data);
    } catch (error) {
      console.error("Failed to load characters:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-neutral-500">캐릭터 목록을 불러오는 중...</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-1">
      {characters.map((char) => (
        <button
          key={char.id}
          onClick={() => onSelect(char)}
          className={`
            relative flex items-start gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200
            ${activeCharacterId === char.id
              ? "border-primary-500 bg-primary-50 shadow-md"
              : "border-neutral-100 bg-white hover:border-primary-200 hover:shadow-sm"
            }
          `}
        >
          <div className="flex-shrink-0">
            {char.avatar_options ? (
              <AvatarPreview options={char.avatar_options} size={48} />
            ) : (
              <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-2xl">
                🤖
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className={`font-bold mb-1 ${activeCharacterId === char.id ? "text-primary-900" : "text-neutral-900"}`}>
              {char.name}
            </h3>
            <p className="text-sm text-neutral-600 line-clamp-2">
              {char.description || "설명이 없습니다."}
            </p>
            
            {/* Traits tags */}
            {char.traits && char.traits.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {char.traits.slice(0, 2).map((trait, i) => (
                  <span key={i} className="px-2 py-0.5 bg-white rounded-md border border-neutral-200 text-xs text-neutral-500">
                    #{trait}
                  </span>
                ))}
              </div>
            )}
          </div>

          {activeCharacterId === char.id && (
            <div className="absolute top-4 right-4 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white shadow-sm">
              <Check className="w-3.5 h-3.5" />
            </div>
          )}
        </button>
      ))}

      {/* Create New Button */}
      <button
        onClick={onCreateNew}
        className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 border-dashed border-neutral-300 hover:border-primary-400 hover:bg-primary-50/50 transition-all duration-200 min-h-[140px]"
      >
        <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 group-hover:text-primary-600">
          <Plus className="w-6 h-6" />
        </div>
        <span className="font-medium text-neutral-600">새로운 AI 친구 만들기</span>
      </button>
    </div>
  );
}
