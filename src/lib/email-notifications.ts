import { getEmailTransporter } from "./email";

export async function sendEmailNotification(to: string, subject: string, htmlContent: string) {
  const transporter = getEmailTransporter();
  const defaultFrom = process.env.EMAIL_FROM || `مِعمار <${process.env.EMAIL_SERVER_USER || "noreply@me-mar.com"}>`;

  if (!transporter) {
    console.log("==================================================================");
    console.log("[ME'MAR EMAIL NOTIFICATION - LOCAL PREVIEW / NO SMTP CONFIGURED]");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message Content:\n${htmlContent.replace(/<[^>]+>/g, '')}`);
    console.log("==================================================================");
    return { success: true, mode: "dev_logged" as const };
  }

  try {
    const info = await transporter.sendMail({
      from: defaultFrom,
      to,
      subject,
      html: htmlContent,
    });
    return { success: true, messageId: info.messageId, mode: "sent" as const };
  } catch (error) {
    console.error("[EMAIL_NOTIFY_ERR]", error);
    return { success: false, error };
  }
}
