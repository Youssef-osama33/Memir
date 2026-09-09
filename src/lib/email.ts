import nodemailer from "nodemailer";

/**
 * Returns a configured Nodemailer transport using the existing environment variables
 * already configured for NextAuth (EMAIL_SERVER_HOST, PORT, USER, PASSWORD).
 */
export function getEmailTransporter() {
  const host = process.env.EMAIL_SERVER_HOST;
  const user = process.env.EMAIL_SERVER_USER;
  const pass = process.env.EMAIL_SERVER_PASSWORD;
  const port = parseInt(process.env.EMAIL_SERVER_PORT || "587", 10);

  if (!host || !user) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass: pass || "",
    },
  });
}

export interface SendContactEmailParams {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Sends contact form submissions to the site owner (yossef2319128@gmail.com)
 * with the sender's provided email set as replyTo for direct responses.
 */
export async function sendContactEmail({
  name,
  email,
  subject,
  message,
}: SendContactEmailParams) {
  const recipient = "yossef2319128@gmail.com";
  const defaultFrom = process.env.EMAIL_FROM || `مِعمار <${process.env.EMAIL_SERVER_USER || "noreply@me-mar.com"}>`;

  const transporter = getEmailTransporter();

  if (!transporter) {
    // In local development/preview without live SMTP credentials, log formatted message safely
    console.log("==================================================================");
    console.log("[ME'MAR CONTACT FORM - LOCAL PREVIEW / NO SMTP CONFIGURED]");
    console.log(`To: ${recipient}`);
    console.log(`Reply-To: ${name} <${email}>`);
    console.log(`Subject: [رسالة تواصل من مِعمار] ${subject}`);
    console.log(`Message Content:\n${message}`);
    console.log("==================================================================");
    return { success: true, mode: "dev_logged" as const };
  }

  const cleanName = name.replace(/[\r\n]/g, "").trim();
  const cleanSubject = subject.replace(/[\r\n]/g, "").trim();

  const mailOptions = {
    to: recipient,
    from: defaultFrom,
    replyTo: `${cleanName} <${email.trim()}>`,
    subject: `[رسالة تواصل من مِعمار] ${cleanSubject}`,
    text: `رسالة تواصل جديدة عبر موقع مِعمار:\n\nاسم المرسل: ${cleanName}\nالبريد الإلكتروني: ${email.trim()}\nالموضوع: ${cleanSubject}\n\nنص الرسالة:\n${message}\n\n---\nملاحظة: يمكنك الضغط على "رد" (Reply) في بريدك الإلكتروني للتواصل المباشر مع صاحب الرسالة.`,
    html: `
      <div dir="rtl" style="background:#FCFBF9;padding:32px;font-family:'IBM Plex Sans Arabic',Arial,sans-serif;color:#111;">
        <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #E5E5E5;padding:32px;border-top:4px solid #C86A00;">
          <div style="margin-bottom:20px;border-b:1px solid #f0f0f0;padding-bottom:16px;">
            <span style="font-size:11px;font-weight:bold;color:#8C4B00;background:#FAF7F0;border:1px solid #E8DCC8;padding:3px 8px;text-transform:uppercase;">
              نموذج الاتصال • منصة مِعمار
            </span>
            <h1 style="font-size:22px;color:#000;margin:12px 0 4px 0;font-weight:bold;">
              رسالة تواصل جديدة: ${cleanSubject}
            </h1>
          </div>

          <div style="background:#FAF7F0;border:1px solid #E8DCC8;padding:16px 20px;margin-bottom:24px;font-size:14px;line-height:1.7;">
            <p style="margin:4px 0;"><strong>اسم المرسل:</strong> ${cleanName}</p>
            <p style="margin:4px 0;"><strong>البريد الإلكتروني:</strong> <a href="mailto:${email.trim()}" style="color:#C86A00;text-decoration:none;font-weight:bold;">${email.trim()}</a></p>
            <p style="margin:4px 0;"><strong>الموضوع:</strong> ${cleanSubject}</p>
          </div>

          <div style="font-size:15px;line-height:1.8;color:#222;white-space:pre-wrap;background:#FFFFFF;border:1px solid #EBEBEB;padding:20px;border-radius:2px;">
${message}
          </div>

          <div style="font-size:12px;color:#777;margin-top:28px;border-top:1px dashed #DDD;padding-top:16px;line-height:1.6;">
            💡 <strong>تنبيه:</strong> تم تعيين عنوان الرد (Reply-To) تلقائياً ليكون بريد المرسل (<a href="mailto:${email.trim()}" style="color:#555;">${email.trim()}</a>). يمكنك الرد مباشرة من صندوق بريدك لمراسلته.
          </div>
        </div>
      </div>
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  return { success: true, mode: "sent" as const, messageId: info.messageId };
}
