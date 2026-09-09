"use client";

import React from "react";
import Link from "next/link";
import { Lock, ArrowLeft, User } from "lucide-react";
import { useSession } from "next-auth/react";

interface PaywallProps {
  countryCode?: string;
  pppConfig?: any;
  requiredTier?: "STANDARD" | "PLUS";
  featureTitle?: string;
}

export default function Paywall({ requiredTier = "STANDARD", featureTitle }: PaywallProps) {
  const isPlus = requiredTier === "PLUS";
  const { data: session } = useSession();

  return (
    <div className="relative font-sans text-right" dir="rtl">
      {/* Top Blur Gradient to mask truncated content */}
      <div className="absolute -top-24 left-0 right-0 h-24 bg-gradient-to-t from-[#FCFBF9] to-transparent pointer-events-none" />

      <div className="relative border border-neutral-300 bg-[#FAF9F6] p-8 md:p-10 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="w-9 h-9 bg-neutral-900 text-white flex items-center justify-center rounded-xs">
            <Lock className="w-4 h-4 text-[#C86A00]" />
          </div>
          <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#8C4B00] bg-amber-50 border border-amber-300/60 px-2.5 py-0.5 rounded-2xs">
            {isPlus ? "ميزة حصرية لباقة بلس" : "محتوى مخصص للمشتركين"}
          </span>
        </div>

        <h3 className="text-xl md:text-2xl font-serif font-bold text-neutral-900 mb-2">
          {featureTitle || (isPlus ? "هذه الميزة مخصصة لمشتركي باقة بلس" : "هذا التحليل مخصص للمشتركين")}
        </h3>
        <p className="text-xs text-neutral-600 font-serif leading-relaxed mb-6">
          {isPlus
            ? "للاستماع إلى الإيجاز الصوتي للأوراق، وتحميل الدراسات كملفات PDF مهيأة للأرشفة، والتمتع بأولوية التعليق، يرجى الترقية إلى باقة بلس."
            : "لمتابعة قراءة كامل التحليل الاستراتيجي وقسم 'الفكرة في زمننا' وكافة أوراق التقدير عبر الأقسام الثمانية، يمكنك الاشتراك في مِعمار."}
        </p>

        <div className="space-y-3 pt-2">
          <Link
            href="/subscribe"
            className="w-full py-3.5 bg-neutral-900 hover:bg-black text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 rounded-xs shadow-2xs"
          >
            <span>{session?.user?.isPremium ? "إدارة الاشتراك في باقة بلس" : "استعراض باقات الاشتراك والترقية"}</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>

          {session ? (
            <Link
              href="/dashboard"
              className="w-full py-2.5 border border-neutral-300 hover:border-black text-neutral-800 text-xs font-bold transition-colors flex items-center justify-center gap-2 rounded-xs bg-white"
            >
              <User className="w-3.5 h-3.5 text-[#C86A00]" />
              <span>الذهاب إلى حسابي ولوحة التحكم</span>
            </Link>
          ) : (
            <Link
              href="/auth/signin"
              className="w-full py-2.5 border border-neutral-300 hover:border-black text-neutral-800 text-xs font-bold transition-colors block text-center rounded-xs bg-white"
            >
              مشترك بالفعل؟ تسجيل الدخول
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
