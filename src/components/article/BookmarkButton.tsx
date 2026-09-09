"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import { useRouter } from "next/navigation";

interface BookmarkButtonProps {
  articleId: string;
  isInitiallySaved?: boolean;
  showLabel?: boolean;
  className?: string;
}

export default function BookmarkButton({
  articleId,
  isInitiallySaved = false,
  showLabel = true,
  className = "",
}: BookmarkButtonProps) {
  const [isSaved, setIsSaved] = useState(isInitiallySaved);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const router = useRouter();

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;
    setIsLoading(true);
    setFeedback(null);

    const wasSaved = isSaved;
    // Optimistic toggle
    setIsSaved(!wasSaved);

    try {
      const res = await fetch(`/api/articles/${articleId}/save`, {
        method: "POST",
      });

      if (!res.ok) {
        if (res.status === 401) {
          setIsSaved(wasSaved);
          router.push(`/auth/signin?callbackUrl=/articles/${articleId}`);
          return;
        }
        // Revert on error
        setIsSaved(wasSaved);
        setFeedback("تعذر حفظ المقال");
      } else {
        const data = await res.json();
        setIsSaved(Boolean(data.saved));
      }
    } catch (err) {
      console.error("[BOOKMARK_TOGGLE_ERR]", err);
      setIsSaved(wasSaved);
      setFeedback("خطأ بالاتصال");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggleSave}
      disabled={isLoading}
      title={isSaved ? "إزالة من المقالات المحفوظة" : "حفظ المقال للقراءة لاحقاً"}
      className={`inline-flex items-center justify-center gap-1.5 transition-all font-sans text-xs cursor-pointer ${
        showLabel
          ? `px-3.5 py-1.5 rounded-full border ${
              isSaved
                ? "border-[#C86A00] bg-[#FAF7F0] text-[#8C4B00] font-bold"
                : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
            }`
          : `p-1.5 rounded-xs transition-colors ${
              isSaved
                ? "text-[#C86A00] hover:text-[#8C4B00] bg-[#FAF7F0]"
                : "text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
            }`
      } ${className}`}
    >
      <Bookmark
        size={showLabel ? 16 : 15}
        className={`transition-transform duration-200 ${isSaved ? "fill-[#C86A00] text-[#C86A00] scale-110" : ""}`}
      />
      {showLabel && (
        <span>{isSaved ? "محفوظ للقراءة" : "حفظ لاحقاً"}</span>
      )}
      {feedback && (
        <span className="text-[10px] text-red-500 font-sans mr-1">{feedback}</span>
      )}
    </button>
  );
}
