"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { Mail, Lock, Shield, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || email.trim() === "") return;

    try {
      setLoading(true);
      setError(null);
      const result = await signIn("email", {
        email: email.trim(),
        callbackUrl: "/dashboard",
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      // Smooth transition to verify page
      window.location.href = `/auth/verify?email=${encodeURIComponent(email.trim())}`;
    } catch (err: any) {
      console.error("[AUTH_SIGNIN_FAIL]", err);
      setError(err.message || "تعذر إرسال رابط الدخول. يرجى التأكد من صحة البريد والمحاولة مرة أخرى.");
      setLoading(false);
    }
  };

  return (
    <div id="me-mar-signin-context" className="min-h-[80vh] flex items-center justify-center bg-[#FCFBF9] text-[#111111] font-serif py-12 px-6 text-right select-none" dir="rtl">
      <div className="w-full max-w-md bg-white border-2 border-black p-8 shadow-md relative">
        <div className="absolute -top-3.5 right-6 bg-[#111111] text-white text-[9px] font-sans px-3 py-1 font-bold tracking-widest uppercase">
          بوابة المصادقة المشفرة
        </div>

        {/* Brand Emblem */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 border border-black bg-black text-white flex items-center justify-center">
            <Lock className="w-5 h-5 text-amber-400" />
          </div>
        </div>

        <h1 className="text-2xl font-sans font-bold text-center text-black mb-2">
          تسجيل الدخول / إنشاء حساب
        </h1>
        <p className="text-xs text-neutral-500 font-sans text-center mb-6 font-mono leading-relaxed">
          أدخل بريدك الإلكتروني لتلقي رابط الدخول المباشر (Magic Link) دون الحاجة لكلمة مرور
        </p>

        {error && (
          <div className="mb-6 p-3 border border-red-400 bg-red-50 text-red-900 text-xs font-sans leading-relaxed">
            <strong>تنبيه:</strong> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 font-sans">
          <div className="space-y-1.5">
            <label htmlFor="agent-email-field" className="text-xs font-bold text-neutral-700 block">
              عنوان البريد الإلكتروني:
            </label>
            <div className="relative">
              <input
                id="agent-email-field"
                type="email"
                required
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-3 text-sm bg-[#FCFBF9] border border-neutral-300 focus:outline-none focus:border-black text-left font-mono"
                dir="ltr"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 border-2 border-black bg-black text-white hover:bg-[#FCFBF9] hover:text-black font-extrabold text-xs tracking-widest transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin ml-2" />
                <span>جاري إرسال رابط الدخول...</span>
              </>
            ) : (
              <>
                <span>إرسال رابط الدخول الآمن</span>
                <ArrowLeft className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="border-t border-dashed border-neutral-300 pt-6 mt-8 font-sans text-[11px] text-neutral-500 leading-normal text-center">
          يتم تسجيل المستخدمين الجدد تلقائياً فور تأكيد الرابط المشفر.
        </div>
      </div>
    </div>
  );
}
