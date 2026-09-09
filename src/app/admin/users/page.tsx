export const dynamic = "force-dynamic";

import React from "react";
import { db } from "../../../lib/db";
import { auth } from "../../../lib/auth";
import UsersTable, { AdminUserItem } from "../../../components/admin/UsersTable";

export default async function AdminUsersPage() {
  const session = await auth();
  const currentAdminId = session?.user?.id || "";

  let users: AdminUserItem[] = [];

  if ((process.env.DATABASE_URL || process.env.SQL_HOST)) {
    try {
      const dbUsers = await db.user.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          subscriptions: {
            where: { status: "ACTIVE" },
            take: 1,
            select: {
              tier: true,
              status: true,
            },
          },
        },
      });

      users = dbUsers.map((u) => {
        const activeSub = u.subscriptions?.[0];
        return {
          id: u.id,
          name: u.name,
          email: u.email,
          role: (u.role as "USER" | "ADMIN") || "USER",
          tier: (activeSub?.tier as "FREE" | "STANDARD" | "PLUS") || "FREE",
          subscriptionStatus: activeSub?.status || null,
          createdAt: u.createdAt.toISOString(),
        };
      });
    } catch (err) {
      console.error("[ADMIN_USERS_PAGE_ERR]", err);
    }
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="border-b border-[#E5E2DC] pb-4">
        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-sans block">
          إدارة الحسابات والصلاحيات
        </span>
        <h1 className="text-2xl font-bold font-sans text-neutral-900 mt-0.5">
          إدارة المستخدمين وصلاحيات المشرفين
        </h1>
        <p className="text-xs text-neutral-500 font-sans mt-1">
          البحث في سجلات المشتركين، واستعراض تفاصيل العضوية، وترقية أو تخفيض صلاحيات المشرفين.
        </p>
      </div>

      {/* Users Table */}
      <UsersTable initialUsers={users} currentAdminId={currentAdminId} />
    </div>
  );
}
