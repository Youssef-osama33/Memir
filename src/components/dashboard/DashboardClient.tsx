"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  User,
  CreditCard,
  Bookmark,
  Heart,
  MessageSquare,
  Radio,
  Settings,
  ShieldCheck,
  Lock,
  ExternalLink,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Clock,
  Sparkles,
  Phone,
  Mail,
  Copy,
  Check,
  RefreshCw,
  X,
} from "lucide-react";

export interface ArticlePreviewData {
  slug: string;
  title: string;
  category: string;
  categoryTitle?: string;
  publishedAt: string;
  readingTime?: string;
  isPremium?: boolean;
}

export interface UserCommentData {
  id: string;
  articleId: string;
  articleTitle: string;
  content: string;
  createdAt: string;
}

export interface DashboardClientProps {
  user: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    role: string;
    createdAt: string;
    tier: "FREE" | "STANDARD" | "PLUS";
    isPremium: boolean;
    hasPlusAccess: boolean;
  };
  subscription: {
    id?: string;
    status?: string;
    tier?: string;
    interval?: string;
    currentPeriodEnd?: string;
    stripeSubscriptionId?: string;
    invoices?: Array<{
      id: string;
      stripeInvoiceId: string;
      amountPaid: number;
      currency: string;
      status: string;
      invoiceUrl?: string | null;
      createdAt: string;
    }>;
  } | null;
  podcastToken: {
    feedUrl: string;
    token: string;
  } | null;
  savedArticles: ArticlePreviewData[];
  likedArticles: ArticlePreviewData[];
  userComments: UserCommentData[];
}

type TabKey = "subscription" | "saved" | "activity" | "podcast" | "settings";

export default function DashboardClient({
  user: initialUser,
  subscription,
  podcastToken,
  savedArticles: initialSavedArticles,
  likedArticles,
  userComments: initialUserComments,
}: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("subscription");

  // Profile Form state
  const [userProfile, setUserProfile] = useState(initialUser);
  const [editName, setEditName] = useState(initialUser.name || "");
  const [editPhone, setEditPhone] = useState(initialUser.phoneNumber || "");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccessMessage, setProfileSuccessMessage] = useState<string | null>(null);
  const [profileErrorMessage, setProfileErrorMessage] = useState<string | null>(null);

  // Saved Articles local state for optimistic delete
  const [savedArticles, setSavedArticles] = useState<ArticlePreviewData[]>(initialSavedArticles);
  const [removingSavedSlug, setRemovingSavedSlug] = useState<string | null>(null);

  // Comments local state for optimistic delete
  const [comments, setComments] = useState<UserCommentData[]>(initialUserComments);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);

  // Stripe Portal Loading State
  const [isOpeningPortal, setIsOpeningPortal] = useState(false);
  const [portalNotice, setPortalNotice] = useState<string | null>(null);

  // Podcast URL Copy State
  const [hasCopiedFeed, setHasCopiedFeed] = useState(false);

  // Delete Account Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmEmailInput, setConfirmEmailInput] = useState("");
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteAccountError, setDeleteAccountError] = useState<string | null>(null);

  // Copy podcast feed URL
  const handleCopyFeed = async () => {
    if (!podcastToken?.feedUrl) return;
    try {
      await navigator.clipboard.writeText(podcastToken.feedUrl);
      setHasCopiedFeed(true);
      setTimeout(() => setHasCopiedFeed(false), 2500);
    } catch {
      // fallback
    }
  };

  // Open Stripe Billing Customer Portal
  const handleOpenStripePortal = async () => {
    setIsOpeningPortal(true);
    setPortalNotice(null);
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setPortalNotice(data.message || data.error || "تعذر فتح بوابة الفوترة.");
      }
    } catch (err: any) {
      setPortalNotice("حدث خطأ في الاتصال ببوابة الفوترة.");
    } finally {
      setIsOpeningPortal(false);
    }
  };

  // Remove saved article
  const handleRemoveSaved = async (slug: string) => {
    setRemovingSavedSlug(slug);
    try {
      const res = await fetch(`/api/articles/${slug}/save`, { method: "POST" });
      if (res.ok) {
        setSavedArticles((prev) => prev.filter((item) => item.slug !== slug));
      }
    } catch (err) {
      console.error("Error removing saved article", err);
    } finally {
      setRemovingSavedSlug(null);
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId: string) => {
    setDeletingCommentId(commentId);
    try {
      const res = await fetch(`/api/comments/${commentId}`, { method: "DELETE" });
      if (res.ok) {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
      }
    } catch (err) {
      console.error("Error deleting comment", err);
    } finally {
      setDeletingCommentId(null);
    }
  };

  // Save profile changes
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileSuccessMessage(null);
    setProfileErrorMessage(null);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          phoneNumber: editPhone,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setProfileErrorMessage(data.error || "تعذر تحديث البيانات.");
      } else {
        setUserProfile((prev) => ({
          ...prev,
          name: editName,
          phoneNumber: data.user?.phoneNumber || editPhone,
        }));
        setProfileSuccessMessage("تم تحديث بيانات ملفك الشخصي بنجاح.");
        setTimeout(() => setProfileSuccessMessage(null), 4000);
      }
    } catch (err: any) {
      setProfileErrorMessage("حدث خطأ غير متوقع أثناء الحفظ.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Delete Account
  const handleDeleteAccount = async () => {
    if (confirmEmailInput.trim().toLowerCase() !== userProfile.email.toLowerCase().trim()) {
      setDeleteAccountError("البريد الإلكتروني الذي أدخلته غير متطابق.");
      return;
    }

    setIsDeletingAccount(true);
    setDeleteAccountError(null);

    try {
      const res = await fetch("/api/user/account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmEmail: confirmEmailInput }),
      });

      const data = await res.json();
      if (!res.ok) {
        setDeleteAccountError(data.error || "تعذر حذف الحساب.");
        setIsDeletingAccount(false);
      } else {
        // Sign out and redirect to home
        await signOut({ callbackUrl: "/" });
      }
    } catch (err: any) {
      setDeleteAccountError("حدث خطأ أثناء محاولة حذف الحساب.");
      setIsDeletingAccount(false);
    }
  };

  // Calculate initials for avatar
  const getInitials = (nameStr?: string) => {
    if (!nameStr) return "م";
    const parts = nameStr.trim().split(/\s+/);
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  const isPlus = userProfile.hasPlusAccess || userProfile.tier === "PLUS";
  const isStandard = userProfile.tier === "STANDARD" && !isPlus;
  const isFree = !userProfile.isPremium;

  return (
    <div className="space-y-10 font-sans" dir="rtl">
      {/* =========================================================================
          1. HEADER AREA: PROFILE OVERVIEW & TIER BADGE
          ========================================================================= */}
      <div className="bg-white border border-[#E5E2DC] p-6 sm:p-8 rounded-sm shadow-xs relative">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Avatar and basic info */}
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-neutral-900 text-[#FAF7F0] flex items-center justify-center font-serif text-xl sm:text-2xl font-bold border-2 border-[#C86A00] shrink-0 shadow-inner">
              {getInitials(userProfile.name || userProfile.email)}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 font-sans">
                  {userProfile.name || "مشترك مِعمار"}
                </h1>

                {/* Plan Badge with Amber accent */}
                {isPlus ? (
                  <span className="inline-flex items-center gap-1 bg-[#1A1A1A] text-[#FAF7F0] border border-[#C86A00] px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide shadow-2xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C86A00]" />
                    <span className="text-[#FBBF24]">مِعمار بلس</span>
                    {subscription?.interval && (
                      <span className="text-neutral-400 text-[10px] font-mono">
                        ({subscription.interval === "YEARLY" ? "سنوي" : "شهري"})
                      </span>
                    )}
                  </span>
                ) : isStandard ? (
                  <span className="inline-flex items-center gap-1 bg-neutral-100 text-neutral-800 border border-neutral-300 px-2.5 py-0.5 rounded-full text-xs font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-neutral-600" />
                    <span>الاشتراك القياسي</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-[#FAF7F0] text-neutral-700 border border-[#D5CFBE] px-2.5 py-0.5 rounded-full text-xs font-medium">
                    <span>عضوية مجانية</span>
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-neutral-600 font-sans">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="font-mono text-neutral-800">{userProfile.email}</span>
                </span>

                {userProfile.phoneNumber && (
                  <span className="flex items-center gap-1" dir="ltr">
                    <span className="font-mono text-neutral-800">{userProfile.phoneNumber}</span>
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  </span>
                )}

                {userProfile.createdAt && (
                  <span className="flex items-center gap-1 text-neutral-500">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                    <span>عضو منذ {new Date(userProfile.createdAt).toLocaleDateString("ar-EG", { year: "numeric", month: "long" })}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick action buttons */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-start md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-neutral-100">
            <button
              onClick={() => setActiveTab("settings")}
              className="px-4 py-2 border border-neutral-300 hover:border-neutral-900 bg-[#FCFBF9] text-xs font-bold text-neutral-800 transition-colors flex items-center gap-1.5 rounded-xs"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>تعديل الملف الشخصي</span>
            </button>

            {!isPlus && (
              <Link
                href="/subscribe"
                className="px-4 py-2 bg-[#C86A00] hover:bg-[#8C4B00] text-white text-xs font-bold transition-colors flex items-center gap-1.5 rounded-xs shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>الترقية إلى بلس</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. RESPONSIVE TAB NAVIGATION
          ========================================================================= */}
      <div className="border-b border-[#E5E2DC] flex items-center justify-between overflow-x-auto no-scrollbar gap-1 sm:gap-2">
        <div className="flex items-center gap-1 sm:gap-2 min-w-max">
          <button
            onClick={() => setActiveTab("subscription")}
            className={`flex items-center gap-2 py-3 px-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "subscription"
                ? "border-[#C86A00] text-neutral-900 bg-white/50"
                : "border-transparent text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <CreditCard className={`w-4 h-4 ${activeTab === "subscription" ? "text-[#C86A00]" : "text-neutral-400"}`} />
            <span>الاشتراك والفوترة</span>
          </button>

          <button
            onClick={() => setActiveTab("saved")}
            className={`flex items-center gap-2 py-3 px-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "saved"
                ? "border-[#C86A00] text-neutral-900 bg-white/50"
                : "border-transparent text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <Bookmark className={`w-4 h-4 ${activeTab === "saved" ? "text-[#C86A00]" : "text-neutral-400"}`} />
            <span>المقالات المحفوظة</span>
            {savedArticles.length > 0 && (
              <span className="bg-neutral-100 text-neutral-800 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full border border-neutral-200">
                {savedArticles.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("activity")}
            className={`flex items-center gap-2 py-3 px-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "activity"
                ? "border-[#C86A00] text-neutral-900 bg-white/50"
                : "border-transparent text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <Heart className={`w-4 h-4 ${activeTab === "activity" ? "text-red-600" : "text-neutral-400"}`} />
            <span>نشاطي ومشاركاتي</span>
            {(likedArticles.length > 0 || comments.length > 0) && (
              <span className="bg-neutral-100 text-neutral-800 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full border border-neutral-200">
                {likedArticles.length + comments.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("podcast")}
            className={`flex items-center gap-2 py-3 px-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "podcast"
                ? "border-[#C86A00] text-neutral-900 bg-white/50"
                : "border-transparent text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <Radio className={`w-4 h-4 ${activeTab === "podcast" ? "text-emerald-600" : "text-neutral-400"}`} />
            <span>الاستخبارات الصوتية</span>
            {!isPlus ? (
              <span className="bg-amber-100 text-[#8C4B00] text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                <Lock className="w-2.5 h-2.5" />
                <span>بلس</span>
              </span>
            ) : (
              <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                نشط
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 py-3 px-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "settings"
                ? "border-[#C86A00] text-neutral-900 bg-white/50"
                : "border-transparent text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <Settings className={`w-4 h-4 ${activeTab === "settings" ? "text-[#C86A00]" : "text-neutral-400"}`} />
            <span>إعدادات الحساب</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          3. TAB CONTENT PANELS
          ========================================================================= */}

      {/* TAB 1: SUBSCRIPTION & BILLING */}
      {activeTab === "subscription" && (
        <div className="space-y-8 animate-in fade-in-50 duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Active Plan Card */}
            <div className="lg:col-span-2 bg-white border border-[#E5E2DC] p-6 sm:p-7 rounded-sm shadow-xs">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4 mb-5">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                    الباقة الحالية
                  </span>
                  <h3 className="text-xl font-bold text-neutral-900 font-sans mt-0.5">
                    {isPlus
                      ? "مِعمار بلس (المستوى الاستراتيجي الأعلى)"
                      : isStandard
                      ? "الاشتراك القياسي (وصول شهري كامل)"
                      : "العضوية المجانية"}
                  </h3>
                </div>

                <div className="text-left">
                  {userProfile.isPremium ? (
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-xs inline-block">
                      {subscription?.status === "TRIALING" ? "فترة تجريبية" : "اشتراك نشط"}
                    </span>
                  ) : (
                    <span className="bg-neutral-100 text-neutral-600 border border-neutral-200 text-xs font-bold px-3 py-1 rounded-xs inline-block">
                      حساب غير مدفوع
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-xs">
                <div className="bg-[#FAF7F0] border border-[#E5E2DC] p-3.5 rounded-xs">
                  <span className="text-neutral-500 block mb-1">دورة الفوترة:</span>
                  <span className="font-bold text-neutral-900 font-sans text-sm">
                    {subscription?.interval === "YEARLY" ? "سنوية (وفر شهرين)" : subscription?.interval === "MONTHLY" ? "شهرية" : "غير محددة"}
                  </span>
                </div>

                <div className="bg-[#FAF7F0] border border-[#E5E2DC] p-3.5 rounded-xs">
                  <span className="text-neutral-500 block mb-1">تاريخ التجديد القادم:</span>
                  <span className="font-bold text-neutral-900 font-sans text-sm">
                    {subscription?.currentPeriodEnd
                      ? new Date(subscription.currentPeriodEnd).toLocaleDateString("ar-EG", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "لا يوجد تجديد تلقائي"}
                  </span>
                </div>

                <div className="bg-[#FAF7F0] border border-[#E5E2DC] p-3.5 rounded-xs">
                  <span className="text-neutral-500 block mb-1">رقم تعريف الاشتراك:</span>
                  <span className="font-mono text-neutral-800 text-[11px] truncate block" title={subscription?.stripeSubscriptionId || "N/A"}>
                    {subscription?.stripeSubscriptionId ? subscription.stripeSubscriptionId.slice(0, 16) + "..." : "غير متوفر"}
                  </span>
                </div>
              </div>

              {/* Action Buttons for Subscription */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={handleOpenStripePortal}
                  disabled={isOpeningPortal}
                  className="px-5 py-2.5 bg-neutral-900 hover:bg-black text-white text-xs font-bold transition-all flex items-center gap-2 rounded-xs disabled:opacity-50 cursor-pointer shadow-2xs"
                >
                  {isOpeningPortal ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <ExternalLink className="w-3.5 h-3.5" />
                  )}
                  <span>إدارة الاشتراك عبر بوابة Stripe الرسمية</span>
                </button>

                {!isPlus && (
                  <Link
                    href="/subscribe"
                    className="px-5 py-2.5 bg-[#C86A00] hover:bg-[#8C4B00] text-white text-xs font-bold transition-all flex items-center gap-2 rounded-xs shadow-2xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>ترقية الباقة إلى مِعمار بلس</span>
                  </Link>
                )}
              </div>

              {portalNotice && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>{portalNotice}</span>
                </div>
              )}

              <p className="text-[11px] text-neutral-500 font-serif mt-4 leading-relaxed">
                * يمكنك من خلال بوابة Stripe الآمنة تحديث بطاقة الدفع، تنزيل الفواتير الرسمية، أو إلغاء التجديد التلقائي في أي وقت بنقرة واحدة.
              </p>
            </div>

            {/* Quick Plan Highlights Card */}
            <div className="bg-[#FAF7F0] border border-[#E5E2DC] p-6 rounded-sm flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-neutral-900 mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#C86A00]" />
                  <span>مزايا باقتك الحالية</span>
                </h4>
                <ul className="space-y-2.5 text-xs text-neutral-700 font-serif">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span>قراءة كافة الأوراق والمراجعات الاستراتيجية</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span>إشعارات النشر الفورية عبر واتساب المعتمد</span>
                  </li>
                  <li className="flex items-start gap-2">
                    {isPlus ? (
                      <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                    )}
                    <span className={isPlus ? "font-bold text-neutral-900" : "text-neutral-400 line-through"}>
                      خلاصة الإيجاز الصوتي الخاص (Podcast RSS)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    {isPlus ? (
                      <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                    )}
                    <span className={isPlus ? "font-bold text-neutral-900" : "text-neutral-400 line-through"}>
                      أولوية في حلقات النقاش والدراسات الخاصة
                    </span>
                  </li>
                </ul>
              </div>

              {!isPlus && (
                <div className="mt-6 pt-4 border-t border-neutral-200">
                  <p className="text-[11px] text-neutral-600 font-serif mb-2">
                    ارتقِ بتجربتك المعرفية مع البودكاست المشفر عالي الدقة:
                  </p>
                  <Link
                    href="/subscribe"
                    className="block text-center py-2 bg-neutral-900 hover:bg-black text-white text-xs font-bold transition-colors rounded-xs"
                  >
                    اكتشف باقة بلس ←
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Billing Ledger / Invoices Table */}
          <div className="bg-white border border-[#E5E2DC] p-6 sm:p-7 rounded-sm shadow-xs">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3 mb-5">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-neutral-700" />
                <h3 className="text-base font-bold text-neutral-900">سجل الفواتير والمعاملات</h3>
              </div>
              <span className="text-xs text-neutral-400 font-mono">
                {subscription?.invoices?.length || 0} معاملة مسجلة
              </span>
            </div>

            {subscription?.invoices && subscription.invoices.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-right border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-200 text-neutral-500 font-sans">
                      <th className="pb-3 pt-1">رقم الفاتورة</th>
                      <th className="pb-3 pt-1">التاريخ</th>
                      <th className="pb-3 pt-1">المبلغ</th>
                      <th className="pb-3 pt-1">الحالة</th>
                      <th className="pb-3 pt-1 text-left">الإيصال المباشر</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 font-sans">
                    {subscription.invoices.map((invoice) => (
                      <tr key={invoice.id} className="text-neutral-800 hover:bg-neutral-50/70">
                        <td className="py-3.5 font-mono text-[11px]">
                          {invoice.stripeInvoiceId.length > 14
                            ? invoice.stripeInvoiceId.substring(0, 14) + "..."
                            : invoice.stripeInvoiceId}
                        </td>
                        <td className="py-3.5 text-neutral-600">
                          {new Date(invoice.createdAt).toLocaleDateString("ar-EG")}
                        </td>
                        <td className="py-3.5 font-bold font-mono">
                          ${(invoice.amountPaid / 100).toFixed(2)}{" "}
                          <span className="text-[10px] text-neutral-500 uppercase">{invoice.currency}</span>
                        </td>
                        <td className="py-3.5">
                          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 font-bold rounded-2xs text-[10px]">
                            {invoice.status.toUpperCase() === "PAID" ? "تم السداد" : invoice.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3.5 text-left">
                          {invoice.invoiceUrl ? (
                            <a
                              href={invoice.invoiceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[#C86A00] hover:text-[#8C4B00] font-bold hover:underline"
                            >
                              <span>تحميل PDF</span>
                              <ExternalLink className="w-3 h-3" />
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
              <div className="text-center py-10 border border-dashed border-neutral-200 rounded-xs bg-[#FCFBF9]">
                <CreditCard className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                <p className="text-xs text-neutral-500 font-serif">
                  لا توجد فواتير سابقة مسجلة على هذا الحساب بعد.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: SAVED ARTICLES */}
      {activeTab === "saved" && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          <div className="flex items-center justify-between border-b border-[#E5E2DC] pb-4">
            <div>
              <h3 className="text-lg font-bold text-neutral-900 font-sans flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-[#C86A00]" />
                <span>المقالات المحفوظة للقراءة لاحقاً</span>
              </h3>
              <p className="text-xs text-neutral-500 font-serif mt-1">
                دراسات وأوراق قمت بتمييزها للرجوع إليها وإتمام قراءتها في أي وقت.
              </p>
            </div>
            <span className="text-xs font-mono font-bold bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded-full border border-neutral-200">
              {savedArticles.length} دراسات محفوظة
            </span>
          </div>

          {savedArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedArticles.map((article) => (
                <div
                  key={article.slug}
                  className="bg-white border border-[#E5E2DC] p-5 rounded-xs hover:border-[#C86A00] transition-colors flex flex-col justify-between shadow-2xs group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2 font-sans text-xs">
                      <span className="text-neutral-500 text-[11px] font-medium bg-neutral-100 px-2 py-0.5 rounded-2xs">
                        {article.categoryTitle || article.category}
                      </span>
                      <span className="text-[11px] text-neutral-400 font-mono">
                        {new Date(article.publishedAt).toLocaleDateString("ar-EG")}
                      </span>
                    </div>

                    <h4 className="text-base font-bold font-serif text-neutral-900 group-hover:text-[#C86A00] transition-colors leading-snug mb-3">
                      <Link href={`/articles/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h4>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-neutral-100 text-xs font-sans mt-3">
                    <Link
                      href={`/articles/${article.slug}`}
                      className="text-neutral-900 hover:text-[#C86A00] font-bold inline-flex items-center gap-1 transition-colors"
                    >
                      <span>قراءة المقال</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      onClick={() => handleRemoveSaved(article.slug)}
                      disabled={removingSavedSlug === article.slug}
                      className="text-neutral-400 hover:text-red-600 transition-colors p-1 rounded-xs flex items-center gap-1 text-[11px] cursor-pointer"
                      title="إزالة من المحفوظات"
                    >
                      {removingSavedSlug === article.slug ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-neutral-400" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                      <span>إزالة</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white border border-dashed border-neutral-300 rounded-xs p-8">
              <Bookmark className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
              <h4 className="text-base font-bold text-neutral-800 font-sans mb-1">
                لم تقم بحفظ أي مقالات بعد
              </h4>
              <p className="text-xs text-neutral-500 font-serif max-w-md mx-auto mb-5 leading-relaxed">
                أثناء تصفحك للتحليلات والمراجعات الاستراتيجية، اضغط على زر الإشارة المرجعية (حفظ لاحقاً) لتظهر هنا تلقائياً.
              </p>
              <Link
                href="/archive"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-xs transition-colors"
              >
                <span>استكشاف أرشيف الدراسات</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CONTENT ACTIVITY (LIKES & COMMENTS) */}
      {activeTab === "activity" && (
        <div className="space-y-8 animate-in fade-in-50 duration-200">
          {/* Liked Articles Section */}
          <div className="bg-white border border-[#E5E2DC] p-6 sm:p-7 rounded-sm shadow-xs">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-5">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-600" />
                <h3 className="text-base font-bold text-neutral-900 font-sans">
                  الدراسات التي أبدت إعجابك بها
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-neutral-500">
                {likedArticles.length} دراسات
              </span>
            </div>

            {likedArticles.length > 0 ? (
              <div className="divide-y divide-neutral-100">
                {likedArticles.map((article) => (
                  <div
                    key={article.slug}
                    className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4 group"
                  >
                    <div>
                      <span className="text-[10px] font-medium text-neutral-400 block mb-1">
                        {article.categoryTitle || article.category}
                      </span>
                      <Link
                        href={`/articles/${article.slug}`}
                        className="text-sm font-bold font-serif text-neutral-900 group-hover:text-[#C86A00] transition-colors leading-snug block"
                      >
                        {article.title}
                      </Link>
                    </div>

                    <Link
                      href={`/articles/${article.slug}`}
                      className="text-xs text-neutral-600 hover:text-black font-sans font-medium shrink-0 flex items-center gap-1"
                    >
                      <span>عرض</span>
                      <ArrowLeft className="w-3 h-3" />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-neutral-500 font-serif italic py-6 text-center border border-dashed border-neutral-200 rounded-xs">
                [لم تسجل إعجابك بأي دراسة حتى الآن]
              </p>
            )}
          </div>

          {/* User Comments Section */}
          <div className="bg-white border border-[#E5E2DC] p-6 sm:p-7 rounded-sm shadow-xs">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-5">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-neutral-700" />
                <h3 className="text-base font-bold text-neutral-900 font-sans">
                  سجل تعليقاتك ومشاركاتك
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-neutral-500">
                {comments.length} تعليقات
              </span>
            </div>

            {comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 bg-[#FCFBF9] border border-neutral-200 rounded-xs flex flex-col justify-between gap-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-[10px] text-neutral-400 font-sans block mb-1">
                          تعليق على أطروحة:{" "}
                          <Link
                            href={`/articles/${c.articleId}`}
                            className="text-[#C86A00] hover:underline font-serif font-bold"
                          >
                            {c.articleTitle || c.articleId}
                          </Link>
                        </span>
                        <p className="text-xs text-neutral-800 font-serif leading-relaxed mt-1 whitespace-pre-wrap">
                          {c.content}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDeleteComment(c.id)}
                        disabled={deletingCommentId === c.id}
                        className="text-neutral-400 hover:text-red-600 transition-colors p-1.5 rounded-xs shrink-0 cursor-pointer"
                        title="حذف هذا التعليق"
                      >
                        {deletingCommentId === c.id ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <div className="text-[10px] text-neutral-400 font-mono text-left pt-2 border-t border-neutral-150">
                      {new Date(c.createdAt).toLocaleString("ar-EG")}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-neutral-500 font-serif italic py-6 text-center border border-dashed border-neutral-200 rounded-xs">
                [لم تنشر أي تعليقات أو مداخلات بعد]
              </p>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: PODCAST / AUDIO ACCESS */}
      {activeTab === "podcast" && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          {isPlus ? (
            /* PLUS ACCESS: FULL RSS FEED */
            <div className="bg-white border border-[#E5E2DC] p-6 sm:p-8 rounded-sm shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Radio className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-neutral-900 font-sans">
                      رابط البث الصوتي الخاص (Private Podcast RSS)
                    </h3>
                    <p className="text-xs text-neutral-500 font-serif">
                      موجز تحليلي واستخباراتي صوتي موقع تشفيرياً بتقنية HMAC-SHA256
                    </p>
                  </div>
                </div>

                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-2.5 py-1 rounded-full font-sans">
                  متاح باشتراك بلس
                </span>
              </div>

              <div className="space-y-4">
                <div className="bg-[#FAF7F0] border border-[#E5E2DC] p-4 rounded-xs">
                  <span className="text-[11px] font-bold font-sans text-neutral-500 uppercase block mb-1.5">
                    رابط التغذية الشخصي المشفر (Personal Feed URL):
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      dir="ltr"
                      value={podcastToken?.feedUrl || ""}
                      className="w-full bg-white border border-neutral-300 text-xs p-2.5 font-mono text-neutral-800 rounded-xs focus:outline-none select-all text-left"
                    />
                    <button
                      onClick={handleCopyFeed}
                      className="px-4 py-2.5 bg-neutral-900 hover:bg-black text-white text-xs font-bold transition-all shrink-0 rounded-xs flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      {hasCopiedFeed ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>تم النسخ!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>نسخ الرابط</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-emerald-50/70 border border-emerald-200 p-5 rounded-xs font-serif text-xs leading-relaxed text-emerald-950">
                  <h4 className="font-sans font-bold text-emerald-900 mb-2 flex items-center gap-1.5 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>كيفية إضافة البودكاست في 3 خطوات بسيطة:</span>
                  </h4>
                  <ol className="list-decimal list-inside space-y-1.5 pr-1 text-emerald-900">
                    <li>انسخ الرابط الشخصي المشفر أعلاه.</li>
                    <li>افتح تطبيق البودكاست المفضل لديك (مثل Apple Podcasts, Pocket Casts, Overcast).</li>
                    <li>اختر "إضافة بودكاست عبر رابط URL" (Add Show by URL / Follow by URL).</li>
                    <li>الصق الرابط، وستصلك حلقات الإيجاز الاستراتيجي المسجلة بأعلى معايير الإنتاج الصوتي فور صدورها.</li>
                  </ol>
                </div>
              </div>
            </div>
          ) : (
            /* LOCKED PREVIEW STATE FOR FREE/STANDARD */
            <div className="bg-white border border-[#E5E2DC] p-8 rounded-sm shadow-xs text-center max-w-2xl mx-auto space-y-6">
              <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-300 text-[#C86A00] flex items-center justify-center mx-auto">
                <Lock className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[11px] font-bold font-sans uppercase tracking-widest text-[#C86A00] block mb-1">
                  ميزة حصرية لمشتركي مِعمار بلس
                </span>
                <h3 className="text-xl font-bold font-sans text-neutral-900 mb-2">
                  الاستخبارات الصوتية والإيجاز الاستراتيجي
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 font-serif leading-relaxed max-w-lg mx-auto">
                  استمع إلى أوراق التقدير والمراجعات الاستراتيجية عبر تغذية صوتية خاصة ومقفلة (Private Podcast) تعمل على كافة تطبيقات البودكاست العالمية مع تحليلات معمقة لمجريات الساحة التقنية والجيوسياسية.
                </p>
              </div>

              <div className="bg-[#FAF7F0] border border-[#E5E2DC] p-5 rounded-xs text-right max-w-md mx-auto space-y-2 text-xs font-serif">
                <div className="flex items-center gap-2 text-neutral-800">
                  <CheckCircle2 className="w-4 h-4 text-[#C86A00] shrink-0" />
                  <span>تسجيلات صوتية احترافية ملخصة لكل دراسة رئيسية</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-800">
                  <CheckCircle2 className="w-4 h-4 text-[#C86A00] shrink-0" />
                  <span>تحديث تلقائي عبر Apple Podcasts و Overcast و Pocket Casts</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-800">
                  <CheckCircle2 className="w-4 h-4 text-[#C86A00] shrink-0" />
                  <span>ملاحظات صوتية سريعة حول التطورات الطارئة</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/subscribe"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#C86A00] hover:bg-[#8C4B00] text-white text-xs sm:text-sm font-bold rounded-xs transition-all shadow-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>الترقية إلى مِعمار بلس وتفعيل البودكاست</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: ACCOUNT SETTINGS */}
      {activeTab === "settings" && (
        <div className="space-y-8 animate-in fade-in-50 duration-200">
          {/* Profile Edit Form */}
          <div className="bg-white border border-[#E5E2DC] p-6 sm:p-8 rounded-sm shadow-xs">
            <div className="border-b border-neutral-100 pb-3 mb-6">
              <h3 className="text-base font-bold text-neutral-900 font-sans">
                تعديل بيانات الملف الشخصي
              </h3>
              <p className="text-xs text-neutral-500 font-serif mt-0.5">
                تحديث اسم المشترك ورقم واتساب المعتمد لإشعارات النشر الاستراتيجية.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5 max-w-xl">
              <div>
                <label className="block text-xs font-bold font-sans text-neutral-700 mb-1.5">
                  الاسم الكامل:
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="مثال: د. طارق، أحمد المنصوري..."
                  className="w-full bg-[#FCFBF9] border border-neutral-300 p-2.5 text-xs text-neutral-900 rounded-xs focus:outline-none focus:border-neutral-900 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold font-sans text-neutral-700 mb-1.5">
                  البريد الإلكتروني الموثق (للقراءة فقط):
                </label>
                <input
                  type="email"
                  disabled
                  value={userProfile.email}
                  className="w-full bg-neutral-100 border border-neutral-200 p-2.5 text-xs text-neutral-500 font-mono rounded-xs cursor-not-allowed"
                />
                <span className="text-[10px] text-neutral-400 font-serif mt-1 block">
                  * لتغيير البريد الإلكتروني، يرجى التواصل مع الدعم الفني لضمان سلامة الجلسة.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold font-sans text-neutral-700 mb-1.5 flex items-center justify-between">
                  <span>رقم هاتف واتساب المعتمد:</span>
                  <span className="text-[10px] text-[#C86A00] font-normal">مع رمز الدولة الدولي (مثال: +966500000000)</span>
                </label>
                <input
                  type="tel"
                  dir="ltr"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="+966501234567"
                  className="w-full bg-[#FCFBF9] border border-neutral-300 p-2.5 text-xs font-mono text-neutral-900 rounded-xs focus:outline-none focus:border-neutral-900 transition-colors text-right"
                />
              </div>

              {profileSuccessMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{profileSuccessMessage}</span>
                </div>
              )}

              {profileErrorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-900 text-xs rounded-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-700 shrink-0" />
                  <span>{profileErrorMessage}</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-6 py-2.5 bg-neutral-900 hover:bg-black text-white text-xs font-bold transition-all rounded-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSavingProfile ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  <span>حفظ التعديلات</span>
                </button>
              </div>
            </form>
          </div>

          {/* Session & Sign Out */}
          <div className="bg-white border border-[#E5E2DC] p-6 sm:p-8 rounded-sm shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-neutral-900 font-sans">
                إنهاء الجلسة الحالية
              </h4>
              <p className="text-xs text-neutral-500 font-serif mt-0.5">
                تسجيل الخروج من المنصة على هذا الجهاز بأمان.
              </p>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="px-5 py-2 border border-neutral-300 hover:border-neutral-900 text-neutral-800 text-xs font-bold transition-colors rounded-xs cursor-pointer"
            >
              تسجيل الخروج
            </button>
          </div>

          {/* Danger Zone: Delete Account */}
          <div className="bg-red-50/40 border border-red-200 p-6 sm:p-8 rounded-sm">
            <div className="border-b border-red-200/60 pb-3 mb-4">
              <h4 className="text-sm font-bold text-red-900 font-sans flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-700" />
                <span>منطقة الخطر - حذف الحساب نهائياً</span>
              </h4>
              <p className="text-xs text-red-700/80 font-serif mt-1">
                إجراء لا يمكن التراجع عنه. سيؤدي إلى حذف حسابك وكافة المقالات المحفوظة، والتعليقات، والاشتراكات ومفتاح البودكاست الخاص بك فوراً.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xs transition-colors cursor-pointer"
            >
              حذف الحساب نهائياً
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          CONFIRMATION MODAL: DELETE ACCOUNT
          ========================================================================= */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-red-500 max-w-md w-full p-6 rounded-sm shadow-xl space-y-4 text-right animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h3 className="text-base font-bold text-red-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span>تأكيد حذف الحساب نهائياً</span>
              </h3>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setConfirmEmailInput("");
                  setDeleteAccountError(null);
                }}
                className="text-neutral-400 hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-700 font-serif leading-relaxed">
              هذا الإجراء <strong>نهائي ولا رجعة فيه</strong>. ستفقد كافة بياناتك والوصول إلى أوراق التحليلات والاشتراكات.
            </p>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-neutral-800">
                يرجى كتابة بريدك الإلكتروني{" "}
                <span className="font-mono bg-neutral-100 text-black px-1 py-0.5 border border-neutral-200 select-all">
                  {userProfile.email}
                </span>{" "}
                لتأكيد الحذف:
              </label>
              <input
                type="text"
                dir="ltr"
                value={confirmEmailInput}
                onChange={(e) => setConfirmEmailInput(e.target.value)}
                placeholder={userProfile.email}
                className="w-full bg-[#FCFBF9] border border-red-300 p-2 text-xs font-mono text-neutral-900 rounded-xs focus:outline-none focus:border-red-600"
              />
            </div>

            {deleteAccountError && (
              <div className="text-[11px] text-red-600 bg-red-50 p-2 border border-red-200 rounded-xs">
                {deleteAccountError}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setConfirmEmailInput("");
                  setDeleteAccountError(null);
                }}
                className="px-4 py-2 border border-neutral-300 hover:bg-neutral-100 text-xs font-bold rounded-xs transition-colors cursor-pointer"
              >
                إلغاء
              </button>

              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={
                  isDeletingAccount ||
                  confirmEmailInput.trim().toLowerCase() !== userProfile.email.toLowerCase().trim()
                }
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xs transition-colors disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
              >
                {isDeletingAccount && <RefreshCw className="w-3 h-3 animate-spin" />}
                <span>نعم، احذف حسابي نهائياً</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
