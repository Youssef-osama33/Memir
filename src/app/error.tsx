'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FCFBF9] text-neutral-900 px-6" dir="rtl">
      <div className="max-w-md w-full text-center">
        <h2 className="text-2xl font-serif font-bold mb-3 text-black">حدث خطأ غير متوقع</h2>
        <p className="text-sm text-neutral-600 font-sans mb-6">نعتذر عن هذا الخلل المؤقت. يمكنك محاولة إعادة تحميل الصفحة أو العودة للرئيسية.</p>
        <div className="flex items-center justify-center gap-4 font-sans">
          <button
            onClick={() => reset()}
            className="bg-black text-white px-5 py-2 text-xs font-bold hover:bg-neutral-800 transition-colors"
          >
            إعادة المحاولة
          </button>
          <Link
            href="/"
            className="border border-neutral-300 text-neutral-800 px-5 py-2 text-xs font-bold hover:bg-neutral-100 transition-colors"
          >
            الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
