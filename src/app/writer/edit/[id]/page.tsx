import { auth } from "../../../../lib/auth";
import { db } from "../../../../lib/db";
import { redirect } from "next/navigation";
import Navigation from "../../../../components/navigation";
import ArticleEditor from "../../../../components/writer/ArticleEditor";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || (session.user?.role !== "WRITER" && session.user?.role !== "ADMIN")) {
    redirect("/dashboard");
  }

  const { id } = await params;
  const article = await db.article.findUnique({
    where: { id }
  });

  if (!article) {
    redirect("/writer");
  }

  // Writers can only edit their own articles, Admin can edit any
  if (article.userId !== session.user.id && session.user.role !== "ADMIN") {
    redirect("/writer");
  }

  return (
    <div className="min-h-screen bg-[#FCFBF9]">
      <Navigation />
      <ArticleEditor initialData={{
        id: article.id,
        title: article.title,
        slug: article.slug,
        category: article.category,
        excerpt: article.excerpt,
        content: article.content,
        isPremium: article.isPremium,
        bookAuthor: article.bookAuthor,
        ideaInOurTimeTitle: article.ideaInOurTimeTitle,
        draft: article.draft,
        pendingReview: article.pendingReview,
      }} />
    </div>
  );
}
