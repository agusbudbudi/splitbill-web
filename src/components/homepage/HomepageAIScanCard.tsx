"use client";

import React from "react";
import { Sparkles, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/lib/stores/authStore";
import { cn } from "@/lib/utils";

export const HomepageAIScanCard = () => {
  const { user } = useAuthStore();
  const isSubscribed = user?.subscriptionStatus === "active";
  const freeScanCount = user?.freeScanCount ?? 5;
  const maxScanCount = 5;
  const isExhausted = !isSubscribed && freeScanCount <= 0;

  return (
    <div className="relative p-[1.5px] rounded-2xl bg-gradient-to-br from-violet-400 via-pink-400 to-primary shadow-lg shadow-pink-500/5 transition-all duration-300 h-full w-full flex flex-col group/card hover:scale-[1.005] active:scale-[0.99] overflow-hidden">
      {/* Stick Badge */}
      <div className={cn(
        "absolute top-0 right-0 px-3 py-1.5 rounded-bl-xl flex items-center gap-1 text-[9px] font-black uppercase z-30 shadow-md transition-transform group-hover/card:scale-105 origin-top-right",
        isSubscribed
          ? "bg-gradient-to-r from-amber-400 to-amber-500 text-white"
          : "bg-gradient-to-r from-primary to-violet-500 text-white"
      )}>
        <Sparkles className="w-3 h-3 fill-current" />
        <span>{isSubscribed ? "PRO" : "Free"}</span>
      </div>

      <div className="relative overflow-hidden bg-white rounded-[calc(1rem-1.5px)] z-10 flex-grow flex flex-col justify-between p-6">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none" />

        <div className="flex items-center gap-4">
          {/* AI Icon wrapper */}
          <div className="shrink-0 w-16 h-16 rounded-full flex items-center justify-center transition-transform group-hover/card:scale-110">
            <Image
              src="/img/ai-icon.png"
              alt="Ikon AI"
              width={80}
              height={80}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="space-y-1">
            <h4 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight leading-tight">
              {isSubscribed ? (
                "Scan struk tanpa batas sepuasnya! ⚡"
              ) : freeScanCount === maxScanCount ? (
                "Ada 5x scan gratis spesial buat kamu! 🔥"
              ) : isExhausted ? (
                "Scan habis, input manual dulu yuk! ✍️"
              ) : (
                `Tersisa ${freeScanCount}x scan gratis buat kamu! ✨`
              )}
            </h4>
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-5 mt-auto">
          <Link href="/split-bill?step=1" className="block w-full">
            <button className="w-full flex items-center justify-center gap-2 h-12 bg-primary hover:bg-primary/95 text-white font-bold text-sm rounded-lg shadow-lg shadow-primary/10 hover:shadow-primary/20 active:scale-[0.98] transition-all cursor-pointer">
              Bagi Tagihan Sekarang
              <ChevronRight className="w-4 h-4 group-hover/card:translate-x-0.5 transition-transform" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
