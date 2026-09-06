"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Mail, ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";

function VerifyContent() {
  const searchParams = useSearchParams();
  const email = searchParams?.get("email") || "بريدك الإلكتروني";

  return (
    <div className="w-full max-w-md bg-white border-2 border-black p-8 shadow-md relative" dir="rtl">
      <div className="absolute -top-3.5 right-6 bg-emerald-700 text-white text-[9px] font-sans px-3 py-1 font-bold tracking-widest uppercase">
        تم إرسال الرابط الآمن
      </div>

      <div className="flex justify-center mb-6">
        <div className="w-14 h-14 border border-black bg-emerald-50 text-emerald-800 flex items-center justify-center">
          <Mail className="w-6 h-6 text-emerald-700" />
        </div>
      </div>

      <h1 className="text-2xl font-sans font-bold text-center text-black mb-3">
        تفقد صندوق بريدك
      </h1>

      <p className="text-xs text-neutral-500 font-sans text-center mb-6 uppercase tracking-wider font-mono">
        WAITING FOR MAGIC LINK VERIFICATION
      </p>

      <div className="space-y-4 font-serif text-sm leading-relaxed text-neutral-700 text-right mb-8">
        <p>
          لقد أرسلنا رابط تسجيل دخول مشفر بصلاحية محدودة إلى:
        </p>
        <p className="font-mono font-bold bg-[#FAF9F6] border border-neutral-300 p-2.5 text-center text-xs text-black break-all select-all" dir="ltr">
          {email}
        </p>
        <p className="text-xs text-neutral-500 leading-normal">
          اضغط على الرابط الموجود في الرسالة وسيتم توجيهك فوراً وبشكل آمن إلى لوحة التحكم الخاصة بك. إذا لم تجد الرسالة في صندوق الوارد، يرجى تفقد مجلد الرسائل غير المرغوب فيها (Spam).
        </p>
      </div>

      <div className="border-t border-dashed border-neutral-300 pt-6 space-y-3 font-sans text-xs">
        <Link
          href="/auth/signin"
          className="w-full h-10 border border-neutral-300 bg-neutral-50 hover:bg-neutral-100 text-neutral-800 font-bold transition-all flex items-center justify-center gap-1.5"
        >
          <span>تغيير البريد الإلكتروني</span>
        </Link>
        <Link
          href="/"
          className="w-full h-10 border border-black bg-black text-white hover:bg-neutral-800 font-bold transition-all flex items-center justify-center gap-2"
        >
          <span>العودة إلى الصفحة الرئيسية</span>
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export default function VerifyRequestPage() {
  return (
    <div id="me-mar-verify-context" className="min-h-[80vh] flex items-center justify-center bg-[#FCFBF9] text-[#111111] font-serif py-12 px-6 text-right">
      <Suspense fallback={
        <div className="text-xs font-mono text-neutral-500 animate-pulse">
          جاري التحقق من معطيات المصادقة...
        </div>
      }>
        <VerifyContent />
      </Suspense>
    </div>
  );
}
