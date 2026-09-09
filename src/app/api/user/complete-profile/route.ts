import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../lib/auth";
import { validateWhatsAppNumber, saveUserProfile, getUserProfile } from "../../../../lib/user-profile";

export async function GET() {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: "غير مصرح، يرجى تسجيل الدخول أولاً" }, { status: 401 });
  }

  const profile = await getUserProfile(session.user.id, session.user.email);
  return NextResponse.json({
    user: {
      id: session.user.id,
      email: session.user.email,
      name: profile?.name || session.user.name || "",
      phoneNumber: profile?.phoneNumber || null,
      isComplete: Boolean(profile?.phoneNumber),
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, dialCode = "+20", phoneNumber } = body;

    // Validate phone number format
    const validation = validateWhatsAppNumber(dialCode, phoneNumber);
    if (!validation.isValid || !validation.formattedNumber) {
      return NextResponse.json(
        { error: validation.errorMessage || "رقم هاتف واتساب غير صالح." },
        { status: 400 }
      );
    }

    // Persist to user record
    const updated = await saveUserProfile(session.user.id, {
      name: name?.trim() || session.user.name || undefined,
      phoneNumber: validation.formattedNumber,
      email: session.user.email,
    });

    return NextResponse.json({
      success: true,
      message: "تم حفظ بيانات الملف الشخصي بنجاح",
      redirect: "/dashboard",
      user: {
        id: session.user.id,
        email: session.user.email,
        name: updated?.name || name || session.user.name,
        phoneNumber: validation.formattedNumber,
      },
    });
  } catch (err: any) {
    console.error("[COMPLETE_PROFILE_API_ERR]", err);
    return NextResponse.json(
      { error: "حدث خطأ غير متوقع أثناء حفظ الملف الشخصي. يرجى المحاولة ثانية." },
      { status: 500 }
    );
  }
}
