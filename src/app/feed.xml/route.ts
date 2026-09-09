import { NextResponse } from 'next/server';
import { db } from '@/src/lib/db';

export async function GET() {
  const baseUrl = process.env.APP_URL || 'https://me-mar.com';

  try {
    const articles = await db.article.findMany({
      where: {
        isPremium: false,
        draft: false,
        publishedAt: {
          not: null,
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
      take: 30,
    });

    const feedItems = articles.map((article) => {
      const url = `${baseUrl}/articles/${article.slug}`;
      const date = article.publishedAt ? new Date(article.publishedAt).toUTCString() : new Date().toUTCString();
      
      return `
        <item>
          <title><![CDATA[${article.title}]]></title>
          <link>${url}</link>
          <guid isPermaLink="true">${url}</guid>
          <description><![CDATA[${article.excerpt}]]></description>
          <pubDate>${date}</pubDate>
          <author><![CDATA[${article.author}]]></author>
          <category><![CDATA[${article.category}]]></category>
        </item>
      `;
    }).join('');

    const feed = `<?xml version="1.0" encoding="UTF-8"?>
      <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
        <channel>
          <title><![CDATA[مِعمار]]></title>
          <description><![CDATA[منصة تحليلات استراتيجية وتكنولوجية معمقة في تقاطع الذكاء الاصطناعي والجيوبوليتكس والتقنية]]></description>
          <link>${baseUrl}</link>
          <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
          <language>ar</language>
          <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
          ${feedItems}
        </channel>
      </rss>
    `;

    return new NextResponse(feed.trim(), {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate',
      },
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    return new NextResponse('Error generating feed', { status: 500 });
  }
}
