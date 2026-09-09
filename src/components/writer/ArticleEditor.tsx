"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Category } from "@prisma/client";
import { CATEGORIES } from "../../lib/categories";
import { saveArticle } from "../../app/writer/actions";
import { ArrowRight, Save, Send, Eye, Edit3, Type, List, Quote, Link as LinkIcon } from "lucide-react";
import { Compass } from "lucide-react";
import TiptapEditor from "./TiptapEditor";

interface ArticleEditorProps {
  initialData?: {
    id?: string;
    title?: string;
    slug?: string;
    category?: Category;
    excerpt?: string;
    content?: string;
    isPremium?: boolean;
    bookAuthor?: string | null;
    ideaInOurTimeTitle?: string | null;
    draft?: boolean;
    pendingReview?: boolean;
  };
}

export default function ArticleEditor({ initialData }: ArticleEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || "");
  const [category, setCategory] = useState<Category>(initialData?.category || "AI_GEOPOLITICS");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [isPremium, setIsPremium] = useState(initialData?.isPremium ?? true);
  const [bookAuthor, setBookAuthor] = useState(initialData?.bookAuthor || "");
  const [ideaInOurTimeTitle, setIdeaInOurTimeTitle] = useState(initialData?.ideaInOurTimeTitle || "الفكرة في زمننا");
  
  const [isSaving, setIsSaving] = useState(false);

  const wordCount = content.trim().split(/\\s+/).filter(w => w.length > 0).length;

  const handleSave = async (actionType: "draft" | "review") => {
    try {
      setIsSaving(true);
      const formData = new FormData();
      if (initialData?.id) formData.append("id", initialData.id);
      if (initialData?.slug) formData.append("slug", initialData.slug);
      formData.append("title", title);
      formData.append("category", category);
      formData.append("excerpt", excerpt);
      formData.append("content", content);
      formData.append("isPremium", String(isPremium));
      formData.append("actionType", actionType);
      
      if (category === "BOOKS") {
        formData.append("bookAuthor", bookAuthor);
        formData.append("ideaInOurTimeTitle", ideaInOurTimeTitle);
      }

      const res = await saveArticle(formData);
      if (res.success) {
        router.push("/writer");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء الحفظ");
    } finally {
      setIsSaving(false);
    }
  };

  const insertMarkdown = (prefix: string, suffix: string = "") => {
    const textarea = document.getElementById("content-editor") as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const selected = text.substring(start, end) || "نص";
    const after = text.substring(end);
    
    setContent(before + prefix + selected + suffix + after);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 0);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-6 dir-rtl" dir="rtl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
            <ArrowRight className="w-5 h-5 text-neutral-600" />
          </button>
          <h1 className="text-2xl font-bold font-sans text-neutral-900">
            {initialData?.id ? "تعديل الأطروحة" : "كتابة أطروحة جديدة"}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleSave("draft")} 
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50 rounded-sm font-sans text-sm font-bold transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            حفظ كمسودة
          </button>
          <button 
            onClick={() => handleSave("review")} 
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-amber-800 text-white hover:bg-amber-900 rounded-sm font-sans text-sm font-bold transition-colors shadow-sm disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            إرسال للمراجعة
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Editor Area */}
        <div className="lg:col-span-3 space-y-6">
          <input
            type="text"
            placeholder="العنوان الرئيسي للأطروحة..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-3xl font-serif font-bold text-neutral-900 placeholder:text-neutral-300 border-none outline-none bg-transparent py-2"
          />

          <div className="bg-white border border-neutral-200 rounded-md shadow-sm overflow-hidden flex flex-col min-h-[600px]">
            {/* Editor Area */}
            <div className="flex-grow bg-white flex flex-col relative h-full">
              <TiptapEditor content={content} onChange={setContent} />
            </div>
            
            {/* Word Count Footer */}
            <div className="bg-neutral-50 border-t border-neutral-200 px-4 py-2 flex items-center justify-between text-xs font-sans text-neutral-500">
              <span>تستهدف أطروحات مِعمار ما بين 2500 - 4500 كلمة.</span>
              <span className="font-bold">{wordCount} كلمة</span>
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-neutral-200 rounded-md shadow-sm p-5">
            <h3 className="font-bold text-sm text-neutral-900 border-b border-neutral-100 pb-3 mb-4">الإعدادات وتصنيف المادة</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-sans text-neutral-500 mb-1.5">التصنيف الرئيسي</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full border border-neutral-300 rounded-sm text-sm font-sans px-3 py-2 outline-none focus:border-amber-800 transition-colors"
                >
                  {CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              {category === "BOOKS" && (
                <div className="space-y-4 p-4 bg-amber-50/50 border border-amber-200 rounded-sm">
                  <div>
                    <label className="block text-xs font-sans text-amber-900 mb-1.5">مؤلف الكتاب الأصلي</label>
                    <input 
                      type="text" 
                      value={bookAuthor}
                      onChange={(e) => setBookAuthor(e.target.value)}
                      placeholder="اسم الكاتب..."
                      className="w-full border border-amber-200 rounded-sm text-sm font-sans px-3 py-2 outline-none focus:border-amber-800 transition-colors bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-sans text-amber-900 mb-1.5">عنوان قسم "الفكرة في زمننا"</label>
                    <input 
                      type="text" 
                      value={ideaInOurTimeTitle}
                      onChange={(e) => setIdeaInOurTimeTitle(e.target.value)}
                      className="w-full border border-amber-200 rounded-sm text-sm font-sans px-3 py-2 outline-none focus:border-amber-800 transition-colors bg-white"
                    />
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-sans text-neutral-500">الملخص (Excerpt)</label>
                  <span className={`text-[10px] ${excerpt.length > 200 ? 'text-rose-500' : 'text-neutral-400'}`}>
                    {excerpt.length}/200
                  </span>
                </div>
                <textarea 
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="ملخص مكثف للأطروحة يظهر في البطاقات..."
                  className="w-full border border-neutral-300 rounded-sm text-sm font-sans px-3 py-2 outline-none focus:border-amber-800 transition-colors h-24 resize-none"
                />
              </div>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-neutral-900">مقال مدفوع للمشتركين</div>
                  <div className="text-[10px] text-neutral-500 font-sans">تفعيل نظام الجدار الذهبي (Paywall)</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={isPremium}
                    onChange={(e) => setIsPremium(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-800"></div>
                </label>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
