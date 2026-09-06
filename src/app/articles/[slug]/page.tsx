import { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticleBySlug, sliceContent, getAllArticles } from "../../../lib/mdx";
import { getCategoryBySlug } from "../../../lib/categories";
import { auth } from "../../../lib/auth";
import { getPppConfig } from "../../../lib/ppp";
import Paywall from "../../../components/paywall";
import { Calendar, Clock, Lock, Play, BookOpen, Compass, ArrowRight, ArrowLeft, Layers } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) {
    return {
      title: "المقال غير موجود | معمار",
    };
  }
  return {
    title: `${article.metadata.title} | معمار - تحليلات استراتيجية`,
    description: article.metadata.excerpt,
    openGraph: {
      title: article.metadata.title,
      description: article.metadata.excerpt,
      type: "article",
      publishedTime: article.metadata.publishedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: article.metadata.title,
      description: article.metadata.excerpt,
    },
  };
}

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    slug: article.metadata.slug,
  }));
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;

  const articles = getAllArticles();
  const articleIndex = articles.findIndex((a) => a.metadata.slug === slug);
  const article = articles[articleIndex];

  if (!article) {
    return notFound();
  }

  const prevArticle = articleIndex < articles.length - 1 ? articles[articleIndex + 1] : null;
  const nextArticle = articleIndex > 0 ? articles[articleIndex - 1] : null;

  const headersList = await headers();
  const countryCode = headersList.get("x-country-code") || "US";
  const pppConfig = getPppConfig(countryCode);

  const session = await auth();
  const isPremiumUser = session?.user?.isPremium === true;
  const shouldPaywall = article.metadata.isPremium && !isPremiumUser;

  const finalContent = shouldPaywall
    ? sliceContent(article.content, 20)
    : article.content;

  const wordCount = article.content.trim().split(/\s+/).length;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 225));
  const cat = getCategoryBySlug(article.metadata.category);
  const isBook = cat?.slug === "books" || article.metadata.category === "books";

  return (
    <article id={`article-node-${slug}`} className="min-h-screen bg-[#FCFBF9] text-black pb-24 font-serif antialiased selection:bg-black selection:text-white" dir="rtl">
      {/* Dossier Header */}
      <header className="border-b border-neutral-200 py-16 md:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-right">
          <div className="flex flex-wrap items-center gap-2.5 mb-6 font-sans text-xs text-neutral-500">
            {cat && (
              <Link
                href={cat.isHorizontal ? "/books" : `/categories/${cat.slug}`}
                className="bg-black text-white px-2.5 py-0.5 font-bold text-[10px] rounded-xs hover:bg-neutral-800 transition-colors"
              >
                {cat.title}
              </Link>
            )}
            <span className="text-neutral-300">•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 ml-1 text-neutral-400" />
              {new Date(article.metadata.publishedAt).toLocaleDateString("ar-EG", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="text-neutral-300">•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 ml-1 text-neutral-400" />
              وقت القراءة: {readingTimeMinutes} دقيقة
            </span>
            <span className="text-neutral-300">•</span>
            {article.metadata.isPremium ? (
              <span className="text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-bold rounded-xs">
                تحليل حصري للمشتركين
              </span>
            ) : (
              <span className="text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold rounded-xs">
                متاح مجاناً
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-serif font-black text-[#111111] leading-[1.35] mb-6">
            {article.metadata.title}
          </h1>

          {isBook && article.metadata.bookAuthor && (
            <div className="mb-6 font-sans text-sm text-neutral-700 bg-neutral-100/80 p-4 border-r-3 border-amber-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                الكتاب قيد المراجعة: <strong>{article.metadata.bookOriginalTitle || article.metadata.title}</strong>
              </div>
              <div className="text-xs text-neutral-600">
                المؤلف: <strong className="text-black">{article.metadata.bookAuthor}</strong>
              </div>
            </div>
          )}

          <p className="text-lg md:text-[20px] text-neutral-700 leading-[1.8] mb-8 font-serif italic max-w-3xl">
            {article.metadata.excerpt}
          </p>

          {/* Audio Intelligence Briefing Bar */}
          <div className="mt-8 max-w-2xl bg-neutral-50 border border-neutral-200 p-4 rounded-sm flex items-center justify-between gap-4 font-sans text-xs">
            <div className="flex items-center gap-3">
              <button aria-label="تشغيل التسجيل الصوتي" className="w-9 h-9 bg-black hover:bg-neutral-800 text-white rounded-full flex items-center justify-center transition-colors">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </button>
              <div>
                <span className="font-bold text-neutral-900 block">الإيجاز الصوتي المسجل</span>
                <span className="text-neutral-400 text-[10px]">متاح أيضاً عبر خلاصة RSS الخاصة بالمشتركين</span>
              </div>
            </div>
            <span className="font-mono text-neutral-500" dir="ltr">0:00 / {readingTimeMinutes}:00</span>
          </div>
        </div>
      </header>

      {/* Content Rendering */}
      <section className="max-w-3xl mx-auto px-6 mt-14 md:mt-18 text-right">
        <div className="space-y-6">
          {finalContent.split(/\n\s*\n/).map((paragraph, index) => {
            const trimmed = paragraph.trim();
            if (!trimmed) return null;

            // Detect Books "الفكرة في زمننا" section header
            if (trimmed.includes("الفكرة في زمننا") || trimmed.startsWith("### الفكرة في زمننا")) {
              return (
                <div key={index} className="my-10 p-6 bg-[#FFFDF5] border-2 border-amber-800/40 rounded-sm">
                  <div className="flex items-center gap-2 text-amber-900 font-sans font-bold text-sm mb-2">
                    <Compass className="w-4 h-4 text-amber-800" />
                    <span>الفكرة في زمننا (The Idea in Our Time)</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-serif font-bold text-neutral-900">
                    {trimmed.replace(/^#+\s*/, "")}
                  </h3>
                </div>
              );
            }

            if (trimmed.startsWith("### ")) {
              return (
                <h3 key={index} className="text-xl md:text-2xl font-serif font-bold text-black mt-10 mb-4 leading-snug">
                  {trimmed.replace("### ", "")}
                </h3>
              );
            }
            if (trimmed.startsWith("## ")) {
              return (
                <h2 key={index} className="text-2xl md:text-3xl font-serif font-bold text-black mt-12 mb-5 border-b border-neutral-200 pb-2 leading-snug">
                  {trimmed.replace("## ", "")}
                </h2>
              );
            }
            if (trimmed.startsWith("# ")) {
              return (
                <h1 key={index} className="text-3xl md:text-4xl font-serif font-black text-black mt-14 mb-6 leading-tight">
                  {trimmed.replace("# ", "")}
                </h1>
              );
            }
            if (trimmed.startsWith("> ")) {
              return (
                <blockquote key={index} className="bg-[#FFFBF2] border-r-3 border-amber-800 p-6 my-8 text-neutral-800 text-base leading-relaxed text-right font-serif">
                  {trimmed.replace("> ", "")}
                </blockquote>
              );
            }

            return (
              <p key={index} className="text-base md:text-[18px] leading-[1.9] text-neutral-800 font-serif">
                {trimmed}
              </p>
            );
          })}
        </div>

        {/* Dynamic Paywall */}
        {shouldPaywall && (
          <div className="mt-16">
            <Paywall countryCode={countryCode} pppConfig={pppConfig} />
          </div>
        )}
      </section>

      {/* Pagination & Category Footer Navigation */}
      <section className="max-w-3xl mx-auto px-6 mt-20 pt-10 border-t border-neutral-200 text-right font-sans">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm font-medium">
          {prevArticle ? (
            <Link href={`/articles/${prevArticle.metadata.slug}`} className="flex items-center gap-2 text-neutral-500 hover:text-black transition-colors group">
              <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>السابق: {prevArticle.metadata.title}</span>
            </Link>
          ) : (
            <div />
          )}

          {nextArticle ? (
            <Link href={`/articles/${nextArticle.metadata.slug}`} className="flex items-center gap-2 text-neutral-500 hover:text-black transition-colors group mr-auto">
              <span>التالي: {nextArticle.metadata.title}</span>
              <ArrowLeft className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </section>
    </article>
  );
}
