"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  ShieldCheck,
  User as UserIcon,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  X,
  CreditCard,
  Lock,
} from "lucide-react";

export interface AdminUserItem {
  id: string;
  name: string | null;
  email: string | null;
  role: "USER" | "ADMIN";
  tier: "FREE" | "STANDARD" | "PLUS";
  subscriptionStatus: string | null;
  createdAt: string;
}

interface UsersTableProps {
  initialUsers: AdminUserItem[];
  currentAdminId: string;
}

export default function UsersTable({ initialUsers, currentAdminId }: UsersTableProps) {
  const [users, setUsers] = useState<AdminUserItem[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL"); // ALL, USER, ADMIN
  const [tierFilter, setTierFilter] = useState("ALL"); // ALL, FREE, STANDARD, PLUS

  // State for Role Change Confirmation Modal
  const [targetUser, setTargetUser] = useState<AdminUserItem | null>(null);
  const [pendingRole, setPendingRole] = useState<"USER" | "ADMIN" | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = u.name ? u.name.toLowerCase().includes(query) : false;
        const matchEmail = u.email ? u.email.toLowerCase().includes(query) : false;
        if (!matchName && !matchEmail) return false;
      }

      if (roleFilter !== "ALL" && u.role !== roleFilter) return false;
      if (tierFilter !== "ALL" && u.tier !== tierFilter) return false;

      return true;
    });
  }, [users, searchQuery, roleFilter, tierFilter]);

  // Open confirmation modal
  const promptRoleChange = (user: AdminUserItem, newRole: "USER" | "ADMIN") => {
    if (user.role === newRole) return;
    setTargetUser(user);
    setPendingRole(newRole);
  };

  // Submit confirmed role change to API
  const handleConfirmRoleChange = async () => {
    if (!targetUser || !pendingRole) return;
    setIsUpdating(true);
    setToast(null);

    try {
      const res = await fetch(`/api/admin/users/${targetUser.id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: pendingRole }),
      });

      const data = await res.json();

      if (!res.ok) {
        setToast({ message: data.error || "فشل تحديث صلاحية المستخدم", type: "error" });
      } else {
        setUsers((prev) =>
          prev.map((u) => (u.id === targetUser.id ? { ...u, role: pendingRole } : u))
        );
        setToast({
          message: `تم تغيير دور ${targetUser.email} بنجاح إلى: ${pendingRole === "ADMIN" ? "مشرف" : "مستخدم"}`,
          type: "success",
        });
        setTargetUser(null);
        setPendingRole(null);
        setTimeout(() => setToast(null), 5000);
      }
    } catch (err) {
      setToast({ message: "حدث خطأ غير متوقع في الاتصال بالخادم", type: "error" });
    } finally {
      setIsUpdating(false);
    }
  };

  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const standardCount = users.filter((u) => u.tier === "STANDARD").length;
  const plusCount = users.filter((u) => u.tier === "PLUS").length;

  return (
    <div className="space-y-5" dir="rtl">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`p-3.5 rounded-xs text-xs font-sans flex items-center justify-between gap-3 border ${
            toast.type === "success"
              ? "bg-emerald-50 text-emerald-900 border-emerald-200"
              : "bg-red-50 text-red-900 border-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
          <button
            onClick={() => setToast(null)}
            className="text-neutral-400 hover:text-neutral-900 text-xs px-2"
          >
            إغلاق
          </button>
        </div>
      )}

      {/* Summary KPI Badges */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-sans">
        <span className="bg-white border border-[#E5E2DC] px-3 py-1.5 rounded-xs font-bold text-neutral-800">
          إجمالي المستخدمين: <span className="font-mono text-[#C86A00]">{users.length}</span>
        </span>
        <span className="bg-amber-50 border border-amber-200 text-[#8C4B00] px-3 py-1.5 rounded-xs font-bold">
          المشرفون (Admins): <span className="font-mono">{adminCount}</span>
        </span>
        <span className="bg-neutral-100 border border-neutral-200 text-neutral-700 px-3 py-1.5 rounded-xs font-bold">
          مشتركو بلس: <span className="font-mono">{plusCount}</span>
        </span>
        <span className="bg-neutral-100 border border-neutral-200 text-neutral-700 px-3 py-1.5 rounded-xs font-bold">
          مشتركو قياسي: <span className="font-mono">{standardCount}</span>
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E5E2DC] p-4 rounded-sm shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="ابحث بالاسم أو البريد الإلكتروني..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FCFBF9] border border-neutral-300 text-xs py-2 pr-8 pl-3 rounded-xs focus:outline-none focus:border-neutral-900"
            />
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-3" />
          </div>

          {/* Role Filter */}
          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full bg-[#FCFBF9] border border-neutral-300 text-xs py-2 px-2.5 rounded-xs focus:outline-none focus:border-neutral-900 font-sans"
            >
              <option value="ALL">جميع الأدوار والصلاحيات</option>
              <option value="ADMIN">مشرفون فقط (ADMIN)</option>
              <option value="USER">مستخدمون عاديون (USER)</option>
            </select>
          </div>

          {/* Tier Filter */}
          <div>
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="w-full bg-[#FCFBF9] border border-neutral-300 text-xs py-2 px-2.5 rounded-xs focus:outline-none focus:border-neutral-900 font-sans"
            >
              <option value="ALL">جميع مستويات الاشتراك</option>
              <option value="PLUS">مِعمار بلس (PLUS)</option>
              <option value="STANDARD">الاشتراك القياسي (STANDARD)</option>
              <option value="FREE">المجاني (FREE)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-[#E5E2DC] rounded-sm shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right border-collapse">
            <thead>
              <tr className="bg-[#FAF7F0] border-b border-[#E5E2DC] text-neutral-600 font-sans font-bold">
                <th className="py-3 px-4">المستخدم</th>
                <th className="py-3 px-3">البريد الإلكتروني</th>
                <th className="py-3 px-3">مستوى الاشتراك</th>
                <th className="py-3 px-3">الصلاحية الحالية</th>
                <th className="py-3 px-3">تاريخ الانضمام</th>
                <th className="py-3 px-4 text-left">إدارة الصلاحيات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-sans">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
                  const isSelf = user.id === currentAdminId;
                  return (
                    <tr key={user.id} className="hover:bg-[#FCFBF9] transition-colors">
                      {/* Name */}
                      <td className="py-3.5 px-4 font-bold text-neutral-900">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-xs bg-neutral-100 text-neutral-700 flex items-center justify-center font-bold text-[11px] shrink-0 border border-neutral-200">
                            {user.name ? user.name.slice(0, 1) : "م"}
                          </div>
                          <div>
                            <span>{user.name || "مستخدم غير مسمى"}</span>
                            {isSelf && (
                              <span className="text-[10px] bg-neutral-200 text-neutral-700 px-1.5 py-0.2 rounded-2xs mr-1 font-normal">
                                أنت
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-3 font-mono text-neutral-700 text-[11px]">
                        {user.email}
                      </td>

                      {/* Tier */}
                      <td className="py-3.5 px-3">
                        {user.tier === "PLUS" ? (
                          <span className="inline-flex items-center gap-1 text-[#8C4B00] bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-2xs text-[10px] font-bold">
                            <span>مِعمار بلس</span>
                          </span>
                        ) : user.tier === "STANDARD" ? (
                          <span className="inline-flex items-center gap-1 text-neutral-800 bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded-2xs text-[10px] font-bold">
                            <span>القياسي</span>
                          </span>
                        ) : (
                          <span className="text-neutral-400 font-mono text-[10px]">
                            FREE
                          </span>
                        )}
                      </td>

                      {/* Role Badge */}
                      <td className="py-3.5 px-3">
                        {user.role === "ADMIN" ? (
                          <span className="inline-flex items-center gap-1 bg-amber-100 text-[#8C4B00] border border-amber-300 px-2.5 py-0.5 rounded-2xs text-[10px] font-bold">
                            <ShieldCheck className="w-3 h-3" />
                            <span>مشرف (ADMIN)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-neutral-100 text-neutral-700 px-2.5 py-0.5 rounded-2xs text-[10px]">
                            <UserIcon className="w-3 h-3 text-neutral-400" />
                            <span>مستخدم عادي</span>
                          </span>
                        )}
                      </td>

                      {/* CreatedAt */}
                      <td className="py-3.5 px-3 text-neutral-500 font-mono text-[11px]">
                        {new Date(user.createdAt).toLocaleDateString("ar-EG")}
                      </td>

                      {/* Role Actions */}
                      <td className="py-3.5 px-4 text-left">
                        {isSelf ? (
                          <span className="text-[10px] text-neutral-400 font-serif italic">
                            حسابك الإداري الحالي (محمي)
                          </span>
                        ) : (
                          <div className="flex items-center justify-end gap-1.5">
                            {user.role === "ADMIN" ? (
                              <button
                                onClick={() => promptRoleChange(user, "USER")}
                                className="px-2.5 py-1 text-[11px] font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xs transition-colors cursor-pointer"
                              >
                                تخفيض إلى مستخدم
                              </button>
                            ) : (
                              <button
                                onClick={() => promptRoleChange(user, "ADMIN")}
                                className="px-2.5 py-1 text-[11px] font-bold text-[#8C4B00] bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xs transition-colors cursor-pointer"
                              >
                                ترقية لمشرف (Admin)
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-400 font-serif">
                    لا يوجد مستخدمون مطابقون لمعايير البحث.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {targetUser && pendingRole && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E5E2DC] rounded-sm max-w-md w-full p-5 sm:p-6 shadow-xl space-y-4 text-right">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-bold text-neutral-900 font-sans text-base flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <span>تأكيد تعديل صلاحيات المستخدم</span>
              </h3>
              <button
                onClick={() => {
                  setTargetUser(null);
                  setPendingRole(null);
                }}
                className="text-neutral-400 hover:text-black cursor-pointer p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-neutral-700 font-sans space-y-2 leading-relaxed">
              <p>
                أنت على وشك تعديل صلاحية الحساب التالي:
              </p>
              <div className="p-3 bg-[#FAF7F0] border border-[#E5E2DC] rounded-xs space-y-1 font-mono text-[11px]">
                <div><strong className="font-sans text-neutral-900">الاسم:</strong> {targetUser.name || "—"}</div>
                <div><strong className="font-sans text-neutral-900">البريد:</strong> {targetUser.email}</div>
                <div>
                  <strong className="font-sans text-neutral-900">الدور الجديد:</strong>{" "}
                  <span className="font-bold text-[#C86A00]">
                    {pendingRole === "ADMIN" ? "مشرف عام (ADMIN)" : "مستخدم عادي (USER)"}
                  </span>
                </div>
              </div>

              {pendingRole === "ADMIN" ? (
                <p className="text-amber-800 bg-amber-50 p-2.5 border border-amber-200 rounded-2xs text-[11px]">
                  <strong>تحذير أمني:</strong> ترقية هذا الحساب إلى مشرف تمنحه صلاحية الدخول الكاملة للوحة التحكم الإدارية، وتعديل حالة المقالات، ومراقبة كافة بيانات المستخدمين والاشتراكات.
                </p>
              ) : (
                <p className="text-neutral-600 bg-neutral-50 p-2.5 border border-neutral-200 rounded-2xs text-[11px]">
                  سيتم تجريد هذا المستخدم من كافة الصلاحيات الإدارية وسيعامل كمستخدم عادي.
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-neutral-100">
              <button
                onClick={() => {
                  setTargetUser(null);
                  setPendingRole(null);
                }}
                disabled={isUpdating}
                className="px-3.5 py-2 text-xs font-bold text-neutral-700 hover:text-black hover:bg-neutral-100 rounded-xs transition-colors cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={handleConfirmRoleChange}
                disabled={isUpdating}
                className="px-4 py-2 text-xs font-bold text-white bg-neutral-900 hover:bg-black rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isUpdating && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>تأكيد التعديل الفوري</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
