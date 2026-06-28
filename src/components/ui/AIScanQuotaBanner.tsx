"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/stores/authStore";
import { getGuestScanQuota, GUEST_LIMIT } from "@/lib/utils/guestQuota";

interface AIScanQuotaBannerProps {
  className?: string;
  showRedirect?: boolean;
  /**
   * "card"   – standalone premium gradient card (default)
   *            Self-contained; reads data from authStore + localStorage.
   * "strip"  – compact full-width strip; reads data from authStore + localStorage.
   */
  variant?: "card" | "strip";
}

// ─────────────────────────────────────────────────────────────────────────────
// "card" variant — self-contained premium gradient card.
// ─────────────────────────────────────────────────────────────────────────────
const CardVariant = ({
  className,
  showRedirect = false,
}: {
  className?: string;
  showRedirect?: boolean;
}) => {
  const { isAuthenticated, user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isSubscribed = user?.subscriptionStatus === "active";
  const freeScanCount = user?.freeScanCount ?? 0;
  const maxScanCount = 5;

  // Only read localStorage after mount to prevent SSR/client mismatch
  const guestQuota = (!isAuthenticated && mounted) ? getGuestScanQuota() : null;
  const guestRemaining = guestQuota?.remaining ?? GUEST_LIMIT;

  const effectiveCount = isAuthenticated ? freeScanCount : guestRemaining;
  const isExhausted = !isSubscribed && effectiveCount <= 0;
  // Hide when exhausted — barrier screen already shows the empty-state message
  if (isExhausted) return null;

  const badgeLabel = isSubscribed ? "PRO" : "Free";

  return (
    <div
      className={cn(
        "relative px-[1.5px] pt-[1.5px] pb-[4px] bg-gradient-to-r from-violet-400 via-pink-400 to-primary/70 shadow-lg shadow-pink-500/5 transition-all duration-300 h-full w-full flex flex-col group/card overflow-hidden hover:scale-[1.01] active:scale-[0.99] rounded-2xl",
        className
      )}
    >
      {/* Stick Badge */}
      <div
        className={cn(
          "absolute top-0 right-0 flex items-center gap-1 font-black uppercase z-30 shadow-md transition-transform group-hover/card:scale-105 origin-top-right px-3 py-1.5 rounded-bl-xl text-[9px]",
          isSubscribed
            ? "bg-gradient-to-r from-amber-400 to-amber-500 text-white"
            : "bg-gradient-to-r from-primary to-violet-500 text-white"
        )}
      >
        <Sparkles className="w-3 h-3 fill-current" />
        <span>{badgeLabel}</span>
      </div>

      <div className="relative overflow-hidden bg-white z-10 flex-grow flex flex-col justify-between py-2 px-3 rounded-[calc(1rem-1.5px)]">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none" />

        <div className="flex items-center gap-3">
          <div className="shrink-0 rounded-full flex items-center justify-center transition-transform group-hover/card:scale-110 w-10 h-10">
            <Image
              src="/img/ai-icon.png"
              alt="Ikon AI"
              width={48}
              height={48}
              className="w-10 h-10 object-contain"
            />
          </div>

          <div className="space-y-1 pr-10">
            <h4 className="font-bold text-slate-800 tracking-tight leading-tight text-sm">
              {isSubscribed ? (
                "Scan struk tanpa batas sepuasnya! ⚡"
              ) : effectiveCount >= maxScanCount ? (
                `Ada ${effectiveCount}x scan gratis spesial buat kamu! 🔥`
              ) : isExhausted ? (
                "Scan habis, input manual dulu yuk! ✍️"
              ) : (
                `Tersisa ${effectiveCount}x scan gratis buat kamu! ✨`
              )}
            </h4>
          </div>
        </div>

        {/* CTA Button */}
        {showRedirect && (
          <div className="pt-4 mt-auto">
            <Link href="/split-bill?step=1" className="block w-full">
              <button className="w-full flex items-center justify-center gap-2 h-10 bg-primary hover:bg-primary/95 text-white font-bold text-sm rounded-lg shadow-lg shadow-primary/10 hover:shadow-primary/20 active:scale-[0.98] transition-all cursor-pointer">
                Bagi Tagihan Sekarang
                <ChevronRight className="w-4 h-4 group-hover/card:translate-x-0.5 transition-transform" />
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// "strip" variant is self-contained: it reads data from stores itself.
// Placed directly below a section header to give a "nempel" / attached feel.
// ─────────────────────────────────────────────────────────────────────────────
const StripVariant = ({ className }: { className?: string }) => {
  const { isAuthenticated, user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isSubscribed = user?.subscriptionStatus === "active";
  const freeScanCount = user?.freeScanCount;

  // Only read localStorage after mount to prevent SSR/client mismatch
  const guestQuota = (!isAuthenticated && mounted) ? getGuestScanQuota() : null;
  const guestRemaining = guestQuota?.remaining ?? GUEST_LIMIT;

  // Hide if user is authenticated but quota data not yet loaded
  if (isAuthenticated && freeScanCount === undefined) return null;
  // Hide if authenticated + quota exhausted (barrier screen handles this)
  if (isAuthenticated && !isSubscribed && (freeScanCount ?? 0) <= 0) return null;

  const effectiveCount = isAuthenticated ? (freeScanCount ?? 0) : guestRemaining;
  const isExhausted = !isAuthenticated && guestRemaining <= 0;
  // Hide when exhausted — barrier screen already shows the empty-state message
  if (isExhausted) return null;

  const label = isSubscribed
    ? "Scan struk tanpa batas sepuasnya! ⚡"
    : effectiveCount >= 5
      ? `Ada ${effectiveCount}x scan gratis spesial buat kamu! 🔥`
      : isExhausted
        ? "Scan habis, input manual dulu yuk! ✍️"
        : `Tersisa ${effectiveCount}x scan gratis buat kamu! ✨`;

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 px-3 py-2",
        isSubscribed
          ? "bg-gradient-to-r from-primary/60 to-violet-600 border-b border-primary/20"
          : isExhausted
            ? "bg-rose-50 border border-rose-100"
            : "bg-primary/10",
        className
      )}
    >
      <Image
        src="/img/ai-icon.png"
        alt="AI"
        width={16}
        height={16}
        className="w-4 h-4 object-contain shrink-0"
      />
      <span
        className={cn(
          "text-xs font-semibold tracking-tight flex-1",
          isSubscribed
            ? "text-white"
            : isExhausted
              ? "text-rose-600"
              : "text-primary"
        )}
      >
        {label}
      </span>
      {/* Badge */}
      <span
        className={cn(
          "shrink-0 flex items-center gap-0.5 text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full",
          isSubscribed
            ? "bg-white/20 text-white"
            : "bg-gradient-to-r from-primary to-violet-500 text-white"
        )}
      >
        {isSubscribed ? (
          <>
            <Image src="/img/icon-vip.png" alt="VIP" width={10} height={10} className="w-2.5 h-2.5 object-contain" />
            <span>VIP</span>
          </>
        ) : (
          <span>Free</span>
        )}
      </span>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main export — both variants are self-contained (read from authStore)
// ─────────────────────────────────────────────────────────────────────────────
export const AIScanQuotaBanner = ({
  className,
  showRedirect = false,
  variant = "card",
}: AIScanQuotaBannerProps) => {
  // ── Strip variant ──────────────────────────────────────────────────────────
  if (variant === "strip") {
    return <StripVariant className={className} />;
  }

  // ── Card variant (default) — self-contained ────────────────────────────────
  return <CardVariant className={className} showRedirect={showRedirect} />;
};
