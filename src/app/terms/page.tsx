import Navigation from "../../components/navigation";
import Footer from "../../components/footer";
import Link from "next/link";
import { Scale, AlertCircle } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FCFBF9] text-neutral-900 font-serif flex flex-col justify-between" dir="rtl">
      <Navigation />

      <main className="max-w-3xl mx-auto px-6 py-16 text-right flex-grow">
        <div className="border-b border-neutral-300 pb-8 mb-10">
          <span className="font-sans text-xs font-bold text-neutral-400 uppercase tracking-widest block mb-2">
            الوثائق القانونية
          </span>
          <h1 className="text-3xl md:text-5xl font-sans font-bold text-black tracking-tight">
            الشروط والأحكام
          </h1>
          <p className="text-xs text-neutral-500 font-sans mt-2">
            اتفاقية الاستخدام والاشتراك في منصة مِعمار (Me'mar)
          </p>
        </div>

        <div className="space-y-8 text-neutral-800 text-base md:text-[17px] leading-[1.85]">
          <section>
            <h2 className="text-xl font-sans font-bold text-black mb-2 flex items-center gap-2">
              <Scale className="w-5 h-5 text-neutral-700" />
              <span>1. قبول الشروط</span>
            </h2>
            <p>
              يُعد استخدامك لمنصة <strong>مِعمار</strong> أو اشتراكك في عضويتها المدفوعة (مِعمار بلس) موافقة كاملة وصريحة على هذه الشروط والأحكام. إذا كنت لا توافق على أي بند منها، يرجى التوقف عن استخدام المنصة.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-sans font-bold text-black mb-2">
              2. الملكية الفكرية وحقوق النشر
            </h2>
            <p>
              كافة التحليلات، الدراسات، المراجعات، الرسوم التوضيحية، والتسجيلات الصوتية المنشورة على المنصة محمية بموجب قوانين الملكية الفكرية الدولية. يُسمح بالاقتباس الأكاديمي والبحثي المحدود بشرط الإشارة الصريحة إلى المصدر ورابط المقال الأصلي. يُحظر إعادة نشر المقالات الكاملة أو تفريغها تجارياً دون إذن كتابي مسبق.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-sans font-bold text-black mb-2">
              3. الاشتراكات وسياسة الإلغاء
            </h2>
            <p className="mb-2">
              تُجدد الاشتراكات الشهرية تلقائياً ما لم يقم المشترك بإلغاء التجديد من خلال لوحة التحكم الخاصة به قبل تاريخ الفاتورة التالية. عند الإلغاء، يظل الاشتراك سارياً حتى نهاية الدورة المدفوعة دون خصم أي مبالغ إضافية.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-sans font-bold text-black mb-2">
              4. عدالة التسعير ومكافحة التحايل (PPP)
            </h2>
            <p>
              قُدمت أسعار التكافؤ الشرائي (PPP) بحسن نية لدعم الباحثين والقراء في الدول النامية. يحظر استخدام شبكات VPN أو الوسائل التضليلية للحصول على تسعير دولة غير محل إقامة المشترك الحقيقي، وتحتفظ المنصة بحق إلغاء الاشتراكات المخالفة دون استرداد.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-sans font-bold text-black mb-2">
              5. إخلاء المسؤولية التحليلية
            </h2>
            <p>
              المحتوى المنشور على مِعمار مخصص لأغراض التحليل الاستراتيجي، الفكري، والبحثي المجرد، ولا يشكل مشورة استثمارية أو مالية أو قانونية مباشرة.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
