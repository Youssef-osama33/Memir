import React from "react";
import type { Metadata } from "next";
import Navigation from "../../components/navigation";
import Footer from "../../components/footer";
import ContactForm from "../../components/ContactForm";
import { Mail, Shield, MessageSquare, Compass, Send } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "اتصل بنا | مِعمار",
  description: "تواصل مع صاحب منصة مِعمار وفريق التحرير للاستفسارات البحثية، المقترحات الفكرية، أو دعم الاشتراكات.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FCFBF9] text-[#111111] font-sans flex flex-col justify-between selection:bg-black selection:text-white" dir="rtl">
      <Navigation />

      <main className="max-w-3xl mx-auto w-full px-6 py-12 sm:py-16 text-right flex-grow">
        {/* Editorial Header Treatment */}
        <header className="border-b border-neutral-300 pb-8 mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 text-neutral-800 text-[11px] font-sans font-bold uppercase tracking-wider rounded-xs border border-neutral-300 mb-4">
            قنوات الاتصال والتواصل
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-black leading-[1.25] tracking-tight">
            اتصل بنا
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 font-sans leading-relaxed mt-4">
            نرحب بالمراسلات البحثية، المقترحات الفكرية، استفسارات التعاون الأكاديمي، والدعم الفني لمشتركي مِعمار بلس.
          </p>
        </header>

        <div className="space-y-10">
          {/* Main Interactive Contact Form */}
          <section>
            <ContactForm />
          </section>

          {/* Quick Direct Inquiries Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="border border-neutral-300 bg-white p-6 rounded-xs shadow-2xs">
              <div className="w-10 h-10 bg-neutral-100 text-neutral-800 flex items-center justify-center mb-4 border border-neutral-200">
                <Mail className="w-5 h-5 text-[#C86A00]" />
              </div>
              <h3 className="font-serif font-bold text-base text-black mb-1">
                المراسلة المباشرة للإدارة
              </h3>
              <p className="text-xs text-neutral-600 font-sans leading-relaxed mb-4">
                لأي أسئلة أو مراسلات لا تتطلب ملء النموذج، يمكنك التواصل عبر البريد المباشر:
              </p>
              <a
                href="mailto:yossef2319128@gmail.com"
                dir="ltr"
                className="inline-block bg-[#FAF7F0] hover:bg-black hover:text-white transition-colors px-3 py-2 text-xs font-mono font-bold text-neutral-900 border border-[#E8DCC8]"
              >
                yossef2319128@gmail.com
              </a>
            </div>

            <div className="border border-neutral-300 bg-white p-6 rounded-xs shadow-2xs">
              <div className="w-10 h-10 bg-neutral-100 text-neutral-800 flex items-center justify-center mb-4 border border-neutral-200">
                <Shield className="w-5 h-5 text-neutral-700" />
              </div>
              <h3 className="font-serif font-bold text-base text-black mb-1">
                دعم الاشتراكات وStripe
              </h3>
              <p className="text-xs text-neutral-600 font-sans leading-relaxed mb-4">
                لمشتركي مِعمار بلس بخصوص خلاصات الـ RSS المشفرة أو تعديل وتجديد خطط الدفع:
              </p>
              <a
                href="mailto:contact@me-mar.com"
                dir="ltr"
                className="inline-block bg-[#FAF7F0] hover:bg-black hover:text-white transition-colors px-3 py-2 text-xs font-mono font-bold text-neutral-900 border border-[#E8DCC8]"
              >
                contact@me-mar.com
              </a>
            </div>
          </section>

          {/* Editorial Note Card */}
          <div className="border border-neutral-300 bg-[#FAF8F5] p-6 text-neutral-800 font-sans rounded-xs">
            <h3 className="text-xs font-bold text-black uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#C86A00]" />
              <span>ملاحظة حول سياسة النشر</span>
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              كافة الأوراق والتحليلات في مِعمار تُنتج وتُحرر فردياً وبشرياً بنسبة 100% بقلم صاحب المشروع. المنصة لا تقبل المقالات الدعائية أو المحتوى الممول لضمان الحياد والصرامة الفكرية.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
