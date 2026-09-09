import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../lib/auth";
import { saveUserProfile, validateWhatsAppNumber } from "../../../../lib/user-profile";

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, phoneNumber, dialCode } = body;

    let finalFormattedPhone = phoneNumber ? phoneNumber.trim() : "";

    if (dialCode && phoneNumber) {
      const validation = validateWhatsAppNumber(dialCode, phoneNumber);
      if (!validation.isValid || !validation.formattedNumber) {
        return NextResponse.json(
          { error: validation.errorMessage || "رقم هاتف واتساب غير صالح." },
          { status: 400 }
        );
      }
      finalFormattedPhone = validation.formattedNumber;
    } else if (phoneNumber && !phoneNumber.startsWith("+") && phoneNumber.length > 5) {
      // If entered with no +, prepend +
      finalFormattedPhone = `+${phoneNumber.replace(/[^\d]/g, "")}`;
    }

    const updated = await saveUserProfile(session.user.id, {
      name: name !== undefined ? name.trim() : session.user.name,
      phoneNumber: finalFormattedPhone || "",
      email: session.user.email,
    });

    return NextResponse.json({
      success: true,
      message: "تم تحديث بيانات الملف الشخصي بنجاح",
      user: updated,
    });
  } catch (err: any) {
    console.error("[USER_PROFILE_PATCH_ERR]", err);
    return NextResponse.json(
      { error: "حدث خطأ غير متوقع أثناء تحديث الملف الشخصي." },
      { status: 500 }
    );
  }
}
