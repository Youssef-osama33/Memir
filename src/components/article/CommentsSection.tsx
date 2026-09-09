"use client";

import { useState } from "react";
import { MessageSquare, Send } from "lucide-react";

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  user: { name: string | null; image?: string | null } | null;
};

export default function CommentsSection({ articleId, initialComments = [] }: { articleId: string, initialComments?: Comment[] }) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/articles/${articleId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      
      if (!res.ok) {
        if (res.status === 401) {
          alert("يرجى تسجيل الدخول للتعليق");
        } else {
          alert("حدث خطأ أثناء إضافة التعليق");
        }
        return;
      }
      
      const newComment = await res.json();
      setComments([newComment, ...comments]);
      setContent("");
    } catch (err) {
      alert("حدث خطأ أثناء إضافة التعليق");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-12 border-t border-neutral-200 pt-8 font-sans" dir="rtl">
      <div className="flex items-center gap-2 mb-6 text-neutral-800">
        <MessageSquare size={20} />
        <h3 className="text-xl font-bold font-serif">التعليقات ({comments.length})</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="mb-8 relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="أضف تعليقاً يثري النقاش..."
          className="w-full border border-neutral-300 rounded-lg p-3 min-h-[100px] bg-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800 resize-y"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className="absolute bottom-3 left-3 bg-amber-800 text-white p-2 rounded hover:bg-amber-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="إرسال التعليق"
        >
          <Send size={16} />
        </button>
      </form>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-neutral-500 text-center py-6 bg-neutral-50 rounded-lg border border-neutral-100 text-sm">
            لا توجد تعليقات حتى الآن. كن أول من يشارك برأيه.
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-white p-4 rounded-lg border border-neutral-100 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-neutral-800 text-sm">{comment.user?.name || "مستخدم"}</span>
                <span className="text-xs text-neutral-500">
                  {new Date(comment.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              </div>
              <p className="text-neutral-700 text-sm leading-relaxed whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
