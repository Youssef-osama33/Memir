import Stripe from "stripe";
import { PlanTier, BillingInterval } from "@prisma/client";

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      // In development / preview, provide a fallback instance or descriptive error when called
      stripeClient = new Stripe("sk_test_placeholder_key_for_dev_mode", {
        apiVersion: "2025-02-24.acacia" as any,
      });
    } else {
      stripeClient = new Stripe(key, {
        apiVersion: "2025-02-24.acacia" as any,
      });
    }
  }
  return stripeClient;
}

export interface StripeTierPriceConfig {
  priceId: string;
  tier: "STANDARD" | "PLUS";
  interval: "MONTHLY" | "YEARLY";
  basePriceCents: number; // in cents
}

// 4 paid price IDs total (standard-monthly, standard-yearly, plus-monthly, plus-yearly)
export const STRIPE_PRICES: Record<"STANDARD" | "PLUS", Record<"MONTHLY" | "YEARLY", StripeTierPriceConfig>> = {
  STANDARD: {
    MONTHLY: {
      priceId: process.env.STRIPE_PRICE_STANDARD_MONTHLY || "price_standard_monthly",
      tier: "STANDARD",
      interval: "MONTHLY",
      basePriceCents: 1500, // $15 / mo
    },
    YEARLY: {
      priceId: process.env.STRIPE_PRICE_STANDARD_YEARLY || "price_standard_yearly",
      tier: "STANDARD",
      interval: "YEARLY",
      basePriceCents: 15000, // $150 / yr (2 months free, monthly x 10)
    },
  },
  PLUS: {
    MONTHLY: {
      priceId: process.env.STRIPE_PRICE_PLUS_MONTHLY || "price_plus_monthly",
      tier: "PLUS",
      interval: "MONTHLY",
      basePriceCents: 2500, // $25 / mo
    },
    YEARLY: {
      priceId: process.env.STRIPE_PRICE_PLUS_YEARLY || "price_plus_yearly",
      tier: "PLUS",
      interval: "YEARLY",
      basePriceCents: 25000, // $250 / yr (2 months free, monthly x 10)
    },
  },
};

/**
 * Returns the configured Stripe Price ID for a given tier and billing interval
 */
export function getStripePriceId(tier: "STANDARD" | "PLUS", interval: "MONTHLY" | "YEARLY"): string {
  const tierConfig = STRIPE_PRICES[tier];
  if (!tierConfig) {
    throw new Error(`Unsupported tier: ${tier}`);
  }
  const config = tierConfig[interval];
  if (!config) {
    throw new Error(`Unsupported interval: ${interval} for tier ${tier}`);
  }
  return config.priceId;
}

/**
 * Resolves tier and interval from a Stripe Price ID (e.g. for webhooks)
 */
export function resolveTierFromPriceId(priceId: string): { tier: PlanTier; interval: BillingInterval } {
  for (const [t, intervals] of Object.entries(STRIPE_PRICES)) {
    for (const [i, cfg] of Object.entries(intervals)) {
      if (cfg.priceId === priceId) {
        return {
          tier: t as PlanTier,
          interval: i as BillingInterval,
        };
      }
    }
  }
  // Default fallback if unknown price
  return {
    tier: PlanTier.STANDARD,
    interval: BillingInterval.MONTHLY,
  };
}
