import React from "react";
import type { Metadata } from "next";
import Navigation from "../../components/navigation";
import Footer from "../../components/footer";
import Link from "next/link";
import { ShieldCheck, Lock, EyeOff, AlertTriangle, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "سياسة الخصوصية | مِعمار",
  description: "سياسة الخصوصية وحماية البيانات لمشتركي وزوار منصة مِعمار للتحليلات الاستراتيجية.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FCFBF9] text-[#111111] font-sans flex flex-col justify-between selection:bg-black selection:text-white" dir="rtl">
      <Navigation />

      <main className="max-w-3xl mx-auto w-full px-6 py-12 sm:py-16 text-right flex-grow">
        {/* Editorial Header Treatment */}
        <header className="border-b border-neutral-300 pb-8 mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 text-neutral-800 text-[11px] font-sans font-bold uppercase tracking-wider rounded-xs border border-neutral-300 mb-4">
            الوثائق القانونية والخصوصية
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-black leading-[1.25] tracking-tight">
            سياسة الخصوصية وحماية البيانات
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 font-sans mt-3">
            تاريخ السريان المبدئي: يونيو 2026 • معايير حماية البيانات الشخصية والأمن السيبراني
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
              يُرجى استبدال هذا النص بالصياغة القانونية النهائية المعتمدة من قِبل مستشارك القانوني قبل الإطلاق التجاري الكامل. لا يُعتبر هذا النص استشارة قانونية رسمية أو صياغة نهائية ملزمة.
            </p>
          </div>
        </div>

        {/* Numbered Sections with Headers */}
        <div className="space-y-10 text-neutral-800 text-[15px] sm:text-[16px] leading-[1.85]">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-black flex items-center gap-2">
              <span className="text-[#C86A00] font-mono text-lg">1.</span>
              <span>مبادئ الخصوصية الأساسية والحياد الرقمي</span>
            </h2>
            <div className="space-y-2 text-neutral-700">
              <p>
                [نص تمهيدي - يُرجى استبداله بالصياغة القانونية النهائية]: تلتزم منصة <strong>مِعمار</strong> بحماية خصوصية قرائها بأعلى المعايير الأخلاقية والتقنية. نحن لا نبيع أو نؤجر أو نشارك أي بيانات شخصية مع شبكات إعلانية أو أطراف ثالثة تجارية.
              </p>
              <p>
                [نص تمهيدي]: ترفض المنصة استخدام أدوات التتبع السلوكي الغازية، وتقتصر ملفات تعريف الارتباط على الجلسات الضرورية للمصادقة وتأمين الحسابات.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-black flex items-center gap-2">
              <span className="text-[#C86A00] font-mono text-lg">2.</span>
              <span>البيانات المجمعة وأوجه استخدامها المحددة</span>
            </h2>
            <p className="text-neutral-700">
              [نص تمهيدي - يُرجى استبداله بالصياغة القانونية النهائية]: نجمع الحد الأدنى الضروري من البيانات لتشغيل حساب المشترك وتقديم الخدمة:
            </p>
            <ul className="space-y-2.5 pr-4 border-r-2 border-neutral-200 text-sm text-neutral-700">
              <li>
                <strong>عنوان البريد الإلكتروني:</strong> لإرسال روابط التحقق السحرية (Magic Links) وإشعارات النشر الأساسية دون كلمات مرور معقدة.
              </li>
              <li>
                <strong>رقم هاتف واتساب (اختياري / لإشعارات النشر):</strong> لإرسال تنبيهات صدور التقديرات الحصرية مباشرة دون أي رسائل دعائية أو تسويقية.
              </li>
              <li>
                <strong>بيانات الاشتراك والدفع:</strong> تُعالج مباشرة عبر بوابة الدفع المعتمدة عالمياً (Stripe) عبر بروتوكولات مشفرة؛ ولا تُخزن خوادم مِعمار أي أرقام لبطاقات الائتمان.
              </li>
              <li>
                <strong>تحديد الدولة للتكافؤ الشرائي (PPP):</strong> يُفحص عنوان الـ IP بصورة عابرة عند طلب صفحة الاشتراك لتطبيق الخصم الجغرافي دون تخزين دائم لسجل المواقع.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-black flex items-center gap-2">
              <span className="text-[#C86A00] font-mono text-lg">3.</span>
              <span>أمن خلاصات البودكاست المشفرة (Private RSS)</span>
            </h2>
            <p className="text-neutral-700">
              [نص تمهيدي - يُرجى استبداله بالصياغة القانونية النهائية]: يحصل كل مشترك في باقة مِعمار بلس على رابط RSS صوتي خاص وموقّع رقمياً بتشفير HMAC لحماية الحقوق الفكرية والتسجيلات الصوتية. يعتبر هذا الرابط شخصياً ومخصصاً للاستخدام الفردي فقط في تطبيقات البودكاست المعتمدة للمشترك.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-black flex items-center gap-2">
              <span className="text-[#C86A00] font-mono text-lg">4.</span>
              <span>حقوق المستخدم والحذف النهائي للبيانات</span>
            </h2>
            <p className="text-neutral-700">
              [نص تمهيدي - يُرجى استبداله بالصياغة القانونية النهائية]: يمتلك كل مستخدم الحق الكامل في مراجعة بيانات حسابه، تعديلها، أو طلب الحذف النهائي والشامل لكافة سجلاته من قواعد بيانات المنصة في أي وقت عبر مراسلة الدعم من خلال <Link href="/contact" className="underline font-bold hover:text-[#C86A00]">صفحة اتصل بنا</Link>.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-black flex items-center gap-2">
              <span className="text-[#C86A00] font-mono text-lg">5.</span>
              <span>التعديلات والتحديثات الدورية</span>
            </h2>
            <p className="text-neutral-700">
              [نص تمهيدي - يُرجى استبداله بالصياغة القانونية النهائية]: قد تخضع هذه السياسة للتحديث لمواكبة التغييرات التشريعية أو التقنية في خدمات المنصة. سيتم إخطار المشتركين بأي تعديلات جوهرية عبر البريد الإلكتروني المسجل.
            </p>
          </section>
        </div>

        {/* Navigation / Contact Footer */}
        <div className="mt-14 pt-6 border-t border-neutral-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-sans">
          <Link
            href="/terms"
            className="font-bold text-neutral-900 hover:text-[#C86A00] flex items-center gap-1.5 transition-colors"
          >
            <span>الانتقال إلى الشروط والأحكام</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <Link
            href="/contact"
            className="text-neutral-500 hover:text-black underline transition-colors"
          >
            استفسارات حول خصوصية البيانات وحسابك
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
