import twilio from 'twilio';

let twilioClient: twilio.Twilio | null = null;

export function getTwilioClient() {
  if (!twilioClient) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    if (!accountSid || !authToken) {
      console.warn("Twilio credentials not configured. WhatsApp notifications will be disabled.");
      return null;
    }

    twilioClient = twilio(accountSid, authToken);
  }
  return twilioClient;
}

export async function sendWhatsAppNotification(to: string, message: string) {
  const client = getTwilioClient();
  const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER;

  if (!client || !fromNumber) {
    console.log("==================================================================");
    console.log("[ME'MAR WHATSAPP NOTIFICATION - LOCAL PREVIEW / NO TWILIO CONFIGURED]");
    console.log(`To: ${to}`);
    console.log(`Message Content:\n${message}`);
    console.log("==================================================================");
    return { success: true, mode: "dev_logged" as const };
  }

  try {
    const response = await client.messages.create({
      body: message,
      from: `whatsapp:${fromNumber}`,
      to: `whatsapp:${to}`
    });
    console.log(`WhatsApp message sent successfully: ${response.sid}`);
    return { success: true, messageId: response.sid, mode: "sent" as const };
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    return { success: false, error };
  }
}
