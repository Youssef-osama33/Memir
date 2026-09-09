"use client";

import React, { useState, useMemo } from "react";
import { Search, CreditCard, CheckCircle2, Clock, XCircle, AlertCircle, Globe } from "lucide-react";

export interface AdminSubscriptionItem {
  id: string;
  userEmail: string;
  userName: string | null;
  tier: "STANDARD" | "PLUS";
  interval: "MONTHLY" | "YEARLY";
  status: string;
  pppCountryCode: string | null;
  pppDiscountApplied: boolean;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
}

interface SubscriptionsTableProps {
  subscriptions: AdminSubscriptionItem[];
}

export default function SubscriptionsTable({ subscriptions }: SubscriptionsTableProps) {
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [intervalFilter, setIntervalFilter] = useState("ALL");

  const filteredSubs = useMemo(() => {
    return subscriptions.filter((s) => {
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchEmail = s.userEmail.toLowerCase().includes(q);
        const matchName = s.userName ? s.userName.toLowerCase().includes(q) : false;
        if (!matchEmail && !matchName) return false;
      }

      if (tierFilter !== "ALL" && s.tier !== tierFilter) return false;
      if (statusFilter !== "ALL" && s.status !== statusFilter) return false;
      if (intervalFilter !== "ALL" && s.interval !== intervalFilter) return false;

      return true;
    });
  }, [subscriptions, search, tierFilter, statusFilter, intervalFilter]);

  const activeCount = subscriptions.filter((s) => s.status === "ACTIVE").length;
  const pppCount = subscriptions.filter((s) => s.pppDiscountApplied).length;

  return (
    <div className="space-y-4" dir="rtl">
      {/* Summary KPI Badges */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-sans">
        <span className="bg-white border border-[#E5E2DC] px-3 py-1.5 rounded-xs font-bold text-neutral-800">
          إجمالي سجلات الفوترة: <span className="font-mono text-[#C86A00]">{subscriptions.length}</span>
        </span>
        <span className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-xs font-bold">
          اشتراكات سارية (Active): <span className="font-mono">{activeCount}</span>
        </span>
        <span className="bg-blue-50 border border-blue-200 text-blue-800 px-3 py-1.5 rounded-xs font-bold">
          مستفيدو تسعير القوة الشرائية (PPP): <span className="font-mono">{pppCount}</span>
        </span>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-[#E5E2DC] p-4 rounded-sm shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="ابحث بالبريد أو اسم المشترك..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#FCFBF9] border border-neutral-300 text-xs py-2 pr-8 pl-3 rounded-xs focus:outline-none focus:border-neutral-900"
            />
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-3" />
          </div>

          {/* Tier Filter */}
          <div>
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="w-full bg-[#FCFBF9] border border-neutral-300 text-xs py-2 px-2.5 rounded-xs focus:outline-none focus:border-neutral-900 font-sans"
            >
              <option value="ALL">جميع الباقات (بلس وقياسي)</option>
              <option value="PLUS">مِعمار بلس (PLUS)</option>
              <option value="STANDARD">الاشتراك القياسي (STANDARD)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[#FCFBF9] border border-neutral-300 text-xs py-2 px-2.5 rounded-xs focus:outline-none focus:border-neutral-900 font-sans"
            >
              <option value="ALL">جميع الحالات (سارية، ملغاة، متأخرة)</option>
              <option value="ACTIVE">سارية (ACTIVE)</option>
              <option value="CANCELED">ملغاة (CANCELED)</option>
              <option value="PAST_DUE">متأخرة السداد (PAST_DUE)</option>
            </select>
          </div>

          {/* Interval Filter */}
          <div>
            <select
              value={intervalFilter}
              onChange={(e) => setIntervalFilter(e.target.value)}
              className="w-full bg-[#FCFBF9] border border-neutral-300 text-xs py-2 px-2.5 rounded-xs focus:outline-none focus:border-neutral-900 font-sans"
            >
              <option value="ALL">دورة الفوترة (الكل)</option>
              <option value="MONTHLY">شهري (Monthly)</option>
              <option value="YEARLY">سنوي (Yearly)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E5E2DC] rounded-sm shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right border-collapse">
            <thead>
              <tr className="bg-[#FAF7F0] border-b border-[#E5E2DC] text-neutral-600 font-sans font-bold">
                <th className="py-3 px-4">المشترك</th>
                <th className="py-3 px-3">الباقة</th>
                <th className="py-3 px-3">دورة الفوترة</th>
                <th className="py-3 px-3">حالة السريان</th>
                <th className="py-3 px-3">تسعير PPP</th>
                <th className="py-3 px-3">نهاية الفترة الحالية</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-sans">
              {filteredSubs.length > 0 ? (
                filteredSubs.map((s) => (
                  <tr key={s.id} className="hover:bg-[#FCFBF9] transition-colors">
                    {/* User */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-neutral-900">{s.userName || "—"}</div>
                      <div className="text-[10px] text-neutral-500 font-mono">{s.userEmail}</div>
                    </td>

                    {/* Tier */}
                    <td className="py-3.5 px-3">
                      {s.tier === "PLUS" ? (
                        <span className="inline-flex items-center gap-1 text-[#8C4B00] bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-2xs text-[10px] font-bold">
                          <span>مِعمار بلس</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-neutral-800 bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded-2xs text-[10px] font-bold">
                          <span>القياسي</span>
                        </span>
                      )}
                    </td>

                    {/* Interval */}
                    <td className="py-3.5 px-3 font-mono text-[11px] text-neutral-700 font-bold">
                      {s.interval === "YEARLY" ? "سنوي (خصم شهرين)" : "شهري"}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3">
                      {s.status === "ACTIVE" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-2xs text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>سارٍ</span>
                          {s.cancelAtPeriodEnd && (
                            <span className="text-[9px] text-amber-700 font-normal mr-1">
                              (ينتهي قريباً)
                            </span>
                          )}
                        </span>
                      ) : s.status === "CANCELED" ? (
                        <span className="inline-flex items-center gap-1 text-red-800 bg-red-50 border border-red-200 px-2 py-0.5 rounded-2xs text-[10px]">
                          <XCircle className="w-3 h-3 text-red-500" />
                          <span>ملغى</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-2xs text-[10px]">
                          <AlertCircle className="w-3 h-3 text-amber-500" />
                          <span>{s.status}</span>
                        </span>
                      )}
                    </td>

                    {/* PPP Discount */}
                    <td className="py-3.5 px-3">
                      {s.pppCountryCode ? (
                        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded-2xs text-[10px] font-mono">
                          <Globe className="w-3 h-3 text-blue-600" />
                          <span>{s.pppCountryCode}</span>
                          {s.pppDiscountApplied && <span className="font-bold text-[9px]">(-40%)</span>}
                        </span>
                      ) : (
                        <span className="text-neutral-400 font-mono text-[10px]">عالمي (Global)</span>
                      )}
                    </td>

                    {/* Current Period End */}
                    <td className="py-3.5 px-3 text-neutral-600 font-mono text-[11px]">
                      {new Date(s.currentPeriodEnd).toLocaleDateString("ar-EG", {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-400 font-serif">
                    لا توجد اشتراكات مطابقة للخيارات المحددة.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
