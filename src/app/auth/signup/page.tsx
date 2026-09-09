"use client";

import React, { useState, useEffect, Suspense } from "react";
import { User, Mail, Shield, ArrowLeft, Loader2, Sparkles, CheckCircle2, Lock, Eye, EyeOff, Globe, Phone, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Navigation from "../../../components/navigation";
import Footer from "../../../components/footer";
import GoogleSignInButton from "../../../components/auth/GoogleSignInButton";
import { COUNTRIES, DEFAULT_COUNTRY, type CountryCode } from "../../../lib/countries";
import { authenticateWithCredentials } from "../../../lib/auth-client";

function SignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const { data: session, status } = useSession();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(DEFAULT_COUNTRY);
  const [phoneNumber, setPhoneNumber] = useState("");
  
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
    setError(null);
    setSuccessMsg(null);

    if (!email || !email.trim()) {
      setError("يرجى إدخال عنوان بريد إلكتروني صالح.");
      return;
    }

    if (!password || password.length < 6) {
      setError("يرجى إدخال كلمة مرور لا تقل عن 6 خانات.");
      return;
    }

    if (!phoneNumber || !phoneNumber.trim()) {
      setError("يرجى إدخال رقم هاتف الواتساب لتفعيل حسابك وتلقي الإشعارات.");
      return;
    }

    try {
      setLoading(true);

      // 1. Call Register API Endpoint to create and persist user + phone + country
      const registerRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          email: email.trim().toLowerCase(),
          password,
          dialCode: selectedCountry.dialCode,
          phoneNumber: phoneNumber.trim(),
          country: selectedCountry.name,
        }),
      });

      const registerData = await registerRes.json();

      if (!registerRes.ok || registerData.error) {
        setError(registerData.error || "تعذر إنشاء الحساب. يرجى التحقق من صحة البيانات.");
        setLoading(false);
        return;
      }

      // 2. Establish NextAuth session immediately using robust client authenticator
      const authRes = await authenticateWithCredentials({
        name: name.trim() || email.split("@")[0],
        email: email.trim().toLowerCase(),
        password,
        phoneNumber: registerData.user?.phoneNumber || `${selectedCountry.dialCode}${phoneNumber.trim().replace(/^0+/, "")}`,
        callbackUrl,
      });

      if (!authRes.ok && authRes.error) {
        setError(authRes.error);
        setLoading(false);
        return;
      }

      setSuccessMsg("تم إنشاء وتفعيل حسابك بنجاح! جاري توجيهك إلى منصة مِعمار...");
      setTimeout(() => {
        window.location.href = callbackUrl;
      }, 500);
    } catch (err: any) {
      console.error("[AUTH_SIGNUP_ERROR]", err);
      setError("حدث خطأ أثناء إنشاء الحساب. يرجى مراجعة الاتصال والمحاولة مرة أخرى.");
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center py-10 md:py-14 px-4 sm:px-6 font-sans">
      <div className="w-full max-w-lg bg-white border border-neutral-300 p-7 sm:p-9 shadow-xs relative rounded-xs">
        {/* Architectural amber accent line */}
        <div className="absolute top-0 right-0 left-0 h-1 bg-[#C86A00]" />

        <div className="absolute -top-3.5 right-6 bg-black text-white text-[10px] font-sans px-3 py-1 font-bold tracking-widest uppercase rounded-xs">
          عضوية جديدة
        </div>

        {/* Brand Emblem */}
        <div className="flex justify-center mb-5">
          <div className="w-13 h-13 rounded-full bg-[#FAF7F0] border-2 border-[#C86A00] flex items-center justify-center text-[#8C4B00] shadow-2xs">
            <Sparkles className="w-6 h-6 text-[#C86A00]" />
          </div>
        </div>

        {/* Heading in Amiri Serif */}
        <div className="text-center mb-6 space-y-1.5">
          <h1 className="text-2.5xl sm:text-3.5xl font-serif font-black text-black leading-tight">
            إنشاء حساب في مِعمار
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 font-sans">
            منصة التحليلات الجيوتقنية المعمقة وتقديرات الموقف الاستراتيجية
          </p>
        </div>

        {/* Google Quick Sign-Up */}
        <div className="space-y-4 mb-6">
          <GoogleSignInButton
            text="إنشاء الحساب فوراً عبر Google"
            callbackUrl={callbackUrl}
          />

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-[1px] bg-neutral-200" />
            <span className="text-[11px] font-bold text-neutral-400 font-sans">أو بالتسجيل المباشر</span>
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
          {/* 1. Name Field */}
          <div className="space-y-1">
            <label htmlFor="agent-name-field" className="text-xs font-bold text-neutral-800 flex items-center gap-1.5 justify-start">
              <User className="w-3.5 h-3.5 text-[#C86A00]" />
              <span>الاسم الكامل / الصفة البحثية:</span>
            </label>
            <input
              id="agent-name-field"
              type="text"
              required
              disabled={loading}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="د. محمد السعيد"
              className="w-full px-3.5 py-2.5 text-sm bg-[#FCFBF9] border border-neutral-300 focus:outline-none focus:border-black rounded-xs text-right transition-colors"
            />
          </div>

          {/* 2. Email Field */}
          <div className="space-y-1">
            <label htmlFor="agent-email-field" className="text-xs font-bold text-neutral-800 flex items-center gap-1.5 justify-start">
              <Mail className="w-3.5 h-3.5 text-[#C86A00]" />
              <span>البريد الإلكتروني:</span>
            </label>
            <input
              id="agent-email-field"
              type="email"
              required
              disabled={loading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="researcher@organization.com"
              className="w-full px-3.5 py-2.5 text-sm bg-[#FCFBF9] border border-neutral-300 focus:outline-none focus:border-black rounded-xs text-left font-mono transition-colors"
              dir="ltr"
            />
          </div>

          {/* 3. Password Field */}
          <div className="space-y-1">
            <label htmlFor="agent-password-field" className="text-xs font-bold text-neutral-800 flex items-center gap-1.5 justify-start">
              <Lock className="w-3.5 h-3.5 text-[#C86A00]" />
              <span>كلمة المرور:</span>
            </label>
            <div className="relative">
              <input
                id="agent-password-field"
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                disabled={loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 text-sm bg-[#FCFBF9] border border-neutral-300 focus:outline-none focus:border-black rounded-xs text-left font-mono transition-colors pr-10"
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
            <p className="text-[10px] text-neutral-400">يجب أن تحتوي على 6 خانات على الأقل.</p>
          </div>

          {/* 4. Country Selector */}
          <div className="space-y-1">
            <label htmlFor="agent-country-field" className="text-xs font-bold text-neutral-800 flex items-center gap-1.5 justify-start">
              <Globe className="w-3.5 h-3.5 text-[#C86A00]" />
              <span>الدولة:</span>
            </label>
            <div className="relative">
              <select
                id="agent-country-field"
                disabled={loading}
                value={selectedCountry.code}
                onChange={(e) => {
                  const country = COUNTRIES.find((c) => c.code === e.target.value) || DEFAULT_COUNTRY;
                  setSelectedCountry(country);
                }}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FCFBF9] border border-neutral-300 focus:outline-none focus:border-black rounded-xs text-right appearance-none transition-colors cursor-pointer"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name} ({c.dialCode})
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* 5. Phone Number Field */}
          <div className="space-y-1">
            <label htmlFor="agent-phone-field" className="text-xs font-bold text-neutral-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#C86A00]" />
                <span>رقم هاتف الواتساب:</span>
              </span>
              <span className="text-[10px] text-neutral-400 font-normal">لتلقي التحليلات الجديدة</span>
            </label>
            <div className="flex items-center gap-2" dir="ltr">
              <div className="w-24 px-2.5 py-2.5 bg-[#FAF7F0] border border-neutral-300 rounded-xs text-xs font-mono font-bold text-[#8C4B00] text-center shrink-0 flex items-center justify-center gap-1">
                <span>{selectedCountry.flag}</span>
                <span>{selectedCountry.dialCode}</span>
              </div>
              <input
                id="agent-phone-field"
                type="tel"
                required
                disabled={loading}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder={selectedCountry.placeholder}
                className="flex-1 px-3.5 py-2.5 text-sm bg-[#FCFBF9] border border-neutral-300 focus:outline-none focus:border-black rounded-xs text-left font-mono transition-colors"
              />
            </div>
            <p className="text-[10px] text-neutral-400 text-right">أدخل الرقم بدون الصفر المبدئي وبدون مسافات.</p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            id="signup-submit-btn"
            className="w-full h-12 border-2 border-black bg-black text-white hover:bg-[#FCFBF9] hover:text-black font-extrabold text-xs tracking-wider transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer rounded-xs shadow-2xs mt-4"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin ml-2" />
                <span>جاري إنشاء الحساب والتفعيل...</span>
              </>
            ) : (
              <>
                <span>إنشاء الحساب والبدء فوراً</span>
                <ArrowLeft className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Switch to Sign In */}
        <div className="border-t border-dashed border-neutral-300 pt-4 mt-5 font-sans text-xs text-center space-y-2">
          <p className="text-neutral-600">
            لديك حساب بالفعل؟{" "}
            <Link
              href={`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`}
              className="text-[#C86A00] hover:text-black font-bold underline underline-offset-4 transition-colors inline-flex items-center gap-1"
            >
              <span>تسجيل الدخول</span>
              <Lock className="w-3.5 h-3.5 inline" />
            </Link>
          </p>
          <p className="text-[11px] text-neutral-400">
            بالتسجيل، أنت توافق على شروط الاستخدام وسياسة الخصوصية لمنصة مِعمار.
          </p>
        </div>
      </div>
    </main>
  );
}

export default function SignUpPage() {
  return (
    <div id="me-mar-signup-context" className="min-h-screen bg-[#FCFBF9] text-[#111111] flex flex-col font-sans selection:bg-black selection:text-white" dir="rtl">
      <Navigation />
      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-[#C86A00]" />
        </div>
      }>
        <SignUpContent />
      </Suspense>
      <Footer />
    </div>
  );
}
