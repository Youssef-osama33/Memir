"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X, BookOpen, Layers, ShieldCheck, User, PenTool, LogOut, ChevronDown, Bookmark, Settings, Sparkles } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { CATEGORIES } from "../lib/categories";
import { BrandMark } from "./BrandMark";
import SearchOverlay from "./search/SearchOverlay";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const drawerRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsUserMenuOpen(false);
  }, [pathname]);

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
          <Link href="/" className="flex items-center focus:outline-none group">
            <BrandMark size="md" withTagline={false} />
          </Link>

          {/* Primary Editorial Nav on Desktop */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-sans text-neutral-600 mr-2">
            <Link 
              href="/" 
              className={`font-bold transition-colors ${pathname === "/" ? "text-[#C86A00] font-extrabold" : "text-neutral-900 hover:text-[#C86A00]"}`}
            >
              الرئيسية
            </Link>
            <Link href="/#categories" className="hover:text-[#C86A00] transition-colors">
              الأقسام
            </Link>
            <Link 
              href="/books" 
              className={`flex items-center gap-1 font-bold transition-colors ${pathname?.startsWith("/books") ? "text-[#C86A00]" : "text-neutral-900 hover:text-[#C86A00]"}`}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#C86A00]" />
              <span>الكتب (الفكرة في زمننا)</span>
            </Link>
            <Link 
              href="/archive" 
              className={`transition-colors ${pathname?.startsWith("/archive") ? "text-[#C86A00] font-bold" : "hover:text-[#C86A00]"}`}
            >
              الأرشيف
            </Link>
            <Link 
              href="/community" 
              className={`transition-colors font-bold ${pathname?.startsWith("/community") ? "text-[#C86A00] font-bold" : "text-neutral-900 hover:text-[#C86A00]"}`}
            >
              المجتمع
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3 font-sans">
          {session ? (
            <div className="flex items-center gap-2">
              {session.user?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="hidden sm:flex text-xs font-bold text-neutral-900 border border-neutral-300 hover:border-black px-3 py-1.5 rounded-xs transition-colors items-center gap-1.5 bg-white shadow-2xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-neutral-700" />
                  <span>الإدارة</span>
                </Link>
              )}
              {session.user?.role === "WRITER" && (
                <Link
                  href="/writer"
                  className="hidden sm:flex text-xs font-bold text-neutral-900 border border-neutral-300 hover:border-black px-3 py-1.5 rounded-xs transition-colors items-center gap-1.5 bg-white shadow-2xs"
                >
                  <PenTool className="w-3.5 h-3.5 text-neutral-700" />
                  <span>لوحة الكاتب</span>
                </Link>
              )}

              {/* Enhanced 'حسابي' (My Account) dropdown menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="text-xs font-bold text-neutral-900 border border-neutral-300 hover:border-black px-3 py-1.5 rounded-xs transition-colors flex items-center gap-1.5 bg-white shadow-2xs cursor-pointer focus:outline-none"
                  aria-expanded={isUserMenuOpen}
                  aria-label="قائمة حسابي"
                >
                  <User className="w-3.5 h-3.5 text-[#C86A00]" />
                  <span>حسابي</span>
                  <ChevronDown className={`w-3 h-3 text-neutral-400 transition-transform duration-200 ${isUserMenuOpen ? "rotate-180 text-black" : ""}`} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute left-0 mt-2 w-60 bg-white border border-neutral-200 rounded-xs shadow-xl py-2 z-50 text-right font-sans">
                    <div className="px-3.5 py-2.5 border-b border-neutral-100 mb-1 bg-[#FCFBF9]">
                      <div className="text-xs font-bold text-neutral-900 truncate">
                        {session.user?.name || "المشترك"}
                      </div>
                      <div className="text-[11px] font-mono text-neutral-500 truncate mt-0.5" dir="ltr">
                        {session.user?.email}
                      </div>
                      {session.user?.isPremium ? (
                        <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-2xs">
                          <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                          <span>باقة مِعمار بلس النشطة</span>
                        </div>
                      ) : (
                        <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-2xs">
                          <span>عضوية قياسية</span>
                        </div>
                      )}
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-neutral-700 hover:bg-[#FAF7F0] hover:text-black transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-[#C86A00]" />
                      <span>حسابي ولوحة التحكم</span>
                    </Link>

                    <Link
                      href="/dashboard"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-neutral-700 hover:bg-[#FAF7F0] hover:text-black transition-colors"
                    >
                      <Bookmark className="w-3.5 h-3.5 text-neutral-500" />
                      <span>المقالات المحفوظة والأرشيف</span>
                    </Link>

                    {session.user?.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-neutral-700 hover:bg-[#FAF7F0] hover:text-black transition-colors"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-neutral-700" />
                        <span>لوحة الإدارة</span>
                      </Link>
                    )}

                    {session.user?.role === "WRITER" && (
                      <Link
                        href="/writer"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-neutral-700 hover:bg-[#FAF7F0] hover:text-black transition-colors"
                      >
                        <PenTool className="w-3.5 h-3.5 text-neutral-700" />
                        <span>لوحة الكاتب والتحرير</span>
                      </Link>
                    )}

                    <div className="h-[1px] bg-neutral-100 my-1" />

                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors text-right cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5 text-red-500" />
                      <span>تسجيل الخروج</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href={`/auth/signin?callbackUrl=${encodeURIComponent(pathname || "/")}`}
                className="text-xs font-bold text-neutral-800 hover:text-black border border-neutral-300 hover:border-black px-3 py-1.5 rounded-xs transition-colors bg-white shadow-2xs"
              >
                تسجيل الدخول
              </Link>
              <Link
                href={`/auth/signup?callbackUrl=${encodeURIComponent(pathname || "/")}`}
                className="hidden sm:inline-flex text-xs font-bold text-white bg-black hover:bg-neutral-800 px-3 py-1.5 rounded-xs transition-colors shadow-2xs"
              >
                إنشاء حساب
              </Link>
            </div>
          )}

          <button
            onClick={() => setIsSearchOpen(true)}
            className="text-neutral-600 hover:text-black p-1.5 transition-colors focus:outline-none ml-2"
            aria-label="البحث"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2 px-3 py-1.5 bg-neutral-900 hover:bg-black text-white rounded-xs border border-neutral-900 transition-all duration-150 cursor-pointer focus:outline-none shadow-2xs hover:shadow-xs"
            aria-label="فتح القائمة الرئيسية والفهرس"
          >
            <div className="flex flex-col justify-center items-end gap-1 w-4 h-3.5" aria-hidden="true">
              <span className="w-4 h-[1.5px] bg-white transition-all duration-150 group-hover:w-4 rounded-full" />
              <span className="w-2.5 h-[1.5px] bg-amber-400 transition-all duration-150 group-hover:w-3.5 rounded-full" />
              <span className="w-3.5 h-[1.5px] bg-white transition-all duration-150 group-hover:w-4 rounded-full" />
            </div>
            <span className="text-xs font-sans font-bold tracking-wide hidden sm:inline">الفهرس</span>
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
          <Link href="/" onClick={() => setIsOpen(false)} className="group focus:outline-none">
            <BrandMark size="sm" withTagline={true} />
          </Link>
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
          <form action="/archive" method="get" className="mb-4">
            <div className="relative">
              <input 
                type="search" 
                name="q" 
                placeholder="ابحث في المقالات..." 
                className="w-full bg-white border border-neutral-200/80 rounded-xs py-2 pr-9 pl-3 text-sm focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400 transition-colors"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900 transition-colors">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {session ? (
            <div className="bg-[#F7F4EC] border border-[#E7E0CE] p-4.5 rounded-xs shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-amber-900/10 border border-amber-800/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-[#C86A00]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold font-sans text-neutral-900 block">
                      حسابي ({session.user?.name || "المشترك"})
                    </span>
                  </div>
                </div>
                {session.user?.isPremium ? (
                  <span className="bg-amber-900 text-amber-100 text-[10px] font-sans font-bold px-2 py-0.5 rounded-2xs flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-amber-300" />
                    عضوية ممتازة
                  </span>
                ) : (
                  <span className="bg-neutral-200 text-neutral-800 text-[10px] font-sans font-bold px-2 py-0.5 rounded-2xs">
                    عضوية قياسية
                  </span>
                )}
              </div>
              <div className="text-xs font-mono text-neutral-600 mb-3 text-left truncate" dir="ltr">
                {session.user?.email}
              </div>
              
              <div className="space-y-2">
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center bg-neutral-900 text-white text-xs font-bold py-2.5 hover:bg-black rounded-xs transition-colors shadow-2xs"
                >
                  الذهاب إلى حسابي وإدارة الاشتراكات ←
                </Link>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  {session.user?.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      onClick={() => setIsOpen(false)}
                      className="text-center bg-white border border-neutral-300 hover:border-black text-neutral-900 text-xs font-bold py-1.5 rounded-xs transition-colors flex items-center justify-center gap-1"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-neutral-700" />
                      <span>لوحة الإدارة</span>
                    </Link>
                  )}
                  {session.user?.role === "WRITER" && (
                    <Link
                      href="/writer"
                      onClick={() => setIsOpen(false)}
                      className="text-center bg-white border border-neutral-300 hover:border-black text-neutral-900 text-xs font-bold py-1.5 rounded-xs transition-colors flex items-center justify-center gap-1"
                    >
                      <PenTool className="w-3.5 h-3.5 text-neutral-700" />
                      <span>لوحة الكاتب</span>
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className={`text-center border border-neutral-300 hover:border-red-400 bg-white text-red-600 hover:bg-red-50 text-xs font-bold py-1.5 rounded-xs transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                      session.user?.role !== "ADMIN" && session.user?.role !== "WRITER" ? "col-span-2" : ""
                    }`}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>تسجيل الخروج</span>
                  </button>
                </div>
              </div>
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
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
