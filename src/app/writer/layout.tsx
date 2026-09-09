import React from "react";
import { redirect } from "next/navigation";
import { auth } from "../../lib/auth";
import Link from "next/link";
import { BookOpen, LogOut, Home, FileText } from "lucide-react";
import { BrandMark } from "../../components/BrandMark";

export const dynamic = "force-dynamic";

export default async function WriterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Protect writer layout
  if (!session || !session.user || !["WRITER", "ADMIN"].includes(session.user.role)) {
    redirect("/");
  }

  return (
    <div
      className="min-h-screen bg-[#F9F8F6] text-[#111111] font-sans selection:bg-amber-200 selection:text-black flex flex-col md:flex-row"
      dir="rtl"
    >
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-l border-[#E5E2DC] flex flex-col justify-between shrink-0">
        <div>
          <div className="p-5 border-b border-[#E5E2DC]">
            <Link href="/" className="inline-block mb-4">
              <BrandMark size="sm" withTagline={false} />
            </Link>
            <div>
              <span className="font-bold text-lg text-neutral-900 font-serif block">
                لوحة الكاتب
              </span>
              <span className="text-xs text-neutral-500 font-sans mt-1 block">
                الفضاء التحريري
              </span>
            </div>
          </div>

          <nav className="p-3 space-y-1">
            <Link
              href="/writer"
              className="flex items-center gap-3 px-3 py-2.5 bg-neutral-900 text-white rounded-sm text-sm font-bold shadow-sm"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>مساحة العمل</span>
            </Link>
            {/* Additional links can be added here if writer gets more pages */}
          </nav>
        </div>

        <div className="p-4 border-t border-[#E5E2DC] bg-[#FCFBF9] space-y-3">
          <div className="text-[11px] font-sans">
            <span className="text-neutral-400 block text-[10px]">الكاتب الحالي:</span>
            <span className="font-bold text-neutral-800 block truncate" title={session.user.email || ""}>
              {session.user.name || session.user.email?.split('@')[0]}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
            <Link
              href="/"
              className="flex items-center justify-center gap-1.5 py-2 bg-white border border-neutral-300 hover:border-neutral-800 text-neutral-700 transition-colors rounded-sm"
            >
              <Home className="w-3.5 h-3.5" />
              <span>الرئيسية</span>
            </Link>
            <Link
              href="/api/auth/signout"
              className="flex items-center justify-center gap-1.5 py-2 bg-white border border-red-200 text-red-700 hover:bg-red-50 transition-colors rounded-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>خروج</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
