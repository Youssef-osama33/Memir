import Navigation from "../../components/navigation";
import Footer from "../../components/footer";
import Link from "next/link";
import { Hexagon, Shield, BookOpen, Cpu, Globe, ArrowLeft } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FCFBF9] text-neutral-900 font-serif flex flex-col justify-between" dir="rtl">
      <Navigation />

      <main className="max-w-3xl mx-auto px-6 py-16 text-right flex-grow">
        <div className="border-b border-neutral-300 pb-8 mb-10">
          <span className="font-sans text-xs font-bold text-neutral-400 uppercase tracking-widest block mb-2">
            عن المنصة والرؤية
          </span>
          <h1 className="text-3xl md:text-5xl font-sans font-bold text-black tracking-tight">
            من نحن: مِعمار
          </h1>
          <p className="text-base text-neutral-600 font-serif leading-relaxed mt-4">
            مشروع تحليلي مستقل عند تقاطع الجيوبوليتكس، الذكاء الاصطناعي، البنى التحتية الحيوية، وفقه الواقع المعاصر.
          </p>
        </div>

        <div className="space-y-8 text-neutral-800 text-base md:text-lg leading-[1.9]">
          <section>
            <h2 className="text-xl md:text-2xl font-sans font-bold text-black mb-3">
              الرسالة والهوية
            </h2>
            <p>
              تأسست <strong>مِعمار</strong> لتقديم قراءة استراتيجية معمقة ومجردة من الصخب الدعائي السائد في فضاء التقنية. نحن لا نكتفي بنقل الأخبار التقنية، بل نقوم بتشريح العوامل الهيكلية الجيوتكنولوجية: مسارات سلاسل الإمداد، صراع السيادة على أشباه الموصلات، أمن كابلات الألياف الضوئية في قيعان البحار، وحسابات الردع السيبراني والكمي بين القوى الكبرى.
            </p>
          </section>

          <section className="bg-amber-50/60 border-r-3 border-amber-800 p-6 my-6 text-neutral-800">
            <h3 className="font-sans font-bold text-sm text-amber-950 mb-2">
              سياسة التحرير والأصالة المطلقة:
            </h3>
            <p className="text-sm font-serif leading-relaxed text-neutral-700">
              كافة التحليلات والمقالات والمراجعات المنشورة على هذه المنصة تُكتب وتُحرر يدوياً بصورة حصرية من قِبل صاحب المشروع. المنصة ملتزمة بسياسة صارمة تمنع النشر التلقائي أو الاستعانة بمحتوى مُولَّد آلياً، حفاظاً على العمق التحليلي الرصين والمسؤولية الفكرية.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-sans font-bold text-black mb-3">
              الهيكل التحليلي ثماني الأبعاد
            </h2>
            <p className="mb-4">
              تنتظم تحليلات مِعمار في سبعة أقسام رئيسية متخصصة ومسار أفقي مستقل لمراجعة الكتب:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
              <li className="p-3 bg-white border border-neutral-200">
                <strong>1. الذكاء الاصطناعي والجيوبوليتكس:</strong> النماذج التأسيسية وصراع الرقائق.
              </li>
              <li className="p-3 bg-white border border-neutral-200">
                <strong>2. الأمن السيبراني:</strong> عقائد الردع وحماية الأنظمة الحيوية.
              </li>
              <li className="p-3 bg-white border border-neutral-200">
                <strong>3. الحوسبة الكمية:</strong> كسر التشفير ومعايير ما بعد الكم.
              </li>
              <li className="p-3 bg-white border border-neutral-200">
                <strong>4. الطاقة:</strong> تغذية مراكز البيانات والمفاعلات المصغرة.
              </li>
              <li className="p-3 bg-white border border-neutral-200">
                <strong>5. البنية التحتية الرقمية:</strong> كابلات البحار والممرات الجغرافية.
              </li>
              <li className="p-3 bg-white border border-neutral-200">
                <strong>6. رياضيات ونمذجة تطبيقية:</strong> نظرية الألعاب وحركيات المنصات.
              </li>
              <li className="p-3 bg-white border border-neutral-200">
                <strong>7. فقه الواقع:</strong> استدعاء أطروحات المسيري وبن نبي لتفكيك التبعية.
              </li>
              <li className="p-3 bg-amber-50/80 border border-amber-300">
                <strong>8. مسار الكتب:</strong> تفكيك أمهات الكتب وقسم خاص: "الفكرة في زمننا".
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-sans font-bold text-black mb-3">
              عدالة الوصول وتكافؤ القوة الشرائية (PPP)
            </h2>
            <p>
              اعتمدت مِعمار نموذج اشتراك شهري يراعي تباين الأوضاع الاقتصادية بين مختلف أقطار الوطن العربي والعالم النامي؛ حيث يُطبق تخفيض يصل إلى 66% للقراء في الدول النامية وفق معايير مدروسة، لضمان وصول المعرفة الاستراتيجية لكافة الباحثين والمهتمين دون حواجز مالية تعجيزية.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t border-neutral-200 flex justify-between items-center text-xs font-sans">
          <Link href="/subscribe" className="font-bold text-neutral-900 hover:text-amber-800 flex items-center gap-1">
            <span>استعراض أسعار الاشتراك والـ PPP</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <Link href="/contact" className="text-neutral-500 hover:underline">
            للتواصل مع فريق التحرير
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
