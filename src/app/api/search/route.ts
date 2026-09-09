import { NextResponse } from 'next/server';
import { db } from '@/src/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query || query.trim() === '') {
      return NextResponse.json({ articles: [] });
    }

    // In a real production app we would use Postgres Full-Text Search (tsvector).
    // For this prototype, we'll use a basic ILIKE search via Prisma on title and excerpt.
    const articles = await db.article.findMany({
      where: {
        draft: false,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { excerpt: { contains: query, mode: 'insensitive' } },
          { author: { contains: query, mode: 'insensitive' } }
        ]
      },
      select: {
        title: true,
        slug: true,
        excerpt: true,
        author: true,
        category: true,
        publishedAt: true,
      },
      take: 10,
      orderBy: {
        publishedAt: 'desc'
      }
    });

    return NextResponse.json({ articles });
  } catch (error: any) {
    console.error('[SEARCH_API]', error);
    return NextResponse.json({ error: "حدث خطأ داخلي أثناء البحث" }, { status: 500 });
  }
}
