import { Metadata } from "next";
import { db } from "../../../lib/db";
import TeamManagement from "../../../components/admin/TeamManagement";

export const metadata: Metadata = {
  title: "إدارة فريق العمل والكُتّاب | مِعمار",
  description: "إدارة صلاحيات فريق العمل، والكُتّاب، والملفات التحريرية.",
};

export default async function AdminTeamPage() {
  // Fetch users with WRITER or ADMIN role, plus their WriterProfile if any
  const staffMembers = await db.user.findMany({
    where: {
      role: {
        in: ["WRITER", "ADMIN"],
      },
    },
    include: {
      writerProfile: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-neutral-900 mb-1">
            فريق العمل والكُتّاب
          </h1>
          <p className="text-xs text-neutral-500 font-sans">
            إدارة صلاحيات الفريق، ترقية المشتركين إلى كُتّاب، وتخصيص الملفات التحريرية.
          </p>
        </div>
      </div>

      <TeamManagement initialStaff={staffMembers} />
    </div>
  );
}
