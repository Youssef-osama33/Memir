"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { Loader2, AlertCircle } from "lucide-react";
import { authenticateWithCredentials } from "../../lib/auth-client";

interface GoogleSignInButtonProps {
  text?: string;
  callbackUrl?: string;
  className?: string;
}

export default function GoogleSignInButton({
  text = "المتابعة باستخدام حساب Google",
  callbackUrl = "/dashboard",
  className = "",
}: GoogleSignInButtonProps) {
  const [loading, setLoading] = useState(false);
  const [showConfigNotice, setShowConfigNotice] = useState(false);

  const handleGoogleClick = async () => {
    try {
      setLoading(true);
      setShowConfigNotice(false);

      // Attempt NextAuth Google OAuth
      const res = await signIn("google", {
        callbackUrl,
        redirect: false,
      });

      if (res?.error) {
        console.warn("[GOOGLE_AUTH_NOTICE]", res.error);
        // If Google client ID is not configured on environment, provide seamless alternative
        if (res.error === "OAuthSignin" || res.error === "Configuration" || res.error.includes("OAuth")) {
          setShowConfigNotice(true);
          setLoading(false);
          return;
        }
      }

      if (res?.url) {
        window.location.href = res.url;
      }
    } catch (err: any) {
      console.warn("[GOOGLE_AUTH_ERROR]", err);
      setShowConfigNotice(true);
      setLoading(false);
    }
  };

  const handleDevGoogleLogin = async () => {
    setLoading(true);
    try {
      const res = await authenticateWithCredentials({
        email: "researcher@gmail.com",
        name: "متابع مِعمار (Google User)",
        callbackUrl,
      });

      if (res.ok) {
        window.location.href = callbackUrl;
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-2">
      <button
        type="button"
        id="google-signin-btn"
        onClick={handleGoogleClick}
        disabled={loading}
        className={`w-full h-12 bg-white border-2 border-neutral-300 hover:border-black text-neutral-800 hover:text-black font-bold text-xs tracking-wider transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer rounded-xs shadow-2xs ${className}`}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-neutral-600" />
            <span>جاري الاتصال بـ Google...</span>
          </>
        ) : (
          <>
            {/* Standard SVG Google 'G' Logo */}
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{text}</span>
          </>
        )}
      </button>

      {showConfigNotice && (
        <div className="p-3 bg-amber-50 border border-amber-300 text-amber-900 text-xs rounded-xs space-y-2 font-sans text-right animate-in fade-in">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-[#C86A00] flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">لتفعيل تسجيل الدخول التلقائي بـ Google في الإنتاج:</p>
              <p className="text-[11px] text-neutral-700">
                أضف مفاتيح <code className="bg-amber-100 px-1 py-0.5 font-mono">GOOGLE_CLIENT_ID</code> و <code className="bg-amber-100 px-1 py-0.5 font-mono">GOOGLE_CLIENT_SECRET</code> في إعدادات البيئة (.env).
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDevGoogleLogin}
            className="w-full mt-2 py-1.5 bg-[#C86A00] hover:bg-[#A85800] text-white text-xs font-bold rounded-xs transition-colors"
          >
            تجربة الدخول الفوري بحساب Google تجريبي (Demo) ←
          </button>
        </div>
      )}
    </div>
  );
}
