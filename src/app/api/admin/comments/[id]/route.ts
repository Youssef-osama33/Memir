import { NextResponse } from "next/server";
import { db } from "@/src/lib/db";
import { auth } from "@/src/lib/auth";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "غير مصرح لك بإجراء عمليات الإشراف الإدارية." },
        { status: 403 }
      );
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "معرف التعليق غير صالح" }, { status: 400 });
    }

    if (!(process.env.DATABASE_URL || process.env.SQL_HOST)) {
      return NextResponse.json({ success: true, message: "تم حذف التعليق (وضع العرض التجريبي)" });
    }

    const comment = await db.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      return NextResponse.json({ error: "التعليق غير موجود" }, { status: 404 });
    }

    await db.comment.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "تم حذف التعليق بنجاح من المنظومة.",
    });
  } catch (error: any) {
    console.error("[ADMIN_DELETE_COMMENT_ERR]", error);
    return NextResponse.json(
      { error: "تعذر حذف التعليق في الوقت الحالي." },
      { status: 500 }
    );
  }
}
