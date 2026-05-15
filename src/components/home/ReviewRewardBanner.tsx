"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Gift, ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/lib/stores/authStore";
import { useWalletStore } from "@/store/useWalletStore";
import { trackGeneral } from "@/lib/gtag";

export const ReviewRewardBanner = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { savedBills } = useWalletStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Condition 1: User must be authenticated
  // Condition 2: User must have created at least one split bill (backend record)
  // Condition 3: User has not yet claimed the review reward
  const hasBackendRecords = savedBills.some((bill) =>
    /^[0-9a-fA-F]{24}$/.test(bill.id),
  );

  const shouldShow =
    isMounted &&
    isAuthenticated &&
    hasBackendRecords &&
    !user?.hasClaimedReviewReward;

  if (!shouldShow) return null;

  return (
    <div className="animate-in fade-in slide-in-from-top-4 duration-700 relative">
      <Link
        href="/review"
        onClick={() => trackGeneral.reviewBannerClick()}
        className="block group relative overflow-hidden bg-white border border-amber-200 rounded-2xl p-4 hover:shadow-soft hover:border-amber-300/50 transition-all duration-300 cursor-pointer"
      >
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl -mr-12 -mt-12 pointer-events-none" />

        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-500 overflow-hidden">
            <Image
              src="/img/icon-rewards.jpg"
              alt="Bonus Scan Struk AI — Reward untuk review dan feedback pengguna"
              width={48}
              height={48}
              className="w-full h-full object-contain"
              unoptimized
            />
          </div>

          <div className="flex-1 space-y-0.5 pr-4">
            <h3 className="text-[13px] font-bold text-slate-900 tracking-tight">
              Ada bonus +5 Scan AI nih!
            </h3>
            <p className="text-[11px] text-slate-500 font-medium leading-tight">
              Kasih review singkat & ambil reward kamu. Cuma 10 detik gais! ✨
            </p>
          </div>

          <div className="text-amber-200 group-hover:translate-x-1 transition-transform">
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>
      </Link>
    </div>
  );
};
