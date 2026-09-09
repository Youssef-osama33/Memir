"use client";

import React, { useState } from "react";
import { MessageSquare, ArrowLeft, Loader2, ShieldCheck, CheckCircle2, ChevronDown, Sparkles } from "lucide-react";
import { COUNTRIES, DEFAULT_COUNTRY, type CountryCode } from "../../../lib/countries";

interface CompleteProfileFormProps {
  initialName?: string;
  userEmail: string;
}

export default function CompleteProfileForm({ initialName = "", userEmail }: CompleteProfileFormProps) {
  const [name, setName] = useState(initialName);
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(DEFAULT_COUNTRY);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || !phoneNumber.trim()) {
      setError("يرجى إدخال رقم هاتف واتساب للمتابعة.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/user/complete-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          dialCode: selectedCountry.dialCode,
          phoneNumber: phoneNumber.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || "تعذر حفظ بيانات الملف الشخصي. يرجى التحقق من الرقم.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      // Brief feedback before navigating to dashboard
      setTimeout(() => {
        window.location.href = data.redirect || "/dashboard";
      }, 700);
    } catch (err: any) {
      console.error("[COMPLETE_PROFILE_SUBMIT_ERR]", err);
      setError("حدث خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg bg-white border border-neutral-300 p-8 sm:p-10 shadow-xs relative rounded-xs" dir="rtl">
      {/* Signature Amber Accent */}
      <div className="absolute top-0 right-0 left-0 h-1 bg-[#C86A00]" />

      <div className="absolute -top-3.5 right-6 bg-black text-white text-[10px] font-sans px-3 py-1 font-bold tracking-widest uppercase rounded-xs">
        إكمال الملف الشخصي
      </div>

      {/* WhatsApp & Brand Emblem */}
      <div className="flex items-center justify-center mb-6">
        <div className="w-14 h-14 rounded-full bg-[#FAF7F0] border-2 border-[#C86A00] flex items-center justify-center text-[#8C4B00] shadow-2xs">
          <MessageSquare className="w-7 h-7 text-[#C86A00]" />
        </div>
      </div>

      <div className="text-center mb-8 space-y-2">
        <h1 className="text-2xl sm:text-3xl font-serif font-black text-black leading-tight">
          أكمل ملفك الشخصي
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 font-sans leading-relaxed max-w-md mx-auto">
          خطوة واحدة تفصلك عن الوصول الكامل للتحليلات الاستراتيجية وخلاصات النشر المباشرة.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3.5 border border-red-300 bg-red-50 text-red-900 text-xs font-sans leading-relaxed rounded-xs">
          <strong>تنبيه:</strong> {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-3.5 border border-emerald-300 bg-emerald-50 text-emerald-900 text-xs font-sans leading-relaxed rounded-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>تم حفظ ملفك بنجاح! جاري التوجيه إلى لوحة التحكم...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 font-sans">
        {/* Email read-only badge */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-600 block">
            الحساب المعتمد:
          </label>
          <div className="px-3.5 py-2.5 bg-[#FAF9F6] border border-neutral-200 text-xs font-mono text-neutral-700 rounded-xs flex items-center justify-between" dir="ltr">
            <span className="truncate">{userEmail}</span>
            <span className="text-[10px] font-sans font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-xs ml-2">
              مُفعّل وموثّق
            </span>
          </div>
        </div>

        {/* Full Name field */}
        <div className="space-y-1.5">
          <label htmlFor="agent-name-field" className="text-xs font-bold text-neutral-800 block">
            الاسم الكامل أو الصفة البحثية <span className="text-neutral-400 font-normal">(اختياري)</span>:
          </label>
          <input
            id="agent-name-field"
            type="text"
            disabled={loading || success}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="مثال: د. يوسف أسامة / باحث مستقل"
            className="w-full px-4 py-3 text-sm bg-[#FCFBF9] border border-neutral-300 focus:outline-none focus:border-black rounded-xs transition-colors"
          />
        </div>

        {/* WhatsApp Phone Number with Country Selector */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="agent-phone-field" className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
              <span>رقم هاتف واتساب</span>
              <span className="text-[#C86A00] font-black">*</span>
            </label>
            <span className="text-[10px] font-mono text-[#8C4B00] bg-[#FAF7F0] border border-[#E8DCC8] px-2 py-0.5 rounded-xs font-bold">
              لإشعارات النشر عبر واتساب
            </span>
          </div>

          <div className="flex items-stretch gap-2">
            {/* Country Selector */}
            <div className="relative w-44 flex-shrink-0">
              <select
                aria-label="اختر رمز الدولة"
                value={selectedCountry.code}
                onChange={(e) => {
                  const found = COUNTRIES.find((c) => c.code === e.target.value);
                  if (found) setSelectedCountry(found);
                }}
                disabled={loading || success}
                className="w-full h-full appearance-none bg-[#FCFBF9] border border-neutral-300 hover:border-black focus:outline-none focus:border-black px-3 py-2.5 text-xs font-sans rounded-xs cursor-pointer pr-3 pl-8 text-right"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.dialCode} ({c.name})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2 text-neutral-500">
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Phone Number Input */}
            <div className="relative flex-1">
              <input
                id="agent-phone-field"
                type="tel"
                required
                disabled={loading || success}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder={selectedCountry.placeholder}
                className="w-full h-full px-4 py-3 text-sm bg-[#FCFBF9] border border-neutral-300 focus:outline-none focus:border-black text-left font-mono rounded-xs transition-colors"
                dir="ltr"
              />
            </div>
          </div>

          {/* Context Explainer / Trust Guarantee */}
          <div className="p-3 bg-[#FAF7F0] border border-[#E8DCC8] text-[11px] text-[#8C4B00] font-sans rounded-xs leading-relaxed space-y-1">
            <div className="font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#C86A00]" />
              <span>لماذا نطلب رقم واتساب؟</span>
            </div>
            <p className="text-neutral-600">
              نرسل تنبيهات موجزة بتقديرات الموقف العاجلة وأوراق التحليل الجيوتقني الحصرية فور نشرها مباشرة على هاتفك دون أي رسائل دعائية.
            </p>
          </div>
        </div>

        {/* Submit CTA */}
        <button
          type="submit"
          disabled={loading || success}
          className="w-full h-12 border-2 border-black bg-black text-white hover:bg-[#FCFBF9] hover:text-black font-extrabold text-xs tracking-wider transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer rounded-xs shadow-2xs"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin ml-2" />
              <span>جاري حفظ الملف الشخصي...</span>
            </>
          ) : (
            <>
              <span>حفظ ومتابعة إلى لوحة التحكم</span>
              <ArrowLeft className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Security Reassurance */}
      <div className="border-t border-dashed border-neutral-300 pt-5 mt-6 font-sans text-[11px] text-neutral-500 leading-normal text-center flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
        <span>المصادقة الأمنية تظل حصرية عبر البريد الإلكتروني ورابط الدخول المشفر.</span>
      </div>
    </div>
  );
}
