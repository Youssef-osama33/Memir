"use server";

import { signIn } from "../../../lib/auth";
import { AuthError } from "next-auth";

export async function loginWithEmail(formData: FormData) {
  const email = formData.get("email") as string;
  if (!email || !email.trim()) {
    return { error: "يرجى إدخال عنوان بريد إلكتروني صالح." };
  }

  try {
    await signIn("credentials", {
      email: email.trim(),
      redirectTo: "/dashboard",
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "فشل التحقق من البريد الإلكتروني. يرجى التأكد من البريد والمحاولة ثانية." };
    }
    // Re-throw redirect errors so Next.js can handle the navigation
    throw error;
  }
}
