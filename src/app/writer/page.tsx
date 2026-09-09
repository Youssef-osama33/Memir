import { Metadata } from "next";
import { db } from "../../lib/db";
import { auth } from "../../lib/auth";
import { redirect } from "next/navigation";
import { CATEGORIES } from "../../lib/categories";
import { FileText, Edit3, Eye, Heart, ExternalLink, ShieldAlert } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "لوحة الكاتب | مِعمار",
  description: "الفضاء التحريري الخاص بكتّاب منصة مِعمار.",
};

export default async function WriterDashboard() {
  const session = await auth();

  if (!session || !session.user || !["WRITER", "ADMIN"].includes(session.user.role)) {
    redirect("/");
  }

  let profile: any = null;
  if ((process.env.DATABASE_URL || process.env.SQL_HOST)) {
    try {
      profile = await db.writerProfile.findUnique({
        where: { userId: session.user.id },
      });
    } catch (err) {
      console.warn("DB Fallback writerProfile:", err);
    }
  }

  // Fetch writer's articles.
  // Note: the `authorSlug` on the Article model connects it to the Author model.
  // If the writer has an authorSlug set in their WriterProfile, we fetch articles matching that.
  // Otherwise, we can try to fetch by their user ID or email (depending on how the platform was tracking it).
  // The prompt said: "Match by authorSlug and name to guarantee fetching all".
  
  let articles: any[] = [];
  let totalLikes = 0;
  const likesCountMap: Record<string, number> = {};

  if ((process.env.DATABASE_URL || process.env.SQL_HOST)) {
    try {
      articles = await db.article.findMany({
        where: profile?.authorSlug ? { authorSlug: profile.authorSlug } : { author: session.user.name || "Unknown" },
        orderBy: { createdAt: "desc" },
      });

      const articleSlugs = articles.map(a => a.slug);

      if (articleSlugs.length > 0) {
        const likeCounts = await db.articleLike.groupBy({
          by: ['articleId'],
          where: { articleId: { in: articleSlugs } },
          _count: { articleId: true }
        });
        
        likeCounts.forEach(lc => {
          likesCountMap[lc.articleId] = lc._count.articleId;
          totalLikes += lc._count.articleId;
        });
      }
    } catch (err) {
      console.warn("DB Fallback in Writer Dashboard:", err);
    }
  }

  const articlesWithCounts = articles.map(article => ({
    ...article,
    _count: {
      articleLikes: likesCountMap[article.slug] || 0
    }
  }));

  const publishedCount = articles.filter((a) => (a.publishedAt || "") <= new Date()).length;
  // Actually, we don't have an explicit 'isDraft' flag in the Article schema. 
  // Drafts might be those where publishedAt is in the future, or we just treat them all as published if we lack a draft flag.
  // Looking at the schema, there's no status field. If we assume "drafts" are just unpublished or not handled yet.
  // We'll just show all articles.

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-serif font-bold text-neutral-900 mb-2">
          مرحباً بك، {session.user.name || "أيها الكاتب"}
        </h1>
        <p className="text-sm text-neutral-600 font-sans">
          هنا يمكنك متابعة مقالاتك ومسوداتك والتفاعل الذي تحققه.
        </p>
      </div>

      {!profile && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-sm flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-amber-900 mb-1">ملفك التحريري غير مكتمل</h3>
            <p className="text-xs text-amber-800">
              لم يقم المشرف العام بتعيين تفاصيل ملفك التحريري (المسمى والتصنيفات). يرجى التواصل مع الإدارة.
            </p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-md border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-3 text-neutral-500 mb-3">
            <FileText className="w-5 h-5" />
            <h3 className="text-xs font-bold font-sans">إجمالي المقالات</h3>
          </div>
          <div className="text-3xl font-serif font-bold text-neutral-900">
            {articles.length}
          </div>
        </div>

        <div className="bg-white p-5 rounded-md border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-3 text-amber-600 mb-3">
            <Edit3 className="w-5 h-5" />
            <h3 className="text-xs font-bold font-sans">المسودات المفتوحة</h3>
          </div>
          <div className="text-3xl font-serif font-bold text-neutral-900">
            0 <span className="text-xs text-neutral-400 font-normal mr-2">(قريباً)</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-md border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-3 text-rose-500 mb-3">
            <Heart className="w-5 h-5" />
            <h3 className="text-xs font-bold font-sans">إجمالي الإعجابات</h3>
          </div>
          <div className="text-3xl font-serif font-bold text-neutral-900">
            {totalLikes}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-neutral-200 rounded-md p-5 shadow-sm">
            <h3 className="font-bold text-sm text-neutral-900 border-b border-neutral-100 pb-3 mb-4">
              هويتك التحريرية
            </h3>
            <div className="space-y-4">
              <div>
                <span className="block text-[10px] text-neutral-400 font-sans mb-1">المسمى التحريري</span>
                <span className="text-sm font-bold text-neutral-800">
                  {profile?.title || "كاتب"}
                </span>
              </div>

              <div>
                <span className="block text-[10px] text-neutral-400 font-sans mb-1.5">التصنيفات المصرح بها</span>
                {profile?.assignedCategories && profile.assignedCategories.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {profile.assignedCategories.map(cat => {
                      const categoryObj = CATEGORIES.find(c => c.id === cat);
                      return categoryObj ? (
                        <span key={cat} className="text-[10px] bg-neutral-100 text-neutral-700 border border-neutral-200 px-2 py-0.5 rounded-sm">
                          {categoryObj.title}
                        </span>
                      ) : null;
                    })}
                  </div>
                ) : (
                  <span className="text-xs text-neutral-400 italic">لا يوجد تصنيفات محددة.</span>
                )}
              </div>

              {profile?.authorSlug && (
                <div className="pt-4 border-t border-neutral-100 mt-2">
                  <Link
                    href={`/authors/${profile.authorSlug}`}
                    target="_blank"
                    className="flex items-center justify-center gap-2 w-full py-2 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-xs font-bold text-neutral-700 transition-colors rounded-sm"
                  >
                    <span>معاينة الملف العام للجمهور</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Articles */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-neutral-200 rounded-md shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-neutral-100 bg-neutral-50 flex items-center justify-between">
              <h3 className="font-bold text-sm text-neutral-900">
                مقالاتك ودراساتك ({articles.length})
              </h3>
              <Link href="/writer/new" className="px-3 py-1.5 bg-neutral-900 text-white text-xs font-bold rounded-sm hover:bg-neutral-800 transition-colors">
                أطروحة جديدة +
              </Link>
            </div>
            
            <div className="divide-y divide-neutral-100">
              {articlesWithCounts.length === 0 ? (
                <div className="p-8 text-center text-neutral-500 text-sm font-serif">
                  لم تقم بنشر أو كتابة أي مقال بعد.
                </div>
              ) : (
                articlesWithCounts.map(article => (
                  <div key={article.id} className="p-4 sm:p-5 hover:bg-[#FAF7F0] transition-colors flex flex-col sm:flex-row gap-4 sm:items-center justify-between group">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[9px] font-bold tracking-wider text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-sm border border-amber-200">
                          {CATEGORIES.find(c => c.id === article.category)?.title || article.category}
                        </span>
                        {article.draft ? (
                          article.pendingReview ? (
                            <span className="text-[9px] font-bold tracking-wider text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-sm border border-blue-200">
                              بانتظار المراجعة
                            </span>
                          ) : (
                            <span className="text-[9px] font-bold tracking-wider text-neutral-600 bg-neutral-100 px-1.5 py-0.5 rounded-sm border border-neutral-200">
                              مسودة
                            </span>
                          )
                        ) : (
                          <span className="text-[9px] font-bold tracking-wider text-green-700 bg-green-50 px-1.5 py-0.5 rounded-sm border border-green-200">
                            منشور
                          </span>
                        )}
                        {article.isPremium && (
                          <span className="text-[9px] font-bold tracking-wider text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded-sm border border-purple-200">
                            محتوى مدفوع
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold font-serif text-sm text-neutral-900 mb-1 truncate">
                        {article.title}
                      </h4>
                      <div className="flex items-center gap-4 text-[10px] text-neutral-500 font-sans">
                        <span>تم الإنشاء: {new Date(article.createdAt).toLocaleDateString('ar-EG')}</span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3 text-rose-400" />
                          {article._count.articleLikes}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        href={`/articles/${article.slug}`}
                        target="_blank"
                        className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-white rounded-full transition-colors border border-transparent hover:border-neutral-200"
                        title="معاينة المقال"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/writer/edit/${article.id}`}
                        className="p-2 text-amber-800 hover:text-amber-900 hover:bg-white rounded-full transition-colors border border-transparent hover:border-amber-200"
                        title="تعديل المقال"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-sm text-xs text-amber-800 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <p>
              ملاحظة: صلاحية نشر المقالات وتعديل حالتها من مسودة إلى عامة محصورة حصراً بالمشرف العام لضمان المراجعة النهائية.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
