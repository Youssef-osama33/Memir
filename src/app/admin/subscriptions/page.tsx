export const dynamic = "force-dynamic";

import React from "react";
import { db } from "../../../lib/db";
import SubscriptionsTable, {
  AdminSubscriptionItem,
} from "../../../components/admin/SubscriptionsTable";
import { DollarSign, TrendingUp, Calendar } from "lucide-react";

export default async function AdminSubscriptionsPage() {
  let subscriptions: AdminSubscriptionItem[] = [];
  const monthlyRevenueData: { label: string; amount: number }[] = [];

  const now = new Date();

  if ((process.env.DATABASE_URL || process.env.SQL_HOST)) {
    try {
      // 1. Fetch all subscriptions
      const dbSubs = await db.subscription.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      subscriptions = dbSubs.map((s) => ({
        id: s.id,
        userEmail: s.user.email || "—",
        userName: s.user.name || null,
        tier: (s.tier as "STANDARD" | "PLUS") || "STANDARD",
        interval: (s.interval as "MONTHLY" | "YEARLY") || "MONTHLY",
        status: s.status,
        pppCountryCode: s.pppCountryCode || null,
        pppDiscountApplied: s.pppDiscountApplied,
        currentPeriodEnd: s.currentPeriodEnd.toISOString(),
        cancelAtPeriodEnd: s.cancelAtPeriodEnd,
        createdAt: s.createdAt.toISOString(),
      }));

      // 2. Fetch last 6 calendar months revenue
      for (let i = 5; i >= 0; i--) {
        const startDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1);
        const label = startDate.toLocaleDateString("ar-EG", {
          month: "short",
          year: "numeric",
        });

        const invoices = await db.invoice.findMany({
          where: {
            createdAt: { gte: startDate, lt: endDate },
            status: { in: ["PAID", "paid"] },
          },
          select: { amountPaid: true },
        });

        const cents = invoices.reduce((sum, inv) => sum + (inv.amountPaid || 0), 0);
        monthlyRevenueData.push({
          label,
          amount: cents / 100,
        });
      }
    } catch (err) {
      console.error("[ADMIN_SUBSCRIPTIONS_PAGE_ERR]", err);
    }
  } else {
    // Demo fallback for months
    for (let i = 5; i >= 0; i--) {
      const startDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = startDate.toLocaleDateString("ar-EG", {
        month: "short",
        year: "numeric",
      });
      monthlyRevenueData.push({ label, amount: 0 });
    }
  }

  const maxRevenue = Math.max(...monthlyRevenueData.map((m) => m.amount), 100);
  const total6MonthRevenue = monthlyRevenueData.reduce((acc, m) => acc + m.amount, 0);

  return (
    <div className="space-y-8" dir="rtl">
      {/* Header */}
      <div className="border-b border-[#E5E2DC] pb-4">
        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-sans block">
          الفوترة والشؤون المالية
        </span>
        <h1 className="text-2xl font-bold font-sans text-neutral-900 mt-0.5">
          الاشتراكات وسجلات الإيرادات
        </h1>
        <p className="text-xs text-neutral-500 font-sans mt-1">
          متابعة اشتراكات الأعضاء (القياسي وبلس)، والتحقق من تطبيق خصومات تعادل القوة الشرائية، ومخطط الإيرادات لآخر 6 أشهر.
        </p>
      </div>

      {/* Revenue Last 6 Months Chart Block */}
      <div className="bg-white border border-[#E5E2DC] p-5 sm:p-6 rounded-sm shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#C86A00]" />
            <h2 className="text-sm font-bold text-neutral-900 font-sans">
              سجل الإيرادات الشهرية المحققة (آخر 6 أشهر)
            </h2>
          </div>
          <div className="flex items-center gap-3 text-xs font-sans">
            <span className="text-neutral-500">إجمالي الـ 6 أشهر:</span>
            <span className="font-mono font-bold text-emerald-800 text-sm">
              ${total6MonthRevenue.toFixed(2)}
            </span>
          </div>
        </div>

        {/* SVG/CSS Clean Bar Chart */}
        <div className="pt-4 pb-2">
          <div className="grid grid-cols-6 gap-2 sm:gap-4 items-end h-44 border-b border-neutral-200 px-2 sm:px-6">
            {monthlyRevenueData.map((item, idx) => {
              const heightPercent = Math.max(
                item.amount > 0 ? Math.round((item.amount / maxRevenue) * 100) : 4,
                4
              );
              return (
                <div key={idx} className="flex flex-col items-center h-full justify-end group">
                  <div className="font-mono text-[10px] text-neutral-700 font-bold mb-1 opacity-90 transition-opacity">
                    ${item.amount.toFixed(0)}
                  </div>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full max-w-[48px] bg-neutral-900 group-hover:bg-[#C86A00] transition-colors rounded-t-2xs"
                  />
                  <div className="text-[10px] sm:text-[11px] font-mono text-neutral-500 mt-2 truncate max-w-full text-center">
                    {item.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <p className="text-[11px] text-neutral-400 font-sans text-left">
          * الإيرادات محسوبة من إجمالي الفواتير المسددة (Paid Invoices) بدقة السنت.
        </p>
      </div>

      {/* Subscriptions Table */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-neutral-900 font-sans">
          سجل الاشتراكات المفصل
        </h2>
        <SubscriptionsTable subscriptions={subscriptions} />
      </div>
    </div>
  );
}
