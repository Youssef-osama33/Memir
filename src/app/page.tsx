import React from "react";
import { headers } from "next/headers";
import { getPublishedArticles } from "../lib/mdx";
import { CATEGORIES, getCategoryBySlug } from "../lib/categories";
import Navigation from "../components/navigation";
import Footer from "../components/footer";
import Link from "next/link";
import { ArrowLeft, BookOpen, Layers, Lock, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await headers();
  const articles = getPublishedArticles();

  // Split content
  const bookArticles = articles.filter((a) => a.metadata.category === "books");
  const analysisArticles = articles.filter((a) => a.metadata.category !== "books");

  const heroArticle = analysisArticles.length > 0 ? analysisArticles[0] : null;
  const latestArticles = analysisArticles.slice(1, 7);
  const mainCategories = CATEGORIES.filter((c) => !c.isHorizontal);

  return (
    <div className="min-h-screen bg-[#FCFBF9] text-neutral-900 antialiased flex flex-col justify-between selection:bg-black selection:text-white" dir="rtl">
      <Navigation />

      <main className="flex-grow">
        {/* Masthead */}
        <div className="pt-16 pb-12 text-center max-w-3xl mx-auto px-6">
          <span className="bg-neutral-100 text-neutral-600 border border-neutral-200 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-4 inline-block font-sans">
            منصة دراسات استراتيجية وفكرية
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black text-black leading-[1.3] mb-6 tracking-tight">
            بوصلتك في عصر التحولات الكبرى
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 font-serif leading-relaxed max-w-2xl mx-auto">
            نقدم تحليلات معمقة وتقاطعية تبحث في تأثير الذكاء الاصطناعي والجيوبوليتكس والتقنيات الصاعدة على السيادة وبنية المستقبل.
          </p>
        </div>

        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-6 mb-20">
          {!heroArticle ? (
            <div className="bg-white border border-neutral-200 p-12 text-center rounded-sm">
              <Layers className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-xl font-serif font-bold text-neutral-800 mb-2">الصدارة التحليلية قيد الإعداد</h3>
              <p className="text-neutral-500 font-sans text-sm">لم يتم نشر التحليل الرئيسي بعد.</p>
            </div>
          ) : (
            <Link href={`/articles/${heroArticle.metadata.slug}`} className="group block relative border border-neutral-200 bg-white hover:border-black transition-colors rounded-sm overflow-hidden flex flex-col md:flex-row">
              <div className="p-8 md:p-12 md:w-full">
                <div className="flex flex-wrap items-center gap-2.5 mb-4 font-sans text-xs">
                  {getCategoryBySlug(heroArticle.metadata.category) && (
                    <span className="font-bold tracking-wide text-neutral-700 bg-neutral-100 px-2.5 py-0.5 rounded-sm">
                      {getCategoryBySlug(heroArticle.metadata.category)?.title}
                    </span>
                  )}
                  <span className="text-neutral-300">•</span>
                  <span className="text-neutral-500">
                    {new Date(heroArticle.metadata.publishedAt).toLocaleDateString("ar-EG", {
                      year: "numeric", month: "long", day: "numeric",
                    })}
                  </span>
                  <span className="text-neutral-300">•</span>
                  {heroArticle.metadata.isPremium ? (
                    <span className="text-amber-800 bg-amber-50 px-2 py-0.5 border border-amber-200/50 text-[10px] font-bold rounded-sm flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      للمشتركين
                    </span>
                  ) : (
                    <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200/50 text-[10px] font-bold rounded-sm">
                      متاح مجاناً
                    </span>
                  )}
                </div>
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-black leading-[1.25] mb-5 group-hover:text-amber-800 transition-colors">
                  {heroArticle.metadata.title}
                </h2>
                <p className="text-lg text-neutral-600 leading-[1.8] font-serif mb-8 max-w-4xl">
                  {heroArticle.metadata.excerpt}
                </p>
                <div className="flex items-center justify-between border-t border-neutral-100 pt-6 mt-auto">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-neutral-400 font-sans uppercase tracking-widest mb-1">بقلم</span>
                    <span className="text-sm font-bold text-amber-900 font-sans">{heroArticle.metadata.author}</span>
                  </div>
                  <div className="text-sm font-sans font-bold text-black flex items-center gap-1 group-hover:text-amber-800 transition-colors">
                    <span>قراءة الملف كاملاً</span>
                    <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          )}
        </section>

        {/* Latest Analyses Grid */}
        <section className="max-w-6xl mx-auto px-6 mb-24">
          <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-8">
            <h2 className="text-2xl font-serif font-bold text-black">أحدث التحليلات الاستراتيجية</h2>
            <Link href="/archive" className="text-sm font-sans font-bold text-neutral-500 hover:text-black transition-colors flex items-center gap-1">
              <span>المزيد في الأرشيف</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          {latestArticles.length === 0 ? (
            <div className="text-center py-12 bg-neutral-50 border border-neutral-100 rounded-sm">
              <p className="text-neutral-500 font-sans text-sm">لا توجد تحليلات إضافية منشورة.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestArticles.map((article) => {
                const cat = getCategoryBySlug(article.metadata.category);
                return (
                  <Link key={article.metadata.slug} href={`/articles/${article.metadata.slug}`} className="group flex flex-col block border border-neutral-200 bg-white p-6 hover:border-black transition-colors rounded-sm h-full">
                    <div className="flex flex-wrap items-center gap-2 mb-3 font-sans text-[11px]">
                      {cat && (
                        <span className="font-bold tracking-wide text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-sm">
                          {cat.title}
                        </span>
                      )}
                      {article.metadata.isPremium && (
                        <span className="text-amber-800 bg-amber-50 px-1.5 py-0.5 border border-amber-200/50 font-bold rounded-sm flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" />
                          للمشتركين
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-serif font-bold text-black leading-snug mb-3 group-hover:text-amber-800 transition-colors">
                      {article.metadata.title}
                    </h3>
                    <p className="text-sm text-neutral-600 leading-[1.7] font-serif mb-6 line-clamp-3 flex-grow">
                      {article.metadata.excerpt}
                    </p>
                    <div className="border-t border-neutral-100 pt-4 flex items-center justify-between mt-auto font-sans">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-neutral-400">الكاتب</span>
                        <span className="text-xs font-bold text-amber-900">{article.metadata.author}</span>
                      </div>
                      <time className="text-xs text-neutral-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(article.metadata.publishedAt).toLocaleDateString("ar-EG")}
                      </time>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Books Section */}
        <section className="bg-[#FFFDF7] border-y border-amber-200/50 py-20 mb-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center justify-between border-b-2 border-amber-900 pb-3 mb-10">
              <div className="flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-amber-800" />
                <h2 className="text-2xl font-serif font-bold text-amber-900">مراجعات الكتب: الفكرة في زمننا</h2>
              </div>
              <Link href="/books" className="text-sm font-sans font-bold text-amber-800/70 hover:text-amber-900 transition-colors flex items-center gap-1">
                <span>تصفح المكتبة</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </div>

            {bookArticles.length === 0 ? (
              <div className="text-center py-12 border border-amber-100 bg-amber-50/30 rounded-sm">
                <p className="text-amber-900/60 font-sans text-sm">المكتبة قيد الإعداد.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {bookArticles.slice(0, 2).map((book) => (
                  <Link key={book.metadata.slug} href={`/articles/${book.metadata.slug}`} className="group block border border-amber-200/60 bg-white p-8 hover:border-amber-400 transition-colors rounded-sm relative">
                    <div className="absolute top-0 right-0 bg-amber-900 text-white text-[10px] font-sans font-bold px-3 py-1 rounded-bl-sm">
                      الفكرة في زمننا
                    </div>
                    <div className="mt-4 mb-2 text-xs font-sans text-neutral-500">
                      المؤلف الأصلي: <strong className="text-black">{book.metadata.bookAuthor}</strong>
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-black mb-3 group-hover:text-amber-800 transition-colors leading-snug">
                      {book.metadata.title}
                    </h3>
                    <p className="text-sm text-neutral-600 leading-[1.8] font-serif mb-6 line-clamp-3">
                      {book.metadata.excerpt}
                    </p>
                    <div className="border-t border-amber-100 pt-4 flex items-center justify-between font-sans">
                       <div className="flex flex-col">
                        <span className="text-[10px] text-neutral-400">التحليل بقلم</span>
                        <span className="text-xs font-bold text-amber-900">{book.metadata.author}</span>
                      </div>
                      <div className="text-xs font-bold text-amber-900 flex items-center gap-1">
                        <span>قراءة المراجعة</span>
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 7 Categories Directory */}
        <section className="max-w-6xl mx-auto px-6 mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-black mb-3">محاور التحليل السبعة</h2>
            <p className="text-neutral-500 font-sans text-sm">تصنيفات الأبحاث والتقديرات الاستراتيجية في معمار</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
            {mainCategories.map((cat) => (
              <Link key={cat.slug} href={`/categories/${cat.slug}`} className="block border border-neutral-200 bg-white p-5 hover:border-black hover:bg-neutral-50 transition-colors rounded-sm group">
                <h3 className="font-bold text-black mb-1 group-hover:text-amber-800 transition-colors">{cat.title}</h3>
                <div className="text-[10px] text-neutral-400 uppercase tracking-widest font-mono mb-3" dir="ltr">{cat.titleEn}</div>
                <p className="text-xs text-neutral-500 leading-relaxed font-serif line-clamp-3">{cat.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Subscribe / Membership Banner */}
        <section className="max-w-4xl mx-auto px-6 mb-24 text-center">
          <div className="bg-black text-white p-10 md:p-16 rounded-sm">
            <h2 className="text-3xl font-serif font-bold mb-4">اشترك في مِعمار بلس</h2>
            <p className="text-neutral-300 font-sans text-sm mb-8 max-w-lg mx-auto leading-relaxed">
              انضم للحصول على وصول كامل ومبكر إلى كافة التحليلات المعمقة وأوراق التقدير الاستراتيجية، بالإضافة إلى النسخة الصوتية من كافة الملفات.
            </p>
            <Link href="/subscribe" className="inline-flex items-center justify-center bg-white text-black px-8 py-3 rounded-sm font-sans font-bold hover:bg-neutral-200 transition-colors">
              الاشتراك الآن
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
