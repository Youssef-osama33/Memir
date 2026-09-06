import NextAuth, { type DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import EmailProvider from "next-auth/providers/email";
import nodemailer from "nodemailer";
import { db } from "./db";
import { authConfig } from "./auth.config";
import { Role } from "@prisma/client";

// Extend native NextAuth types to propagate Roles and Premium status through the security layer
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      isPremium: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    role: Role;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db) as any,
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST || "localhost",
        port: parseInt(process.env.EMAIL_SERVER_PORT || "587", 10),
        auth: {
          user: process.env.EMAIL_SERVER_USER || "",
          pass: process.env.EMAIL_SERVER_PASSWORD || "",
        },
      },
      from: process.env.EMAIL_FROM || "مِعمار <noreply@me-mar.com>",
      async sendVerificationRequest({ identifier: email, url, provider }) {
        // Production email delivery when SMTP is configured
        if (process.env.EMAIL_SERVER_HOST && process.env.EMAIL_SERVER_USER) {
          const transport = nodemailer.createTransport(provider.server);
          const result = await transport.sendMail({
            to: email,
            from: provider.from,
            subject: "رابط الدخول الآمن لمنصة مِعمار (Magic Link)",
            text: `تسجيل الدخول إلى مِعمار:\n${url}\n\nصالح لمدة 24 ساعة. إذا لم تطلب هذا الرابط، يرجى تجاهل هذه الرسالة.`,
            html: `
              <div dir="rtl" style="background:#FCFBF9;padding:40px;font-family:serif;color:#111;">
                <div style="max-width:520px;margin:0 auto;background:#fff;border:2px solid #000;padding:32px;">
                  <h1 style="font-size:24px;margin-bottom:12px;color:#000;">مِعمار للتحليلات الاستراتيجية</h1>
                  <p style="font-size:14px;color:#555;margin-bottom:24px;">اضغط على الزر أدناه لتأكيد هويتك والدخول إلى حسابك ومتابعة التحليلات:</p>
                  <a href="${url}" style="display:inline-block;background:#000;color:#fff;padding:12px 24px;text-decoration:none;font-weight:bold;font-size:14px;">تأكيد الدخول إلى مِعمار ←</a>
                  <p style="font-size:11px;color:#888;margin-top:24px;border-top:1px dashed #ccc;padding-top:16px;">الرابط مشفر وصالح لاستخدام مرة واحدة فقط.</p>
                </div>
              </div>
            `,
          });
          const failed = result.rejected.concat(result.pending).filter(Boolean);
          if (failed.length) {
            throw new Error(`Email (${failed.join(", ")}) could not be sent`);
          }
        } else {
          // Development fallback: Log verification link clearly to stdout for developer visibility
          console.log("==================================================================");
          console.log(`[ME'MAR AUTH DEV] MAGIC LINK FOR: ${email}`);
          console.log(`[ME'MAR AUTH DEV] VERIFICATION URL: ${url}`);
          console.log("==================================================================");
        }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async session({ session, token }) {
      const baseSession = await authConfig.callbacks.session({ session, token } as any);

      if (token && baseSession.user) {
        baseSession.user.id = token.id as string;
        baseSession.user.role = (token.role as Role) || "USER";

        // Query active subscription status in real-time
        try {
          const activeSubscription = await db.subscription.findFirst({
            where: {
              userId: token.id as string,
              status: {
                in: ["ACTIVE", "TRIALING"],
              },
            },
          });
          baseSession.user.isPremium = !!activeSubscription;
        } catch (dbErr) {
          console.error("[AUTH_SESSION_SUBSCRIPTION_QUERY_FAIL]", dbErr);
          baseSession.user.isPremium = false;
        }
      }
      return baseSession;
    },
  },
});
