import Link from "next/link";
import { ArrowLeft, BookOpen, Calendar, Lock, Clock, Sparkles, Compass, ShieldCheck } from "lucide-react";
import Navigation from "../components/navigation";
import Footer from "../components/footer";
import { getPublishedArticles, ParsedArticle } from "../lib/articles";
import { CATEGORIES, getCategoryBySlug } from "../lib/categories";
import { AuthorByline } from "../components/AuthorByline";
import BookmarkButton from "../components/article/BookmarkButton";
import CategoryBadge from "../components/article/CategoryBadge";

// Calculate estimated reading time in Arabic
function getReadingTimeMinutes(content: string): number {
  if (!content) return 5;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.max(3, Math.ceil(wordCount / 180));
}

export const dynamic = "force-dynamic";

export default async function Home() {
  // Purely dynamic article fetching - draft: true is strictly excluded
  const articles = await getPublishedArticles();

  // Distinct categorization
  const bookArticles = articles.filter((a) => a.metadata.category === "books");
  const analysisArticles = articles.filter((a) => a.metadata.category !== "books");

  // Editorial Hero: The lead featured analysis
  const heroArticle = analysisArticles.length > 0 ? analysisArticles[0] : null;

  // Companion spotlight articles beside the hero on desktop
  const companionArticles = analysisArticles.slice(1, 4);

  // Latest analyses grid (scannable matrix)
  const latestAnalyses = analysisArticles.slice(1, 7);

  // Latest book reviews (the horizontal books category)
  const latestBooks = bookArticles.slice(0, 3);

  // Curated deep-dive analyses: dynamically pulled from published long-form / premium analyses
  const deepDives = analysisArticles
    .filter((a) => a.metadata.isPremium || a.content.length > 2500)
    .slice(0, 4);

  // 7 Main analytical sectors
  const mainCategories = CATEGORIES.filter((c) => !c.isHorizontal);

  return (
    <div className="min-h-screen bg-[#FCFBF9] text-black font-sans selection:bg-amber-200 selection:text-black" dir="rtl">
      <Navigation />

      <main className="pt-6 md:pt-10 pb-20">
        
        {/* =========================================================================
            SECTION 1: HERO & SPOTLIGHT LEAD (المقال الافتتاحي ومختارات التقدير)
            Asymmetric 12-column magazine layout: 8 cols lead card + 4 cols companion stack
            ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-amber-600 rounded-full animate-pulse" aria-hidden="true" />
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-black tracking-tight">
                المقال الافتتاحي ومختارات التقدير
              </h2>
            </div>
            <Link
              href="/archive"
              className="text-xs sm:text-sm font-sans font-bold text-neutral-600 hover:text-black transition-colors flex items-center gap-1 group py-1"
            >
              <span>أرشيف التقديرات</span>
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {heroArticle ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* PRIMARY HERO CARD (8 Columns on desktop) */}
              {(() => {
                const cat = getCategoryBySlug(heroArticle.metadata.category);
                const readTime = getReadingTimeMinutes(heroArticle.content);
                return (
                  <article className="lg:col-span-8 bg-white border border-neutral-200 hover:border-black transition-all duration-200 rounded-xs p-6 sm:p-8 md:p-10 shadow-2xs hover:shadow-xs flex flex-col justify-between relative group">
                    <div>
                      {/* Category & Premium Tag Header */}
                      <div className="flex flex-wrap items-center gap-2 mb-4 font-sans text-xs">
                        {cat && (
                          <CategoryBadge categorySlug={cat.slug} />
                        )}
                        {heroArticle.metadata.isPremium && (
                          <span className="text-amber-800 bg-amber-50 px-2.5 py-1 border border-amber-200/70 font-bold rounded-xs flex items-center gap-1 shadow-2xs">
                            <Lock className="w-3 h-3 text-amber-700" />
                            للمشتركين فقط
                          </span>
                        )}
                        <span className="text-neutral-400 text-xs mr-auto flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-neutral-400" />
                          {readTime} دقائق قراءة
                        </span>
                      </div>

                      {/* Lead Title */}
                      <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-serif font-black text-[#111111] leading-[1.3] mb-4 group-hover:text-[#C86A00] transition-colors">
                        <Link href={`/articles/${heroArticle.metadata.slug}`} className="focus:outline-none">
                          {heroArticle.metadata.title}
                        </Link>
                      </h3>

                      {/* Excerpt */}
                      <p className="text-base sm:text-lg text-neutral-700 leading-[1.8] font-serif mb-6 line-clamp-3">
                        {heroArticle.metadata.excerpt}
                      </p>
                    </div>

                    {/* Meta Bar */}
                    <div className="border-t border-neutral-100 pt-5 mt-4 flex flex-wrap items-center justify-between gap-4 font-sans text-xs">
                      <AuthorByline
                        authorName={heroArticle.metadata.author}
                        publishDate={new Date(heroArticle.metadata.publishedAt).toLocaleDateString("ar-EG", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                        size="md"
                        showTitle={true}
                      />
                      <div className="text-neutral-400 font-mono text-xs hidden sm:flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C86A00]" />
                        <span>ورقة تقدير موقف</span>
                      </div>
                    </div>
                  </article>
                );
              })()}

              {/* COMPANION EDITORIAL FEED (4 Columns on desktop) */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                <div className="bg-[#FAF8F3] border border-neutral-200/80 p-4 rounded-xs">
                  <div className="text-[11px] font-sans font-bold uppercase tracking-wider text-neutral-500 pb-2 mb-3 border-b border-neutral-200/80 flex items-center justify-between">
                    <span>قراءات مرتبطة بالحدث</span>
                    <span className="font-mono text-[10px] text-[#C86A00] font-bold">SPOTLIGHT</span>
                  </div>

                  {companionArticles.length > 0 ? (
                    <div className="space-y-4">
                      {companionArticles.map((article, idx) => {
                        const cat = getCategoryBySlug(article.metadata.category);
                        const isLast = idx === companionArticles.length - 1;
                        return (
                          <article
                            key={article.metadata.slug}
                            className={`group ${!isLast ? "pb-4 border-b border-neutral-200/60" : ""}`}
                          >
                            <div className="flex items-center gap-2 mb-1.5 font-sans text-[11px]">
                              {cat && (
                                <CategoryBadge categorySlug={cat.slug} />
                              )}
                              {article.metadata.isPremium && (
                                <span className="text-[#C86A00] bg-amber-50 px-1.5 py-0.2 border border-amber-200/60 text-[9px] font-bold rounded-2xs flex items-center gap-0.5">
                                  <Lock className="w-2.5 h-2.5 text-[#C86A00]" />
                                  للمشتركين
                                </span>
                              )}
                            </div>
                            <h4 className="text-base sm:text-lg font-serif font-bold text-neutral-900 group-hover:text-[#C86A00] transition-colors leading-snug mb-2">
                              <Link href={`/articles/${article.metadata.slug}`} className="focus:outline-none">
                                {article.metadata.title}
                              </Link>
                            </h4>
                            <div className="pt-1">
                              <AuthorByline
                                authorName={article.metadata.author}
                                publishDate={new Date(article.metadata.publishedAt).toLocaleDateString("ar-EG")}
                                size="sm"
                              />
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-500 py-4 text-center font-sans">
                      لا توجد تحليلات إضافية في هذا القسم حالياً.
                    </p>
                  )}
                </div>

                {/* Membership Micro-Teaser */}
                <div className="border border-neutral-900 bg-black text-[#FCFBF9] p-5 rounded-xs">
                  <div className="flex items-center gap-2 text-[#D97706] text-xs font-bold font-sans mb-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>خدمة مِعمار بلس الاستراتيجية</span>
                  </div>
                  <p className="text-xs text-neutral-300 font-serif leading-relaxed mb-3">
                    وصول دوري لكافة أوراق التقدير المحجوبة، والنسخة الصوتية، وموجز الرصد الأسبوعي عبر خلاصة RSS شخصية.
                  </p>
                  <Link
                    href="/subscribe"
                    className="inline-block bg-white text-black font-sans font-bold text-xs px-3.5 py-1.5 rounded-xs hover:bg-amber-100 transition-colors"
                  >
                    الانضمام للمشتركين ←
                  </Link>
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-16 bg-white border border-neutral-200 rounded-xs">
              <p className="text-neutral-500 font-sans text-sm">لا توجد تحليلات منشورة بعد.</p>
            </div>
          )}
        </section>

        {/* =========================================================================
            SECTION 2: LATEST ANALYSES GRID (أحدث التحليلات الاستراتيجية)
            Dense 3-column scannable grid with mixed metadata
            ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-black tracking-tight">
                أحدث التحليلات الاستراتيجية
              </h2>
              <p className="text-xs text-neutral-500 font-sans mt-0.5">
                أوراق تقدير موقف ورصد للتحولات الجيوتكنولوجية والسيادية
              </p>
            </div>
            <Link
              href="/archive"
              className="text-xs sm:text-sm font-sans font-bold text-neutral-600 hover:text-black transition-colors flex items-center gap-1 group py-1"
            >
              <span>المزيد في الأرشيف</span>
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {latestAnalyses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestAnalyses.map((article, index) => {
                const cat = getCategoryBySlug(article.metadata.category);
                const readTime = getReadingTimeMinutes(article.content);
                const isFiqh = article.metadata.category === "fiqh-al-waqi";
                const isFeaturedLead = index === 0;

                return (
                  <article
                    key={article.metadata.slug}
                    className={`group flex flex-col justify-between transition-all duration-150 rounded-xs shadow-2xs hover:shadow-xs p-6 ${
                      isFeaturedLead ? "sm:col-span-2 lg:col-span-2 border-2" : "border"
                    } ${
                      isFiqh
                        ? "bg-[#F7F5EE] border-amber-300 hover:border-amber-600"
                        : "bg-white border-neutral-200 hover:border-black"
                    }`}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex flex-wrap items-center gap-2 mb-3.5 font-sans text-xs">
                        {isFiqh ? (
                          <span className="font-serif font-bold text-[#8C4B00] bg-amber-100/70 border border-amber-300/60 px-2.5 py-0.5 rounded-2xs text-[11px] flex items-center gap-1">
                            <Compass className="w-3 h-3 text-[#C86A00]" />
                            <span>فِـقْـهُ الـوَاقِـع</span>
                          </span>
                        ) : (
                          cat && (
                            <CategoryBadge categorySlug={cat.slug} />
                          )
                        )}

                        {isFeaturedLead && (
                          <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                            تحليل استراتيجي موسع
                          </span>
                        )}

                        {article.metadata.isPremium && (
                          <span className="text-[#C86A00] bg-amber-50 px-2 py-0.5 border border-amber-200/70 font-bold rounded-xs flex items-center gap-1 text-[11px]">
                            <Lock className="w-2.5 h-2.5 text-[#C86A00]" />
                            للمشتركين فقط
                          </span>
                        )}
                        <span className="text-neutral-400 text-[10px] mr-auto font-mono flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" />
                          {readTime} د
                        </span>
                      </div>

                      {/* Title */}
                      <h3
                        className={`font-serif font-bold text-[#111111] leading-snug mb-3 group-hover:text-[#C86A00] transition-colors ${
                          isFeaturedLead ? "text-xl sm:text-2xl" : "text-lg sm:text-xl line-clamp-2"
                        }`}
                      >
                        <Link href={`/articles/${article.metadata.slug}`} className="focus:outline-none">
                          {article.metadata.title}
                        </Link>
                      </h3>

                      {/* Excerpt */}
                      <p
                        className={`text-neutral-600 leading-[1.75] font-serif mb-6 ${
                          isFeaturedLead ? "text-sm sm:text-base line-clamp-3" : "text-xs sm:text-sm line-clamp-3"
                        }`}
                      >
                        {article.metadata.excerpt}
                      </p>
                    </div>

                    {/* Card Footer with AuthorByline & Bookmark */}
                    <div className="border-t border-neutral-100 pt-3.5 mt-auto flex items-center justify-between">
                      <AuthorByline
                        authorName={article.metadata.author}
                        publishDate={new Date(article.metadata.publishedAt).toLocaleDateString("ar-EG")}
                        size={isFeaturedLead ? "md" : "sm"}
                      />
                      <BookmarkButton articleId={article.metadata.slug} showLabel={false} />
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white border border-neutral-200 rounded-xs">
              <p className="text-neutral-500 font-sans text-sm">لا توجد تحليلات إضافية منشورة بعد.</p>
            </div>
          )}
        </section>

        {/* =========================================================================
            SECTION 3: BOOKS REVIEWS (قراءات أمهات الكتب: الفكرة في زمننا)
            Distinct tinted editorial treatment (#F9F7F1) for the horizontal books category
            ========================================================================= */}
        <section className="bg-[#F8F5EC] border-y border-amber-200/80 py-16 mb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between border-b-2 border-amber-900 pb-3 mb-8">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-6 h-6 text-amber-800 shrink-0" />
                <div>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-amber-950 tracking-tight">
                    قراءات أمهات الكتب (الفكرة في زمننا)
                  </h2>
                  <p className="text-xs text-amber-900/70 font-sans mt-0.5">
                    تفكيك نقدي لأمهات المراجع الاستراتيجية والفكرية وربط أطروحاتها بتحولات الحاضر
                  </p>
                </div>
              </div>
              <Link
                href="/books"
                className="text-xs sm:text-sm font-sans font-bold text-amber-900 hover:text-black transition-colors flex items-center gap-1 group py-1"
              >
                <span>المزيد من الكتب</span>
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {latestBooks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {latestBooks.map((book) => {
                  const readTime = getReadingTimeMinutes(book.content);
                  return (
                    <article
                      key={book.metadata.slug}
                      className="group flex flex-col justify-between border border-amber-200/90 bg-white p-6 hover:border-amber-500 transition-all duration-150 rounded-xs shadow-2xs hover:shadow-xs relative"
                    >
                      <div>
                        {/* Book Badge & Status */}
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5 font-sans">
                          <span className="bg-[#111111] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-2xs tracking-wider">
                            مراجعة وتحليل كتاب
                          </span>
                          {book.metadata.isPremium && (
                            <span className="text-[#C86A00] bg-amber-50 px-2 py-0.5 border border-amber-200/70 text-[10px] font-bold rounded-xs flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5 text-[#C86A00]" />
                              للمشتركين فقط
                            </span>
                          )}
                        </div>

                        {/* Original Author attribution */}
                        {book.metadata.bookAuthor && (
                          <div className="text-[11px] font-sans text-neutral-500 mb-1.5">
                            المؤلف الأصلي: <strong className="text-neutral-900">{book.metadata.bookAuthor}</strong>
                          </div>
                        )}

                        {/* Title */}
                        <h3 className="text-lg sm:text-xl font-serif font-bold text-neutral-900 leading-snug mb-2.5 group-hover:text-[#C86A00] transition-colors">
                          <Link href={`/articles/${book.metadata.slug}`} className="focus:outline-none">
                            {book.metadata.title}
                          </Link>
                        </h3>

                        {/* Excerpt */}
                        <p className="text-xs sm:text-sm text-neutral-600 leading-[1.75] font-serif mb-6 line-clamp-3">
                          {book.metadata.excerpt}
                        </p>
                      </div>

                      {/* Card Footer with AuthorByline */}
                      <div className="border-t border-amber-200/60 pt-3.5 mt-auto flex items-center justify-between">
                        <AuthorByline
                          authorName={book.metadata.author}
                          publishDate={new Date(book.metadata.publishedAt).toLocaleDateString("ar-EG")}
                          size="sm"
                        />
                        <span className="text-neutral-500 font-mono text-[11px]">{readTime} د</span>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 border border-amber-200/60 bg-amber-50/40 rounded-xs">
                <p className="text-amber-900/70 font-sans text-sm">
                  لا توجد مراجعات كتب منشورة حالياً. يرجى مراجعة الأرشيف لاحقاً.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* =========================================================================
            SECTION 4: CURATED DEEP-DIVE ANALYSES (مختارات التحليل الأعمق)
            Pulls dynamically from await getPublishedArticles() for long-form analyses
            ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-8">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#C86A00]" />
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-black tracking-tight">
                  مختارات التحليل الأعمق
                </h2>
                <p className="text-xs text-neutral-500 font-sans mt-0.5">
                  ملفات استراتيجية تفكك البنى التحتية والتوازنات الكبرى بعمق تحليلي استثنائي
                </p>
              </div>
            </div>
            <Link
              href="/archive"
              className="text-xs sm:text-sm font-sans font-bold text-neutral-600 hover:text-black transition-colors flex items-center gap-1 group py-1"
            >
              <span>كامل الأرشيف</span>
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {deepDives.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {deepDives.map((item, index) => {
                const cat = getCategoryBySlug(item.metadata.category);
                const orderNumber = String(index + 1).padStart(2, "0");
                return (
                  <article
                    key={item.metadata.slug}
                    className="border border-neutral-200 bg-white p-5 hover:border-black transition-all rounded-xs flex flex-col justify-between group shadow-2xs hover:shadow-xs"
                  >
                    <div>
                      {/* Numeric Order Marker & Category */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-serif font-black text-amber-800/40 group-hover:text-[#C86A00] transition-colors">
                          {orderNumber}
                        </span>
                        {cat && (
                          <CategoryBadge categorySlug={cat.slug} />
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-serif font-bold text-neutral-900 leading-snug mb-2.5 group-hover:text-[#C86A00] transition-colors line-clamp-2">
                        <Link href={`/articles/${item.metadata.slug}`} className="focus:outline-none">
                          {item.metadata.title}
                        </Link>
                      </h3>

                      {/* Excerpt */}
                      <p className="text-xs text-neutral-600 font-serif leading-relaxed line-clamp-2 mb-4">
                        {item.metadata.excerpt}
                      </p>
                    </div>

                    <div className="border-t border-neutral-100 pt-3 flex items-center justify-between font-sans text-[11px] mt-auto">
                      <AuthorByline
                        authorName={item.metadata.author}
                        size="sm"
                      />
                      {item.metadata.isPremium && (
                        <span className="text-[#C86A00] font-bold text-[10px] flex items-center gap-0.5">
                          <Lock className="w-2.5 h-2.5" />
                          للمشتركين
                        </span>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white border border-neutral-200 rounded-xs">
              <p className="text-neutral-500 font-sans text-sm">
                لا توجد ملفات متعمقة منشورة في هذا القسم حالياً.
              </p>
            </div>
          )}
        </section>

        {/* =========================================================================
            SECTION 5: 7 ANALYTICAL SECTORS DIRECTORY (محاور مِعمار الاستراتيجية)
            Scannable category directory with dynamic article counters
            ========================================================================= */}
        <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 scroll-mt-24">
          <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-8">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-neutral-900" />
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-black tracking-tight">
                  محاور مِعمار الاستراتيجية
                </h2>
                <p className="text-xs text-neutral-500 font-sans mt-0.5">
                  التصنيفات السبعة التخصصية للأبحاث والتقديرات الاستراتيجية
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-neutral-400">7 ANALYTICAL SECTORS</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
            {mainCategories.map((cat) => {
              const count = articles.filter((a) => a.metadata.category === cat.slug).length;
              return (
                <Link
                  key={cat.slug}
                  href={`/categories/${cat.slug}`}
                  className="block border border-neutral-200 bg-white p-5 hover:border-black hover:bg-[#FDFBF7] transition-all rounded-xs group shadow-2xs"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="font-serif font-bold text-base text-black group-hover:text-amber-800 transition-colors">
                      {cat.title}
                    </h3>
                    <span className="text-[10px] font-mono text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded-2xs">
                      {count} {count === 1 ? "تحليل" : "تحليلات"}
                    </span>
                  </div>
                  <div className="text-[9px] text-neutral-400 uppercase tracking-widest font-mono mb-2" dir="ltr">
                    {cat.titleEn}
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed font-serif line-clamp-2">
                    {cat.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* =========================================================================
            SECTION 6: EDITORIAL MEMBERSHIP BANNER (مِعمار بلس)
            Restrained, high-contrast black & amber presentation
            ========================================================================= */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 mb-8 text-center">
          <div className="bg-[#111111] text-[#FCFBF9] p-8 sm:p-12 md:p-14 border border-neutral-800 rounded-xs shadow-md relative overflow-hidden">
            <div className="inline-block bg-amber-500/15 border border-amber-600/30 text-amber-400 text-[10px] font-sans font-bold px-3 py-1 rounded-2xs mb-4 uppercase tracking-widest">
              عضوية التحليل الاستراتيجي
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold mb-4 text-white leading-snug">
              انضم إلى نخبة قراء مِعمار بلس
            </h2>
            <p className="text-neutral-300 font-sans text-xs sm:text-sm mb-8 max-w-xl mx-auto leading-relaxed">
              وصول كامل وغير مقيد لكافة التحليلات المعمقة وأوراق التقدير المحجوبة، بالإضافة إلى النسخة الصوتية من كافة الملفات وخلاصة البودكاست المشفرة عبر RSS.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 font-sans text-xs font-bold">
              <Link
                href="/subscribe"
                className="bg-white text-black px-6 py-3 rounded-xs hover:bg-neutral-200 transition-colors shadow-2xs"
              >
                الاشتراك والعضوية
              </Link>
              <Link
                href="/about"
                className="text-neutral-300 hover:text-white border border-neutral-700 px-5 py-3 rounded-xs transition-colors"
              >
                عن المنصة ومنهجية النشر
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
