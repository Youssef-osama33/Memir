import Navigation from "../../components/navigation";
import Footer from "../../components/footer";
import Link from "next/link";
import { Mail, MessageSquare, Shield, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FCFBF9] text-neutral-900 font-serif flex flex-col justify-between" dir="rtl">
      <Navigation />

      <main className="max-w-3xl mx-auto px-6 py-16 text-right flex-grow">
        <div className="border-b border-neutral-300 pb-8 mb-10">
          <span className="font-sans text-xs font-bold text-neutral-400 uppercase tracking-widest block mb-2">
            قنوات الاتصال والتواصل
          </span>
          <h1 className="text-3xl md:text-5xl font-sans font-bold text-black tracking-tight">
            اتصل بنا
          </h1>
          <p className="text-base text-neutral-600 font-serif leading-relaxed mt-4">
            للاستفسارات البحثية، المقترحات الفكرية، أو الدعم الفني المتعلق باشتراكات مِعمار بلس.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-12">
          {/* Direct Email Card */}
          <div className="border-2 border-black bg-white p-6 shadow-xs font-sans">
            <div className="w-10 h-10 bg-black text-white flex items-center justify-center mb-4">
              <Mail className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="font-bold text-base text-black mb-1">المراسلة المباشرة</h3>
            <p className="text-xs text-neutral-600 leading-relaxed mb-4">
              يمكنك مراسلة صاحب المنصة وفريق التحرير مباشرة لأي أسئلة أو مقترحات أكاديمية.
            </p>
            <a
              href="mailto:contact@me-mar.com"
              dir="ltr"
              className="inline-block bg-neutral-100 hover:bg-black hover:text-white transition-colors px-3 py-2 text-xs font-mono font-bold text-neutral-900 border border-neutral-300"
            >
              contact@me-mar.com
            </a>
          </div>

          {/* Secure Inquiries */}
          <div className="border border-neutral-300 bg-white p-6 shadow-xs font-sans">
            <div className="w-10 h-10 bg-neutral-100 text-neutral-800 flex items-center justify-center mb-4 border border-neutral-300">
              <Shield className="w-5 h-5 text-neutral-700" />
            </div>
            <h3 className="font-bold text-base text-black mb-1">دعم الاشتراكات وStripe</h3>
            <p className="text-xs text-neutral-600 leading-relaxed mb-4">
              لمشتركي مِعمار بلس الذين يواجهون أي صعوبة في استلام رمز الـ RSS أو إدارة بطاقة الدفع.
            </p>
            <a
              href="mailto:support@me-mar.com"
              dir="ltr"
              className="inline-block bg-neutral-100 hover:bg-black hover:text-white transition-colors px-3 py-2 text-xs font-mono font-bold text-neutral-900 border border-neutral-300"
            >
              support@me-mar.com
            </a>
          </div>
        </div>

        <div className="border border-neutral-300 bg-[#FAF8F5] p-8 text-neutral-800 font-sans">
          <h3 className="text-sm font-bold text-black uppercase tracking-wider mb-2">
            ملاحظة بخصوص النشر والكتابة
          </h3>
          <p className="text-xs text-neutral-600 leading-relaxed font-serif">
            كافة الأوراق المنشورة في مِعمار تُكتب حصرياً وبشكل فردي بقلم صاحب المشروع. لا نقبل المقالات الممولة، الإعلانات الترويجية، أو المحتوى التجاري من أي جهة.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
