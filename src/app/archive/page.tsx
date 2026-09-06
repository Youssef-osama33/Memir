import React from "react";
import { getAllArticles } from "../../lib/mdx";
import { CATEGORIES, getCategoryBySlug } from "../../lib/categories";
import Navigation from "../../components/navigation";
import Footer from "../../components/footer";
import Link from "next/link";
import { Calendar, Lock, ArrowLeft, BookOpen, Layers } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ArchivePage() {
  const articles = getAllArticles();

  return (
    <div id="me-mar-archive-context" className="min-h-screen bg-[#FCFBF9] text-[#111111] font-serif selection:bg-black selection:text-white flex flex-col justify-between" dir="rtl">
      <Navigation />
      <div className="max-w-4xl mx-auto px-6 text-right py-16 flex-grow w-full">
        {/* Archive Title */}
        <div className="border-b border-neutral-300 pb-8 mb-12">
          <span className="font-sans text-xs font-bold text-neutral-400 uppercase tracking-widest block mb-1">
            الأرشيف المفهرس
          </span>
          <h1 className="text-3xl md:text-5xl font-sans font-bold text-black tracking-tight">
            أرشيف التحليلات الاستراتيجية
          </h1>
          <p className="text-sm md:text-base text-neutral-600 font-serif leading-relaxed mt-4 max-w-2xl">
            سجل توثيقي مصنف لكافة أوراق التقدير والمراجعات الاستراتيجية الصادرة عن مِعمار، موزعة عبر الأقسام الثمانية ومسار الكتب المستقل.
          </p>
        </div>

        {/* Categories Quick Jump */}
        <div className="mb-14 bg-white border border-neutral-200 p-6 rounded-sm">
          <h3 className="text-xs font-bold font-sans uppercase tracking-wider text-neutral-500 mb-4 flex items-center gap-1.5">
            <Layers className="w-4 h-4" />
            <span>الانتقال السريع للأقسام:</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-sans text-xs">
            <Link
              href="/books"
              className="p-2.5 bg-amber-50 border border-amber-200 hover:bg-amber-100/70 font-bold text-amber-900 rounded-sm text-center flex items-center justify-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>الكتب المستقلة</span>
            </Link>
            {CATEGORIES.filter((c) => !c.isHorizontal).map((c) => (
              <a
                key={c.slug}
                href={`#section-${c.slug}`}
                className="p-2.5 bg-neutral-50 border border-neutral-200 hover:bg-neutral-100 text-neutral-800 rounded-sm text-center font-medium"
              >
                {c.title}
              </a>
            ))}
          </div>
        </div>

        {/* Grouped by All 8 Categories */}
        <div className="space-y-16">
          {CATEGORIES.map((category) => {
            const catArticles = articles.filter((a) => a.metadata.category === category.slug);
            return (
              <section key={category.slug} id={`section-${category.slug}`} className="scroll-mt-24">
                <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-6">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl md:text-2xl font-sans font-bold text-black">
                      {category.title}
                    </h2>
                    <span className="text-xs bg-black text-[#FCFBF9] font-sans px-2.5 py-0.5 font-bold mr-2">
                      {catArticles.length}
                    </span>
                  </div>
                  <Link
                    href={category.isHorizontal ? "/books" : `/categories/${category.slug}`}
                    className="text-xs font-sans font-bold text-neutral-500 hover:text-black transition-colors"
                  >
                    صفحة القسم المستقلة ←
                  </Link>
                </div>

                {catArticles.length === 0 ? (
                  <p className="text-xs text-neutral-400 font-sans italic py-4">
                    [لا توجد تحليلات منشورة في هذا القسم حالياً]
                  </p>
                ) : (
                  <div className="space-y-6">
                    {catArticles.map((article) => (
                      <div
                        key={article.metadata.slug}
                        className="group relative pb-6 border-b border-neutral-200 last:border-b-0"
                      >
                        <div className="flex items-center gap-3 text-[10px] font-sans text-neutral-400 uppercase mb-1.5">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 ml-1" />
                            {new Date(article.metadata.publishedAt).toLocaleDateString("ar-EG")}
                          </span>
                          <span>•</span>
                          {article.metadata.isPremium ? (
                            <span className="flex items-center gap-1 text-amber-700 bg-amber-50 px-1 py-0.2 border border-amber-200">
                              <Lock className="w-3 h-3 ml-0.5" />
                              للمشتركين
                            </span>
                          ) : (
                            <span className="text-emerald-700 bg-emerald-50 px-1 py-0.2 border border-emerald-200">
                              متاح مجاناً
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg md:text-xl font-bold text-black mb-2 group-hover:text-amber-800">
                          <Link href={`/articles/${article.metadata.slug}`}>
                            {article.metadata.title}
                          </Link>
                        </h3>

                        {article.metadata.category === "books" && article.metadata.bookAuthor && (
                          <div className="text-xs text-neutral-500 font-sans mb-2">
                            المؤلف: <strong>{article.metadata.bookAuthor}</strong>
                          </div>
                        )}

                        <p className="text-xs md:text-sm text-neutral-600 leading-[1.8] max-w-3xl mb-3 font-serif">
                          {article.metadata.excerpt}
                        </p>

                        <Link
                          href={`/articles/${article.metadata.slug}`}
                          className="inline-flex items-center gap-1 text-xs font-sans font-semibold text-black hover:text-amber-800"
                        >
                          <span>قراءة المقال</span>
                          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
}
