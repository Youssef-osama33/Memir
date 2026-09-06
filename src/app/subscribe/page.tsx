import { headers } from "next/headers";
import Navigation from "../../components/navigation";
import Footer from "../../components/footer";
import Link from "next/link";
import { Lock, Check, ArrowLeft, ShieldCheck } from "lucide-react";
import { getPppConfig, formatPrice } from "../../lib/ppp";

export const dynamic = "force-dynamic";

export default async function SubscribePage() {
  const headersList = await headers();
  const countryCode = headersList.get("x-country-code") || "DZ";
  const pppConfig = getPppConfig(countryCode);
  const localizedPrice = formatPrice(
    pppConfig.suggestedPriceCents,
    pppConfig.currency,
    pppConfig.currencySymbol
  );

  return (
    <div className="min-h-screen bg-[#FCFBF9] text-neutral-900 font-serif flex flex-col justify-between" dir="rtl">
      <Navigation />

      <main className="max-w-3xl mx-auto px-6 py-16 text-right flex-grow">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 bg-neutral-900 text-white px-3 py-1 text-xs font-sans font-bold uppercase mb-4 rounded-xs">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>عضوية مِعمار بلس</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight text-black leading-tight">
            اشتراك مِعمار بلس
          </h1>
          <p className="text-neutral-600 font-serif text-sm mt-4 leading-relaxed max-w-lg mx-auto">
            وصول غير مقيد للتحليلات الاستراتيجية، تفكيك أمهات الكتب الفكرية مع قسم 'الفكرة في زمننا'، وبث البودكاست المشفر عبر خلاصة شخصية.
          </p>
        </div>

        {/* Subscription Plan Card */}
        <div className="bg-[#FAF9F6] border border-neutral-300 p-8 md:p-10 relative shadow-xs">
          <div className="border-b border-neutral-200 pb-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl md:text-2xl font-serif font-bold text-black">
                  الاشتراك الشهري
                </h2>
                <p className="text-xs text-neutral-400 font-mono mt-0.5" dir="ltr">
                  MONTHLY RESEARCH PASS
                </p>
              </div>
              <div className="text-left font-sans">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl md:text-4xl font-serif font-black text-black">
                    {localizedPrice}
                  </span>
                  <span className="text-xs text-neutral-500 font-sans">/ شهرياً</span>
                </div>
                <span className="text-[11px] text-neutral-500 block mt-0.5">
                  تجديد شهري، إلغاء في أي وقت
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-8 font-sans">
            <h3 className="font-bold text-xs text-neutral-900 uppercase tracking-wide">
              ما يتضمنه اشتراكك في مِعمار:
            </h3>
            <ul className="space-y-3.5 text-xs text-neutral-700 font-serif">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                <span>وصول كامل لكافة التحليلات في الأقسام التحليلية السبعة دون قيود.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                <span>الوصول الكامل لمراجعات مسار الكتب وقسم 'الفكرة في زمننا' لتفكيك الواقع التكنولوجي.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                <span>خلاصة بودكاست صوتية مشفرة برابط شخصي دائم عبر بروتوكول RSS.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                <span>متابعة مستمرة للتطورات الجيوبوليتيكية والذكاء الاصطناعي وأمن البنية التحتية.</span>
              </li>
            </ul>
          </div>

          <div className="border-t border-neutral-200 pt-6">
            <Link
              href="/auth/signin"
              className="w-full h-12 bg-neutral-900 hover:bg-black text-white font-sans font-bold text-xs tracking-wider transition-colors flex items-center justify-center gap-2 rounded-xs shadow-2xs"
            >
              <span>متابعة الاشتراك عبر Stripe</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center justify-center gap-2 mt-4 text-[11px] text-neutral-500 font-sans">
              <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
              <span>دفع آمن ومشفر بالكامل، إمكانية الإلغاء في أي وقت من لوحة المشترك بنقرة واحدة.</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
