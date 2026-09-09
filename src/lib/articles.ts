import { db } from "./db";
import { Category } from "@prisma/client";
import * as mdxFallback from "./mdx";

export interface ArticleMetadata {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  authorSlug?: string;
  authorId?: string;
  category: string;
  isPremium: boolean;
  publishedAt: string;
  draft: boolean;
  bookAuthor?: string;
  bookOriginalTitle?: string;
  ideaInOurTimeTitle?: string;
}

export interface ParsedArticle {
  metadata: ArticleMetadata;
  content: string;
}

export function sanitizeHtml(html: string): string {
  return html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function sliceContent(content: string, percentage: number = 20): string {
  if (!content) return "";
  const splitToken = "<!-- PAYWALL_SPLIT -->";
  if (content.includes(splitToken)) {
    return content.split(splitToken)[0].trim() + "\n\n...";
  }
  const paragraphs = content.split(/\n\s*\n/);
  const totalParagraphs = paragraphs.length;
  if (totalParagraphs <= 1) {
    const words = content.trim().split(/\s+/);
    const sliceCount = Math.max(5, Math.floor((words.length * percentage) / 100));
    return words.slice(0, sliceCount).join(" ") + " ...";
  }
  const paragraphSliceCount = Math.max(1, Math.floor((totalParagraphs * percentage) / 100));
  const slicedParagraphs = paragraphs.slice(0, paragraphSliceCount);
  return slicedParagraphs.join("\n\n") + "\n\n...";
}

// Convert DB Article to ParsedArticle
function mapDbToParsed(article: any): ParsedArticle {
  return {
    metadata: {
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      author: article.author,
      authorSlug: article.authorSlug || undefined,
      authorId: article.authorId || undefined,
      category: article.category,
      isPremium: article.isPremium,
      publishedAt: article.publishedAt ? new Date(article.publishedAt).toISOString() : new Date(article.createdAt).toISOString(),
      draft: article.draft,
      bookAuthor: article.bookAuthor || undefined,
      ideaInOurTimeTitle: article.ideaInOurTimeTitle || undefined,
    },
    content: article.content,
  };
}

export async function getArticleBySlug(slug: string): Promise<ParsedArticle | null> {
  if (!(process.env.DATABASE_URL || process.env.SQL_HOST)) {
    return mdxFallback.getArticleBySlug(slug) as unknown as ParsedArticle | null;
  }
  try {
    const article = await db.article.findUnique({
      where: { slug }
    });
    if (!article) return null;
    return mapDbToParsed(article);
  } catch (err) {
    console.warn("DB Fallback:", err);
    return mdxFallback.getArticleBySlug(slug) as unknown as ParsedArticle | null;
  }
}

export async function getAllArticles(includeDrafts: boolean = true): Promise<ParsedArticle[]> {
  if (!(process.env.DATABASE_URL || process.env.SQL_HOST)) {
    return mdxFallback.getAllArticles(includeDrafts) as unknown as ParsedArticle[];
  }
  try {
    const articles = await db.article.findMany({
      where: includeDrafts ? undefined : { draft: false },
      orderBy: { publishedAt: 'desc' }
    });
    return articles.map(mapDbToParsed);
  } catch (err) {
    console.warn("DB Fallback:", err);
    return mdxFallback.getAllArticles(includeDrafts) as unknown as ParsedArticle[];
  }
}

export async function getPublishedArticles(): Promise<ParsedArticle[]> {
  return getAllArticles(false);
}

export async function getArticlesByCategory(categorySlug: string, includeDrafts: boolean = false): Promise<ParsedArticle[]> {
  if (!(process.env.DATABASE_URL || process.env.SQL_HOST)) {
    return mdxFallback.getArticlesByCategory(categorySlug, includeDrafts) as unknown as ParsedArticle[];
  }
  try {
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
    const categoryEnum = categoryMap[categorySlug];
    if (!categoryEnum) return [];

    const articles = await db.article.findMany({
      where: {
        category: categoryEnum,
        draft: includeDrafts ? undefined : false,
      },
      orderBy: { publishedAt: 'desc' }
    });
    return articles.map(mapDbToParsed);
  } catch (err) {
    console.warn("DB Fallback:", err);
    return mdxFallback.getArticlesByCategory(categorySlug, includeDrafts) as unknown as ParsedArticle[];
  }
}

export async function getArticlesByAuthor(authorIdentifier: string, includeDrafts: boolean = false): Promise<ParsedArticle[]> {
  if (!(process.env.DATABASE_URL || process.env.SQL_HOST)) {
    return mdxFallback.getArticlesByAuthor(authorIdentifier, includeDrafts) as unknown as ParsedArticle[];
  }
  try {
    const target = authorIdentifier.trim();
    const articles = await db.article.findMany({
      where: {
        OR: [
          { author: target },
          { authorSlug: target }
        ],
        draft: includeDrafts ? undefined : false,
      },
      orderBy: { publishedAt: 'desc' }
    });
    return articles.map(mapDbToParsed);
  } catch (err) {
    console.warn("DB Fallback:", err);
    return mdxFallback.getArticlesByAuthor(authorIdentifier, includeDrafts) as unknown as ParsedArticle[];
  }
}

import { sendWhatsAppNotification } from "./whatsapp";
import { sendEmailNotification } from "./email-notifications";

export async function toggleArticleDraft(slug: string): Promise<{ success: boolean; draft?: boolean; error?: string }> {
  if (!(process.env.DATABASE_URL || process.env.SQL_HOST)) {
    return mdxFallback.toggleArticleDraft(slug);
  }
  try {
    const article = await db.article.findUnique({ where: { slug } });
    if (!article) return { success: false, error: "المقال غير موجود" };
    
    const newDraftStatus = !article.draft;
    await db.article.update({
      where: { id: article.id },
      data: { 
        draft: newDraftStatus,
        publishedAt: newDraftStatus ? null : new Date()
      }
    });

    // If publishing, send WhatsApp notifications to users with verified phone numbers
    if (!newDraftStatus) {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'https://me-mar.com';
      const articleUrl = `${baseUrl}/articles/${slug}`;
        
      try {
        const users = await db.user.findMany({
          where: { phoneNumber: { not: null } },
          select: { phoneNumber: true, name: true, email: true }
        });

        for (const user of users) {
          if (user.phoneNumber) {
            const message = `مرحباً ${user.name || 'عزيزي المشترك'}\n\nتحليل جديد متوفر الآن على مِعمار:\n*${article.title}*\n\n${article.excerpt || ''}\n\nللقراءة: ${articleUrl}`;
            await sendWhatsAppNotification(user.phoneNumber, message);
          }
          
          if (user.email) {
             const emailHtml = `
              <div dir="rtl" style="font-family:'IBM Plex Sans Arabic',Arial,sans-serif;color:#111;">
                <h2>مرحباً ${user.name || 'عزيزي المشترك'}،</h2>
                <p>تم نشر تحليل جديد على منصة مِعمار:</p>
                <h3 style="color:#C86A00;">${article.title}</h3>
                <p style="font-size:16px;line-height:1.6;color:#444;">${article.excerpt || ''}</p>
                <div style="margin-top:30px;">
                  <a href="${articleUrl}" style="background-color:#111;color:#fff;padding:12px 24px;text-decoration:none;border-radius:4px;font-weight:bold;">قراءة التحليل كاملاً</a>
                </div>
              </div>
            `;
            await sendEmailNotification(user.email, `تحليل جديد: ${article.title}`, emailHtml);
          }
        }
      } catch (notifyErr) {
        console.error("Failed to send notifications on publish", notifyErr);
      }
    }

    return { success: true, draft: newDraftStatus };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
