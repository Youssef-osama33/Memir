export const dynamic = "force-dynamic";

import React from "react";
import { redirect } from "next/navigation";
import { auth } from "../../lib/auth";
import { db } from "../../lib/db";
import crypto from "crypto";
import {
  User,
  Lock,
  ShieldCheck,
  Radio,
  Terminal,
  Calendar,
  Activity,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import CopyButton from "../../components/copy-button";

export default async function DashboardPage() {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/auth/signin");
  }

  const userId = session.user.id;
  const userEmail = session.user.email;

  // Query subscription details
  let activeSubscription: any = null;
  try {
    activeSubscription = await db.subscription.findFirst({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        invoices: {
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        },
      },
    });
  } catch (err) {
    console.error("[DASHBOARD_SUBSCRIPTION_QUERY_ERR]", err);
  }

  const isPremiumActive =
    activeSubscription && ["ACTIVE", "TRIALING"].includes(activeSubscription.status);

  // Auto-provision or recover direct HMAC podcast feed token
  let podcastToken: any = null;
  try {
    podcastToken = await db.podcastToken.findFirst({
      where: {
        userId: userId,
        isActive: true,
      },
    });

    if (!podcastToken && userId) {
      const generatedToken = crypto.randomBytes(24).toString("hex");
      const appUrl = process.env.APP_URL || "https://me-mar.com";
      const feedUrl = `${appUrl}/api/feed/${generatedToken}`;
      podcastToken = await db.podcastToken.create({
        data: {
          userId: userId,
          token: generatedToken,
          feedUrl: feedUrl,
          isActive: true,
        },
      });
    }
  } catch (err) {
    console.error("[PODCAST_TOKEN_PROVISION_ERR]", err);
  }

  return (
    <div id="me-mar-dashboard-context" className="min-h-screen bg-[#FCFBF9] text-[#111111] font-serif py-12 md:py-20 text-right selection:bg-black selection:text-white" dir="rtl">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="border-b border-neutral-300 pb-6 mb-10">
          <span className="font-sans text-xs font-bold text-neutral-400 uppercase tracking-widest block mb-1">
            بوابة المشترك
          </span>
          <h1 className="text-2xl md:text-4xl font-sans font-bold text-black">
            لوحة إدارة الحساب والاستخبارات الصوتية
          </h1>
          <p className="text-xs md:text-sm text-neutral-500 font-sans mt-2">
            معرف المشترك: <span className="font-mono bg-neutral-100 text-black px-1.5 py-0.5">{userId}</span>
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Area: RSS Feed & History */}
          <div className="lg:col-span-2 space-y-8 font-sans">
            {/* Podcast RSS Section */}
            <div className="border border-neutral-300 bg-white p-6 shadow-xs">
              <h3 className="text-base font-bold text-black flex items-center gap-2 mb-3">
                <Radio className="w-5 h-5 text-emerald-600 ml-1.5" />
                <span>رابط البث الصوتي الخاص (RSS المشفر)</span>
              </h3>

              <p className="text-xs text-neutral-600 leading-relaxed font-serif mb-6">
                هذا الرابط مخصص حصرياً لاشتراكك، وموقع تشفيرياً عبر تقنية <span className="font-mono font-bold bg-neutral-100 text-black px-1">HMAC-SHA256</span> ليعمل على أي تطبيق بودكاست تفضله (مثل Apple Podcasts, Overcast, Pocket Casts).
              </p>

              {podcastToken ? (
                <div className="space-y-4">
                  <div className="bg-neutral-50 border border-neutral-200 p-3 flex flex-col gap-2 font-mono text-right relative">
                    <span className="text-[10px] text-neutral-400 font-bold uppercase">
                      رابط التغذية الشخصي (Private Feed URL)
                    </span>
                    <input
                      dir="ltr"
                      type="text"
                      readOnly
                      value={podcastToken.feedUrl}
                      className="w-full bg-[#FCFBF9] border border-neutral-300 text-[11px] p-2 focus:outline-none text-left select-all"
                    />
                    <div className="flex gap-2 justify-end mt-2">
                      <CopyButton text={podcastToken.feedUrl} />
                    </div>
                  </div>

                  <div className="bg-emerald-50/60 border border-emerald-200 p-4 font-serif text-xs leading-relaxed text-emerald-950">
                    <p className="font-sans font-bold text-emerald-900 mb-1">طريقة الإضافة السريعة:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>انسخ الرابط المشفر أعلاه.</li>
                      <li>افتح تطبيق البودكاست المفضل لديك.</li>
                      <li>اختر "إضافة بودكاست عبر رابط URL" (Add via URL).</li>
                      <li>ألصق الرابط وستظهر حلقات الإيجاز الاستراتيجي تلقائياً وبأعلى جودة صوتية.</li>
                    </ol>
                  </div>
                </div>
              ) : (
                <div className="border border-dashed border-red-300 p-4 bg-red-50 text-red-900 text-xs">
                  جاري إعداد وتشفير مفتاح البودكاست... يرجى تحديث الصفحة.
                </div>
              )}
            </div>

            {/* Invoices Ledger */}
            <div className="border border-neutral-300 bg-white p-6 shadow-xs">
              <h3 className="text-base font-bold text-black flex items-center gap-2 mb-4">
                <Terminal className="w-5 h-5 text-neutral-600 ml-1.5" />
                <span>سجل الفواتير والمعاملات</span>
              </h3>

              {activeSubscription && activeSubscription.invoices && activeSubscription.invoices.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-right border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-200 text-neutral-500">
                        <th className="pb-3 pt-1">رقم الفاتورة</th>
                        <th className="pb-3 pt-1">المبلغ</th>
                        <th className="pb-3 pt-1">العملة</th>
                        <th className="pb-3 pt-1">الحالة</th>
                        <th className="pb-3 pt-1">الإيصال</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-150">
                      {activeSubscription.invoices.map((invoice: any) => (
                        <tr key={invoice.id} className="text-neutral-700">
                          <td className="py-3 font-mono">{invoice.stripeInvoiceId.substring(0, 10)}...</td>
                          <td className="py-3 font-bold">${(invoice.amountPaid / 100).toFixed(2)}</td>
                          <td className="py-3 font-mono uppercase">{invoice.currency}</td>
                          <td className="py-3">
                            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 font-bold">
                              {invoice.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3">
                            {invoice.invoiceUrl ? (
                              <a
                                href={invoice.invoiceUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-black hover:underline font-bold"
                              >
                                تحميل الفاتورة
                              </a>
                            ) : (
                              <span className="text-neutral-400">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-neutral-500 font-serif italic text-center py-6 border border-dashed border-neutral-200">
                  [لا توجد فواتير سابقة مسجلة على هذا الحساب]
                </p>
              )}
            </div>
          </div>

          {/* Sidebar Area: Profile & Subscription Status */}
          <div className="space-y-8 font-sans">
            {/* Identity Card */}
            <div className="border border-neutral-300 bg-white p-6 shadow-xs">
              <div className="flex items-center gap-3 border-b border-neutral-200 pb-4 mb-4">
                <div className="bg-black p-2 text-white">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-black">بيانات المشترك</h3>
                  <p className="text-[10px] text-neutral-400 font-mono tracking-wide uppercase">ME'MAR AGENT PROFILE</p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase font-bold">البريد الإلكتروني:</span>
                  <span className="font-mono font-bold block text-neutral-800 pt-0.5">{userEmail}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase font-bold">مستوى العضوية:</span>
                  {isPremiumActive ? (
                    <span className="mt-1 inline-flex items-center gap-1.5 bg-black text-white px-2.5 py-1 text-[10px] font-bold">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400 ml-1 shrink-0" />
                      اشتراك نشط (مِعمار بلس)
                    </span>
                  ) : (
                    <span className="mt-1 inline-flex items-center gap-1.5 border border-black text-black px-2.5 py-0.5 text-[10px] font-medium">
                      عضوية مجانية
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase font-bold">الدور في النظام:</span>
                  <span className="font-mono font-bold block text-black">{session.user?.role || "USER"}</span>
                </div>
              </div>
            </div>

            {/* Subscription Detail Panel */}
            <div className="border border-neutral-300 bg-white p-6 shadow-xs">
              <h3 className="text-sm font-bold text-black mb-4 flex items-center gap-2">
                <Lock className="w-4 h-4 text-neutral-700 ml-1 shrink-0" />
                <span>تفاصيل الاشتراك في Stripe</span>
              </h3>

              {activeSubscription ? (
                <div className="space-y-4 text-xs">
                  <div>
                    <span className="text-neutral-400 block text-[10px] uppercase font-bold">رقم اشتراك Stripe:</span>
                    <span className="font-mono text-neutral-700 block truncate">{activeSubscription.stripeSubscriptionId}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[10px] uppercase font-bold">تاريخ التجديد:</span>
                    <span className="font-sans text-neutral-700 block font-bold">{new Date(activeSubscription.currentPeriodEnd).toLocaleDateString("ar-EG")}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[10px] uppercase font-bold">حالة الاشتراك:</span>
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 inline-block font-bold mt-1">
                      {activeSubscription.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3.5 text-xs text-right">
                  <p className="text-neutral-600 font-serif leading-relaxed">
                    حسابك الحالي مسجل كعضوية مجانية. للاطلاع على التحليلات المشفرة والوصول إلى كافة الأقسام والاستماع إلى البودكاست:
                  </p>
                  <Link
                    href="/subscribe"
                    className="w-full py-2.5 bg-black text-white hover:bg-neutral-800 font-sans font-bold text-xs transition-all text-center flex items-center justify-center gap-1.5"
                  >
                    <span>الترقية إلى مِعمار بلس</span>
                    <ArrowRight className="w-4 h-4 mr-1" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
