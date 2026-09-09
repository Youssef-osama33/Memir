import React from "react";
import { type Metadata } from "next";
import Link from "next/link";
import Navigation from "../../components/navigation";
import Footer from "../../components/footer";
import { getPublishedArticles } from "../../lib/articles";
import { Calendar, Lock, ArrowLeft, BookOpen, Compass } from "lucide-react";
import { AuthorByline } from "../../components/AuthorByline";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "الكتب وقسم 'الفكرة في زمننا' | معمار",
  description: "مراجعات نقدية تحليلية لأهم الكتب التأسيسية التي تُعيد تفكيك التكنولوجيا والجيوبوليتكس ونماذج المعرفة، مقترنة بقسم دائم: 'الفكرة في زمننا'.",
};

export default async function BooksPage() {
  const allArticles = await getPublishedArticles();
  const bookReviews = allArticles.filter((a) => a.metadata.category === "books");

  return (
    <div className="min-h-screen bg-[#FCFBF9] text-[#111111] font-serif flex flex-col justify-between selection:bg-black selection:text-white" dir="rtl">
      <Navigation />
      <div className="py-16 md:py-24 flex-grow">
        <div className="max-w-4xl mx-auto px-6 text-right">
        {/* Books Master Header */}
        <div className="border-b-2 border-black pb-10 mb-12">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-sans text-[11px] font-bold text-amber-800 uppercase tracking-widest bg-amber-500/10 px-2.5 py-1 rounded-sm">
              تصنيف أفقي مستقل
            </span>
            <span className="font-sans text-xs text-neutral-400 font-mono" dir="ltr">
              / Books & Conceptual Roots
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-sans font-black text-black tracking-tight mb-4">
            الكتب: تأصيل الفكرة وتشريح الحاضر
          </h1>

          <p className="text-base md:text-lg text-neutral-700 font-serif leading-relaxed max-w-3xl">
            مسار نقدي مستقل يقرأ أمهات الكتب الفكرية والتاريخية والتقنية. لا نكتفي بملخصات عابرة، بل يتضمن كل تحليل شقين متكاملين: <strong>(أ) تفكيك أطروحة الكتاب وبنيته المفاهيمية</strong>، و <strong>(ب) قسم 'الفكرة في زمننا'</strong> لربط فرضيات المؤلف بأكثر الملفات التكنولوجية والجيوسياسية سخونة اليوم.
          </p>
        </div>

        {/* Book Reviews Feed */}
        <div className="space-y-12">
          {bookReviews.map((article) => (
            <article
              key={article.metadata.slug}
              className="bg-white border border-neutral-200 p-8 md:p-10 shadow-sm relative group hover:border-neutral-400 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-sans text-neutral-400 mb-4 pb-4 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-800" />
                  <span className="font-bold text-neutral-900">مراجعة كتاب فكري</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 ml-1 text-neutral-400" />
                    {new Date(article.metadata.publishedAt).toLocaleDateString("ar-EG", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  {article.metadata.isPremium ? (
                    <span className="text-amber-800 bg-amber-50 px-2 py-0.5 border border-amber-200 text-[10px] font-bold">
                      للمشتركين
                    </span>
                  ) : (
                    <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200 text-[10px] font-bold">
                      متاح مجاناً
                    </span>
                  )}
                </div>
              </div>

              <h2 className="text-2xl md:text-3xl font-serif font-bold text-neutral-900 leading-snug mb-3 group-hover:text-[#C86A00] transition-colors">
                <Link href={`/articles/${article.metadata.slug}`}>
                  {article.metadata.title}
                </Link>
              </h2>

              {article.metadata.bookAuthor && (
                <div className="text-xs font-sans text-neutral-600 mb-4 bg-neutral-50 p-3 border-r-2 border-[#C86A00] flex items-center justify-between">
                  <span>المؤلف الأصلي: <strong className="text-black">{article.metadata.bookAuthor}</strong></span>
                  {article.metadata.bookOriginalTitle && (
                    <span className="text-neutral-400 font-mono text-[11px]" dir="ltr">
                      {article.metadata.bookOriginalTitle}
                    </span>
                  )}
                </div>
              )}

              <p className="text-base text-neutral-700 leading-[1.8] font-serif mb-6">
                {article.metadata.excerpt}
              </p>

              {/* Distinction: The Idea in Our Time box */}
              {article.metadata.ideaInOurTimeTitle && (
                <div className="bg-[#FFFDF7] border-2 border-[#C86A00]/30 p-5 mb-6 rounded-sm">
                  <div className="flex items-center gap-2 text-xs font-sans font-bold text-[#8C4B00] mb-2">
                    <Compass className="w-4 h-4 text-[#C86A00]" />
                    <span>{article.metadata.ideaInOurTimeTitle}</span>
                  </div>
                  <p className="text-xs text-neutral-700 font-serif leading-relaxed">
                    هذا القسم داخل المقال يفكك أثر الفكرة المركزية في ظل خوارزميات الاستلاب واحتكار المعرفة والسيادة الرقمية المعاصرة.
                  </p>
                </div>
              )}

              <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-neutral-100">
                <AuthorByline
                  authorName={article.metadata.author}
                  size="sm"
                />
                <Link
                  href={`/articles/${article.metadata.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-sans font-bold text-white bg-black hover:bg-neutral-800 px-5 py-2.5 transition-colors"
                >
                  <span>قراءة المراجعة و'الفكرة في زمننا'</span>
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
}
