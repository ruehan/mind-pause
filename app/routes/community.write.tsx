import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { AppLayout } from "../components/AppLayout";
import { Button } from "../components/Button";
import { useToast } from "../components/ToastProvider";
import { useAuth } from "../contexts/AuthContext";
import * as api from "../lib/api";

// Jodit 에디터를 동적으로 import (클라이언트 사이드에서만)
let JoditEditor: any = null;

export function meta() {
  return [
    { title: "글쓰기 - 마음쉼표" },
    {
      name: "description",
      content: "커뮤니티 글쓰기",
    },
  ];
}

export default function CommunityWrite() {
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const editor = useRef(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditorLoaded, setIsEditorLoaded] = useState(false);

  // 클라이언트 사이드에서만 Jodit 에디터 로드
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("jodit-react").then((module) => {
        JoditEditor = module.default;
        setIsEditorLoaded(true);
      });
    }
  }, []);

  // Jodit 에디터 설정
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "내용을 입력하세요...",
      height: 500,
      language: "ko",
      toolbarButtonSize: "middle",
      buttons: [
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "|",
        "ul",
        "ol",
        "|",
        "font",
        "fontsize",
        "brush",
        "|",
        "image",
        "link",
        "|",
        "align",
        "|",
        "undo",
        "redo",
      ],
      disabled: isSubmitting,
    }),
    [isSubmitting]
  );

  // 로그인 체크
  if (!user) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center">
            <p className="text-body text-neutral-600 mb-4">
              글을 작성하려면 로그인이 필요합니다
            </p>
            <Button variant="primary" onClick={() => navigate("/login")}>
              로그인하기
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    if (!title.trim()) {
      toast.error("입력 오류", "제목을 입력해주세요");
      return;
    }

    if (title.length > 255) {
      toast.error("입력 오류", "제목은 255자 이내로 입력해주세요");
      return;
    }

    // HTML 태그를 제거하고 실제 텍스트가 있는지 확인
    const textContent = content.replace(/<[^>]*>/g, "").trim();
    if (!textContent) {
      toast.error("입력 오류", "내용을 입력해주세요");
      return;
    }

    try {
      setIsSubmitting(true);

      const newPost = await api.createPost({
        title: title.trim(),
        content: content.trim(),
        is_anonymous: isAnonymous,
      });

      toast.success("성공", "게시글이 작성되었습니다");
      navigate(`/community/${newPost.id}`);
    } catch (error) {
      console.error("게시글 작성 오류:", error);
      toast.error("오류", "게시글 작성 중 오류가 발생했습니다");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    const textContent = content.replace(/<[^>]*>/g, "").trim();
    if (title.trim() || textContent) {
      if (confirm("작성 중인 내용이 있습니다. 정말 취소하시겠습니까?")) {
        navigate("/community");
      }
    } else {
      navigate("/community");
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-h2 text-neutral-900">글쓰기</h1>
          <p className="text-body text-neutral-600 mt-2">
            커뮤니티에 자유롭게 글을 작성해보세요
          </p>
        </div>

        {/* Writing Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-4">
            {/* Title Input */}
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-body-sm font-medium text-neutral-700 mb-2"
              >
                제목 <span className="text-error-600">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요 (최대 255자)"
                maxLength={255}
                className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={isSubmitting}
              />
              <p className="text-caption text-neutral-500 mt-1">
                {title.length}/255
              </p>
            </div>

            {/* Content Input */}
            <div className="mb-4">
              <label className="block text-body-sm font-medium text-neutral-700 mb-2">
                내용 <span className="text-error-600">*</span>
              </label>
              {isEditorLoaded && JoditEditor ? (
                <JoditEditor
                  ref={editor}
                  value={content}
                  config={config}
                  onBlur={(newContent) => setContent(newContent)}
                  onChange={(newContent) => {}}
                />
              ) : (
                <div className="w-full h-[500px] border border-neutral-200 rounded-lg flex items-center justify-center bg-neutral-50">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                    <p className="text-body-sm text-neutral-600">에디터 로딩 중...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Anonymous Checkbox */}
            <div className="mb-4">
              <label className="flex items-center gap-2 text-body text-neutral-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-500"
                  disabled={isSubmitting}
                />
                익명으로 작성
              </label>
              <p className="text-caption text-neutral-500 mt-1 ml-6">
                익명으로 작성하면 작성자 정보가 표시되지 않습니다
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              취소
            </Button>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                취소
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting || !isEditorLoaded || !title.trim() || !content.replace(/<[^>]*>/g, "").trim()}
              >
                {isSubmitting ? "작성 중..." : "작성하기"}
              </Button>
            </div>
          </div>
        </form>

        {/* Guidelines */}
        <div className="mt-8 bg-neutral-50 rounded-xl p-6">
          <h3 className="text-body-sm font-medium text-neutral-900 mb-3">
            📝 작성 가이드라인
          </h3>
          <ul className="space-y-2 text-body-sm text-neutral-600">
            <li className="flex items-start gap-2">
              <span className="text-primary-600">•</span>
              <span>타인을 존중하고 배려하는 글을 작성해주세요</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600">•</span>
              <span>개인정보나 민감한 정보는 공유하지 마세요</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600">•</span>
              <span>광고, 스팸, 욕설 등 부적절한 내용은 삭제될 수 있습니다</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600">•</span>
              <span>익명으로 작성한 글도 관리자는 작성자를 확인할 수 있습니다</span>
            </li>
          </ul>
        </div>
      </div>
    </AppLayout>
  );
}
