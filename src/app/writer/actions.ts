"use server";

import { db } from "../../lib/db";
import { auth } from "../../lib/auth";
import { Category } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function saveArticle(formData: FormData) {
  const session = await auth();
  if (!session || (session.user?.role !== "WRITER" && session.user?.role !== "ADMIN")) {
    throw new Error("Unauthorized");
  }

  const id = formData.get("id") as string | null;
  const title = formData.get("title") as string;
  const category = formData.get("category") as Category;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const isPremium = formData.get("isPremium") === "true";
  const actionType = formData.get("actionType") as string; // 'draft' or 'review'
  
  const bookAuthor = formData.get("bookAuthor") as string | null;
  const ideaInOurTimeTitle = formData.get("ideaInOurTimeTitle") as string | null;

  if (!title || !content || !category) {
    throw new Error("Missing required fields");
  }

  // Create slug from title if it's new
  let slug = formData.get("slug") as string | null;
  if (!slug) {
    slug = title.trim().toLowerCase().replace(/\\s+/g, "-").replace(/[^a-z0-9\u0600-\u06FF-]/g, "");
    if (!slug) slug = "untitled-" + Date.now();
  }

  const draft = true; // Writer can only save as draft
  const pendingReview = actionType === "review";

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { writerProfile: true }
  });

  if (!user) {
    throw new Error("User not found");
  }

  const authorName = user.writerProfile?.title || user.name || "Unknown Author";
  const authorSlug = user.writerProfile?.authorSlug || slug + "-author";

  const data = {
    title,
    slug,
    category,
    excerpt,
    content,
    isPremium,
    draft,
    pendingReview,
    bookAuthor: category === "BOOKS" ? bookAuthor : null,
    ideaInOurTimeTitle: category === "BOOKS" ? ideaInOurTimeTitle : null,
    author: authorName,
    authorSlug,
    userId: user.id
  };

  if (id) {
    // Check ownership or admin
    const existing = await db.article.findUnique({ where: { id } });
    if (!existing) throw new Error("Article not found");
    if (existing.userId !== user.id && session.user.role !== "ADMIN") {
      throw new Error("Unauthorized: you do not own this article");
    }
    
    await db.article.update({
      where: { id },
      data
    });
  } else {
    // Create new
    await db.article.create({
      data
    });
  }

  revalidatePath("/writer");
  revalidatePath("/admin/articles");
  
  return { success: true };
}
