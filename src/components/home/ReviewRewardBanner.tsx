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
    <div className="animate-in fade-in slide-in-from-top-4 duration-700 relative mb-4">
      <Link
        href="/review"
        onClick={() => trackGeneral.reviewBannerClick()}
        className="block group relative overflow-hidden bg-white border border-slate-100 rounded-md p-3 hover:shadow-sm hover:border-slate-200 transition-all duration-300 cursor-pointer"
      >
        <div className="relative z-10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-9 h-9 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-500 overflow-hidden">
              <Image
                src="/img/icon-rewards.png"
                alt="Bonus Scan Struk AI — Reward untuk review dan feedback pengguna"
                width={72}
                height={72}
                className="w-full h-full object-contain"
                unoptimized
              />
            </div>

            <div className="flex-1 space-y-0.5">
              <h3 className="text-xs font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
                Hadiah buat kamu 🎁
              </h3>
              <p className="text-[10px] text-slate-500 font-medium leading-tight">
                Kasih review singkat & claim hadiahnya. Cuma 10 detik gais!
              </p>
            </div>
          </div>

          <div className="text-slate-400 group-hover:translate-x-1 transition-transform">
            <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
          </div>
        </div>
      </Link>
    </div>);
};
