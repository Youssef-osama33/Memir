import React from "react";
import type { Metadata } from "next";
import Navigation from "../../components/navigation";
import Footer from "../../components/footer";
import Link from "next/link";
import { Scale, AlertTriangle, ArrowLeft, ShieldAlert } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "الشروط والأحكام | مِعمار",
  description: "اتفاقية الاستخدام والشروط التعاقدية لاشتراكات منصة مِعمار للتحليلات الاستراتيجية.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FCFBF9] text-[#111111] font-sans flex flex-col justify-between selection:bg-black selection:text-white" dir="rtl">
      <Navigation />

      <main className="max-w-3xl mx-auto w-full px-6 py-12 sm:py-16 text-right flex-grow">
        {/* Editorial Header Treatment */}
        <header className="border-b border-neutral-300 pb-8 mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 text-neutral-800 text-[11px] font-sans font-bold uppercase tracking-wider rounded-xs border border-neutral-300 mb-4">
            الوثائق التعاقدية والاشتراك
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-black leading-[1.25] tracking-tight">
            الشروط والأحكام
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 font-sans mt-3">
            اتفاقية استخدام منصة مِعمار والاشتراك في عضوية مِعمار بلس (Me'mar Plus)
          </p>
        </header>

        {/* Legal Disclaimer / Placeholder Warning */}
        <div className="mb-10 p-4 bg-amber-50 border border-amber-300 rounded-xs flex items-start gap-3 text-xs text-amber-950 font-sans leading-relaxed">
          <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">
              تنبيه قانوني (نص تمهيدي مسودة):
            </p>
            <p className="text-amber-900">
              يُرجى استبدال هذا النص بالصياغة القانونية النهائية المعتمدة من قِبل مستشارك القانوني قبل الإطلاق التجاري الكامل. لا يُعتبر هذا النص استشارة قانونية رسمية أو عقداً نهائياً ملزماً.
            </p>
          </div>
        </div>

        {/* Numbered Sections with Headers */}
        <div className="space-y-10 text-neutral-800 text-[15px] sm:text-[16px] leading-[1.85]">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-black flex items-center gap-2">
              <span className="text-[#C86A00] font-mono text-lg">1.</span>
              <span>قبول الشروط وأهلية الاستخدام</span>
            </h2>
            <div className="space-y-2 text-neutral-700">
              <p>
                [نص تمهيدي - يُرجى استبداله بالصياغة القانونية النهائية]: إن وصولك إلى موقع <strong>مِعمار</strong> أو اشتراكك في عضويتها يُمثل إقراراً منك بالاطلاع والموافقة الكاملة على هذه الشروط والأحكام. إذا كنت لا توافق على هذه البنود، يرجى التوقف عن استخدام المنصة.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-black flex items-center gap-2">
              <span className="text-[#C86A00] font-mono text-lg">2.</span>
              <span>الملكية الفكرية وحظر إعادة النشر التجاري</span>
            </h2>
            <div className="space-y-2 text-neutral-700">
              <p>
                [نص تمهيدي - يُرجى استبداله بالصياغة القانونية النهائية]: كافة الدراسات، أوراق تقدير الموقف، المقالات، والمحتويات الصوتية المنشورة على مِعمار هي ملكية فكرية حصرية لصاحب المشروع ومحمية بموجب القوانين الوطنية والمعاهدات الدولية لحق المؤلف.
              </p>
              <p>
                [نص تمهيدي]: يُسمح بالاقتباس الأكاديمي والبحثي المحدود بشرط الإشارة الصريحة إلى المنصة ورابط الورقة الأصلية. يُحظر تماماً تفريغ النصوص، أو إعادة نشر الأوراق الكاملة، أو تدريب نماذج الذكاء الاصطناعي على محتوى المنصة دون إذن خطي مسبق.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-black flex items-center gap-2">
              <span className="text-[#C86A00] font-mono text-lg">3.</span>
              <span>سياسة الاشتراكات، التجديد التلقائي، والإلغاء</span>
            </h2>
            <div className="space-y-2 text-neutral-700">
              <p>
                [نص تمهيدي - يُرجى استبداله بالصياغة القانونية النهائية]: تُقدم العضوية المميزة بنموذج اشتراك دوري (شهري أو سنوي) يتجدد تلقائياً عند حلول تاريخ الاستحقاق عبر بوابة الدفع Stripe ما لم يقم المشترك بإيقاف التجديد من لوحة التحكم قبل موعد الفاتورة.
              </p>
              <p>
                [نص تمهيدي]: عند الإلغاء، يظل حساب المشترك متمتعاً بكافة مزايا العضوية حتى نهاية الدورة المحاسبية الحالية دون فرض أي رسوم إضافية.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-black flex items-center gap-2">
              <span className="text-[#C86A00] font-mono text-lg">4.</span>
              <span>عدالة التسعير وتكافؤ القوة الشرائية (PPP)</span>
            </h2>
            <div className="space-y-2 text-neutral-700">
              <p>
                [نص تمهيدي - يُرجى استبداله بالصياغة القانونية النهائية]: قُدمت تخفيضات تكافؤ القوة الشرائية (PPP) بحسن نية لمساندة الباحثين في الدول النامية. يحظر استخدام شبكات VPN أو البيانات المزيفة للحصول على تسعير دولة لا يقيم فيها المشترك فعلياً. تحتفظ المنصة بحق إلغاء أي اشتراك مخالف لهذه القاعدة دون استرداد.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-black flex items-center gap-2">
              <span className="text-[#C86A00] font-mono text-lg">5.</span>
              <span>إخلاء المسؤولية التحليلية</span>
            </h2>
            <div className="space-y-2 text-neutral-700">
              <p>
                [نص تمهيدي - يُرجى استبداله بالصياغة القانونية النهائية]: إن كافة الآراء والتحليلات الجيوتقنية والاستراتيجية المنشورة في مِعمار هي لأغراض إعلامية، معرفية، وبحثية بحتة، ولا تمثل بأي حال من الأحوال توصيات استثمارية، مالية، أو استشارات أمنية رسمية ملزمة.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-black flex items-center gap-2">
              <span className="text-[#C86A00] font-mono text-lg">6.</span>
              <span>الإنهاء وتسوية النزاعات</span>
            </h2>
            <div className="space-y-2 text-neutral-700">
              <p>
                [نص تمهيدي - يُرجى استبداله بالصياغة القانونية النهائية]: تحتفظ المنصة بالحق في تعليق أو إنهاء وصول أي مستخدم ينتهك هذه الشروط أو يسيء استخدام خدمات المنصة وخلاصاتها المشفرة.
              </p>
            </div>
          </section>
        </div>

        {/* Navigation / Contact Footer */}
        <div className="mt-14 pt-6 border-t border-neutral-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-sans">
          <Link
            href="/privacy"
            className="font-bold text-neutral-900 hover:text-[#C86A00] flex items-center gap-1.5 transition-colors"
          >
            <span>الانتقال إلى سياسة الخصوصية</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <Link
            href="/contact"
            className="text-neutral-500 hover:text-black underline transition-colors"
          >
            للاستفسارات التعاقدية والتراخيص الأكاديمية
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
