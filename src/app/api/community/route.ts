import { NextResponse } from 'next/server';
import { db } from '@/src/lib/db';
import { auth } from '@/src/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });
    }
    
    // Allow admins or premium users to post
    const isPremium = session.user.isPremium === true;
    const isAdmin = session.user.role === "ADMIN";
    if (!isPremium && !isAdmin) {
      return NextResponse.json({ error: "خاصية المشاركة متاحة للمشتركين فقط" }, { status: 403 });
    }

    const { title, content } = await req.json();

    if (!title || !content) {
      return NextResponse.json({ error: "العنوان والمحتوى مطلوبان" }, { status: 400 });
    }

    const post = await db.communityPost.create({
      data: {
        title,
        content,
        authorId: session.user.id
      }
    });

    return NextResponse.json({ success: true, post });
  } catch (error: any) {
    console.error('[COMMUNITY_POST]', error);
    return NextResponse.json({ error: "حدث خطأ داخلي" }, { status: 500 });
  }
}
