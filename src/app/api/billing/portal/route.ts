import { NextResponse } from "next/server";
import { auth } from "../../../../lib/auth";
import { db } from "../../../../lib/db";
import { getStripe } from "../../../../lib/stripe";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const appUrl = process.env.APP_URL || process.env.NEXTAUTH_URL || "https://me-mar.com";
    const returnUrl = `${appUrl}/dashboard`;

    // Find subscription with Stripe Customer ID
    let stripeCustomerId: string | null = null;
    if ((process.env.DATABASE_URL || process.env.SQL_HOST)) {
      const subscription = await db.subscription.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });
      stripeCustomerId = subscription?.stripeCustomerId || null;
    }

    if (!process.env.STRIPE_SECRET_KEY || !stripeCustomerId) {
      // If Stripe is not live or user has no Stripe customer ID yet (e.g. Free tier or demo mode)
      return NextResponse.json({
        url: null,
        message: "لا توجد بوابة فوترة نشطة لحسابك حالياً. يمكنك ترقية الباقة عبر صفحة الاشتراكات.",
      });
    }

    const stripe = getStripe();
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: returnUrl,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error: any) {
    console.error("[STRIPE_PORTAL_ERROR]", error);
    return NextResponse.json(
      { error: error?.message || "تعذر فتح بوابة الفوترة في الوقت الحالي." },
      { status: 500 }
    );
  }
}
