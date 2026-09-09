export const dynamic = "force-dynamic";

import React from "react";
import { redirect } from "next/navigation";
import { auth } from "../../lib/auth";
import AdminNav from "../../components/admin/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Server-side strict authorization gate: only ADMIN role allowed
  if (!session || !session.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div
      id="me-mar-admin-portal"
      className="min-h-screen bg-[#F9F8F6] text-[#111111] font-sans selection:bg-black selection:text-white flex flex-col lg:flex-row"
      dir="rtl"
    >
      {/* Sidebar Navigation */}
      <AdminNav
        userEmail={session.user.email || ""}
        userName={session.user.name || ""}
      />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
}
