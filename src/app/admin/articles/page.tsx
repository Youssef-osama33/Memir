export const dynamic = "force-dynamic";

import React from "react";
import { getAllArticles } from "../../../lib/articles";
import { CATEGORIES } from "../../../lib/categories";
import ArticlesTable, { AdminArticleItem } from "../../../components/admin/ArticlesTable";

export default async function AdminArticlesPage() {
  const mdxArticles = await getAllArticles(true);

  // Map to table items with localized category title
  const articles: AdminArticleItem[] = mdxArticles.map((art) => {
    const categoryDef = CATEGORIES.find((c) => c.slug === art.metadata.category);
    return {
      slug: art.metadata.slug,
      title: art.metadata.title,
      author: art.metadata.author,
      category: art.metadata.category,
      categoryTitle: categoryDef?.title || art.metadata.category,
      isPremium: art.metadata.isPremium,
      draft: Boolean(art.metadata.draft),
      publishedAt: art.metadata.publishedAt,
    };
  });

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="border-b border-[#E5E2DC] pb-4">
        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-sans block">
          إدارة المحتوى والتحرير
        </span>
        <h1 className="text-2xl font-bold font-sans text-neutral-900 mt-0.5">
          إدارة المقالات والدراسات المنشورة
        </h1>
        <p className="text-xs text-neutral-500 font-sans mt-1">
          مراقبة حالة نشر الدراسات، والتبديل المباشر بين حالة المسودة والنشر الفوري.
        </p>
      </div>

      {/* Interactive Table */}
      <ArticlesTable initialArticles={articles} />
    </div>
  );
}
