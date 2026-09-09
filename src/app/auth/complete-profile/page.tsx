import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "../../../lib/auth";
import { getUserProfile } from "../../../lib/user-profile";
import Navigation from "../../../components/navigation";
import Footer from "../../../components/footer";
import CompleteProfileForm from "./CompleteProfileForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "إكمال الملف الشخصي | مِعمار",
  description: "أكمل بياناتك الشخصية للوصول إلى التحليلات الاستراتيجية وتنبيهات واتساب.",
};

export default async function CompleteProfilePage() {
  const session = await auth();

  // 1. If not authenticated, send to signin
  if (!session || !session.user) {
    redirect("/auth/signin");
  }

  // 2. If returning user already completed profile (has phoneNumber), skip straight to dashboard
  const profile = await getUserProfile(session.user.id, session.user.email);
  if (profile?.phoneNumber) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#FCFBF9] text-[#111111] flex flex-col font-sans selection:bg-black selection:text-white" dir="rtl">
      <Navigation />

      <main className="flex-1 flex items-center justify-center py-12 sm:py-16 px-4 sm:px-6">
        <CompleteProfileForm
          userEmail={session.user.email || ""}
          initialName={profile?.name || session.user.name || ""}
        />
      </main>

      <Footer />
    </div>
  );
}
