"use client";

import { useState } from "react";
import { Mail, Check } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === "loading") return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      if (!res.ok) throw new Error();
      
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="bg-neutral-50 rounded-xl p-8 my-12 border border-neutral-200 text-center" dir="rtl">
      <div className="mx-auto bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center text-amber-800 mb-4">
        <Mail size={24} />
      </div>
      <h3 className="font-serif text-2xl font-bold text-neutral-900 mb-2">النشرة البريدية</h3>
      <p className="text-neutral-600 font-sans text-sm mb-6 max-w-md mx-auto">
        اشترك للحصول على أحدث التحليلات الاستراتيجية والمقالات الحصرية مباشرة في بريدك الإلكتروني.
      </p>
      
      {status === "success" ? (
        <div className="flex items-center justify-center gap-2 text-green-700 bg-green-50 p-3 rounded-lg border border-green-200 max-w-md mx-auto">
          <Check size={18} />
          <span className="font-sans text-sm font-bold">تم التسجيل بنجاح! شكراً لك.</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="بريدك الإلكتروني"
            className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-800 font-sans text-sm text-left"
            dir="ltr"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-neutral-900 hover:bg-black text-white px-6 py-3 rounded-lg font-sans font-bold text-sm transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {status === "loading" ? "جاري التسجيل..." : "اشتراك"}
          </button>
        </form>
      )}
      {status === "error" && (
        <p className="text-red-600 text-xs mt-2 font-sans">حدث خطأ، يرجى المحاولة مرة أخرى أو التأكد من عدم تسجيلك مسبقاً.</p>
      )}
    </div>
  );
}
