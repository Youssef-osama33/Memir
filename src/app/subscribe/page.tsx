import { headers } from "next/headers";
import Navigation from "../../components/navigation";
import Footer from "../../components/footer";
import { Sparkles, HelpCircle, CheckCircle2, Award } from "lucide-react";
import { getTierPricing, PlanTierType } from "../../lib/ppp";
import SubscriptionPricingTable from "../../components/SubscriptionPricingTable";

export const dynamic = "force-dynamic";

export default async function SubscribePage() {
  const headersList = await headers();
  const countryCode = headersList.get("x-country-code") || "DZ";

  const tiers: PlanTierType[] = ["FREE", "STANDARD", "PLUS"];

  const monthlyPrices: any = {};
  const yearlyPrices: any = {};

  for (const t of tiers) {
    monthlyPrices[t] = getTierPricing(t, "MONTHLY", countryCode);
    yearlyPrices[t] = getTierPricing(t, "YEARLY", countryCode);
  }

  return (
    <div className="min-h-screen bg-[#FCFBF9] text-neutral-900 font-serif flex flex-col justify-between" dir="rtl">
      <Navigation />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16 text-right flex-grow w-full">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-[#FAF7F0] border border-[#C86A00]/30 text-[#8C4B00] px-3.5 py-1 text-xs font-sans font-bold uppercase tracking-wider mb-4 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-[#C86A00]" />
            <span>باقات الاشتراك والبحث الاستراتيجي</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight text-black leading-tight mb-4">
            انضم إلى شبكة مِعمار التحليلية
          </h1>
          <p className="text-neutral-600 font-serif text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            منصة مستقلة متخصصة في تفكيك التحولات الجيوسياسية، هندسة الذكاء الاصطناعي، الأمن السيبراني، ومراجعة أمهات الكتب الفكرية بعيون استراتيجية رصينة.
          </p>
        </div>

        {/* 3-Tier Pricing Table with Monthly/Yearly Toggle */}
        <SubscriptionPricingTable
          prices={{
            monthly: monthlyPrices,
            yearly: yearlyPrices,
          }}
        />

        {/* Institutional & Research Note */}
        <div className="mt-16 bg-[#F8F6F0] border border-neutral-300/80 p-6 md:p-8 rounded-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-black text-white flex items-center justify-center shrink-0 rounded-xs mt-1">
                <Award className="w-5 h-5 text-[#C86A00]" />
              </div>
              <div>
                <h4 className="text-base font-serif font-bold text-black mb-1">
                  هل تبحث عن اشتراك مؤسسي للمراكز البحثية والجامعات؟
                </h4>
                <p className="text-xs text-neutral-600 font-serif leading-relaxed max-w-2xl">
                  توفر مِعمار تراخيص متعددة المقاعد (Multi-Seat Access) لغرف الأخبار، مراكز السياسات، والمؤسسات الأكاديمية الراغبة في توفير صلاحيات كاملة لفريق العمل مع فواتير ضريبية معتمدة.
                </p>
              </div>
            </div>

            <a
              href="mailto:subscriptions@me-mar.com?subject=طلب اشتراك مؤسسي"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-white border border-neutral-400 hover:border-black text-black text-xs font-sans font-bold tracking-wide transition-colors shrink-0 rounded-xs shadow-2xs"
            >
              تواصل مع قسم الاشتراكات المؤسسية
            </a>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-xl md:text-2xl font-serif font-bold text-black">
              الأسئلة الشائعة حول الاشتراكات
            </h3>
          </div>

          <div className="space-y-4">
            <div className="bg-white border border-neutral-200 p-5 rounded-xs">
              <h5 className="text-sm font-sans font-bold text-black mb-2 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#C86A00]" />
                <span>ما الفرق بين الباقة الشهرية (Standard) وباقة بلس (Plus)؟</span>
              </h5>
              <p className="text-xs text-neutral-600 font-serif leading-relaxed">
                تمنحك الباقة الشهرية وصولاً كاملاً وغير مقيد لكافة المقالات والدراسات المنشورة عبر الأقسام الثمانية. بينما تنفرد <strong>باقة بلس</strong> بميزات حصرية للمطالعة المتعمقة تشمل الاستماع للتسجيل الصوتي الاستراتيجي للأوراق، وتحميل ملفات PDF عالية الجودة مهيأة للأرشفة والطباعة، وشارة مميزة في نقاشات الموقع.
              </p>
            </div>

            <div className="bg-white border border-neutral-200 p-5 rounded-xs">
              <h5 className="text-sm font-sans font-bold text-black mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C86A00]" />
                <span>كيف يعمل خيار الدفع السنوي؟</span>
              </h5>
              <p className="text-xs text-neutral-600 font-serif leading-relaxed">
                عند اختيار الدفع السنوي، تحصل على خصم يوازي شهرين مجاناً (حيث تحسب تكلفة 10 أشهر فقط وتستمتع بعام كامل من الوصول). يتم الخصم دفعة واحدة كل 12 شهراً.
              </p>
            </div>

            <div className="bg-white border border-neutral-200 p-5 rounded-xs">
              <h5 className="text-sm font-sans font-bold text-black mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C86A00]" />
                <span>هل يمكنني إلغاء اشتراكي في أي وقت؟</span>
              </h5>
              <p className="text-xs text-neutral-600 font-serif leading-relaxed">
                نعم، لا توجد أي التزامات طويلة الأمد. يمكنك إلغاء التجديد التلقائي بنقرة واحدة من لوحة التحكم الخاصة بك في أي لحظة، وستظل محتفظاً بالوصول حتى نهاية الفترة المدفوعة.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
