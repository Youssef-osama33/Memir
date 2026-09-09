import { NextRequest, NextResponse } from "next/server";
import { sendContactEmail } from "../../../lib/email";
import { db } from "../../../lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message, website_url } = body;

    // 1. Honeypot Spam Protection:
    // If the hidden 'website_url' field was filled out, it was submitted by a bot.
    // Silently return success without sending any email.
    if (website_url && typeof website_url === "string" && website_url.trim().length > 0) {
      console.warn("[CONTACT_FORM_HONEYPOT_TRIGGERED] Silent drop of bot submission");
      return NextResponse.json({
        success: true,
        message: "تم إرسال رسالتك بنجاح، سنتواصل معك قريباً",
      });
    }

    // 2. Validate Name
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "يرجى إدخال اسم صحيح لا يقل عن حرفين." },
        { status: 400 }
      );
    }
    if (name.trim().length > 100) {
      return NextResponse.json(
        { error: "الاسم المدخل طويل جداً (الحد الأقصى 100 حرف)." },
        { status: 400 }
      );
    }

    // 3. Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: "يرجى إدخال عنوان بريد إلكتروني صالح للتواصل." },
        { status: 400 }
      );
    }

    // 4. Validate Subject
    if (!subject || typeof subject !== "string" || subject.trim().length < 2) {
      return NextResponse.json(
        { error: "يرجى تحديد موضوع الرسالة." },
        { status: 400 }
      );
    }
    if (subject.trim().length > 200) {
      return NextResponse.json(
        { error: "موضوع الرسالة طويل جداً (الحد الأقصى 200 حرف)." },
        { status: 400 }
      );
    }

    // 5. Validate Message
    if (!message || typeof message !== "string" || message.trim().length < 5) {
      return NextResponse.json(
        { error: "يرجى كتابة نص الرسالة (5 أحرف على الأقل)." },
        { status: 400 }
      );
    }
    if (message.trim().length > 5000) {
      return NextResponse.json(
        { error: "نص الرسالة طويل جداً (الحد الأقصى 5000 حرف)." },
        { status: 400 }
      );
    }

    // Persist submission in database
    if ((process.env.DATABASE_URL || process.env.SQL_HOST)) {
      try {
        await db.contactSubmission.create({
          data: {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            subject: subject.trim(),
            message: message.trim(),
          },
        });
      } catch (dbErr) {
        console.error("[CONTACT_SUBMISSION_DB_SAVE_ERR]", dbErr);
      }
    }

    // 6. Send Email via Nodemailer configuration
    await sendContactEmail({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });

    return NextResponse.json({
      success: true,
      message: "تم إرسال رسالتك بنجاح، سنتواصل معك قريباً",
    });
  } catch (err: any) {
    console.error("[CONTACT_API_ERROR]", err);
    return NextResponse.json(
      { error: "تعذر إرسال الرسالة في الوقت الحالي. يرجى المحاولة لاحقاً أو مراسلتنا مباشرة عبر البريد." },
      { status: 500 }
    );
  }
}

