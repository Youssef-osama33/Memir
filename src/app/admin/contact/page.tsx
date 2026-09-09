export const dynamic = "force-dynamic";

import React from "react";
import { db } from "../../../lib/db";
import ContactSubmissionsList, {
  ContactSubmissionItem,
} from "../../../components/admin/ContactSubmissionsList";

export default async function AdminContactPage() {
  let submissions: ContactSubmissionItem[] = [];

  if ((process.env.DATABASE_URL || process.env.SQL_HOST)) {
    try {
      const dbSubmissions = await db.contactSubmission.findMany({
        orderBy: { createdAt: "desc" },
      });

      submissions = dbSubmissions.map((s) => ({
        id: s.id,
        name: s.name,
        email: s.email,
        subject: s.subject,
        message: s.message,
        createdAt: s.createdAt.toISOString(),
      }));
    } catch (err) {
      console.error("[ADMIN_CONTACT_PAGE_ERR]", err);
    }
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="border-b border-[#E5E2DC] pb-4">
        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-sans block">
          صندوق الوارد والاتصالات
        </span>
        <h1 className="text-2xl font-bold font-sans text-neutral-900 mt-0.5">
          رسائل نموذج التواصل
        </h1>
        <p className="text-xs text-neutral-500 font-sans mt-1">
          استعراض المراسلات الواردة من القراء والباحثين عبر نموذج التواصل، مرتبة زمنياً من الأحدث إلى الأقدم.
        </p>
      </div>

      {/* Interactive Submissions List */}
      <ContactSubmissionsList initialSubmissions={submissions} />
    </div>
  );
}
