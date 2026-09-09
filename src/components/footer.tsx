import Link from "next/link";
import { BrandMark } from "./BrandMark";
import { Rss } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#FAF8F5] border-t-2 border-neutral-900/10 pt-12 pb-8 text-xs font-sans text-neutral-600" dir="rtl">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-neutral-200">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <Link href="/" className="inline-block group focus:outline-none">
              <BrandMark size="md" withTagline={true} />
            </Link>
            <p className="text-xs text-neutral-600 font-serif leading-relaxed max-w-md pt-1">
              مِعمار منصة فكرية استراتيجية تُعنى بتفكيك موازين القوى المعاصرة، سلاسل الإمداد السيادية، فلسفة التقنية، وتأصيل فقه الواقع في العالم الإسلامي.
            </p>
          </div>

          {/* Quick Sectors */}
          <div className="space-y-2.5">
            <div className="text-[11px] font-bold text-neutral-900 uppercase tracking-wider font-mono">
              الأجنحة والمحاور
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/categories/fiqh-al-waqi" className="hover:text-[#C86A00] transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#C86A00]" />
                  <span>فِـقْـهُ الواقع (الفكر والحضارة)</span>
                </Link>
              </li>
              <li>
                <Link href="/books" className="hover:text-[#C86A00] transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-neutral-400" />
                  <span>الكتب (الفكرة في زمننا)</span>
                </Link>
              </li>
              <li>
                <Link href="/categories/semiconductors" className="hover:text-[#C86A00] transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-neutral-400" />
                  <span>أشباه الموصلات والسيادة الرقمية</span>
                </Link>
              </li>
              <li>
                <Link href="/archive" className="hover:text-[#C86A00] transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-neutral-400" />
                  <span>أرشيف الدراسات والتقديرات</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Editorial */}
          <div className="space-y-2.5">
            <div className="text-[11px] font-bold text-neutral-900 uppercase tracking-wider font-mono">
              المنصة وهيئة التحرير
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-[#C86A00] transition-colors">
                  من نحن والرؤية التحريرية
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#C86A00] transition-colors">
                  التواصل وتقديم الدراسات
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#C86A00] transition-colors">
                  الخصوصية والاشتراكات
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#C86A00] transition-colors">
                  الشروط والأحكام
                </Link>
              </li>
              <li>
                <Link href="/feed.xml" target="_blank" className="hover:text-[#C86A00] transition-colors flex items-center gap-1 mt-2 font-bold text-[#C86A00]">
                  <Rss className="w-3 h-3" />
                  خلاصة RSS العامة
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500 font-mono">
          <div>جميع الحقوق محفوظة لِمِعمار للدراسات الاستراتيجية © {currentYear}</div>
          <div className="flex items-center gap-2">
            <span>التقدير الاستراتيجي المستقل</span>
            <span>•</span>
            <span className="text-[#C86A00]">بدون خوارزميات ترويجية</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
