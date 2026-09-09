export const dynamic = "force-dynamic";

import React from "react";
import { db } from "../../../lib/db";
import { getArticleBySlug } from "../../../lib/articles";
import CommentsModeration, {
  AdminCommentItem,
} from "../../../components/admin/CommentsModeration";

export default async function AdminCommentsPage() {
  let comments: AdminCommentItem[] = [];

  if ((process.env.DATABASE_URL || process.env.SQL_HOST)) {
    try {
      const dbComments = await db.comment.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      // Cache article titles by slug to avoid duplicate disk reads
      const titleCache = new Map<string, string>();

      comments = await Promise.all(dbComments.map(async (c) => {
        let articleTitle = titleCache.get(c.articleId);
        if (!articleTitle) {
          const parsed = await getArticleBySlug(c.articleId);
          articleTitle = parsed?.metadata.title || c.articleId;
          titleCache.set(c.articleId, articleTitle);
        }

        return {
          id: c.id,
          articleId: c.articleId,
          articleTitle,
          userId: c.userId,
          userName: c.user.name || null,
          userEmail: c.user.email || null,
          content: c.content,
          createdAt: c.createdAt.toISOString(),
        };
      }));
    } catch (err) {
      console.error("[ADMIN_COMMENTS_PAGE_ERR]", err);
    }
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="border-b border-[#E5E2DC] pb-4">
        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-sans block">
          الإشراف التحريري والنقاشات
        </span>
        <h1 className="text-2xl font-bold font-sans text-neutral-900 mt-0.5">
          الإشراف على تعليقات القراء
        </h1>
        <p className="text-xs text-neutral-500 font-sans mt-1">
          متابعة النقاشات الدائرة حول الدراسات المنشورة، وحذف التعليقات المخالفة أو غير اللائقة بصورة فورية.
        </p>
      </div>

      {/* Moderation Component */}
      <CommentsModeration initialComments={comments} />
    </div>
  );
}
