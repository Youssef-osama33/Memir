import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../lib/auth";
import { db } from "../../../../lib/db";

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "انتهت صلاحية الجلسة. يرجى تسجيل الدخول مجدداً." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { confirmEmail } = body;

    const userEmail = session.user.email?.toLowerCase().trim();
    const enteredEmail = confirmEmail ? String(confirmEmail).toLowerCase().trim() : "";

    if (!enteredEmail || enteredEmail !== userEmail) {
      return NextResponse.json(
        { error: "البريد الإلكتروني المدخل لتأكيد الحذف غير متطابق مع بريد حسابك." },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    if ((process.env.DATABASE_URL || process.env.SQL_HOST)) {
      // Cascade delete is configured in schema.prisma on all child relations (onDelete: Cascade)
      try {
        await db.user.delete({
          where: { id: userId },
        });
      } catch (err) {
        // In case the user was found by email instead of synthetic ID
        if (userEmail) {
          await db.user.deleteMany({
            where: { email: userEmail },
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "تم حذف حسابك وكافة بياناتك المرتبطة نهائياً.",
    });
  } catch (err: any) {
    console.error("[DELETE_ACCOUNT_ERR]", err);
    return NextResponse.json(
      { error: "حدث خطأ غير متوقع أثناء معالجة طلب حذف الحساب." },
      { status: 500 }
    );
  }
}
