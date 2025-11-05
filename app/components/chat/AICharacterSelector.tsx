import { useState, useEffect } from "react";
import { AvatarPreview } from "./AvatarPreview";
import { Button } from "../Button";
import { useToast } from "../ToastProvider";
import * as api from "../../lib/api";

interface AICharacterSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  currentCharacterId?: string;
  onCharacterSelected: () => void;
  onCreateNew: () => void;
}

export function AICharacterSelector({
  isOpen,
  onClose,
  currentCharacterId,
  onCharacterSelected,
  onCreateNew,
}: AICharacterSelectorProps) {
  const toast = useToast();
  const [characters, setCharacters] = useState<api.AICharacter[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadCharacters();
    }
  }, [isOpen]);

  const loadCharacters = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAICharacters();
      setCharacters(data);
    } catch (error) {
      if (error instanceof api.UnauthorizedError) return;
      toast.error("오류", "캐릭터 목록을 불러오는 중 오류가 발생했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCharacter = async (characterId: string) => {
    if (characterId === currentCharacterId) {
      onClose();
      return;
    }

    setSelectedId(characterId);
    try {
      await api.updateAICharacter(characterId, { is_active: true });
      toast.success("캐릭터 변경", "AI 캐릭터가 변경되었습니다");
      onCharacterSelected();
      onClose();
    } catch (error) {
      if (error instanceof api.UnauthorizedError) return;
      toast.error("오류", "캐릭터 변경 중 오류가 발생했습니다");
    } finally {
      setSelectedId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
    >
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <h3 className="text-h4 text-neutral-900">AI 캐릭터 선택</h3>
            <button
              onClick={onClose}
              className="text-neutral-600 hover:text-neutral-900 text-2xl transition-colors"
            >
              ×
            </button>
          </div>
          <p className="text-body-sm text-neutral-600 mt-2">
            대화할 AI 캐릭터를 선택하거나 새로 만드세요
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <>
              {/* 새 캐릭터 생성 버튼 */}
              <button
                onClick={() => {
                  onClose();
                  onCreateNew();
                }}
                className="w-full mb-4 p-6 border-2 border-dashed border-neutral-300 rounded-2xl hover:border-primary-400 hover:bg-primary-50 transition-all group"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-20 h-20 rounded-full bg-neutral-100 group-hover:bg-primary-100 flex items-center justify-center text-4xl transition-colors">
                    +
                  </div>
                  <span className="text-body font-medium text-neutral-700 group-hover:text-primary-600 transition-colors">
                    새 캐릭터 만들기
                  </span>
                </div>
              </button>

              {/* 캐릭터 목록 */}
              {characters.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-body text-neutral-600">
                    아직 생성된 캐릭터가 없습니다
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {characters.map((character) => {
                    const isActive = character.id === currentCharacterId;
                    const isSelecting = character.id === selectedId;

                    return (
                      <button
                        key={character.id}
                        onClick={() => handleSelectCharacter(character.id)}
                        disabled={isSelecting}
                        className={`
                          p-4 rounded-2xl border-2 transition-all text-left
                          ${
                            isActive
                              ? "border-primary-500 bg-primary-50"
                              : "border-neutral-200 hover:border-primary-300 hover:bg-neutral-50"
                          }
                          ${isSelecting ? "opacity-50 cursor-wait" : ""}
                        `}
                      >
                        <div className="flex items-start gap-4">
                          {/* Avatar */}
                          <div className="flex-shrink-0">
                            {character.avatar_options ? (
                              <AvatarPreview
                                options={character.avatar_options}
                                size={60}
                              />
                            ) : (
                              <div className="w-15 h-15 rounded-full bg-neutral-200 flex items-center justify-center text-2xl">
                                🤖
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-body font-semibold text-neutral-900 truncate">
                                {character.name}
                              </h4>
                              {isActive && (
                                <span className="flex-shrink-0 text-primary-500">
                                  ✓
                                </span>
                              )}
                            </div>
                            <p className="text-body-sm text-neutral-600 line-clamp-2">
                              {character.personality}
                            </p>
                            {character.description && (
                              <p className="text-caption text-neutral-500 mt-1 line-clamp-1">
                                {character.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {isActive && (
                          <div className="mt-3 pt-3 border-t border-primary-200">
                            <span className="text-caption text-primary-600 font-medium">
                              현재 선택된 캐릭터
                            </span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
