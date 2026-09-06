import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#FAF8F5] border-t border-neutral-200 py-6 text-xs font-sans text-neutral-600" dir="rtl">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4">
        <div>جميع الحقوق محفوظة لِمِعمار {currentYear}</div>
        <div className="flex items-center gap-3">
          <Link href="/about" className="hover:text-black transition-colors">من نحن</Link>
          <span className="text-neutral-300">·</span>
          <Link href="/privacy" className="hover:text-black transition-colors">سياسة الخصوصية</Link>
          <span className="text-neutral-300">·</span>
          <Link href="/terms" className="hover:text-black transition-colors">الشروط والأحكام</Link>
          <span className="text-neutral-300">·</span>
          <Link href="/contact" className="hover:text-black transition-colors">اتصل بنا</Link>
        </div>
      </div>
    </footer>
  );
}
