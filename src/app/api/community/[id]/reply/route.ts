import { NextResponse } from 'next/server';
import { db } from '@/src/lib/db';
import { auth } from '@/src/lib/auth';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: postId } = await params;
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });
    }
    
    const isPremium = session.user.isPremium === true;
    const isAdmin = session.user.role === "ADMIN";
    if (!isPremium && !isAdmin) {
      return NextResponse.json({ error: "خاصية المشاركة متاحة للمشتركين فقط" }, { status: 403 });
    }

    const { content } = await req.json();

    if (!content) {
      return NextResponse.json({ error: "محتوى الرد مطلوب" }, { status: 400 });
    }

    const post = await db.communityPost.findUnique({ where: { id: postId } });
    if (!post) {
      return NextResponse.json({ error: "الموضوع غير موجود" }, { status: 404 });
    }

    const reply = await db.communityReply.create({
      data: {
        content,
        postId,
        authorId: session.user.id
      }
    });

    return NextResponse.json({ success: true, reply });
  } catch (error: any) {
    console.error('[COMMUNITY_REPLY]', error);
    return NextResponse.json({ error: "حدث خطأ داخلي" }, { status: 500 });
  }
}
