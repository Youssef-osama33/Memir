"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Loader2, Sparkles, Mail } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    website_url: "", // Honeypot spam trap
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic client validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setError("يرجى استكمال كافة الحقول المطلوبة.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "تعذر إرسال الرسالة. يرجى المحاولة لاحقاً.");
      }

      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        website_url: "",
      });
    } catch (err: any) {
      console.error("[CONTACT_FORM_SUBMIT_ERR]", err);
      setError(err.message || "حدث خطأ غير متوقع أثناء الإرسال. يرجى المحاولة مجدداً.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-neutral-300 p-6 sm:p-8 relative rounded-xs shadow-xs" dir="rtl">
      {/* Editorial top accent bar */}
      <div className="absolute top-0 right-0 left-0 h-1 bg-[#C86A00]" />

      <div className="flex items-center justify-between border-b border-neutral-200 pb-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-black flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#C86A00]" />
            <span>إرسال رسالة مباشرة</span>
          </h2>
          <p className="text-xs text-neutral-500 font-sans mt-1">
            يصل استفسارك مباشرة لصاحب المنصة مع إمكانية الرد الفوري على بريدك.
          </p>
        </div>
      </div>

      {success && (
        <div className="mb-6 p-4 border border-emerald-300 bg-emerald-50 text-emerald-900 rounded-xs flex items-start gap-3 text-sm font-sans leading-relaxed">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">تم إرسال رسالتك بنجاح، سنتواصل معك قريباً.</p>
            <p className="text-xs text-emerald-800/90">
              شكراً لاهتمامك ومراسلتك لمنصة مِعمار. تم تسليم الرسالة لصندوق بريد الإدارة.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 border border-red-300 bg-red-50 text-red-900 rounded-xs flex items-start gap-2.5 text-xs font-sans leading-relaxed">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <p>
            <strong>تنبيه:</strong> {error}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 font-sans text-right">
        {/* Honeypot Spam Trap (Visually hidden & offscreen) */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="website_url">تجاهل هذا الحقل إذا كنت إنساناً</label>
          <input
            id="website_url"
            name="website_url"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={formData.website_url}
            onChange={handleChange}
          />
        </div>

        {/* Row 1: Name and Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="contact-name" className="block text-xs font-bold text-neutral-800">
              الاسم الكامل <span className="text-[#C86A00]">*</span>
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              disabled={loading}
              value={formData.name}
              onChange={handleChange}
              placeholder="مثال: د. يوسف أسامة"
              className="w-full px-3.5 py-2.5 text-sm bg-[#FCFBF9] border border-neutral-300 focus:outline-none focus:border-black rounded-xs transition-colors placeholder:text-neutral-400"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="contact-email" className="block text-xs font-bold text-neutral-800">
              عنوان البريد الإلكتروني <span className="text-[#C86A00]">*</span>
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              disabled={loading}
              value={formData.email}
              onChange={handleChange}
              placeholder="name@organization.com"
              dir="ltr"
              className="w-full px-3.5 py-2.5 text-sm bg-[#FCFBF9] border border-neutral-300 focus:outline-none focus:border-black rounded-xs transition-colors placeholder:text-neutral-400 text-left font-mono"
            />
          </div>
        </div>

        {/* Subject */}
        <div className="space-y-1.5">
          <label htmlFor="contact-subject" className="block text-xs font-bold text-neutral-800">
            موضوع المراسلة <span className="text-[#C86A00]">*</span>
          </label>
          <input
            id="contact-subject"
            name="subject"
            type="text"
            required
            disabled={loading}
            value={formData.subject}
            onChange={handleChange}
            placeholder="مثال: استفسار بحثي حول ورقة الذكاء الاصطناعي / دعم اشتراك مِعمار بلس"
            className="w-full px-3.5 py-2.5 text-sm bg-[#FCFBF9] border border-neutral-300 focus:outline-none focus:border-black rounded-xs transition-colors placeholder:text-neutral-400"
          />
        </div>

        {/* Message */}
        <div className="space-y-1.5">
          <label htmlFor="contact-message" className="block text-xs font-bold text-neutral-800">
            نص الرسالة <span className="text-[#C86A00]">*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            required
            disabled={loading}
            value={formData.message}
            onChange={handleChange}
            placeholder="تفضل بكتابة تفاصيل استفسارك أو مقترحك هنا..."
            className="w-full px-3.5 py-2.5 text-sm bg-[#FCFBF9] border border-neutral-300 focus:outline-none focus:border-black rounded-xs transition-colors placeholder:text-neutral-400 leading-relaxed"
          />
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-neutral-500 font-sans text-right">
            يتم التعامل مع كافة المراسلات بسرية تامة واهتمام تحليلي دقيق.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto min-w-[180px] h-11 px-6 border-2 border-black bg-black text-white hover:bg-[#FCFBF9] hover:text-black font-sans font-bold text-xs tracking-wider transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer rounded-xs shadow-2xs"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin ml-1" />
                <span>جاري الإرسال...</span>
              </>
            ) : (
              <>
                <span>إرسال الرسالة</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
