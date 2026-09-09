import { NextRequest, NextResponse } from "next/server";
import { db, withDbRetry } from "../../../../lib/db";
import { validateWhatsAppNumber, saveUserProfile } from "../../../../lib/user-profile";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, dialCode = "+20", phoneNumber, country } = body;

    if (!email || !email.trim()) {
      return NextResponse.json({ error: "يرجى إدخال عنوان البريد الإلكتروني." }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = (name || "").trim() || cleanEmail.split("@")[0];

    if (password && password.length < 6) {
      return NextResponse.json({ error: "كلمة المرور يجب أن لا تقل عن 6 أحرف أو أرقام." }, { status: 400 });
    }

    // Validate phone number if provided
    let formattedPhone: string | null = null;
    if (phoneNumber && phoneNumber.trim()) {
      const validation = validateWhatsAppNumber(dialCode, phoneNumber.trim());
      if (!validation.isValid || !validation.formattedNumber) {
        return NextResponse.json({ error: validation.errorMessage || "رقم هاتف واتساب غير صالح." }, { status: 400 });
      }
      formattedPhone = validation.formattedNumber;
    } else {
      return NextResponse.json({ error: "يرجى إدخال رقم هاتف واتساب لتلقي التحليلات وتفعيل الحساب." }, { status: 400 });
    }

    // Check if database is configured
    if ((process.env.DATABASE_URL || process.env.SQL_HOST)) {
      try {
        const result = await withDbRetry(async (client) => {
          const existing = await client.user.findUnique({
            where: { email: cleanEmail },
          });

          if (existing) {
            // If existing, update missing fields like phoneNumber and name
            const updated = await client.user.update({
              where: { id: existing.id },
              data: {
                ...(formattedPhone ? { phoneNumber: formattedPhone } : {}),
                ...(cleanName ? { name: cleanName } : {}),
              },
            });
            return { user: updated, isExisting: true };
          }

          // Create new user in DB
          const newUser = await client.user.create({
            data: {
              email: cleanEmail,
              name: cleanName,
              phoneNumber: formattedPhone,
              role: "USER",
            },
          });
          return { user: newUser, isExisting: false };
        });

        if (formattedPhone) {
          await saveUserProfile(result.user.id, {
            name: cleanName,
            phoneNumber: formattedPhone,
            email: cleanEmail,
          });
        }

        return NextResponse.json({
          success: true,
          isExisting: result.isExisting,
          message: result.isExisting ? "الحساب مسجل بالفعل، تم تحديث بياناتك بنجاح." : "تم إنشاء حسابك بنجاح!",
          user: {
            id: result.user.id,
            email: cleanEmail,
            name: cleanName,
            phoneNumber: formattedPhone,
          },
        });
      } catch (dbError: any) {
        console.error("[REGISTER_DB_ERR]", dbError);
        // Fallback to memory store if DB is unreachable in dev/preview
      }
    }

    // Fallback: save to memory store
    const fallbackId = "memar-user-" + Buffer.from(cleanEmail).toString("hex").slice(0, 10);
    if (formattedPhone) {
      await saveUserProfile(fallbackId, {
        name: cleanName,
        phoneNumber: formattedPhone,
        email: cleanEmail,
      });
    }

    return NextResponse.json({
      success: true,
      message: "تم إنشاء الحساب بنجاح!",
      user: {
        id: fallbackId,
        email: cleanEmail,
        name: cleanName,
        phoneNumber: formattedPhone,
      },
    });
  } catch (error: any) {
    console.error("[REGISTER_API_ERR]", error);
    return NextResponse.json({ error: "حدث خطأ غير متوقع أثناء إنشاء الحساب. يرجى المحاولة ثانية." }, { status: 500 });
  }
}

