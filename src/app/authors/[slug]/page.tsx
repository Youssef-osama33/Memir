import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getAllAuthors, getAuthorBySlug, getAuthorInitials } from "../../../lib/authors";
import { getArticlesByAuthor } from "../../../lib/articles";
import { CATEGORIES } from "../../../lib/categories";
import Navigation from "../../../components/navigation";
import Footer from "../../../components/footer";
import {
  BookOpen,
  ArrowLeft,
  Clock,
  Calendar,
  Sparkles,
  Lock,
  ChevronLeft,
} from "lucide-react";

interface AuthorPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const authors = getAllAuthors();
  return authors.map((author) => ({
    slug: author.slug,
  }));
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);

  if (!author) {
    return {
      title: "الكاتب غير موجود | مِعمار",
    };
  }

  return {
    title: `${author.name} | مِعمار للدراسات الاستراتيجية`,
    description: author.bio || `الملف الفكري والتحليلات المنشورة للباحث ${author.name} في منصة مِعمار.`,
    openGraph: {
      title: `${author.name} | منصة مِعمار`,
      description: author.bio || `الملف الفكري والتحليلات المنشورة للباحث ${author.name}`,
    },
  };
}

export const dynamic = "force-dynamic";

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);

  if (!author) {
    notFound();
  }

  // Get strictly published, non-draft articles for this author
  const rawArticles = await getArticlesByAuthor(author.slug, false);

  // Sort newest first
  const articles = rawArticles.sort((a, b) => {
    return (
      new Date(b.metadata.publishedAt).getTime() -
      new Date(a.metadata.publishedAt).getTime()
    );
  });

  const photoUrl = author.avatarUrl || author.avatar;
  const initials = getAuthorInitials(author.name);

  // Grammar helper for Arabic article count
  const formatArticleCount = (count: number) => {
    if (count === 0) return "لا توجد تحليلات منشورة";
    if (count === 1) return "تحليل واحد منشور";
    if (count === 2) return "تحليلان منشوران";
    if (count >= 3 && count <= 10) return `${count} تحليلات منشورة`;
    return `${count} تحليلاً منشوراً`;
  };

  return (
    <div className="min-h-screen bg-[#FCFBF9] text-[#111111] flex flex-col font-sans selection:bg-black selection:text-white" dir="rtl">
      <Navigation />

      <main className="flex-1 py-12 md:py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-neutral-500">
            <Link href="/" className="hover:text-black transition-colors">
              الرئيسية
            </Link>
            <ChevronLeft className="w-3 h-3 text-neutral-400" />
            <span className="text-neutral-400">هيئة التحرير والباحثون</span>
            <ChevronLeft className="w-3 h-3 text-neutral-400" />
            <span className="text-black font-bold">{author.name}</span>
          </nav>

          {/* 1 to 4: Author Header Profile */}
          <div className="bg-white border border-neutral-200 p-6 sm:p-8 md:p-10 rounded-xs shadow-2xs relative overflow-hidden">
            {/* Architectural signature amber accent line */}
            <div className="absolute top-0 right-0 left-0 h-1 bg-[#C86A00]" />

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 text-center sm:text-right">
              {/* 1. Author's photo (avatarUrl) with initials fallback */}
              <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-[#C86A00] flex-shrink-0 shadow-sm bg-[#FAF7F0] flex items-center justify-center">
                {photoUrl ? (
                  <Image
                    src={photoUrl}
                    alt={author.name}
                    fill
                    sizes="128px"
                    className="object-cover"
                    priority
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-2xl md:text-3xl font-serif font-bold text-[#8C4B00] select-none">
                    {initials}
                  </span>
                )}
              </div>

              {/* Author Details */}
              <div className="space-y-3 flex-1 min-w-0">
                {author.title && (
                  <div className="inline-block bg-[#FAF7F0] border border-[#E8DCC8] text-[#8C4B00] text-[11px] font-mono px-2.5 py-0.5 font-bold rounded-xs">
                    {author.title}
                  </div>
                )}

                {/* 2. Author's name (Amiri serif, bold, large) */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-serif text-black leading-tight">
                  {author.name}
                </h1>

                {/* 3. Total article count directly below name */}
                <div className="flex items-center justify-center sm:justify-start gap-2 text-xs md:text-sm font-sans font-semibold text-[#8C4B00]">
                  <Sparkles className="w-3.5 h-3.5 text-[#C86A00]" />
                  <span>{formatArticleCount(articles.length)}</span>
                </div>

                {/* 4. Short bio text (IBM Plex Sans Arabic, muted color) */}
                {author.bio && (
                  <p className="text-sm md:text-base text-neutral-600 font-sans leading-relaxed pt-1 max-w-2xl">
                    {author.bio}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 5 & 6: Articles Section */}
          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-black">
              <h2 className="text-xl md:text-2xl font-black font-serif text-black">
                الدراسات والتقديرات المنشورة ({articles.length})
              </h2>
              <span className="text-xs font-mono text-[#C86A00] font-bold">
                الأحدث أولاً
              </span>
            </div>

            {/* 6. Dignified empty state if zero published articles */}
            {articles.length === 0 ? (
              <div className="text-center py-16 px-6 bg-white border border-neutral-200 rounded-xs shadow-2xs">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#FAF7F0] border border-[#E8DCC8] flex items-center justify-center text-[#C86A00]">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold font-serif text-black mb-2">
                  لا توجد تحليلات منشورة لهذا الكاتب بعد
                </h3>
                <p className="text-xs text-neutral-500 font-sans max-w-md mx-auto leading-relaxed">
                  الأوراق البحثية وتقديرات الموقف قيد المراجعة والتحرير، وستُنشر فور اكتمال دورة التدقيق المنهجي.
                </p>
              </div>
            ) : (
              /* 5. A grid/list of all published articles by this author */
              <div className="space-y-4">
                {articles.map((art) => {
                  const category = CATEGORIES.find(
                    (c) => c.slug === art.metadata.category
                  );
                  const isFiqh = art.metadata.category === "fiqh-al-waqi";
                  const isBook = art.metadata.category === "books";
                  const words = art.content
                    ? art.content.trim().split(/\s+/).length
                    : 600;
                  const readingMinutes = Math.max(2, Math.round(words / 200));
                  const readingTimeStr = `${readingMinutes} دقائق قراءة`;

                  return (
                    <article
                      key={art.metadata.slug}
                      className={`p-6 border transition-all duration-200 group rounded-xs ${
                        isFiqh
                          ? "bg-[#F7F5EE] border-neutral-300/80 hover:border-black shadow-2xs"
                          : isBook
                          ? "bg-[#FDFBF7] border-amber-200/80 hover:border-black"
                          : "bg-white border-neutral-200 hover:border-black shadow-2xs"
                      }`}
                    >
                      {/* Meta header: Category pill, Premium badge, Date & Reading time */}
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-3 font-mono text-xs">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Link
                            href={`/categories/${art.metadata.category}`}
                            className="text-[#C86A00] font-bold hover:underline"
                          >
                            {category?.title || art.metadata.category}
                          </Link>
                          {art.metadata.isPremium && (
                            <span className="inline-flex items-center gap-1 bg-[#FAF5EE] text-[#8C4B00] border border-[#E8DCC8] text-[10px] font-mono px-2 py-0.5 rounded-xs font-semibold">
                              <Lock className="w-2.5 h-2.5" />
                              <span>للمشتركين فقط</span>
                            </span>
                          )}
                        </div>
                        <div className="text-neutral-400 text-[11px] flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {new Date(art.metadata.publishedAt).toLocaleDateString(
                                "ar-EG",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{readingTimeStr}</span>
                          </span>
                        </div>
                      </div>

                      {/* Article Title */}
                      <Link
                        href={`/articles/${art.metadata.slug}`}
                        className="block group-hover:underline"
                      >
                        <h3 className="text-xl md:text-2xl font-bold font-serif text-black leading-snug mb-2 group-hover:text-[#C86A00] transition-colors">
                          {art.metadata.title}
                        </h3>
                      </Link>

                      {/* Excerpt */}
                      <p className="text-sm text-neutral-600 font-serif leading-relaxed line-clamp-2 mb-4">
                        {art.metadata.excerpt}
                      </p>

                      {/* Footer Link */}
                      <div className="flex items-center justify-between pt-3 border-t border-neutral-100 font-sans text-xs">
                        <Link
                          href={`/articles/${art.metadata.slug}`}
                          className="font-bold text-black group-hover:text-[#C86A00] transition-colors flex items-center gap-1.5"
                        >
                          <span>قراءة التقدير كاملاً</span>
                          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
