import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import AuthSessionProvider from "../components/session-provider";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL || "https://me-mar.com"),
  title: "Me'mar (معمار)",
  description: "منصة تحليلات استراتيجية وتكنولوجية معمقة في تقاطع الذكاء الاصطناعي والجيوبوليتكس والتقنية",
  openGraph: {
    title: "Me'mar (معمار)",
    description: "منصة تحليلات استراتيجية وتكنولوجية معمقة في تقاطع الذكاء الاصطناعي والجيوبوليتكس والتقنية",
  },
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <AuthSessionProvider>
          {children}
        </AuthSessionProvider>
      </body>
    </html>
  );
}

