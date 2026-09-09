import ReadingProgress from "../../../components/article/ReadingProgress";
import TableOfContents from "../../../components/article/TableOfContents";
import { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticleBySlug, sliceContent, getAllArticles, getPublishedArticles } from "../../../lib/articles";
import { getCategoryBySlug } from "../../../lib/categories";
import { auth } from "../../../lib/auth";
import { getPppConfig } from "../../../lib/ppp";
import Paywall from "../../../components/paywall";
import { Calendar, Clock, Lock, Play, BookOpen, Compass, ArrowRight, ArrowLeft, Layers } from "lucide-react";
import { db as prisma } from "../../../lib/db";
import AudioPlayer from "../../../components/article/AudioPlayer";
import LikeButton from "../../../components/article/LikeButton";
import BookmarkButton from "../../../components/article/BookmarkButton";
import CommentsSection from "../../../components/article/CommentsSection";
import NewsletterForm from "../../../components/article/NewsletterForm";
import TextHighlighter from "../../../components/article/TextHighlighter";
import ArticleChat from "../../../components/article/ArticleChat";
import { AuthorByline } from "../../../components/AuthorByline";
import { getAuthorByName, getAuthorInitials } from "../../../lib/authors";
import Image from "next/image";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";

  const article = await getArticleBySlug(slug);
  if (!article || (article.metadata.draft && !isAdmin)) {
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
      url: `/articles/${article.metadata.slug}`,
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(article.metadata.title)}&category=${encodeURIComponent(article.metadata.category)}&author=${encodeURIComponent(article.metadata.author)}`,
          width: 1200,
          height: 630,
          alt: article.metadata.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.metadata.title,
      description: article.metadata.excerpt,
      images: [`/api/og?title=${encodeURIComponent(article.metadata.title)}&category=${encodeURIComponent(article.metadata.category)}&author=${encodeURIComponent(article.metadata.author)}`],
    },
  };
}

export async function generateStaticParams() {
  if (!(process.env.DATABASE_URL || process.env.SQL_HOST)) return [];
  try {
    const articles = await getPublishedArticles();
    return articles.map((article) => ({
      slug: article.metadata.slug,
    }));
  } catch (err) {
    return [];
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";

  const article = await getArticleBySlug(slug);

  // Return 404 for non-existent articles, or draft articles when viewer is not admin
  if (!article || (article.metadata.draft && !isAdmin)) {
    return notFound();
  }

  const articles = isAdmin ? await getAllArticles() : await getPublishedArticles();
  const articleIndex = articles.findIndex((a) => a.metadata.slug === slug);

  const prevArticle = articleIndex !== -1 && articleIndex < articles.length - 1 ? articles[articleIndex + 1] : null;
  const nextArticle = articleIndex !== -1 && articleIndex > 0 ? articles[articleIndex - 1] : null;

  const headersList = await headers();
  const countryCode = headersList.get("x-country-code") || "US";
  const pppConfig = getPppConfig(countryCode);

  const isPremiumUser = session?.user?.isPremium === true;
  const shouldPaywall = article.metadata.isPremium && !isPremiumUser;

  const finalContent = shouldPaywall
    ? sliceContent(article.content, 20)
    : article.content;

  const wordCount = article.content.trim().split(/\s+/).length;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
  const cat = getCategoryBySlug(article.metadata.category);
  const isBook = cat?.slug === "books" || article.metadata.category === "books";

  let likeCount = 0;
  let initialComments: any[] = [];
  let isInitiallyLiked = false;
  let isInitiallySaved = false;

  if ((process.env.DATABASE_URL || process.env.SQL_HOST)) {
    try {
      const [count, comments] = await Promise.all([
        prisma.articleLike.count({ where: { articleId: slug } }),
        prisma.comment.findMany({
          where: { articleId: slug },
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { name: true, image: true } }
          }
        })
      ]);
      likeCount = count;
      initialComments = comments;

      if (session?.user?.id) {
        const [userLike, userSaved] = await Promise.all([
          prisma.articleLike.findUnique({
            where: { articleId_userId: { articleId: slug, userId: session.user.id } }
          }),
          prisma.savedArticle.findUnique({
            where: { articleId_userId: { articleId: slug, userId: session.user.id } }
          })
        ]);
        isInitiallyLiked = !!userLike;
        isInitiallySaved = !!userSaved;
      }
    } catch (dbError) {
      console.warn("Database query skipped or failed:", dbError);
    }
  }

  // Format comments to match expected type
  const formattedComments = initialComments.map(c => ({
    ...c,
    createdAt: typeof c.createdAt === 'string' ? c.createdAt : (c.createdAt?.toISOString?.() || new Date().toISOString())
  }));

  const relatedArticles = articles
    .filter(a => a.metadata.category === article.metadata.category && a.metadata.slug !== slug)
    .slice(0, 3);

  return (
    <article id={`article-node-${slug}`} className="min-h-screen bg-[#FCFBF9] text-black pb-24 font-serif antialiased selection:bg-[#C86A00] selection:text-white" dir="rtl">
      <ReadingProgress />
      <TextHighlighter articleUrl={`${process.env.NEXT_PUBLIC_APP_URL || 'https://me-mar.com'}/articles/${slug}`} />
      <ArticleChat slug={slug} articleTitle={article.metadata.title} />
      
      {/* Dossier Header */}
      <header className="border-b border-neutral-200 py-16 md:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-right">
          <h1 className="text-3xl md:text-5xl font-serif font-black text-[#111111] leading-[1.35] mb-6">
            {article.metadata.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-neutral-100">
            <AuthorByline
              authorName={article.metadata.author}
              publishDate={new Date(article.metadata.publishedAt).toLocaleDateString("ar-EG", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              readingTime={`${readingTimeMinutes} دقيقة قراءة`}
              size="lg"
              showTitle={true}
            />
            <div className="flex items-center gap-3">
              <BookmarkButton articleId={slug} isInitiallySaved={isInitiallySaved} />
              {article.metadata.isPremium && (
                <span className="text-white bg-black px-3 py-1 text-xs font-bold font-sans uppercase tracking-wider">
                  دراسة خاصة للمشتركين
                </span>
              )}
            </div>
          </div>

          <AudioPlayer textTitle={article.metadata.title} textContent={finalContent} />

          {isBook && article.metadata.bookAuthor && (
            <div className="mt-8 mb-6 font-sans text-sm text-neutral-700 bg-neutral-100/80 p-4 border-r-3 border-amber-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                الكتاب قيد المراجعة: <strong>{article.metadata.bookOriginalTitle || article.metadata.title}</strong>
              </div>
              <div className="text-xs text-neutral-600">
                المؤلف: <strong className="text-black">{article.metadata.bookAuthor}</strong>
              </div>
            </div>
          )}

          <p className="text-lg md:text-[20px] text-neutral-700 leading-[1.8] mt-8 mb-2 font-serif italic max-w-3xl">
            {article.metadata.excerpt}
          </p>
        </div>
      </header>

      {/* Content Rendering */}
      <section className="max-w-5xl mx-auto px-6 mt-14 md:mt-18 text-right flex flex-col lg:flex-row gap-12 relative">
        <TableOfContents />
        <div 
          className="space-y-6 flex-grow max-w-3xl article-content prose prose-lg max-w-none prose-neutral font-serif text-neutral-800 leading-[1.9]"
          dangerouslySetInnerHTML={{ __html: finalContent }}
        />

        {/* Dynamic Paywall */}
        {shouldPaywall && (
          <div className="mt-16">
            <Paywall countryCode={countryCode} pppConfig={pppConfig} />
          </div>
        )}

        {/* Zone 3: Engagement Footer */}
        {!shouldPaywall && (
          <div className="mt-16 pt-8 border-t border-neutral-200">
            <div className="flex items-center gap-3 mb-12">
              <LikeButton articleId={slug} initialLikes={likeCount} isInitiallyLiked={isInitiallyLiked} />
              <BookmarkButton articleId={slug} isInitiallySaved={isInitiallySaved} />
            </div>

            <CommentsSection articleId={slug} initialComments={formattedComments} />

            {relatedArticles.length > 0 && (
              <div className="mt-16 pt-12 border-t border-neutral-200">
                <h3 className="text-2xl font-serif font-bold text-neutral-900 mb-8">أطروحات ذات صلة</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedArticles.map((rel) => (
                    <Link key={rel.metadata.slug} href={`/articles/${rel.metadata.slug}`} className="block group">
                      <div className="border border-neutral-200 rounded-lg p-5 hover:border-amber-800 transition-colors h-full flex flex-col bg-white">
                        <span className="text-amber-800 text-xs font-sans font-bold mb-3 block">
                          {getCategoryBySlug(rel.metadata.category)?.title || rel.metadata.category}
                        </span>
                        <h4 className="text-lg font-serif font-bold text-neutral-900 mb-3 group-hover:text-amber-800 transition-colors leading-snug">
                          {rel.metadata.title}
                        </h4>
                        <p className="text-neutral-600 text-sm font-serif line-clamp-2 mt-auto">
                          {rel.metadata.excerpt}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Author Dossier Box */}
            {(() => {
              const authorData = getAuthorByName(article.metadata.author);
              const avatarImg = authorData.avatarUrl || authorData.avatar;
              const initials = getAuthorInitials(authorData.name);
              return (
                <div className="border border-neutral-200 bg-white p-6 sm:p-8 rounded-xs relative shadow-2xs">
                  <div className="absolute top-0 right-0 left-0 h-1 bg-[#C86A00]" />
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-right">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#C86A00] flex-shrink-0 shadow-sm bg-[#FAF7F0] flex items-center justify-center">
                      {avatarImg ? (
                        <Image
                          src={avatarImg}
                          alt={authorData.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className="text-xl font-serif font-bold text-[#8C4B00] select-none">
                          {initials}
                        </span>
                      )}
                    </div>
                    <div className="space-y-2 flex-grow min-w-0">
                      {authorData.title && (
                        <div className="text-[11px] font-mono text-[#C86A00] font-bold">
                          {authorData.title}
                        </div>
                      )}
                      <h4 className="text-xl font-bold font-serif text-black">
                        {authorData.name}
                      </h4>
                      {authorData.bio && (
                        <p className="text-xs sm:text-sm text-neutral-600 font-serif leading-relaxed">
                          {authorData.bio}
                        </p>
                      )}
                      <div className="pt-2">
                        <Link
                          href={`/authors/${authorData.slug}`}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-black hover:text-[#C86A00] transition-colors"
                        >
                          <span>عرض كافة دراسات الكاتب في مِعمار</span>
                          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            <NewsletterForm />
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
