import { NextResponse } from "next/server";
import { db } from "@/src/lib/db";
import { getAllArticles } from "@/src/lib/mdx";
import { Category } from "@prisma/client";

export async function GET() {
  try {
    const articles = getAllArticles(true);
    let migratedCount = 0;

    for (const article of articles) {
      const { metadata, content } = article;
      
      const categoryMap: Record<string, Category> = {
        "ai-geopolitics": "AI_GEOPOLITICS",
        "cybersecurity": "CYBERSECURITY",
        "quantum-computing": "QUANTUM_COMPUTING",
        "energy": "ENERGY",
        "digital-infrastructure": "DIGITAL_INFRASTRUCTURE",
        "applied-modeling": "APPLIED_MODELING",
        "fiqh-al-waqi": "FIQH_AL_WAQI",
        "books": "BOOKS",
      };

      const categoryEnum = categoryMap[metadata.category] || "AI_GEOPOLITICS";

      await db.article.upsert({
        where: { slug: metadata.slug },
        update: {
          title: metadata.title,
          excerpt: metadata.excerpt,
          content: content,
          author: metadata.author,
          authorSlug: metadata.authorSlug,
          category: categoryEnum,
          isPremium: metadata.isPremium,
          draft: metadata.draft ?? false,
          publishedAt: metadata.draft ? null : new Date(metadata.publishedAt),
          bookAuthor: metadata.bookAuthor,
          ideaInOurTimeTitle: metadata.ideaInOurTimeTitle,
        },
        create: {
          slug: metadata.slug,
          title: metadata.title,
          excerpt: metadata.excerpt,
          content: content,
          author: metadata.author,
          authorSlug: metadata.authorSlug,
          category: categoryEnum,
          isPremium: metadata.isPremium,
          draft: metadata.draft ?? false,
          publishedAt: metadata.draft ? null : new Date(metadata.publishedAt),
          createdAt: new Date(metadata.publishedAt),
          bookAuthor: metadata.bookAuthor,
          ideaInOurTimeTitle: metadata.ideaInOurTimeTitle,
        }
      });
      migratedCount++;
    }

    return NextResponse.json({ success: true, migrated: migratedCount });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
