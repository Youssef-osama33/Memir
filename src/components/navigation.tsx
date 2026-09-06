"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X, Hexagon, BookOpen, Layers, ShieldCheck, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { CATEGORIES } from "../lib/categories";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const drawerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const focusableElements = drawerRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements?.[0] as HTMLElement;
      firstElement?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const mainCategories = CATEGORIES.filter((c) => !c.isHorizontal);
  const horizontalCategories = CATEGORIES.filter((c) => c.isHorizontal);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 px-6 py-4 flex items-center justify-between" dir="rtl">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 focus:outline-none group">
            <Hexagon className="w-7 h-7 text-neutral-900 shrink-0 group-hover:text-black transition-colors" fill="currentColor" fillOpacity={0.15} />
            <span className="text-3xl font-black tracking-wide text-neutral-900 font-serif leading-none mt-1 group-hover:text-black transition-colors">
              مِعمار
            </span>
          </Link>

          {/* Quick Category Tabs on Desktop */}
          <nav className="hidden lg:flex items-center gap-5 text-xs font-sans text-neutral-600 mr-4">
            <Link href="/books" className="flex items-center gap-1 font-bold text-neutral-900 hover:text-amber-800 transition-colors">
              <BookOpen className="w-3.5 h-3.5 text-amber-800" />
              <span>الكتب (الفكرة في زمننا)</span>
            </Link>
            <Link href="/categories/ai-geopolitics" className="hover:text-neutral-900 transition-colors">
              الذكاء الاصطناعي والجيوبوليتكس
            </Link>
            <Link href="/categories/cybersecurity" className="hover:text-neutral-900 transition-colors">
              الأمن السيبراني
            </Link>
            <Link href="/categories/energy" className="hover:text-neutral-900 transition-colors">
              الطاقة
            </Link>
            <Link href="/categories/fiqh-al-waqi" className="hover:text-neutral-900 transition-colors">
              فقه الواقع
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3 font-sans">
          {session && (
            <Link
              href="/dashboard"
              className="text-xs font-bold text-neutral-900 border border-neutral-300 hover:border-black px-3 py-1.5 rounded-sm transition-colors flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>لوحة المشترك</span>
            </Link>
          )}

          <button
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2.5 px-3.5 py-1.5 bg-neutral-900 hover:bg-black text-white rounded-xs border border-neutral-900 transition-all duration-150 cursor-pointer focus:outline-none shadow-2xs hover:shadow-xs"
            aria-label="فتح القائمة الرئيسية"
          >
            <div className="flex flex-col justify-center items-end gap-1 w-4 h-3.5" aria-hidden="true">
              <span className="w-4 h-[1.5px] bg-white transition-all duration-150 group-hover:w-4 rounded-full" />
              <span className="w-2.5 h-[1.5px] bg-amber-400 transition-all duration-150 group-hover:w-3.5 rounded-full" />
              <span className="w-3.5 h-[1.5px] bg-white transition-all duration-150 group-hover:w-4 rounded-full" />
            </div>
            <span className="text-xs font-sans font-bold tracking-wide">الأقسام والفهرس</span>
          </button>
        </div>
      </header>

      {isOpen && (
        <div
          className="fixed inset-0 bg-neutral-900/30 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 w-full max-w-md bg-[#FCFBF9] z-50 shadow-2xl border-l border-neutral-200/80 p-8 flex flex-col h-[100dvh] overflow-y-auto transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        dir="rtl"
      >
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <Hexagon className="w-5 h-5 text-black" fill="currentColor" fillOpacity={0.1} />
            <span className="text-xl font-bold font-serif text-black">مِعمار</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-neutral-500 hover:text-black transition-colors focus:outline-none p-1"
            aria-label="إغلاق القائمة"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* User Account / Branded Editorial Promo */}
        <div className="mb-6">
          {session ? (
            <div className="bg-[#F7F4EC] border border-[#E7E0CE] p-4 rounded-xs shadow-2xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold font-sans text-neutral-900">حساب المشترك النشط</span>
                {session.user?.isPremium && (
                  <span className="bg-amber-900 text-amber-100 text-[10px] font-sans font-bold px-2 py-0.5 rounded-2xs flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-amber-300" />
                    عضوية ممتازة
                  </span>
                )}
              </div>
              <div className="text-xs font-mono text-neutral-600 mb-3">{session.user?.email}</div>
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center bg-neutral-900 text-white text-xs font-bold py-2 hover:bg-black rounded-xs transition-colors"
              >
                لوحة التحكم وبث الـ RSS ←
              </Link>
            </div>
          ) : (
            <div className="bg-[#F7F4EC] border border-[#E7E0CE] p-5 rounded-xs shadow-2xs relative">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[10px] font-sans font-bold tracking-wider uppercase text-amber-900 bg-amber-500/15 border border-amber-600/25 px-2 py-0.5 rounded-2xs">
                  عضوية مِعمار بلس
                </span>
              </div>
              <h3 className="font-serif font-bold text-lg text-neutral-900 leading-snug mb-2">
                تحليلات استراتيجية معمقة، بلا تشويش
              </h3>
              <p className="text-xs text-neutral-700 font-serif leading-relaxed mb-4">
                وصول كامل للأقسام الاستراتيجية الثمانية، مراجعات أمهات الكتب مع قسم 'الفكرة في زمننا'، وخلاصة البودكاست المشفرة برابط شخصي عبر RSS.
              </p>
              <div className="flex items-center gap-3 pt-1 font-sans">
                <Link
                  href="/subscribe"
                  onClick={() => setIsOpen(false)}
                  className="bg-neutral-900 hover:bg-black text-[#FCFBF9] text-xs font-bold px-3.5 py-1.5 rounded-xs transition-colors shadow-2xs"
                >
                  الاشتراك والعضوية ←
                </Link>
                <Link
                  href={`/auth/signin?callbackUrl=${encodeURIComponent(pathname || "/")}`}
                  onClick={() => setIsOpen(false)}
                  className="text-neutral-600 hover:text-black text-xs font-medium underline underline-offset-4 transition-colors"
                >
                  تسجيل الدخول
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* 8 Categories Navigation Section */}
        <div className="space-y-6 flex-grow">
          {/* Horizontal Category: Books (Distinct Elevated Treatment) */}
          <div>
            <div className="text-[10px] font-sans font-bold uppercase tracking-[0.14em] text-amber-900/90 pb-1.5 mb-2 border-b border-amber-200/80 flex items-center gap-1.5">
              <BookOpen className="w-3 h-3 text-amber-800" />
              <span>التصنيف المستقل: الكتب ومراجعات الأفكار</span>
            </div>
            <Link
              href="/books"
              onClick={() => setIsOpen(false)}
              className="group block p-3.5 bg-[#FBF6EC] border border-amber-200/90 hover:bg-[#F7EEDC] hover:border-amber-300 transition-all rounded-xs shadow-2xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-serif font-bold text-[17px] text-amber-950 group-hover:text-amber-900 transition-colors leading-tight">
                    الكتب: تأصيل الفكرة وتشريح الحاضر
                  </h4>
                  <span className="text-[9.5px] font-mono tracking-wider text-amber-800/80 uppercase block mt-0.5" dir="ltr">
                    Books & Critical Theory
                  </span>
                  <p className="text-xs text-amber-900/80 font-serif mt-1.5 leading-relaxed">
                    تفكيك أمهات الكتب الفكرية والاستراتيجية مقترنة بقسم 'الفكرة في زمننا'.
                  </p>
                </div>
                <span className="text-amber-800 font-serif text-sm group-hover:translate-x-[-2px] transition-transform">
                  ←
                </span>
              </div>
            </Link>
          </div>

          {/* 7 Main Categories (Tight, Considered Editorial Index) */}
          <div>
            <div className="text-[10px] font-sans font-bold uppercase tracking-[0.14em] text-neutral-400 pb-1.5 mb-1.5 border-b border-neutral-200/80 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3 h-3 text-neutral-400" />
                <span>الأقسام التحليلية السبعة</span>
              </span>
              <span className="text-[10px] font-mono text-neutral-400">7 SECTORS</span>
            </div>
            <ul className="divide-y divide-neutral-200/60 border-y border-neutral-200/70">
              {mainCategories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="group flex items-center justify-between py-2 px-2 hover:bg-neutral-100/60 transition-colors text-right rounded-2xs"
                  >
                    <div className="pr-1">
                      <div className="font-serif font-bold text-[15.5px] text-neutral-900 group-hover:text-amber-900 transition-colors leading-snug">
                        {cat.title}
                      </div>
                      <span className="text-[9.5px] font-mono tracking-wider text-neutral-400/80 uppercase block mt-0.5 group-hover:text-neutral-500 transition-colors" dir="ltr">
                        {cat.titleEn}
                      </span>
                    </div>
                    <span className="text-neutral-300 group-hover:text-neutral-700 transition-colors text-xs font-mono group-hover:translate-x-[-2px] transition-transform">
                      ←
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Additional Quick Routes */}
          <div>
            <div className="text-[10px] font-sans font-bold uppercase tracking-[0.14em] text-neutral-400 pb-1.5 mb-2 border-b border-neutral-200/80">
              مسارات استكشافية
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-sans">
              <Link
                href="/archive"
                onClick={() => setIsOpen(false)}
                className="py-2 px-3 bg-white border border-neutral-200/80 hover:border-neutral-900 text-neutral-800 font-bold transition-colors rounded-xs text-center shadow-2xs"
              >
                الأرشيف المفهرس
              </Link>
              <Link
                href="/subscribe"
                onClick={() => setIsOpen(false)}
                className="py-2 px-3 bg-white border border-neutral-200/80 hover:border-neutral-900 text-neutral-800 font-bold transition-colors rounded-xs text-center shadow-2xs"
              >
                الاشتراك والعضوية
              </Link>
            </div>
          </div>

          {/* Administrative & Legal Links (Clean 2-Column Editorial, No Bullets) */}
          <div className="pt-4 border-t border-neutral-200/80 font-sans">
            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-400 mb-2.5">
              هيئة النشر والوثائق القانونية
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              <Link
                href="/about"
                onClick={() => setIsOpen(false)}
                className="text-neutral-600 hover:text-neutral-950 transition-colors py-0.5"
              >
                عن المنصة (من نحن)
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="text-neutral-600 hover:text-neutral-950 transition-colors py-0.5"
              >
                التواصل والاستفسارات
              </Link>
              <Link
                href="/privacy"
                onClick={() => setIsOpen(false)}
                className="text-neutral-600 hover:text-neutral-950 transition-colors py-0.5"
              >
                سياسة الخصوصية
              </Link>
              <Link
                href="/terms"
                onClick={() => setIsOpen(false)}
                className="text-neutral-600 hover:text-neutral-950 transition-colors py-0.5"
              >
                الشروط والأحكام
              </Link>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-200/60 flex items-center justify-between text-[10px] text-neutral-400">
              <span>مِعمار © {new Date().getFullYear()}</span>
              <span className="font-mono text-[9px] text-neutral-400">STRATEGIC DOSSIERS</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
