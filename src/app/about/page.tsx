import React from "react";
import type { Metadata } from "next";
import Navigation from "../../components/navigation";
import Footer from "../../components/footer";
import Link from "next/link";
import { ArrowLeft, Edit3, Shield, Cpu, BookOpen, Layers, Sparkles, CheckCircle2 } from "lucide-react";
import { CATEGORIES } from "../../lib/categories";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "من نحن | مِعمار",
  description: "مشروع تحليلي استراتيجي مستقل عند تقاطع الجيوبوليتكس، الذكاء الاصطناعي، البنى التحتية الحيوية، وفقه الواقع المعاصر.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FCFBF9] text-[#111111] font-sans flex flex-col justify-between selection:bg-black selection:text-white" dir="rtl">
      <Navigation />

      <main className="max-w-3xl mx-auto w-full px-6 py-12 sm:py-16 text-right flex-grow">
        {/* Editorial Header Treatment */}
        <header className="border-b border-neutral-300 pb-8 mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 text-neutral-800 text-[11px] font-sans font-bold uppercase tracking-wider rounded-xs border border-neutral-300 mb-4">
            عن المنصة والرؤية
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-black leading-[1.25] tracking-tight">
            من نحن: مِعمار
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 font-sans leading-relaxed mt-4">
            مشروع تحليلي مستقل عند تقاطع الجيوبوليتكس، الذكاء الاصطناعي، البنى التحتية الحيوية، وفقه الواقع المعاصر.
          </p>
        </header>

        {/* Editable Notice for the Platform Owner */}
        <div className="mb-10 p-3.5 bg-[#FAF7F0] border border-[#E8DCC8] rounded-xs flex items-start gap-2.5 text-xs text-[#8C4B00] font-sans">
          <Edit3 className="w-4 h-4 text-[#C86A00] flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>ملاحظة للمحرر:</strong> النصوص الواردة أدناه تمثل مسودة تمهيدية منسقة لهيكل ورسالة المنصة (التحليل الاستراتيجي المستقل، المحتوى البشري 100%، والهيكل ثماني الأبعاد)، وهي مُعدة للتعديل والصياغة التحريرية النهائية المباشرة من قِبلك.
          </p>
        </div>

        {/* Body Copy in Comfortable Reading Width */}
        <div className="space-y-10 text-neutral-800 text-[15px] sm:text-[16px] leading-[1.85]">
          {/* Section 1: Mission */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-black">
              1. الرسالة والغاية الاستراتيجية
            </h2>
            <div className="space-y-3 text-neutral-700">
              <p>
                [نص تمهيدي قابل للتحرير]: تأسست <strong>مِعمار</strong> كمنصة أبحاث وتقديرات موقف مستقلة باللغة العربية، تهدف إلى تجاوز التغطيات الإخبارية السطحية وسبر أغوار التحولات البنيوية الكبرى التي تشكل موازين القوة الدولية.
              </p>
              <p>
                [نص تمهيدي قابل للتحرير]: نركز على دراسة التشابك العضوي بين سلاسل توريد التقنيات المتقدمة، صراع الرقائق والسيادة الحسابية، وأمن الممرات البحرية لكابلات الاتصالات، وصولاً إلى أبعاد الردع السيبراني والكمي بين القوى العظمى.
              </p>
            </div>
          </section>

          {/* Section 2: 100% Human-written Content Commitment */}
          <section className="bg-white border-2 border-neutral-900 p-6 rounded-xs relative">
            <div className="absolute -top-3 right-5 bg-black text-white text-[10px] font-mono px-2.5 py-0.5 font-bold uppercase tracking-wider">
              ميثاق الأصالة الفكرية
            </div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-black mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#C86A00]" />
              <span>2. ميثاق الكتابة البشرية 100% (دون توليد آلي)</span>
            </h2>
            <div className="space-y-2 text-xs sm:text-sm text-neutral-700 leading-relaxed font-sans">
              <p>
                [نص تمهيدي قابل للتحرير]: تلتزم منصة مِعمار التزاماً قطعياً بأن كافة المقالات، أوراق السياسات، المراجعات، والتسجيلات الصوتية المنشورة هي نتاج جهد فكري وبحثي بشري 100%، يكتبه ويحرره صاحب المشروع.
              </p>
              <p>
                [نص تمهيدي قابل للتحرير]: نحن نرفض اعتماد النصوص الموّلدة بالذكاء الاصطناعي أو الترجمات الآلية السطحية، إيماناً بأن التحليل الاستراتيجي الأصيل يتطلب بصيرة نقدية، ومعايشة تاريخية، وفهماً عميقاً لسياقات الواقع الإقليمي والدولي لا تملكها الخوارزميات.
              </p>
            </div>
          </section>

          {/* Section 3: The 8-Category Analytical Framework */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-black">
              3. الهيكل التحليلي ثماني الأبعاد
            </h2>
            <p className="text-neutral-700">
              [نص تمهيدي قابل للتحرير]: تنتظم تحليلات ودراسات مِعمار وفق شبكة موضوعية تتألف من سبعة أقسام عمودية متخصصة ومسار أفقي مستمر لمراجعات الكتب:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {CATEGORIES.map((cat, idx) => (
                <div
                  key={cat.id}
                  className={`p-4 border rounded-xs ${
                    cat.isHorizontal
                      ? "bg-[#FAF7F0] border-[#E8DCC8] sm:col-span-2"
                      : "bg-white border-neutral-200"
                  }`}
                >
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="font-serif font-bold text-sm text-black">
                      {idx + 1}. {cat.title}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400" dir="ltr">
                      {cat.titleEn}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 font-sans leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4: Purchasing Power Parity (PPP) */}
          <section className="space-y-3 pt-2">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-black">
              4. عدالة المعرفة وتكافؤ القوة الشرائية (PPP)
            </h2>
            <p className="text-neutral-700">
              [نص تمهيدي قابل للتحرير]: إيماناً بأن المعرفة الاستراتيجية حق للباحث العربي أينما كان، توفر المنصة اشتراكات مِعمار بلس بأسعار متكافئة تراعي تباين القوة الشرائية في الدول النامية بتخفيضات تصل إلى 66%، لتمكين الطلاب والباحثين من النفاذ لكافة المحتويات والخلاصات الصوتية المشفرة.
            </p>
          </section>
        </div>

        {/* Footer Navigation CTA */}
        <div className="mt-14 pt-6 border-t border-neutral-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-sans">
          <Link
            href="/subscribe"
            className="font-bold text-neutral-900 hover:text-[#C86A00] flex items-center gap-1.5 transition-colors"
          >
            <span>استعراض باقات الاشتراك ونظام الـ PPP</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <Link
            href="/contact"
            className="text-neutral-500 hover:text-black underline transition-colors"
          >
            تواصل مع صاحب المنصة وفريق التحرير
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
