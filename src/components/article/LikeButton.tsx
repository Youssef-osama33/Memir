"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

export default function LikeButton({ articleId, initialLikes = 0, isInitiallyLiked = false }: { articleId: string, initialLikes?: number, isInitiallyLiked?: boolean }) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(isInitiallyLiked);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    if (isLoading) return;
    setIsLoading(true);
    
    const wasLiked = isLiked;
    
    try {
      // Optimistic update
      setIsLiked(!wasLiked);
      setLikes(prev => wasLiked ? prev - 1 : prev + 1);
      
      const res = await fetch(`/api/articles/${articleId}/like`, { method: "POST" });
      
      if (!res.ok) {
        if (res.status === 401) {
          // If unauthorized, could redirect to signin. For now, just revert.
          alert("يرجى تسجيل الدخول للإعجاب بالمقال");
        }
        // Revert on error
        setIsLiked(wasLiked);
        setLikes(prev => wasLiked ? prev + 1 : prev - 1);
      }
    } catch (e) {
      // Revert on error
      setIsLiked(wasLiked);
      setLikes(prev => wasLiked ? prev + 1 : prev - 1);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors font-sans text-sm ${
        isLiked 
          ? "border-red-200 bg-red-50 text-red-600" 
          : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
      }`}
    >
      <Heart size={18} className={isLiked ? "fill-current" : ""} />
      <span>{likes}</span>
      <span className="hidden sm:inline">{isLiked ? "أعجبني" : "إعجاب"}</span>
    </button>
  );
}
