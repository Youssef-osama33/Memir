import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FCFBF9] text-neutral-900" dir="rtl">
      <div className="text-center">
        <h2 className="text-3xl font-serif font-bold mb-4">الصفحة غير موجودة</h2>
        <p className="text-neutral-600 mb-6 font-sans">عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها.</p>
        <Link href="/" className="inline-flex items-center justify-center bg-black text-white px-6 py-2 rounded-sm font-sans font-bold hover:bg-neutral-800 transition-colors">
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
