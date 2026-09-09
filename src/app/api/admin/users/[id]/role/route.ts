import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";
import { Role } from "@prisma/client";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "غير مصرح لك بتنفيذ هذه العملية الإدارية." },
        { status: 403 }
      );
    }

    const { id: targetUserId } = await params;
    const body = await req.json();
    const { role } = body;

    if (!role || (role !== Role.USER && role !== Role.ADMIN)) {
      return NextResponse.json(
        { error: "الدور المطلوب غير صالح. الأدوار المتاحة هي USER أو ADMIN فقط." },
        { status: 400 }
      );
    }

    // Safety lockout protection: prevent admin from revoking their own admin role
    if (session.user.id === targetUserId && role !== Role.ADMIN) {
      return NextResponse.json(
        { error: "لا يمكنك تجريد حسابك الإداري الحالي من صلاحية الإدارة تفادياً لفقدان الوصول للنظام." },
        { status: 400 }
      );
    }

    if (!(process.env.DATABASE_URL || process.env.SQL_HOST)) {
      return NextResponse.json(
        { error: "قاعدة البيانات غير مهيأة حالياً." },
        { status: 503 }
      );
    }

    const updatedUser = await db.user.update({
      where: { id: targetUserId },
      data: { role: role as Role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: `تم تحديث صلاحية المستخدم بنجاح إلى: ${role === Role.ADMIN ? "مشرف (ADMIN)" : "مستخدم عادي (USER)"}`,
    });
  } catch (err: any) {
    console.error("[ADMIN_UPDATE_ROLE_ERR]", err);
    return NextResponse.json(
      { error: err?.message || "حدث خطأ أثناء تعديل صلاحيات المستخدم." },
      { status: 500 }
    );
  }
}
