import NextAuth, { type DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import nodemailer from "nodemailer";
import { db, withDbRetry } from "./db";
import { authConfig } from "./auth.config";
import { Role } from "@prisma/client";
import { saveUserProfile, getUserProfile } from "./user-profile";

// Extend native NextAuth types to propagate Roles, Tiers and Premium status through the security layer
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      isPremium: boolean;
      tier: "FREE" | "STANDARD" | "PLUS";
      hasPlusAccess: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    role: Role;
  }
}

if (!process.env.AUTH_SECRET) {
  process.env.AUTH_SECRET = process.env.NEXTAUTH_SECRET || "me-mar-development-cryptographic-secret-key-32-bytes-long";
}

const authProviders: any[] = [];

// 1. Google OAuth Provider
if (process.env.GOOGLE_CLIENT_ID || process.env.AUTH_GOOGLE_ID) {
  authProviders.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || process.env.AUTH_GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || process.env.AUTH_GOOGLE_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    })
  );
}

// 2. Email Magic Link Provider (when SMTP is configured)
if ((process.env.DATABASE_URL || process.env.SQL_HOST)) {
  authProviders.push(
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
          console.log("==================================================================");
          console.log(`[ME'MAR AUTH DEV] MAGIC LINK FOR: ${email}`);
          console.log(`[ME'MAR AUTH DEV] VERIFICATION URL: ${url}`);
          console.log("==================================================================");
        }
      },
    })
  );
}

// 3. Credentials provider enables seamless instant session authentication across preview, sign-in and sign-up
authProviders.push(
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "البريد الإلكتروني", type: "email" },
      password: { label: "كلمة المرور", type: "password" },
      name: { label: "الاسم", type: "text" },
      phoneNumber: { label: "رقم الهاتف", type: "text" },
    },
    async authorize(credentials) {
      if (!credentials?.email) return null;
      const email = String(credentials.email).toLowerCase().trim();
      const name = (credentials.name as string)?.trim() || email.split("@")[0];
      const phoneNumber = (credentials.phoneNumber as string)?.trim() || undefined;

      // If Database is connected, check or create user in DB
      if ((process.env.DATABASE_URL || process.env.SQL_HOST)) {
        try {
          const user = await withDbRetry(async (client) => {
            let u = await client.user.findUnique({
              where: { email },
            });
            if (!u) {
              u = await client.user.create({
                data: {
                  email,
                  name,
                  phoneNumber: phoneNumber || null,
                  role: "USER",
                },
              });
            } else if (phoneNumber && (!u.phoneNumber || u.phoneNumber !== phoneNumber)) {
              u = await client.user.update({
                where: { id: u.id },
                data: {
                  phoneNumber,
                  ...(name ? { name } : {}),
                },
              });
            }
            return u;
          });

          if (user && (phoneNumber || user.phoneNumber)) {
            await saveUserProfile(user.id, {
              name: user.name || name,
              phoneNumber: phoneNumber || user.phoneNumber || "",
              email: user.email,
            });
          }

          if (user) {
            return {
              id: user.id,
              name: user.name || name,
              email: user.email,
              role: user.role,
              isPremium: true,
              tier: "PLUS",
              hasPlusAccess: true,
            };
          }
        } catch (dbErr) {
          console.error("[AUTH_CREDENTIALS_DB_ERR]", dbErr);
        }
      }

      const fallbackId = "memar-user-" + Buffer.from(email).toString("hex").slice(0, 10);
      if (phoneNumber) {
        await saveUserProfile(fallbackId, {
          name,
          phoneNumber,
          email,
        });
      }

      return {
        id: fallbackId,
        name,
        email,
        role: "USER" as Role,
        isPremium: true,
        tier: "PLUS",
        hasPlusAccess: true,
      };
    },
  })
);

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  trustHost: true,
  skipCSRFCheck: authConfig.skipCSRFCheck,
  cookies: authConfig.cookies,
  secret: process.env.AUTH_SECRET,
  adapter: (process.env.DATABASE_URL || process.env.SQL_HOST) ? (PrismaAdapter(db) as any) : undefined,
  providers: authProviders,
  callbacks: {
    ...authConfig.callbacks,
    async session({ session, token }) {
      const baseSession = await authConfig.callbacks.session({ session, token } as any);

      if (token && baseSession.user) {
        baseSession.user.id = token.id as string;
        baseSession.user.role = (token.role as Role) || "USER";

        // Query active subscription status in real-time
        if ((process.env.DATABASE_URL || process.env.SQL_HOST)) {
          try {
            const activeSubscription = await withDbRetry(async (client) => {
              return client.subscription.findFirst({
                where: {
                  userId: token.id as string,
                  status: {
                    in: ["ACTIVE", "TRIALING"],
                  },
                },
              });
            });
            baseSession.user.isPremium = !!activeSubscription;
            baseSession.user.tier = (activeSubscription?.tier as any) || (baseSession.user.isPremium ? "STANDARD" : "FREE");
            baseSession.user.hasPlusAccess = activeSubscription?.tier === "PLUS";
          } catch (dbErr) {
            console.error("[AUTH_SESSION_SUBSCRIPTION_QUERY_FAIL]", dbErr);
            baseSession.user.isPremium = false;
            baseSession.user.tier = "FREE";
            baseSession.user.hasPlusAccess = false;
          }
        } else {
          baseSession.user.isPremium = true;
          baseSession.user.tier = "PLUS";
          baseSession.user.hasPlusAccess = true;
        }
      }
      return baseSession;
    },
  },
});
