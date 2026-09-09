"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  CreditCard,
  MessageSquare,
  Inbox,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

interface AdminNavProps {
  userEmail: string;
  userName: string;
}

export default function AdminNav({ userEmail, userName }: AdminNavProps) {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/admin",
      label: "نظرة عامة وإحصائيات",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: "/admin/articles",
      label: "إدارة المقالات والمسودات",
      icon: FileText,
      exact: false,
    },
    {
      href: "/admin/team",
      label: "فريق العمل والكُتّاب",
      icon: Users,
      exact: false,
    },
    {
      href: "/admin/users",
      label: "إدارة المستخدمين والصلاحيات",
      icon: Users,
      exact: false,
    },
    {
      href: "/admin/subscriptions",
      label: "الاشتراكات والإيرادات",
      icon: CreditCard,
      exact: false,
    },
    {
      href: "/admin/comments",
      label: "الإشراف على التعليقات",
      icon: MessageSquare,
      exact: false,
    },
    {
      href: "/admin/contact",
      label: "رسائل التواصل الواردة",
      icon: Inbox,
      exact: false,
    },
  ];

  const isCurrentActive = (item: typeof navItems[0]) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  };

  return (
    <aside className="w-full lg:w-64 shrink-0 bg-white border-b lg:border-b-0 lg:border-l border-[#E5E2DC] flex flex-col justify-between" dir="rtl">
      <div>
        {/* Brand / Title */}
        <div className="p-4 sm:p-5 border-b border-[#E5E2DC] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xs bg-neutral-900 text-[#FAF7F0] flex items-center justify-center font-serif font-bold text-base border border-[#C86A00]">
              مِ
            </div>
            <div>
              <span className="font-bold text-sm text-neutral-900 font-sans block leading-none">
                مِعمار • الإدارة
              </span>
              <span className="text-[10px] text-neutral-400 font-sans mt-0.5 block">
                بوابة الرقابة والتحكم
              </span>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 bg-amber-50 text-[#C86A00] border border-amber-200 px-2 py-0.5 text-[10px] font-bold rounded-2xs">
            <ShieldCheck className="w-3 h-3" />
            <span>مشرف</span>
          </span>
        </div>

        {/* Navigation links */}
        <nav className="p-2 sm:p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isCurrentActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xs text-xs font-bold transition-colors ${
                  active
                    ? "bg-neutral-900 text-white font-sans shadow-2xs"
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-[#FAF7F0]"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? "text-[#FBBF24]" : "text-neutral-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Admin footer info */}
      <div className="p-3 sm:p-4 border-t border-[#E5E2DC] bg-[#FCFBF9] space-y-3">
        <div className="text-[11px] font-sans">
          <span className="text-neutral-400 block text-[10px]">المشرف الحالي:</span>
          <span className="font-bold text-neutral-800 block truncate" title={userEmail}>
            {userName || userEmail}
          </span>
          <span className="font-mono text-[10px] text-neutral-500 block truncate">
            {userEmail}
          </span>
        </div>

        <Link
          href="/"
          className="flex items-center justify-between w-full px-3 py-2 bg-white border border-neutral-300 hover:border-neutral-800 text-[11px] font-bold text-neutral-700 hover:text-neutral-900 transition-colors rounded-xs"
        >
          <span>العودة للمنصة الرئيسية</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </aside>
  );
}
