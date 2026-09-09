"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Mail, Lock, Shield, ArrowLeft, Loader2, Sparkles, UserPlus, CheckCircle2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Navigation from "../../../components/navigation";
import Footer from "../../../components/footer";
import GoogleSignInButton from "../../../components/auth/GoogleSignInButton";
import { authenticateWithCredentials } from "../../../lib/auth-client";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const { data: session, status } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated" && session) {
      router.replace(callbackUrl);
    }
  }, [status, session, router, callbackUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.trim()) {
      setError("يرجى إدخال عنوان بريد إلكتروني صالح.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccessMsg(null);

      // Perform clean authentication
      const res = await authenticateWithCredentials({
        email: email.trim().toLowerCase(),
        password: password || undefined,
        callbackUrl,
      });

      if (!res.ok && res.error) {
        setError(res.error);
        setLoading(false);
        return;
      }

      setSuccessMsg("تم تسجيل الدخول بنجاح! جاري توجيهك إلى لوحة التحكم...");
      setTimeout(() => {
        window.location.href = callbackUrl;
      }, 500);
    } catch (err: any) {
      console.error("[AUTH_SIGNIN_ERROR]", err);
      setError("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.");
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center py-12 md:py-16 px-4 sm:px-6 font-sans">
      <div className="w-full max-w-lg bg-white border border-neutral-300 p-8 sm:p-10 shadow-xs relative rounded-xs">
        {/* Architectural amber accent line */}
        <div className="absolute top-0 right-0 left-0 h-1 bg-[#C86A00]" />

        <div className="absolute -top-3.5 right-6 bg-black text-white text-[10px] font-sans px-3 py-1 font-bold tracking-widest uppercase rounded-xs">
          تسجيل الدخول
        </div>

        {/* Brand Emblem */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-full bg-[#FAF7F0] border-2 border-[#C86A00] flex items-center justify-center text-[#8C4B00] shadow-2xs">
            <Lock className="w-6 h-6 text-[#C86A00]" />
          </div>
        </div>

        {/* Heading in Amiri Serif */}
        <div className="text-center mb-6 space-y-2">
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-black leading-tight">
            مرحباً بك في مِعمار
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 font-sans">
            منصة التقديرات والتحليلات الجيوتقنية المعمقة
          </p>
        </div>

        {/* Google Sign-in Section */}
        <div className="space-y-4 mb-6">
          <GoogleSignInButton
            text="تسجيل الدخول السريع باستخدام Google"
            callbackUrl={callbackUrl}
          />

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-[1px] bg-neutral-200" />
            <span className="text-[11px] font-bold text-neutral-400 font-sans">أو عبر البريد الإلكتروني</span>
            <div className="flex-1 h-[1px] bg-neutral-200" />
          </div>
        </div>

        {error && (
          <div className="mb-5 p-3.5 border border-red-300 bg-red-50 text-red-900 text-xs font-sans leading-relaxed rounded-xs">
            <strong>تنبيه:</strong> {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-5 p-3.5 border border-emerald-300 bg-emerald-50 text-emerald-900 text-xs font-sans leading-relaxed rounded-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 font-sans text-right">
          <div className="space-y-1.5">
            <label htmlFor="agent-email-field" className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#C86A00]" />
              <span>البريد الإلكتروني:</span>
            </label>
            <div className="relative">
              <input
                id="agent-email-field"
                type="email"
                required
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organization.com"
                className="w-full px-4 py-3 text-sm bg-[#FCFBF9] border border-neutral-300 focus:outline-none focus:border-black rounded-xs text-left font-mono transition-colors"
                dir="ltr"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="agent-password-field" className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#C86A00]" />
              <span>كلمة المرور:</span>
            </label>
            <div className="relative">
              <input
                id="agent-password-field"
                type={showPassword ? "text" : "password"}
                disabled={loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 text-sm bg-[#FCFBF9] border border-neutral-300 focus:outline-none focus:border-black rounded-xs text-left font-mono transition-colors pr-10"
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-neutral-400 hover:text-black transition-colors"
                tabIndex={-1}
                aria-label="تبديل إظهار كلمة المرور"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            id="signin-submit-btn"
            className="w-full h-12 border-2 border-black bg-black text-white hover:bg-[#FCFBF9] hover:text-black font-extrabold text-xs tracking-wider transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer rounded-xs shadow-2xs mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin ml-2" />
                <span>جاري تسجيل الدخول...</span>
              </>
            ) : (
              <>
                <span>تسجيل الدخول والمتابعة</span>
                <ArrowLeft className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Switch to Sign Up */}
        <div className="border-t border-dashed border-neutral-300 pt-5 mt-6 font-sans text-xs text-center space-y-2">
          <p className="text-neutral-600">
            ليس لديك حساب بعد؟{" "}
            <Link
              href={`/auth/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`}
              className="text-[#C86A00] hover:text-black font-bold underline underline-offset-4 transition-colors inline-flex items-center gap-1"
            >
              <span>إنشاء حساب جديد</span>
              <UserPlus className="w-3.5 h-3.5 inline" />
            </Link>
          </p>
          <p className="text-[11px] text-neutral-400">
            بوابة آمنة ومصادقة مشفرة لكافة بيانات الباحثين والمشتركين.
          </p>
        </div>
      </div>
    </main>
  );
}

export default function SignInPage() {
  return (
    <div id="me-mar-signin-context" className="min-h-screen bg-[#FCFBF9] text-[#111111] flex flex-col font-sans selection:bg-black selection:text-white" dir="rtl">
      <Navigation />
      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-[#C86A00]" />
        </div>
      }>
        <SignInContent />
      </Suspense>
      <Footer />
    </div>
  );
}
