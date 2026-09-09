import { db } from "@/src/lib/db";
import { auth } from "@/src/lib/auth";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import Navigation from "@/src/components/navigation";
import Footer from "@/src/components/footer";
import { ArrowRight, User } from "lucide-react";
import ReplyForm from "./ReplyForm";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CommunityPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const isPremium = session?.user?.isPremium === true;
  
  const post = await db.communityPost.findUnique({
    where: { id },
    include: {
      author: { select: { name: true, image: true, role: true } },
      replies: {
        include: { author: { select: { name: true, image: true, role: true } } },
        orderBy: { createdAt: 'asc' }
      }
    }
  });

  if (!post) return notFound();

  return (
    <div className="min-h-screen bg-[#FCFBF9] text-black font-sans selection:bg-black selection:text-white" dir="rtl">
      <Navigation />
      
      <main className="max-w-3xl mx-auto px-6 py-12 md:py-20">
        <Link href="/community" className="inline-flex items-center gap-2 text-xs font-bold text-neutral-500 hover:text-black transition-colors mb-8">
          <ArrowRight className="w-4 h-4" />
          <span>العودة للمجتمع</span>
        </Link>

        <article className="bg-white border border-neutral-200 p-6 md:p-10 rounded-xs shadow-2xs mb-8">
          <h1 className="text-2xl md:text-4xl font-serif font-black text-[#111111] mb-6 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex items-center gap-4 text-xs text-neutral-500 font-mono mb-8 pb-8 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center border border-neutral-200">
                <User className="w-4 h-4 text-neutral-400" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-neutral-900 flex items-center gap-1.5">
                  {post.author.name || "مشارك"}
                  {post.author.role === "ADMIN" && (
                    <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-sm text-[9px] font-bold">إدارة</span>
                  )}
                </span>
                <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ar })}</span>
              </div>
            </div>
          </div>

          <div className="font-serif text-lg leading-relaxed text-neutral-800 whitespace-pre-wrap">
            {post.content}
          </div>
        </article>

        {/* Replies Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-serif font-bold border-b border-neutral-200 pb-4 mb-6">
            الردود ({post.replies.length})
          </h2>
          
          {post.replies.map(reply => (
            <div key={reply.id} className="bg-white border border-neutral-100 p-6 rounded-xs shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center border border-neutral-200">
                  <User className="w-4 h-4 text-neutral-400" />
                </div>
                <div>
                  <div className="font-bold text-xs text-neutral-900 flex items-center gap-1.5">
                    {reply.author.name || "مشارك"}
                    {reply.author.role === "ADMIN" && (
                      <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-sm text-[9px] font-bold">إدارة</span>
                    )}
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono">
                    {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true, locale: ar })}
                  </div>
                </div>
              </div>
              <div className="font-serif text-base leading-relaxed text-neutral-700 whitespace-pre-wrap pl-4 border-r-2 border-neutral-100 pr-4">
                {reply.content}
              </div>
            </div>
          ))}

          {isPremium ? (
            <ReplyForm postId={post.id} />
          ) : (
            <div className="bg-neutral-50 border border-neutral-200 p-6 rounded-xs text-center mt-8">
              <p className="text-sm font-serif text-neutral-600 mb-4">يجب أن تكون مشتركاً (Premium) لإضافة الردود والمشاركة في النقاش.</p>
              <Link href="/subscribe" className="inline-block bg-[#111111] text-white px-6 py-2.5 rounded-xs text-xs font-bold hover:bg-neutral-800 transition-colors">
                اشترك الآن
              </Link>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
