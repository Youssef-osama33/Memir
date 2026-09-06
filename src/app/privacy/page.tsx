import Navigation from "../../components/navigation";
import Footer from "../../components/footer";
import Link from "next/link";
import { ShieldCheck, Lock, EyeOff } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FCFBF9] text-neutral-900 font-serif flex flex-col justify-between" dir="rtl">
      <Navigation />

      <main className="max-w-3xl mx-auto px-6 py-16 text-right flex-grow">
        <div className="border-b border-neutral-300 pb-8 mb-10">
          <span className="font-sans text-xs font-bold text-neutral-400 uppercase tracking-widest block mb-2">
            الوثائق القانونية
          </span>
          <h1 className="text-3xl md:text-5xl font-sans font-bold text-black tracking-tight">
            سياسة الخصوصية وحماية البيانات
          </h1>
          <p className="text-xs text-neutral-500 font-sans mt-2">
            آخر تحديث: يونيو 2026 • متوافقة مع أرقى معايير حماية الخصوصية الرقمية
          </p>
        </div>

        <div className="space-y-8 text-neutral-800 text-base md:text-[17px] leading-[1.85]">
          <section>
            <h2 className="text-xl font-sans font-bold text-black mb-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <span>1. مبدأ المنصة في الخصوصية</span>
            </h2>
            <p>
              تلتزم منصة <strong>مِعمار</strong> بحماية خصوصية قرائها ومشتركيها بأعلى درجات الصرامة الفنية والأخلاقية. لا نقوم ببيع أو تأجير أو مشاركة أي بيانات شخصية مع أطراف ثالثة أو شركات إعلانات، ولا نستخدم أي برمجيات تتبع تجارية غازية.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-sans font-bold text-black mb-2">
              2. البيانات التي نجمعها
            </h2>
            <p className="mb-3">
              نقتصر على جمع الحد الأدنى الضروري من البيانات لتشغيل الخدمة وتأمين الاشتراكات:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-neutral-700 font-sans">
              <li>
                <strong>عنوان البريد الإلكتروني:</strong> يُستخدم حصراً لإرسال روابط تسجيل الدخول السحرية (Magic Links) والإشعارات المتعلقة بحسابك أو اشتراكك.
              </li>
              <li>
                <strong>بيانات الاشتراك والدفع:</strong> تتم معالجة كافة المدفوعات والبطاقات الائتمانية بصورة مشفرة تماماً عبر مزود الدفع العالمي المعتمد (Stripe). لا تخزن خوادم مِعمار أي أرقام بطاقات ائتمانية.
              </li>
              <li>
                <strong>تحديد الدولة للتكافؤ الشرائي (PPP):</strong> يُستخدم عنوان الـ IP بصورة عابرة عند زيارة صفحة الاشتراك لتحديد الدولة المؤهلة لتخفيض القوة الشرائية ولا يُخزن كملف تعريف ارتباط دائم.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-sans font-bold text-black mb-2">
              3. أمن خلاصة البودكاست المشفرة (RSS Tokens)
            </h2>
            <p>
              يتم توليد رمز وصول شخصي فريد (Personal Token) لكل مشترك مميز في مِعمار بلس، وموقع بتوقيع رقمي <code className="bg-neutral-100 px-1 font-mono text-xs">HMAC-SHA256</code>. هذا الرابط مخصص للاستخدام الفردي ويمنع مشاركته العلنية.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-sans font-bold text-black mb-2">
              4. حق حذف البيانات
            </h2>
            <p>
              يحق لكل مستخدم في أي وقت طلب الحذف النهائي والشامل لحسابه وكافة سجلاته من قواعد بياناتنا عن طريق مراسلة الدعم عبر <Link href="/contact" className="underline font-sans text-xs">صفحة الاتصال</Link>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
