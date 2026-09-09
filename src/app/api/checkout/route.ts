import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../lib/auth";
import { getStripe, getStripePriceId } from "../../../lib/stripe";
import { getPppConfig, PlanTierType, BillingIntervalType } from "../../../lib/ppp";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json().catch(() => ({}));
    const requestedTier = body.tier as string;

    if (requestedTier === "FREE") {
      return NextResponse.json(
        { error: "Free tier does not require checkout session" },
        { status: 400 }
      );
    }

    const tier: "STANDARD" | "PLUS" = requestedTier === "PLUS" ? "PLUS" : "STANDARD";
    const interval: BillingIntervalType = body.interval === "YEARLY" ? "YEARLY" : "MONTHLY";

    const countryCode =
      req.headers.get("x-country-code") ||
      req.headers.get("cf-ipcountry") ||
      "DZ";

    const pppConfig = getPppConfig(countryCode);
    const priceId = getStripePriceId(tier, interval);

    const appUrl =
      process.env.APP_URL ||
      process.env.NEXTAUTH_URL ||
      "http://localhost:3000";

    // If Stripe secret key is not configured or in development placeholder, provide a seamless redirect to dashboard
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey || stripeKey.includes("placeholder")) {
      return NextResponse.json({
        url: `${appUrl}/dashboard?mock_subscribed=true&tier=${tier}&interval=${interval}`,
        isMock: true,
      });
    }

    const stripe = getStripe();

    const checkoutParams: any = {
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: session?.user?.id || "guest",
        tier,
        interval,
        countryCode,
      },
      subscription_data: {
        metadata: {
          userId: session?.user?.id || "guest",
          tier,
          interval,
          countryCode,
        },
      },
      success_url: `${appUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${appUrl}/subscribe?canceled=true`,
    };

    // If user is already authenticated, attach customer email
    if (session?.user?.email) {
      checkoutParams.customer_email = session.user.email;
    }

    // Apply invisible PPP coupon if eligible and exists
    if (pppConfig.stripeCouponId) {
      checkoutParams.discounts = [
        {
          coupon: pppConfig.stripeCouponId,
        },
      ];
    }

    const checkoutSession = await stripe.checkout.sessions.create(checkoutParams);

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error("[CHECKOUT_API_ERROR]", error);
    return NextResponse.json(
      { error: error?.message || "Failed to initialize checkout session" },
      { status: 500 }
    );
  }
}
