import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { toggleArticleDraft } from "@/src/lib/articles";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "غير مصرح لك بتنفيذ هذه العملية الإدارية." },
        { status: 403 }
      );
    }

    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ error: "معرف المقال غير صالح" }, { status: 400 });
    }

    const result = await toggleArticleDraft(slug);
    if (!result.success) {
      return NextResponse.json({ error: result.error || "فشل تعديل حالة المقال" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      slug,
      draft: result.draft,
      message: result.draft
        ? "تم تحويل المقال إلى مسودة (تم إخفاؤه عن العموم)."
        : "تم نشر المقال بنجاح وإتاحته للقراء.",
    });
  } catch (err: any) {
    console.error("[ADMIN_TOGGLE_DRAFT_API_ERR]", err);
    return NextResponse.json({ error: "حدث خطأ غير متوقع في الخادم" }, { status: 500 });
  }
}
