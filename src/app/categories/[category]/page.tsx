import React from "react";
import { notFound } from "next/navigation";
import { type Metadata } from "next";
import Link from "next/link";
import Navigation from "../../../components/navigation";
import Footer from "../../../components/footer";
import { getCategoryBySlug, CATEGORIES } from "../../../lib/categories";
import { getPublishedArticles } from "../../../lib/articles";
import { Calendar, Lock, ArrowLeft, BookOpen, Layers } from "lucide-react";
import { AuthorByline } from "../../../components/AuthorByline";
import CategoryIcon from "../../../components/CategoryIcon";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return CATEGORIES.map((cat) => ({
    category: cat.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) {
    return { title: "التصنيف غير موجود | معمار" };
  }
  return {
    title: `${cat.title} | معمار - تحليلات استراتيجية`,
    description: cat.description,
  };
}

export default async function CategoryListingPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const cat = getCategoryBySlug(category);

  if (!cat) {
    return notFound();
  }

  const allArticles = await getPublishedArticles();
  const categoryArticles = allArticles.filter((a) => a.metadata.category === cat.slug);

  return (
    <div className="min-h-screen bg-[#FCFBF9] text-[#111111] font-serif flex flex-col justify-between selection:bg-black selection:text-white" dir="rtl">
      <Navigation />
      <div className="py-16 md:py-24 flex-grow">
        <div className="max-w-4xl mx-auto px-6 text-right">
        {/* Category Header */}
        <div className={`border-b-2 pb-10 mb-12 ${cat.theme.border}`}>
          <div className="flex items-center gap-2 mb-3">
            <span className={`font-sans text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm border ${cat.theme.text} ${cat.theme.bg} ${cat.theme.border} flex items-center`}>
              <CategoryIcon name={cat.theme.iconName} className="w-3.5 h-3.5 ml-1.5" />
              {cat.isHorizontal ? "تصنيف أفقي مستقل" : "قسم تحليلي رئيسي"}
            </span>
            <span className="font-sans text-xs text-neutral-400 font-mono" dir="ltr">
              / {cat.titleEn}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-sans font-black text-black tracking-tight mb-4">
            {cat.title}
          </h1>

          <p className="text-base md:text-lg text-neutral-700 font-serif leading-relaxed max-w-3xl">
            {cat.description}
          </p>

          <div className="mt-6 flex items-center gap-4 text-xs font-sans text-neutral-500">
            <span>عدد التحليلات المنشورة: <strong className="text-black font-bold">{categoryArticles.length}</strong></span>
          </div>
        </div>

        {/* Articles List */}
        {categoryArticles.length === 0 ? (
          <div className="border border-dashed border-neutral-300 p-12 text-center rounded-sm bg-white">
            <Layers className="w-8 h-8 text-neutral-400 mx-auto mb-3" />
            <p className="text-neutral-500 font-sans text-sm">
              لم تُنشر أي تحليلات في هذا القسم بعد. التحليلات قيد الإعداد والمراجعة من قبل هيئة التحرير.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {categoryArticles.map((article) => {
              const isBook = cat.slug === "books" || article.metadata.category === "books";
              return (
                <article
                  key={article.metadata.slug}
                  className="group relative pb-10 border-b border-neutral-200/80 last:border-b-0"
                >
                  <div className="flex flex-wrap items-center gap-3 text-xs font-sans text-neutral-400 mb-3">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 ml-1 text-neutral-400" />
                      {new Date(article.metadata.publishedAt).toLocaleDateString("ar-EG", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <span className="text-neutral-300">•</span>
                    {article.metadata.isPremium ? (
                      <span className="inline-flex items-center gap-1 text-[#C86A00] bg-amber-50 px-2 py-0.5 border border-amber-200/60 text-[10px] font-bold rounded-sm">
                        <Lock className="w-3 h-3 ml-0.5 text-[#C86A00]" />
                        للمشتركين فقط
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200/60 text-[10px] font-bold rounded-sm">
                        متاح مجاناً
                      </span>
                    )}
                  </div>

                  <h2 className={`text-2xl md:text-3xl font-serif font-bold text-neutral-900 leading-snug mb-3 transition-colors ${cat.theme.groupHoverText}`}>
                    <Link href={`/articles/${article.metadata.slug}`}>
                      {article.metadata.title}
                    </Link>
                  </h2>

                  {isBook && article.metadata.bookAuthor && (
                    <div className="mb-3 font-sans text-xs text-neutral-600 bg-neutral-100/70 p-2.5 border-r-2 border-neutral-800">
                      <span>المؤلف الأصلي: <strong>{article.metadata.bookAuthor}</strong></span>
                      {article.metadata.bookOriginalTitle && (
                        <span className="mr-3 text-neutral-400 font-mono" dir="ltr">({article.metadata.bookOriginalTitle})</span>
                      )}
                    </div>
                  )}

                  <p className="text-base text-neutral-700 leading-[1.8] font-serif mb-5 max-w-3xl">
                    {article.metadata.excerpt}
                  </p>

                  {isBook && article.metadata.ideaInOurTimeTitle && (
                    <div className="bg-[#FFFBF2] border border-amber-200/80 p-4 mb-5 rounded-sm">
                      <div className="flex items-center gap-1.5 text-xs font-sans font-bold text-[#8C4B00] mb-1">
                        <BookOpen className="w-3.5 h-3.5 ml-1 text-[#C86A00]" />
                        <span>{article.metadata.ideaInOurTimeTitle}</span>
                      </div>
                      <p className="text-xs text-neutral-700 font-serif leading-relaxed">
                        قسم تحليلي تطبيقي يربط الفكرة المحورية للكتاب بتحولات الصراع التقني والجيوسياسي الراهن.
                      </p>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <AuthorByline
                      authorName={article.metadata.author}
                      size="sm"
                    />
                    <Link
                      href={`/articles/${article.metadata.slug}`}
                      className={`inline-flex items-center gap-1.5 text-sm font-sans font-bold text-neutral-900 transition-colors ${cat.theme.hoverText}`}
                    >
                      <span>قراءة التحليل كاملاً</span>
                      <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
      </div>
      <Footer />
    </div>
  );
}
