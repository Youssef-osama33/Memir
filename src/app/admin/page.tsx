export const dynamic = "force-dynamic";

import React from "react";
import Link from "next/link";
import { db } from "../../lib/db";
import { getAllArticles } from "../../lib/articles";
import {
  FileText,
  Users,
  DollarSign,
  TrendingUp,
  CreditCard,
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Calendar,
} from "lucide-react";

export default async function AdminOverviewPage() {
  // 1. Articles Counts (from MDX files directly)
  const allArticles = await getAllArticles(true);
  const totalPublishedArticles = allArticles.filter((a) => !a.metadata.draft).length;
  const totalDraftArticles = allArticles.filter((a) => Boolean(a.metadata.draft)).length;

  // 2. Database Stats
  let totalUsers = 0;
  let standardCount = 0;
  let plusCount = 0;
  let monthlyCount = 0;
  let yearlyCount = 0;
  let revenueThisMonthDisplay = "0.00";
  let recentUsers: any[] = [];
  let recentWebhookEvents: any[] = [];

  if ((process.env.DATABASE_URL || process.env.SQL_HOST)) {
    try {
      totalUsers = await db.user.count();

      const activeSubscriptions = await db.subscription.findMany({
        where: { status: "ACTIVE" },
        select: { tier: true, interval: true },
      });

      standardCount = activeSubscriptions.filter((s) => s.tier === "STANDARD").length;
      plusCount = activeSubscriptions.filter((s) => s.tier === "PLUS").length;
      monthlyCount = activeSubscriptions.filter((s) => s.interval === "MONTHLY").length;
      yearlyCount = activeSubscriptions.filter((s) => s.interval === "YEARLY").length;

      // Revenue this calendar month
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const invoicesThisMonth = await db.invoice.findMany({
        where: {
          createdAt: { gte: startOfMonth },
          status: { in: ["PAID", "paid"] },
        },
        select: { amountPaid: true },
      });

      const revenueCents = invoicesThisMonth.reduce(
        (sum, inv) => sum + (inv.amountPaid || 0),
        0
      );
      revenueThisMonthDisplay = (revenueCents / 100).toFixed(2);

      // Last 10 registered users
      recentUsers = await db.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          subscriptions: {
            where: { status: "ACTIVE" },
            select: { tier: true },
            take: 1,
          },
        },
      });

      // Last 10 Webhook logs
      recentWebhookEvents = await db.webhookLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          eventType: true,
          stripeEventId: true,
          processed: true,
          errorMessage: true,
          createdAt: true,
        },
      });
    } catch (err) {
      console.error("[ADMIN_STATS_FETCH_ERR]", err);
    }
  }

  const freeUsersCount = Math.max(0, totalUsers - (standardCount + plusCount));

  return (
    <div className="space-y-8" dir="rtl">
      {/* Header */}
      <div className="border-b border-[#E5E2DC] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-sans block">
            لوحة الإدارة والمؤشرات الحيوية
          </span>
          <h1 className="text-2xl font-bold font-sans text-neutral-900 mt-0.5">
            نظرة عامة على أداء المنظومة
          </h1>
        </div>
        <div className="text-xs text-neutral-500 font-mono">
          آخر تحديث: {new Date().toLocaleTimeString("ar-EG")}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Articles */}
        <div className="bg-white border border-[#E5E2DC] p-5 rounded-sm shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-bold font-sans">الأوراق والدراسات</span>
            <FileText className="w-4 h-4 text-[#C86A00]" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-neutral-900">
              {totalPublishedArticles + totalDraftArticles}
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs font-sans">
              <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-2xs font-bold text-[11px]">
                {totalPublishedArticles} منشورة
              </span>
              <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-2xs font-bold text-[11px]">
                {totalDraftArticles} مسودة
              </span>
            </div>
          </div>
          <Link
            href="/admin/articles"
            className="text-[11px] font-bold text-neutral-600 hover:text-black mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between"
          >
            <span>إدارة النشر والمسودات</span>
            <ArrowLeft className="w-3 h-3" />
          </Link>
        </div>

        {/* Metric 2: Users */}
        <div className="bg-white border border-[#E5E2DC] p-5 rounded-sm shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-bold font-sans">المستخدمون المسجلون</span>
            <Users className="w-4 h-4 text-neutral-700" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-neutral-900">
              {totalUsers}
            </div>
            <p className="text-xs text-neutral-500 mt-1 font-sans">
              حسابات مفعلة وموثقة بالمنظومة
            </p>
          </div>
          <Link
            href="/admin/users"
            className="text-[11px] font-bold text-neutral-600 hover:text-black mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between"
          >
            <span>عرض قائمة المستخدمين</span>
            <ArrowLeft className="w-3 h-3" />
          </Link>
        </div>

        {/* Metric 3: Active Subscriptions */}
        <div className="bg-white border border-[#E5E2DC] p-5 rounded-sm shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-bold font-sans">الاشتراكات النشطة</span>
            <CreditCard className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-neutral-900">
              {standardCount + plusCount}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-[11px] font-sans">
              <span className="text-neutral-700 font-bold">{plusCount} بلس</span>
              <span className="text-neutral-300">•</span>
              <span className="text-neutral-700 font-bold">{standardCount} قياسي</span>
            </div>
          </div>
          <Link
            href="/admin/subscriptions"
            className="text-[11px] font-bold text-neutral-600 hover:text-black mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between"
          >
            <span>تفاصيل الاشتراكات</span>
            <ArrowLeft className="w-3 h-3" />
          </Link>
        </div>

        {/* Metric 4: Revenue This Month */}
        <div className="bg-white border border-[#E5E2DC] p-5 rounded-sm shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-bold font-sans">إيراد الشهر الحالي</span>
            <DollarSign className="w-4 h-4 text-emerald-700" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-neutral-900">
              ${revenueThisMonthDisplay}
            </div>
            <p className="text-[11px] text-neutral-500 mt-1 font-sans">
              إجمالي فواتير المسددة للشهر التقويمي
            </p>
          </div>
          <div className="text-[11px] text-neutral-400 mt-3 pt-3 border-t border-neutral-100 font-mono">
            {new Date().toLocaleDateString("ar-EG", { month: "long", year: "numeric" })}
          </div>
        </div>
      </div>

      {/* Subscriptions Breakdown Detail Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Breakdown by Tier */}
        <div className="bg-white border border-[#E5E2DC] p-5 sm:p-6 rounded-sm shadow-xs">
          <h3 className="text-sm font-bold text-neutral-900 font-sans mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#C86A00]" />
            <span>توزيع المشتركين حسب الباقة</span>
          </h3>
          <div className="space-y-3 font-sans text-xs">
            <div className="flex items-center justify-between p-3 bg-[#FAF7F0] border border-[#E5E2DC] rounded-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C86A00]" />
                <span className="font-bold text-neutral-900">مِعمار بلس (PLUS)</span>
              </div>
              <span className="font-mono font-bold text-neutral-900 text-sm">{plusCount}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#FAF7F0] border border-[#E5E2DC] rounded-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
                <span className="font-bold text-neutral-900">الاشتراك القياسي (STANDARD)</span>
              </div>
              <span className="font-mono font-bold text-neutral-900 text-sm">{standardCount}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#FAF7F0] border border-[#E5E2DC] rounded-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-300" />
                <span className="font-bold text-neutral-900">العضوية المجانية (FREE)</span>
              </div>
              <span className="font-mono font-bold text-neutral-900 text-sm">{freeUsersCount}</span>
            </div>
          </div>
        </div>

        {/* Breakdown by Interval */}
        <div className="bg-white border border-[#E5E2DC] p-5 sm:p-6 rounded-sm shadow-xs">
          <h3 className="text-sm font-bold text-neutral-900 font-sans mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-neutral-700" />
            <span>توزيع الاشتراكات المدفوعة حسب دورة الفوترة</span>
          </h3>
          <div className="space-y-3 font-sans text-xs">
            <div className="flex items-center justify-between p-3 bg-[#FAF7F0] border border-[#E5E2DC] rounded-xs">
              <span className="font-bold text-neutral-900">فوترة سنوية (خصم شهرين)</span>
              <span className="font-mono font-bold text-neutral-900 text-sm">{yearlyCount}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#FAF7F0] border border-[#E5E2DC] rounded-xs">
              <span className="font-bold text-neutral-900">فوترة شهرية</span>
              <span className="font-mono font-bold text-neutral-900 text-sm">{monthlyCount}</span>
            </div>

            <div className="p-3 border border-dashed border-neutral-200 rounded-xs text-[11px] text-neutral-500">
              نسبة الاشتراكات السنوية إلى الإجمالي:{" "}
              <span className="font-bold font-mono text-neutral-800">
                {standardCount + plusCount > 0
                  ? Math.round((yearlyCount / (standardCount + plusCount)) * 100)
                  : 0}
                %
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Columns: Recent Signups & Stripe Webhook Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Signups */}
        <div className="bg-white border border-[#E5E2DC] p-5 sm:p-6 rounded-sm shadow-xs">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-neutral-700" />
              <h3 className="text-sm font-bold text-neutral-900 font-sans">
                أحدث المنضمين (آخر 10 مستخدمين)
              </h3>
            </div>
            <Link
              href="/admin/users"
              className="text-xs text-[#C86A00] hover:underline font-bold"
            >
              الكل ←
            </Link>
          </div>

          {recentUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-400 font-sans">
                    <th className="pb-2">الاسم / البريد</th>
                    <th className="pb-2">الصلاحية</th>
                    <th className="pb-2">الباقة</th>
                    <th className="pb-2 text-left">التاريخ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 font-sans">
                  {recentUsers.map((u) => {
                    const activeSub = u.subscriptions?.[0]?.tier;
                    return (
                      <tr key={u.id} className="hover:bg-neutral-50/70">
                        <td className="py-2.5">
                          <div className="font-bold text-neutral-900">{u.name || "—"}</div>
                          <div className="text-[10px] text-neutral-500 font-mono">{u.email}</div>
                        </td>
                        <td className="py-2.5">
                          <span
                            className={`px-1.5 py-0.5 text-[10px] font-bold rounded-2xs ${
                              u.role === "ADMIN"
                                ? "bg-amber-100 text-[#8C4B00]"
                                : "bg-neutral-100 text-neutral-700"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-2.5">
                          <span className="text-[10px] font-mono text-neutral-600 font-bold">
                            {activeSub || "FREE"}
                          </span>
                        </td>
                        <td className="py-2.5 text-left text-neutral-400 font-mono text-[10px]">
                          {new Date(u.createdAt).toLocaleDateString("ar-EG")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-neutral-400 italic py-6 text-center">
              لا توجد سجلات مستخدمين حالياً.
            </p>
          )}
        </div>

        {/* Recent Webhook Events (Stripe Debugging) */}
        <div className="bg-white border border-[#E5E2DC] p-5 sm:p-6 rounded-sm shadow-xs">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-neutral-700" />
              <h3 className="text-sm font-bold text-neutral-900 font-sans">
                أحدث أحداث Stripe (Webhook Logs)
              </h3>
            </div>
            <span className="text-[10px] text-neutral-400 font-mono">
              لتتبع معالجة الاشتراكات
            </span>
          </div>

          {recentWebhookEvents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-400 font-sans">
                    <th className="pb-2">نوع الحدث (Event Type)</th>
                    <th className="pb-2">الحالة</th>
                    <th className="pb-2 text-left">التوقيت</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 font-mono text-[11px]">
                  {recentWebhookEvents.map((evt) => (
                    <tr key={evt.id} className="hover:bg-neutral-50/70">
                      <td className="py-2.5 font-bold text-neutral-800 truncate max-w-[200px]" title={evt.eventType}>
                        {evt.eventType}
                      </td>
                      <td className="py-2.5">
                        {evt.processed ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-2xs text-[10px] font-sans font-bold">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>معالج بنجاح</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 px-1.5 py-0.5 rounded-2xs text-[10px] font-sans font-bold" title={evt.errorMessage || ""}>
                            <AlertCircle className="w-3 h-3" />
                            <span>فشل / معلق</span>
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 text-left text-neutral-400 text-[10px]">
                        {new Date(evt.createdAt).toLocaleTimeString("ar-EG")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-neutral-400 italic py-6 text-center">
              لم تسجل أي أحداث Webhook حتى الآن.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
