import { db } from "@/src/lib/db";
import { auth } from "@/src/lib/auth";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import Navigation from "@/src/components/navigation";
import Footer from "@/src/components/footer";
import { MessageSquare, Clock, Plus } from "lucide-react";
import CreatePostForm from "./CreatePostForm";

export const dynamic = "force-dynamic";

export default async function CommunityPage() {
  const session = await auth();
  const isPremium = session?.user?.isPremium === true;
  
  const posts = await db.communityPost.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { name: true, image: true, role: true } },
      _count: { select: { replies: true } }
    },
    take: 50
  });

  return (
    <div className="min-h-screen bg-[#FCFBF9] text-black font-sans selection:bg-black selection:text-white" dir="rtl">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl md:text-5xl font-serif font-black text-[#111111] mb-3">مجتمع مِعمار</h1>
            <p className="text-neutral-600 max-w-lg font-serif leading-relaxed text-sm">
              مساحة نقاشية خاصة لمشتركي وعقول مِعمار. اطرح أفكارك، وناقش التحليلات الاستراتيجية، وتفاعل مع فريق التحرير والقراء.
            </p>
          </div>
          {isPremium ? (
            <CreatePostForm />
          ) : (
            <Link href="/subscribe" className="bg-[#111111] text-[#FCFBF9] px-6 py-3 rounded-xs text-xs font-bold hover:bg-neutral-800 transition-colors shrink-0">
              اشترك للمشاركة
            </Link>
          )}
        </div>

        <div className="space-y-4">
          {posts.map(post => (
            <Link key={post.id} href={`/community/${post.id}`} className="block bg-white border border-neutral-200 p-5 rounded-xs hover:border-black transition-colors shadow-2xs group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-grow">
                  <h2 className="text-lg font-serif font-bold text-neutral-900 group-hover:text-[#C86A00] transition-colors mb-2">
                    {post.title}
                  </h2>
                  <div className="flex items-center gap-4 text-[11px] text-neutral-500 font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-neutral-700">{post.author.name || "مشارك مجهول"}</span>
                      {post.author.role === "ADMIN" && (
                        <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-sm text-[9px] font-bold">إدارة</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ar })}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      <span>{post._count.replies} ردود</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {posts.length === 0 && (
            <div className="text-center py-20 border border-neutral-200 border-dashed rounded-xs text-neutral-500">
              لا توجد نقاشات حتى الآن. كن أول من يطرح موضوعاً!
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
