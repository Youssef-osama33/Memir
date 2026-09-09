export const dynamic = "force-dynamic";

import React from "react";
import { redirect } from "next/navigation";
import { auth } from "../../lib/auth";
import { db } from "../../lib/db";
import { getUserProfile } from "../../lib/user-profile";
import crypto from "crypto";
import Navigation from "../../components/navigation";
import Footer from "../../components/footer";
import DashboardClient, {
  ArticlePreviewData,
  UserCommentData,
} from "../../components/dashboard/DashboardClient";
import { getArticleBySlug } from "../../lib/articles";
import { getCategoryBySlug } from "../../lib/categories";

export default async function DashboardPage() {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/auth/signin");
  }

  const userId = session.user.id;
  const userEmail = session.user.email;

  // Verify profile completeness (WhatsApp phone number requirement)
  const userProfile = await getUserProfile(userId, userEmail);
  if (!userProfile?.phoneNumber) {
    redirect("/auth/complete-profile");
  }

  // 1. Subscription & Invoices
  let activeSubscription: any = null;
  if ((process.env.DATABASE_URL || process.env.SQL_HOST)) {
    try {
      activeSubscription = await db.subscription.findFirst({
        where: {
          userId: userId,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          invoices: {
            orderBy: {
              createdAt: "desc",
            },
            take: 10,
          },
        },
      });
    } catch (err) {
      console.error("[DASHBOARD_SUBSCRIPTION_QUERY_ERR]", err);
    }
  }

  // 2. Podcast HMAC Token
  let podcastToken: any = null;
  if ((process.env.DATABASE_URL || process.env.SQL_HOST)) {
    try {
      podcastToken = await db.podcastToken.findFirst({
        where: {
          userId: userId,
          isActive: true,
        },
      });

      if (!podcastToken && userId) {
        const generatedToken = crypto.randomBytes(24).toString("hex");
        const appUrl = process.env.APP_URL || process.env.NEXTAUTH_URL || "https://me-mar.com";
        const feedUrl = `${appUrl}/api/feed/${generatedToken}`;
        podcastToken = await db.podcastToken.create({
          data: {
            userId: userId,
            token: generatedToken,
            feedUrl: feedUrl,
            isActive: true,
          },
        });
      }
    } catch (err) {
      console.error("[PODCAST_TOKEN_PROVISION_ERR]", err);
    }
  } else {
    // Dev / preview mock feed URL
    const appUrl = process.env.APP_URL || "https://me-mar.com";
    podcastToken = {
      token: "demo-podcast-token-64bit",
      feedUrl: `${appUrl}/api/feed/demo-personal-podcast-stream`,
    };
  }

  // 3. Saved Articles
  let rawSaved: any[] = [];
  if ((process.env.DATABASE_URL || process.env.SQL_HOST)) {
    try {
      rawSaved = await db.savedArticle.findMany({
        where: { userId },
        orderBy: { savedAt: "desc" },
      });
    } catch (err) {
      console.error("[SAVED_ARTICLES_QUERY_ERR]", err);
    }
  }

  const savedArticlesRaw = await Promise.all(
    rawSaved.map(async (item) => {
      const article = await getArticleBySlug(item.articleId);
      if (!article) return null;
      const cat = getCategoryBySlug(article.metadata.category);
      return {
        slug: article.metadata.slug,
        title: article.metadata.title,
        category: article.metadata.category,
        categoryTitle: cat?.title || article.metadata.category,
        publishedAt: article.metadata.publishedAt,
        isPremium: article.metadata.isPremium,
      };
    })
  );
  const savedArticles: ArticlePreviewData[] = savedArticlesRaw.filter(Boolean) as ArticlePreviewData[];

  // 4. Liked Articles
  let rawLikes: any[] = [];
  if ((process.env.DATABASE_URL || process.env.SQL_HOST)) {
    try {
      rawLikes = await db.articleLike.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });
    } catch (err) {
      console.error("[LIKES_QUERY_ERR]", err);
    }
  }

  const likedArticlesRaw = await Promise.all(
    rawLikes.map(async (item) => {
      const article = await getArticleBySlug(item.articleId);
      if (!article) return null;
      const cat = getCategoryBySlug(article.metadata.category);
      return {
        slug: article.metadata.slug,
        title: article.metadata.title,
        category: article.metadata.category,
        categoryTitle: cat?.title || article.metadata.category,
        publishedAt: article.metadata.publishedAt,
        isPremium: article.metadata.isPremium,
      };
    })
  );
  const likedArticles: ArticlePreviewData[] = likedArticlesRaw.filter(Boolean) as ArticlePreviewData[];

  // 5. User Comments
  let rawComments: any[] = [];
  if ((process.env.DATABASE_URL || process.env.SQL_HOST)) {
    try {
      rawComments = await db.comment.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });
    } catch (err) {
      console.error("[COMMENTS_QUERY_ERR]", err);
    }
  }

  const userComments: UserCommentData[] = await Promise.all(rawComments.map(async (c) => {
    const article = await getArticleBySlug(c.articleId);
    return {
      id: c.id,
      articleId: c.articleId,
      articleTitle: article ? article.metadata.title : c.articleId,
      content: c.content,
      createdAt: c.createdAt ? c.createdAt.toISOString() : new Date().toISOString(),
    };
  }));

  // 6. User account creation date
  let userCreatedAt: string = new Date().toISOString();
  if ((process.env.DATABASE_URL || process.env.SQL_HOST)) {
    try {
      const dbUser = await db.user.findUnique({
        where: { id: userId },
        select: { createdAt: true },
      });
      if (dbUser?.createdAt) {
        userCreatedAt = dbUser.createdAt.toISOString();
      }
    } catch (err) {
      // ignore
    }
  }

  const userTier =
    (activeSubscription?.tier as any) ||
    (session.user.tier as any) ||
    (session.user.isPremium ? "STANDARD" : "FREE");

  const hasPlus = userTier === "PLUS" || session.user.hasPlusAccess;

  const userProps = {
    id: userId,
    name: userProfile?.name || session.user.name || "",
    email: userEmail || "",
    phoneNumber: userProfile?.phoneNumber || "",
    role: session.user.role || "USER",
    createdAt: userCreatedAt,
    tier: userTier,
    isPremium: Boolean(session.user.isPremium || activeSubscription?.status === "ACTIVE"),
    hasPlusAccess: Boolean(hasPlus),
  };

  const subscriptionProps = activeSubscription
    ? {
        id: activeSubscription.id,
        status: activeSubscription.status,
        tier: activeSubscription.tier,
        interval: activeSubscription.interval,
        currentPeriodEnd: activeSubscription.currentPeriodEnd
          ? new Date(activeSubscription.currentPeriodEnd).toISOString()
          : undefined,
        stripeSubscriptionId: activeSubscription.stripeSubscriptionId,
        invoices: (activeSubscription.invoices || []).map((inv: any) => ({
          id: inv.id,
          stripeInvoiceId: inv.stripeInvoiceId,
          amountPaid: inv.amountPaid,
          currency: inv.currency,
          status: inv.status,
          invoiceUrl: inv.invoiceUrl,
          createdAt: inv.createdAt ? new Date(inv.createdAt).toISOString() : new Date().toISOString(),
        })),
      }
    : null;

  const podcastProps = podcastToken
    ? {
        feedUrl: podcastToken.feedUrl,
        token: podcastToken.token,
      }
    : null;

  return (
    <div
      id="me-mar-account-dashboard"
      className="min-h-screen bg-[#FCFBF9] text-[#111111] font-serif selection:bg-black selection:text-white flex flex-col justify-between"
      dir="rtl"
    >
      <Navigation />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex-grow w-full">
        {/* Page Title & Breadcrumb */}
        <div className="border-b border-[#E5E2DC] pb-4 mb-8">
          <span className="font-sans text-xs font-bold text-neutral-400 uppercase tracking-widest block mb-1">
            بوابة المشترك المعتمد
          </span>
          <h1 className="text-2xl sm:text-3xl font-sans font-bold text-neutral-900 tracking-tight">
            مركز الحساب والاستخبارات الاستراتيجية
          </h1>
        </div>

        {/* Dynamic Client Tabbed Dashboard */}
        <DashboardClient
          user={userProps}
          subscription={subscriptionProps}
          podcastToken={podcastProps}
          savedArticles={savedArticles}
          likedArticles={likedArticles}
          userComments={userComments}
        />
      </main>

      <Footer />
    </div>
  );
}
