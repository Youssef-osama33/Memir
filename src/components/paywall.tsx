"use client";

import React from "react";
import Link from "next/link";
import { Lock, ArrowLeft } from "lucide-react";

interface PaywallProps {
  countryCode?: string;
  pppConfig?: any;
}

export default function Paywall({}: PaywallProps) {
  return (
    <div className="relative font-sans text-right" dir="rtl">
      {/* Top Blur Gradient to mask truncated content */}
      <div className="absolute -top-24 left-0 right-0 h-24 bg-gradient-to-t from-[#FCFBF9] to-transparent pointer-events-none" />

      <div className="relative border border-neutral-300 bg-[#FAF9F6] p-8 md:p-10 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="w-9 h-9 bg-neutral-900 text-white flex items-center justify-center rounded-xs">
            <Lock className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-amber-900 bg-amber-500/15 border border-amber-600/20 px-2 py-0.5 rounded-2xs">
            محتوى مخصص للمشتركين
          </span>
        </div>

        <h3 className="text-xl md:text-2xl font-serif font-bold text-neutral-900 mb-2">
          هذا التحليل مخصص لأعضاء مِعمار بلس
        </h3>
        <p className="text-xs text-neutral-600 font-serif leading-relaxed mb-6">
          لمتابعة قراءة كامل التحليل وقسم 'الفكرة في زمننا' والاستماع للإيجازات الصوتية الخاصة عبر خلاصة RSS، يمكنك الانضمام إلى عضوية مِعمار بلس.
        </p>

        <div className="space-y-3 pt-2">
          <Link
            href="/subscribe"
            className="w-full py-3.5 bg-neutral-900 hover:bg-black text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 rounded-xs shadow-2xs"
          >
            <span>الانتقال لصفحة الاشتراك</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <Link
            href="/auth/signin"
            className="w-full py-2.5 border border-neutral-300 hover:border-black text-neutral-800 text-xs font-bold transition-colors block text-center rounded-xs"
          >
            مشترك بالفعل؟ تسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
}
