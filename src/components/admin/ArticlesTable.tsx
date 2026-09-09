"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  ExternalLink,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  Lock,
  RefreshCw,
  AlertCircle,
  FileText,
} from "lucide-react";
import { CATEGORIES } from "../../lib/categories";

export interface AdminArticleItem {
  slug: string;
  title: string;
  author: string;
  category: string;
  categoryTitle: string;
  isPremium: boolean;
  draft: boolean;
  publishedAt: string;
}

interface ArticlesTableProps {
  initialArticles: AdminArticleItem[];
}

export default function ArticlesTable({ initialArticles }: ArticlesTableProps) {
  const [articles, setArticles] = useState<AdminArticleItem[]>(initialArticles);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedDraftStatus, setSelectedDraftStatus] = useState("ALL"); // ALL, PUBLISHED, DRAFT
  const [selectedPremiumStatus, setSelectedPremiumStatus] = useState("ALL"); // ALL, PREMIUM, FREE
  const [togglingSlug, setTogglingSlug] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Toggle draft status via API
  const handleToggleDraft = async (slug: string, currentDraft: boolean) => {
    setTogglingSlug(slug);
    setNotice(null);

    try {
      const res = await fetch(`/api/admin/articles/${slug}/toggle-draft`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        setNotice({ message: data.error || "تعذر تعديل حالة المقال", type: "error" });
      } else {
        setArticles((prev) =>
          prev.map((art) => (art.slug === slug ? { ...art, draft: data.draft } : art))
        );
        setNotice({
          message: data.draft
            ? `تم تحويل "${articles.find((a) => a.slug === slug)?.title}" إلى مسودة.`
            : `تم نشر "${articles.find((a) => a.slug === slug)?.title}" بنجاح على الموقع.`,
          type: "success",
        });
        setTimeout(() => setNotice(null), 5000);
      }
    } catch (err: any) {
      setNotice({ message: "حدث خطأ غير متوقع في الاتصال بالخادم", type: "error" });
    } finally {
      setTogglingSlug(null);
    }
  };

  // Filtered & sorted articles
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchTitle = art.title.toLowerCase().includes(query);
        const matchAuthor = art.author.toLowerCase().includes(query);
        const matchSlug = art.slug.toLowerCase().includes(query);
        if (!matchTitle && !matchAuthor && !matchSlug) return false;
      }

      // Category match
      if (selectedCategory !== "ALL" && art.category !== selectedCategory) {
        return false;
      }

      // Draft status match
      if (selectedDraftStatus === "PUBLISHED" && art.draft) return false;
      if (selectedDraftStatus === "DRAFT" && !art.draft) return false;

      // Premium status match
      if (selectedPremiumStatus === "PREMIUM" && !art.isPremium) return false;
      if (selectedPremiumStatus === "FREE" && art.isPremium) return false;

      return true;
    });
  }, [articles, searchQuery, selectedCategory, selectedDraftStatus, selectedPremiumStatus]);

  const totalPublished = articles.filter((a) => !a.draft).length;
  const totalDrafts = articles.filter((a) => a.draft).length;

  return (
    <div className="space-y-5" dir="rtl">
      {/* Notice Banner */}
      {notice && (
        <div
          className={`p-3.5 rounded-xs text-xs font-sans flex items-center justify-between gap-3 border ${
            notice.type === "success"
              ? "bg-emerald-50 text-emerald-900 border-emerald-200"
              : "bg-red-50 text-red-900 border-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {notice.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{notice.message}</span>
          </div>
          <button
            onClick={() => setNotice(null)}
            className="text-neutral-400 hover:text-neutral-900 text-xs px-2"
          >
            إغلاق
          </button>
        </div>
      )}

      {/* Quick Summary Badges */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-sans">
        <span className="bg-white border border-[#E5E2DC] px-3 py-1.5 rounded-xs font-bold text-neutral-800">
          إجمالي الدراسات: <span className="font-mono text-[#C86A00]">{articles.length}</span>
        </span>
        <span className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-xs font-bold">
          منشورة: <span className="font-mono">{totalPublished}</span>
        </span>
        <span className="bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1.5 rounded-xs font-bold">
          مسودات: <span className="font-mono">{totalDrafts}</span>
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E5E2DC] p-4 rounded-sm shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative lg:col-span-1">
            <input
              type="text"
              placeholder="ابحث بالعنوان أو الكاتب..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FCFBF9] border border-neutral-300 text-xs py-2 pr-8 pl-3 rounded-xs focus:outline-none focus:border-neutral-900"
            />
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-3" />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#FCFBF9] border border-neutral-300 text-xs py-2 px-2.5 rounded-xs focus:outline-none focus:border-neutral-900 font-sans"
            >
              <option value="ALL">جميع التصنيفات الموضوعية</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.title}
                </option>
              ))}
            </select>
          </div>

          {/* Draft Status Filter */}
          <div>
            <select
              value={selectedDraftStatus}
              onChange={(e) => setSelectedDraftStatus(e.target.value)}
              className="w-full bg-[#FCFBF9] border border-neutral-300 text-xs py-2 px-2.5 rounded-xs focus:outline-none focus:border-neutral-900 font-sans"
            >
              <option value="ALL">حالة النشر (الكل)</option>
              <option value="PUBLISHED">منشورة فقط (متاحة للعموم)</option>
              <option value="DRAFT">مسودات فقط (محجوبة)</option>
            </select>
          </div>

          {/* Premium Status Filter */}
          <div>
            <select
              value={selectedPremiumStatus}
              onChange={(e) => setSelectedPremiumStatus(e.target.value)}
              className="w-full bg-[#FCFBF9] border border-neutral-300 text-xs py-2 px-2.5 rounded-xs focus:outline-none focus:border-neutral-900 font-sans"
            >
              <option value="ALL">مستوى الوصول (الكل)</option>
              <option value="PREMIUM">مدفوعة فقط (مشتركين)</option>
              <option value="FREE">مجانية مفتوحة</option>
            </select>
          </div>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white border border-[#E5E2DC] rounded-sm shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right border-collapse">
            <thead>
              <tr className="bg-[#FAF7F0] border-b border-[#E5E2DC] text-neutral-600 font-sans font-bold">
                <th className="py-3 px-4">عنوان الدراسة والكاتب</th>
                <th className="py-3 px-3">التصنيف</th>
                <th className="py-3 px-3">مستوى الوصول</th>
                <th className="py-3 px-3">حالة النشر</th>
                <th className="py-3 px-3">تاريخ النشر</th>
                <th className="py-3 px-4 text-left">إجراءات الرقابة والنشر</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-sans">
              {filteredArticles.length > 0 ? (
                filteredArticles.map((article) => {
                  const isToggling = togglingSlug === article.slug;
                  return (
                    <tr key={article.slug} className="hover:bg-[#FCFBF9] transition-colors">
                      {/* Title & Author */}
                      <td className="py-3.5 px-4 max-w-sm">
                        <div className="font-bold text-neutral-900 font-serif text-sm leading-snug">
                          {article.title}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-neutral-500 mt-1">
                          <span>الكاتب: {article.author}</span>
                          <span className="text-neutral-300">•</span>
                          <span className="font-mono text-[10px] text-neutral-400">/{article.slug}</span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-3">
                        <span className="inline-block bg-neutral-100 text-neutral-800 text-[11px] px-2 py-0.5 rounded-2xs font-medium">
                          {article.categoryTitle}
                        </span>
                      </td>

                      {/* Access Level */}
                      <td className="py-3.5 px-3">
                        {article.isPremium ? (
                          <span className="inline-flex items-center gap-1 text-[#8C4B00] bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-2xs text-[10px] font-bold">
                            <Lock className="w-2.5 h-2.5 text-[#C86A00]" />
                            <span>مدفوع (بلس/قياسي)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-2xs text-[10px] font-bold">
                            <span>مجاني مفتوح</span>
                          </span>
                        )}
                      </td>

                      {/* Draft Status */}
                      <td className="py-3.5 px-3">
                        {article.draft ? (
                          <span className="inline-flex items-center gap-1 bg-amber-100 text-[#8C4B00] px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                            <Clock className="w-3 h-3 text-[#C86A00]" />
                            <span>مسودة (محجوب)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                            <span>منشور للعامة</span>
                          </span>
                        )}
                      </td>

                      {/* Published Date */}
                      <td className="py-3.5 px-3 text-neutral-600 font-mono text-[11px]">
                        {new Date(article.publishedAt).toLocaleDateString("ar-EG", {
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-left">
                        <div className="flex items-center justify-end gap-2">
                          {/* Live Site View Link */}
                          <Link
                            href={`/articles/${article.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 border border-neutral-300 hover:border-neutral-900 text-neutral-700 hover:text-black rounded-xs transition-colors flex items-center gap-1 text-[11px] font-bold"
                            title="معاينة على الموقع الحي"
                          >
                            <span>معاينة</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>

                          {/* Toggle Draft Button */}
                          <button
                            onClick={() => handleToggleDraft(article.slug, article.draft)}
                            disabled={isToggling}
                            className={`px-3 py-1.5 rounded-xs text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${
                              article.draft
                                ? "bg-emerald-700 hover:bg-emerald-800 text-white shadow-2xs"
                                : "bg-neutral-800 hover:bg-black text-white"
                            }`}
                            title={
                              article.draft
                                ? "نشر المقال فورياً للجمهور"
                                : "تحويل المقال إلى مسودة وحجبه عن العموم"
                            }
                          >
                            {isToggling ? (
                              <RefreshCw className="w-3 h-3 animate-spin" />
                            ) : null}
                            <span>{article.draft ? "نشر المقال الآن" : "تحويل لمسودة"}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-400 font-serif">
                    لا توجد دراسات مطابقة لمعايير البحث والفلترة المختارة.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-4 bg-[#FAF7F0] border border-[#E5E2DC] rounded-xs text-neutral-600 text-xs font-serif leading-relaxed">
        <strong>ملاحظة تحريرية:</strong> يتم حفظ وتعديل المتون التحليلية ونصوص الدراسات مباشرة في ملفات MDX على المسار البرمجي المخصص. تغيير حالة النشر هنا يؤثر فورياً على حقل <code className="font-mono text-neutral-800 bg-white px-1 border border-neutral-200">draft</code> في ترويسة المقال، مما يضمن أمان النشر اليدوي المدروس.
      </div>
    </div>
  );
}
