"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, X, ArrowLeft, ShieldCheck, Sparkles, Loader2 } from "lucide-react";
import { TierPricingResult, BillingIntervalType, PlanTierType } from "../lib/ppp";

interface SubscriptionPricingTableProps {
  prices: {
    monthly: Record<PlanTierType, TierPricingResult>;
    yearly: Record<PlanTierType, TierPricingResult>;
  };
}

export default function SubscriptionPricingTable({ prices }: SubscriptionPricingTableProps) {
  const [interval, setInterval] = useState<BillingIntervalType>("MONTHLY");
  const [loadingTier, setLoadingTier] = useState<PlanTierType | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const activePrices = interval === "MONTHLY" ? prices.monthly : prices.yearly;

  const handleCheckout = async (tier: PlanTierType) => {
    if (tier === "FREE") {
      window.location.href = "/auth/signin";
      return;
    }

    setLoadingTier(tier);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, interval }),
      });

      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "تعذر بدء عملية الدفع");
      }

      window.location.href = data.url;
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "حدث خطأ غير متوقع أثناء الانتقال لبوابة الدفع");
      setLoadingTier(null);
    }
  };

  return (
    <div className="w-full">
      {/* Interval Toggle Switch */}
      <div className="flex flex-col items-center justify-center mb-12">
        <div
          id="billing-interval-toggle"
          className="inline-flex items-center bg-[#F3EFEA] p-1 rounded-sm border border-neutral-300/80 shadow-2xs"
        >
          <button
            type="button"
            id="interval-monthly-btn"
            onClick={() => setInterval("MONTHLY")}
            className={`px-5 py-2 text-xs font-sans font-bold transition-all duration-150 rounded-xs cursor-pointer ${
              interval === "MONTHLY"
                ? "bg-black text-white shadow-xs"
                : "text-neutral-600 hover:text-black"
            }`}
          >
            الدفع الشهري
          </button>

          <button
            type="button"
            id="interval-yearly-btn"
            onClick={() => setInterval("YEARLY")}
            className={`px-5 py-2 text-xs font-sans font-bold transition-all duration-150 rounded-xs flex items-center gap-2 cursor-pointer ${
              interval === "YEARLY"
                ? "bg-black text-white shadow-xs"
                : "text-neutral-600 hover:text-black"
            }`}
          >
            <span>الدفع السنوي</span>
            <span className="bg-[#C86A00] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-2xs">
              شهران مجاناً
            </span>
          </button>
        </div>

        <p className="text-xs text-neutral-500 font-sans mt-3">
          {interval === "YEARLY"
            ? "الاشتراك السنوي يمنحك توفير شهرين كاملين (سعر 10 أشهر فقط)"
            : "يمكنك التحويل إلى الاشتراك السنوي أو الإلغاء في أي وقت"}
        </p>
      </div>

      {errorMsg && (
        <div className="max-w-md mx-auto mb-8 p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs font-sans rounded-xs text-center">
          {errorMsg}
        </div>
      )}

      {/* 3 Tier Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
        {/* Tier 1: Free Card */}
        <div
          id="tier-card-free"
          className="bg-white border border-neutral-200 p-6 sm:p-8 flex flex-col justify-between rounded-xs shadow-2xs"
        >
          <div>
            <div className="border-b border-neutral-100 pb-5 mb-6">
              <span className="text-[11px] font-mono font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                FREE PASS
              </span>
              <h3 className="text-2xl font-serif font-bold text-black mb-1.5">
                الباقة المجانية
              </h3>
              <p className="text-xs text-neutral-600 font-serif leading-relaxed">
                للاطلاع العام ومتابعة التطورات الاستراتيجية التمهيدية والنشرة الدورية.
              </p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-1.5 font-sans">
                <span className="text-4xl font-serif font-black text-black">
                  {activePrices.FREE.formattedPrice}
                </span>
                <span className="text-xs text-neutral-500 font-sans">/ دائماً</span>
              </div>
              <span className="text-[11px] text-neutral-400 font-sans block mt-1">
                لا تتطلب إدخال بيانات بنكية
              </span>
            </div>

            <div className="space-y-3 pt-2 mb-8">
              <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-neutral-700 block mb-2">
                ما تشتمل عليه الباقة:
              </span>
              <ul className="space-y-2.5 text-xs text-neutral-700 font-serif">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-neutral-700 shrink-0 mt-0.5" />
                  <span>قراءة كافة المقالات المتاحة مجاناً (غير الحصرية).</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-neutral-700 shrink-0 mt-0.5" />
                  <span>تلقي النشرة البريدية الاستراتيجية الدورية.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-neutral-700 shrink-0 mt-0.5" />
                  <span>قراءة مقدمات وخلاصات أوراق التقدير قبل حائط الدفع.</span>
                </li>
                <li className="flex items-start gap-2 text-neutral-400">
                  <X className="w-4 h-4 text-neutral-300 shrink-0 mt-0.5" />
                  <span className="line-through">الدراسات المعمقة وأوراق فقه الواقع الحصرية</span>
                </li>
                <li className="flex items-start gap-2 text-neutral-400">
                  <X className="w-4 h-4 text-neutral-300 shrink-0 mt-0.5" />
                  <span className="line-through">النسخ الصوتية أو ملفات التحميل للطباعة</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-neutral-100 pt-6 mt-auto">
            <Link
              href="/auth/signin"
              id="cta-free-tier"
              className="w-full h-11 border-2 border-neutral-900 hover:bg-neutral-900 hover:text-white text-neutral-900 font-sans font-bold text-xs tracking-wider transition-colors flex items-center justify-center gap-2 rounded-xs"
            >
              <span>إنشاء حساب مجاني</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Tier 2: Standard Card */}
        <div
          id="tier-card-standard"
          className="bg-white border border-neutral-300 p-6 sm:p-8 flex flex-col justify-between rounded-xs shadow-xs relative"
        >
          <div>
            <div className="border-b border-neutral-100 pb-5 mb-6">
              <span className="text-[11px] font-mono font-bold text-neutral-600 uppercase tracking-wider block mb-1">
                STANDARD RESEARCH
              </span>
              <h3 className="text-2xl font-serif font-bold text-black mb-1.5">
                الباقة الشهرية
              </h3>
              <p className="text-xs text-neutral-600 font-serif leading-relaxed">
                وصول استراتيجي كامل وغير مقيد لكافة الأوراق والدراسات عبر الأقسام الثمانية.
              </p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-1.5 font-sans">
                <span className="text-4xl font-serif font-black text-black">
                  {activePrices.STANDARD.formattedPrice}
                </span>
                <span className="text-xs text-neutral-500 font-sans">
                  {interval === "MONTHLY" ? "/ شهرياً" : "/ سنوياً"}
                </span>
              </div>
              <span className="text-[11px] text-neutral-500 font-sans block mt-1">
                {interval === "YEARLY"
                  ? `بما يعادل ${activePrices.STANDARD.monthlyEquivalentFormatted} فقط شهرياً`
                  : "تجديد شهري مرن، إلغاء في أي لحظة"}
              </span>
            </div>

            <div className="space-y-3 pt-2 mb-8">
              <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-neutral-900 block mb-2">
                كل ما تقدمه مِعمار للأبحاث:
              </span>
              <ul className="space-y-2.5 text-xs text-neutral-700 font-serif">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-black shrink-0 mt-0.5" />
                  <span>وصول غير محدود لكافة الأوراق والدراسات عبر الأقسام الثمانية.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-black shrink-0 mt-0.5" />
                  <span>الأرشيف الاستراتيجي الكامل لأوراق تقدير الموقف والتحليلات.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-black shrink-0 mt-0.5" />
                  <span>التحليلات الكاملة لمسار الكتب مع قسم 'الفكرة في زمننا'.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-black shrink-0 mt-0.5" />
                  <span>المشاركة والتعليق في المناقشات الفكرية مع الباحثين.</span>
                </li>
                <li className="flex items-start gap-2 text-neutral-400">
                  <X className="w-4 h-4 text-neutral-300 shrink-0 mt-0.5" />
                  <span className="line-through">التسجيلات الصوتية وملفات PDF الأرشيفية (في باقة بلس)</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-neutral-100 pt-6 mt-auto">
            <button
              type="button"
              id="cta-standard-tier"
              onClick={() => handleCheckout("STANDARD")}
              disabled={loadingTier !== null}
              className="w-full h-11 bg-neutral-900 hover:bg-black text-white font-sans font-bold text-xs tracking-wider transition-colors flex items-center justify-center gap-2 rounded-xs disabled:opacity-50 cursor-pointer shadow-2xs"
            >
              {loadingTier === "STANDARD" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري الانتقال لـ Stripe...</span>
                </>
              ) : (
                <>
                  <span>الاشتراك في الباقة القياسية</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tier 3: Plus Card (Highlighted with Amber) */}
        <div
          id="tier-card-plus"
          className="bg-white border-2 border-black p-6 sm:p-8 flex flex-col justify-between rounded-xs shadow-md relative overflow-hidden ring-2 ring-[#C86A00]/20"
        >
          {/* Top Recommendation Badge */}
          <div className="absolute top-0 left-0 right-0 bg-[#C86A00] text-white py-1 px-4 text-center text-[10px] font-sans font-bold uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            <span>الأكـثـر شـمـولاً وتـفـضـيـلاً</span>
          </div>

          <div className="pt-3">
            <div className="border-b border-neutral-100 pb-5 mb-6">
              <span className="text-[11px] font-mono font-bold text-[#C86A00] uppercase tracking-wider block mb-1">
                ME&apos;MAR PLUS ELITE
              </span>
              <h3 className="text-2xl font-serif font-bold text-black mb-1.5 flex items-center gap-2">
                <span>باقة بلس</span>
                <span className="bg-black text-white text-[10px] font-sans font-bold px-2 py-0.5 rounded-2xs">
                  PLUS
                </span>
              </h3>
              <p className="text-xs text-neutral-600 font-serif leading-relaxed">
                التجربة الاستراتيجية والأرشيفية المتكاملة للباحثين والمؤسسات وصناع القرار.
              </p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-1.5 font-sans">
                <span className="text-4xl font-serif font-black text-black">
                  {activePrices.PLUS.formattedPrice}
                </span>
                <span className="text-xs text-neutral-500 font-sans">
                  {interval === "MONTHLY" ? "/ شهرياً" : "/ سنوياً"}
                </span>
              </div>
              <span className="text-[11px] text-[#C86A00] font-sans font-bold block mt-1">
                {interval === "YEARLY"
                  ? `بما يعادل ${activePrices.PLUS.monthlyEquivalentFormatted} فقط شهرياً (وفر شهرين)`
                  : "تشمل كافة أدوات وميزات بلس المتقدمة"}
              </span>
            </div>

            <div className="space-y-3 pt-2 mb-8">
              <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-black block mb-2">
                مزايا الباقة الشهرية بالإضافة إلى:
              </span>
              <ul className="space-y-2.5 text-xs text-neutral-800 font-serif">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#C86A00] shrink-0 mt-0.5" />
                  <span className="font-semibold text-black">
                    كافة ميزات وصلاحيات الباقة الشهرية (Standard) بالكامل.
                  </span>
                </li>
                <li className="flex items-start gap-2 bg-[#FFFBF2] p-2 border-r-2 border-[#C86A00] rounded-2xs">
                  <Check className="w-4 h-4 text-[#C86A00] shrink-0 mt-0.5" />
                  <span>
                    <strong>[ميزة بلس]</strong> الاستماع للتسجيل الصوتي الاستراتيجي للأوراق (نسخ مسموعة).
                  </span>
                </li>
                <li className="flex items-start gap-2 bg-[#FFFBF2] p-2 border-r-2 border-[#C86A00] rounded-2xs">
                  <Check className="w-4 h-4 text-[#C86A00] shrink-0 mt-0.5" />
                  <span>
                    <strong>[ميزة بلس]</strong> تحميل دراسات مِعمار كملفات PDF مهيأة للأرشفة والمطالعة.
                  </span>
                </li>
                <li className="flex items-start gap-2 bg-[#FFFBF2] p-2 border-r-2 border-[#C86A00] rounded-2xs">
                  <Check className="w-4 h-4 text-[#C86A00] shrink-0 mt-0.5" />
                  <span>
                    <strong>[ميزة بلس]</strong> شارة تمييز خاصة للتعليقات وأولوية الاستعراض مع الباحثين.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#C86A00] shrink-0 mt-0.5" />
                  <span>بث البودكاست الاستراتيجي المشفر عبر خلاصة RSS شخصية مؤمنة.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-neutral-100 pt-6 mt-auto">
            <button
              type="button"
              id="cta-plus-tier"
              onClick={() => handleCheckout("PLUS")}
              disabled={loadingTier !== null}
              className="w-full h-12 bg-[#C86A00] hover:bg-[#A85800] text-white font-sans font-bold text-xs tracking-wider transition-colors flex items-center justify-center gap-2 rounded-xs disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {loadingTier === "PLUS" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري الانتقال لـ Stripe...</span>
                </>
              ) : (
                <>
                  <span>الاشتراك في باقة بلس الشاملة</span>
                  <ArrowLeft className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Security and Terms footnote */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12 pt-8 border-t border-neutral-200/80 text-xs text-neutral-500 font-sans">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#C86A00]" />
          <span>دفع آمن ومشفر بالكامل عبر بوابة Stripe العالمية</span>
        </div>
        <div className="hidden sm:block text-neutral-300">•</div>
        <div>إلغاء الاشتراك متاح بنقرة واحدة من لوحة التحكم في أي وقت</div>
        <div className="hidden sm:block text-neutral-300">•</div>
        <div>تفعيل فوري لكافة الصلاحيات بمجرد إتمام الدفع</div>
      </div>
    </div>
  );
}
