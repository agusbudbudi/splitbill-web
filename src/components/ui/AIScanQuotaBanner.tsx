"use client";

import React from "react";
import { Sparkles, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface AIScanQuotaBannerProps {
  freeScanCount: number;
  maxScanCount?: number;
  isSubscribed?: boolean;
  className?: string;
  showRedirect?: boolean;
}

export const AIScanQuotaBanner = ({
  freeScanCount,
  maxScanCount = 5,
  isSubscribed = false,
  className,
  showRedirect = false,
}: AIScanQuotaBannerProps) => {
  const isExhausted = !isSubscribed && freeScanCount <= 0;

  return (
    <div className={cn(
      "relative px-[1.5px] pt-[1.5px] pb-[4px] rounded-2xl bg-gradient-to-r from-violet-400 via-pink-400 to-primary/70 shadow-lg shadow-pink-500/5 transition-all duration-300 h-full w-full flex flex-col group/card overflow-hidden hover:scale-[1.01] active:scale-[0.99]",
      className
    )}>
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

      <div className="relative overflow-hidden bg-white rounded-[calc(1rem-1.5px)] z-10 flex-grow flex flex-col justify-between py-2 px-3">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none" />

        <div className="flex items-center gap-3">
          {/* AI Icon wrapper */}
          <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover/card:scale-110">
            <Image
              src="/img/ai-icon.png"
              alt="Ikon AI"
              width={48}
              height={48}
              className="w-10 h-10 object-contain"
            />
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-800 tracking-tight leading-tight">
              {isSubscribed ? (
                "Scan struk tanpa batas sepuasnya! ⚡"
              ) : freeScanCount === maxScanCount ? (
                `Ada ${maxScanCount}x scan gratis spesial buat kamu! 🔥`
              ) : isExhausted ? (
                "Scan habis, input manual dulu yuk! ✍️"
              ) : (
                `Tersisa ${freeScanCount}x scan gratis buat kamu! ✨`
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
