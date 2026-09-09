"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Trash2,
  ExternalLink,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  X,
} from "lucide-react";

export interface AdminCommentItem {
  id: string;
  articleId: string;
  articleTitle: string;
  userId: string;
  userName: string | null;
  userEmail: string | null;
  content: string;
  createdAt: string;
}

interface CommentsModerationProps {
  initialComments: AdminCommentItem[];
}

export default function CommentsModeration({ initialComments }: CommentsModerationProps) {
  const [comments, setComments] = useState<AdminCommentItem[]>(initialComments);
  const [search, setSearch] = useState("");
  const [articleFilter, setArticleFilter] = useState("ALL");

  // Deletion modal state
  const [commentToDelete, setCommentToDelete] = useState<AdminCommentItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Unique articles that have comments
  const uniqueArticles = useMemo(() => {
    const map = new Map<string, string>();
    comments.forEach((c) => {
      if (!map.has(c.articleId)) {
        map.set(c.articleId, c.articleTitle);
      }
    });
    return Array.from(map.entries()).map(([id, title]) => ({ id, title }));
  }, [comments]);

  // Filtered comments
  const filteredComments = useMemo(() => {
    return comments.filter((c) => {
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchContent = c.content.toLowerCase().includes(q);
        const matchName = c.userName ? c.userName.toLowerCase().includes(q) : false;
        const matchEmail = c.userEmail ? c.userEmail.toLowerCase().includes(q) : false;
        const matchArticle = c.articleTitle.toLowerCase().includes(q);
        if (!matchContent && !matchName && !matchEmail && !matchArticle) return false;
      }

      if (articleFilter !== "ALL" && c.articleId !== articleFilter) {
        return false;
      }

      return true;
    });
  }, [comments, search, articleFilter]);

  // Delete handler
  const confirmDelete = async () => {
    if (!commentToDelete) return;
    setIsDeleting(true);
    setToast(null);

    try {
      const res = await fetch(`/api/admin/comments/${commentToDelete.id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        setToast({ message: data.error || "تعذر حذف التعليق", type: "error" });
      } else {
        setComments((prev) => prev.filter((c) => c.id !== commentToDelete.id));
        setToast({ message: "تم حذف التعليق بنجاح من المنظومة.", type: "success" });
        setCommentToDelete(null);
        setTimeout(() => setToast(null), 4000);
      }
    } catch (err) {
      setToast({ message: "حدث خطأ غير متوقع في الاتصال بالخادم", type: "error" });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-5" dir="rtl">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`p-3.5 rounded-xs text-xs font-sans flex items-center justify-between gap-3 border ${
            toast.type === "success"
              ? "bg-emerald-50 text-emerald-900 border-emerald-200"
              : "bg-red-50 text-red-900 border-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
          <button
            onClick={() => setToast(null)}
            className="text-neutral-400 hover:text-neutral-900 text-xs px-2"
          >
            إغلاق
          </button>
        </div>
      )}

      {/* Summary KPI Badges */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-sans">
        <span className="bg-white border border-[#E5E2DC] px-3 py-1.5 rounded-xs font-bold text-neutral-800">
          إجمالي التعليقات: <span className="font-mono text-[#C86A00]">{comments.length}</span>
        </span>
        <span className="bg-neutral-100 border border-neutral-200 text-neutral-700 px-3 py-1.5 rounded-xs font-bold">
          الدراسات التي حظيت بنقاش: <span className="font-mono">{uniqueArticles.length}</span>
        </span>
      </div>

      {/* Filter and Search */}
      <div className="bg-white border border-[#E5E2DC] p-4 rounded-sm shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="ابحث في نص التعليق أو اسم المعلق..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#FCFBF9] border border-neutral-300 text-xs py-2 pr-8 pl-3 rounded-xs focus:outline-none focus:border-neutral-900"
            />
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-3" />
          </div>

          {/* Article Filter */}
          <div>
            <select
              value={articleFilter}
              onChange={(e) => setArticleFilter(e.target.value)}
              className="w-full bg-[#FCFBF9] border border-neutral-300 text-xs py-2 px-2.5 rounded-xs focus:outline-none focus:border-neutral-900 font-sans"
            >
              <option value="ALL">جميع الدراسات والمقالات</option>
              {uniqueArticles.map((art) => (
                <option key={art.id} value={art.id}>
                  {art.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-3">
        {filteredComments.length > 0 ? (
          filteredComments.map((comment) => (
            <div
              key={comment.id}
              className="bg-white border border-[#E5E2DC] p-4 sm:p-5 rounded-sm shadow-xs hover:border-neutral-400 transition-colors space-y-3"
            >
              {/* Header: User & Article */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-2.5">
                <div className="flex items-center gap-2 text-xs font-sans">
                  <div className="w-6 h-6 rounded-xs bg-neutral-800 text-white flex items-center justify-center font-bold text-[10px]">
                    {comment.userName ? comment.userName.slice(0, 1) : "م"}
                  </div>
                  <div>
                    <span className="font-bold text-neutral-900">{comment.userName || "مستخدم غير مسمى"}</span>
                    <span className="text-neutral-400 font-mono text-[10px] mr-2">
                      ({comment.userEmail || "بدون بريد"})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/articles/${comment.articleId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-bold text-[#C86A00] hover:underline flex items-center gap-1 font-serif"
                    title="الانتقال إلى المقال"
                  >
                    <span>الدراسة: {comment.articleTitle}</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                  <span className="text-neutral-300">•</span>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {new Date(comment.createdAt).toLocaleString("ar-EG")}
                  </span>
                </div>
              </div>

              {/* Comment Content */}
              <p className="text-xs text-neutral-800 font-serif leading-relaxed whitespace-pre-wrap bg-[#FAF7F0] p-3 rounded-xs border border-neutral-100">
                {comment.content}
              </p>

              {/* Action */}
              <div className="flex justify-end">
                <button
                  onClick={() => setCommentToDelete(comment)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-red-700 hover:text-red-900 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xs transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>حذف التعليق المخالف</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white border border-[#E5E2DC] p-12 text-center text-neutral-400 font-serif rounded-sm">
            لا توجد تعليقات مطابقة لمعايير البحث.
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {commentToDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E5E2DC] rounded-sm max-w-md w-full p-5 sm:p-6 shadow-xl space-y-4 text-right">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-bold text-neutral-900 font-sans text-base flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                <span>تأكيد حذف التعليق</span>
              </h3>
              <button
                onClick={() => setCommentToDelete(null)}
                className="text-neutral-400 hover:text-black cursor-pointer p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-neutral-700 font-sans space-y-2">
              <p>هل أنت متأكد من رغبتك في حذف هذا التعليق نهائياً؟ لا يمكن التراجع عن هذه العملية.</p>
              <div className="p-3 bg-[#FAF7F0] border border-[#E5E2DC] rounded-xs font-serif italic text-neutral-800">
                &ldquo;{commentToDelete.content}&rdquo;
              </div>
              <div className="text-[11px] text-neutral-500 font-mono">
                كاتب التعليق: {commentToDelete.userName || commentToDelete.userEmail}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-neutral-100">
              <button
                onClick={() => setCommentToDelete(null)}
                disabled={isDeleting}
                className="px-3.5 py-2 text-xs font-bold text-neutral-700 hover:text-black hover:bg-neutral-100 rounded-xs transition-colors cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-bold text-white bg-red-700 hover:bg-red-800 rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isDeleting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>نعم، احذف التعليق</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
