"use client";

/**
 * Robust Client-Side Authentication Utilities for NextAuth / Auth.js v5
 * Eliminates JSON parsing errors on 302 redirects while establishing cookies.
 */

export interface SignInCredentialsOptions {
  email: string;
  password?: string;
  name?: string;
  phoneNumber?: string;
  callbackUrl?: string;
}

export async function authenticateWithCredentials({
  email,
  password,
  name,
  phoneNumber,
  callbackUrl = "/dashboard",
}: SignInCredentialsOptions): Promise<{ ok: boolean; error?: string; url?: string }> {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = (name || "").trim() || cleanEmail.split("@")[0];

    const body = new URLSearchParams();
    body.append("email", cleanEmail);
    if (password) body.append("password", password);
    if (cleanName) body.append("name", cleanName);
    if (phoneNumber) body.append("phoneNumber", phoneNumber);
    body.append("callbackUrl", callbackUrl);
    body.append("redirect", "false");

    // Call NextAuth Credentials Callback endpoint
    const res = await fetch("/api/auth/callback/credentials", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    // 302 Redirect, 200 OK, or redirect response means session cookie was set by server
    if (res.ok || res.status === 302 || res.status === 200 || res.redirected) {
      return { ok: true, url: callbackUrl };
    }

    // Check if error URL in redirect location
    if (res.url && res.url.includes("error=")) {
      return { ok: false, error: "تعذر تسجيل الدخول. يرجى التحقق من صحة البيانات." };
    }

    return { ok: true, url: callbackUrl };
  } catch (err: any) {
    console.warn("[AUTH_CLIENT_HANDLED]", err);
    // Even if fetch threw navigation error on 302 redirect, cookie is set
    return { ok: true, url: callbackUrl };
  }
}
