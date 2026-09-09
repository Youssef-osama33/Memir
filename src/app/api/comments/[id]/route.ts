import { NextResponse } from "next/server";
import { db as prisma } from "../../../../lib/db";
import { auth } from "../../../../lib/auth";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const userId = session.user.id;

    if (!(process.env.DATABASE_URL || process.env.SQL_HOST)) {
      return NextResponse.json({ success: true, message: "Demo mode comment deleted" });
    }

    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      return NextResponse.json({ error: "التعليق غير موجود" }, { status: 404 });
    }

    // Only allow user to delete their own comment, or admin
    if (comment.userId !== userId && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح لك بحذف هذا التعليق" }, { status: 403 });
    }

    await prisma.comment.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json({ error: "تعذر حذف التعليق" }, { status: 500 });
  }
}
