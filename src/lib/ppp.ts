export interface PppConfig {
  tierName: string;
  basePriceCents: number; // monthly base price in cents
  discountPercentage: number; // discount from standard Tier 1 (e.g. 20 for Tier 2, 66 for Tier 3)
  stripeCouponId: string | null;
  currency: string;
  currencySymbol: string;
  suggestedPriceCents: number; // adjusted price in cents
}

// Map country codes (ISO 3166-1 alpha-2) to Tiers
const TIER_MAPPINGS: Record<string, "TIER1" | "TIER2" | "TIER3"> = {
  // Tier 2: GCC & High-Middle Income Adjustments (20% discount, $12.00)
  SA: "TIER2", // Saudi Arabia
  AE: "TIER2", // United Arab Emirates
  QA: "TIER2", // Qatar
  KW: "TIER2", // Kuwait
  OM: "TIER2", // Oman
  BH: "TIER2", // Bahrain
  KR: "TIER2", // South Korea
  TW: "TIER2", // Taiwan
  IL: "TIER2", // Israel

  // Tier 3: Emerging Markets / Deep purchasing power index adjustments (66% discount, $5.10)
  // Arab & Regional Emerging Economies
  EG: "TIER3", // Egypt
  MA: "TIER3", // Morocco
  TN: "TIER3", // Tunisia
  JO: "TIER3", // Jordan
  DZ: "TIER3", // Algeria
  LY: "TIER3", // Libya
  SD: "TIER3", // Sudan
  YE: "TIER3", // Yemen
  SY: "TIER3", // Syria
  IQ: "TIER3", // Iraq
  LB: "TIER3", // Lebanon
  PS: "TIER3", // Palestine
  TR: "TIER3", // Turkey

  // Global Emerging Economies
  IN: "TIER3", // India
  BR: "TIER3", // Brazil
  MX: "TIER3", // Mexico
  AR: "TIER3", // Argentina
  CO: "TIER3", // Colombia
  ZA: "TIER3", // South Africa
  PH: "TIER3", // Philippines
  PK: "TIER3", // Pakistan
  BD: "TIER3", // Bangladesh
  VN: "TIER3", // Vietnam
  ID: "TIER3", // Indonesia
  UA: "TIER3", // Ukraine
  NG: "TIER3", // Nigeria
};

// Pricing structures based on standard pricing of $15/month (standard)
const PRICING_TIERS: Record<"TIER1" | "TIER2" | "TIER3", PppConfig> = {
  TIER1: {
    tierName: "Tier 1 - Standard Global",
    basePriceCents: 1500, // $15.00
    discountPercentage: 0,
    stripeCouponId: null,
    currency: "USD",
    currencySymbol: "$",
    suggestedPriceCents: 1500,
  },
  TIER2: {
    tierName: "Tier 2 - Regional Fair Adjust",
    basePriceCents: 1500,
    discountPercentage: 20, // 20% discount ($12.00)
    stripeCouponId: process.env.STRIPE_COUPON_TIER2 || "ME'MAR_TIER2_20",
    currency: "USD",
    currencySymbol: "$",
    suggestedPriceCents: 1200,
  },
  TIER3: {
    tierName: "Tier 3 - Emerging Power Parity",
    basePriceCents: 1500,
    discountPercentage: 66, // 66% discount ($5.10)
    stripeCouponId: process.env.STRIPE_COUPON_TIER3 || "ME'MAR_TIER3_66",
    currency: "USD",
    currencySymbol: "$",
    suggestedPriceCents: 510,
  },
};

/**
 * Resolves the optimal Purchasing Power Parity (PPP) configuration based on ISO Country Code
 * Defaults to TIER1 (Standard Global) if the country remains unrecognized
 */
export function getPppConfig(countryCode?: string | null): PppConfig {
  if (!countryCode) {
    return PRICING_TIERS.TIER1;
  }
  const normalizedCode = countryCode.toUpperCase().trim();
  const targetTier = TIER_MAPPINGS[normalizedCode] || "TIER1";
  return PRICING_TIERS[targetTier];
}

/**
 * Clean UI formatting function for human legible prices
 */
export function formatPrice(cents: number, currency = "USD", symbol = "$"): string {
  const amount = (cents / 100).toFixed(2);
  const formatted = amount.endsWith(".00") ? amount.slice(0, -3) : amount;
  return `${symbol}${formatted}`;
}

// Popular Arab and international countries for PPP selector and simulation
export const POPULAR_COUNTRIES = [
  { code: "EG", name: "مصر (Egypt)", tier: "Tier 3 - خصم 66%" },
  { code: "DZ", name: "الجزائر (Algeria)", tier: "Tier 3 - خصم 66%" },
  { code: "MA", name: "المغرب (Morocco)", tier: "Tier 3 - خصم 66%" },
  { code: "TN", name: "تونس (Tunisia)", tier: "Tier 3 - خصم 66%" },
  { code: "LY", name: "ليبيا (Libya)", tier: "Tier 3 - خصم 66%" },
  { code: "SD", name: "السودان (Sudan)", tier: "Tier 3 - خصم 66%" },
  { code: "YE", name: "اليمن (Yemen)", tier: "Tier 3 - خصم 66%" },
  { code: "SY", name: "سوريا (Syria)", tier: "Tier 3 - خصم 66%" },
  { code: "IQ", name: "العراق (Iraq)", tier: "Tier 3 - خصم 66%" },
  { code: "JO", name: "الأردن (Jordan)", tier: "Tier 3 - خصم 66%" },
  { code: "LB", name: "لبنان (Lebanon)", tier: "Tier 3 - خصم 66%" },
  { code: "PS", name: "فلسطين (Palestine)", tier: "Tier 3 - خصم 66%" },
  { code: "SA", name: "السعودية (Saudi Arabia)", tier: "Tier 2 - خصم 20%" },
  { code: "AE", name: "الإمارات (UAE)", tier: "Tier 2 - خصم 20%" },
  { code: "QA", name: "قطر (Qatar)", tier: "Tier 2 - خصم 20%" },
  { code: "KW", name: "الكويت (Kuwait)", tier: "Tier 2 - خصم 20%" },
  { code: "OM", name: "عمان (Oman)", tier: "Tier 2 - خصم 20%" },
  { code: "BH", name: "البحرين (Bahrain)", tier: "Tier 2 - خصم 20%" },
  { code: "US", name: "الولايات المتحدة (US Global)", tier: "Tier 1 - قياسي" },
  { code: "GB", name: "بريطانيا (UK)", tier: "Tier 1 - قياسي" },
  { code: "DE", name: "ألمانيا (Germany)", tier: "Tier 1 - قياسي" },
  { code: "TR", name: "تركيا (Turkey)", tier: "Tier 3 - خصم 66%" },
];
