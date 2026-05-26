"use client";

import React from "react";
import { Sparkles, ChevronRight, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

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

  const content = (
    <div
      className={cn(
        "relative px-[1.5px] pt-[1.5px] pb-[4px] rounded-2xl bg-gradient-to-r from-violet-400 via-pink-400 to-primary/70 shadow-lg shadow-pink-500/5 transition-all duration-300 overflow-hidden",
        showRedirect && "group hover:scale-[1.01] active:scale-[0.99]",
        className,
      )}
    >
      <div className="relative overflow-hidden bg-white rounded-[calc(1rem-1.5px)] z-10">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none" />

        <div className="relative z-10 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 overflow-hidden">
                <Image
                  src="/img/ai-icon.png"
                  alt="Ikon AI Scan Struk — Fitur unggulan SplitBill Online untuk bagi tagihan otomatis"
                  width={28}
                  height={28}
                  className="w-7 h-7 object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <p className="text-[9px] font-bold text-primary/80 uppercase leading-none">
                    {isSubscribed
                      ? "Premium Active"
                      : freeScanCount === maxScanCount
                        ? "Gift spesial buat kamu "
                        : isExhausted
                          ? "Yah, Scan-nya Abis!"
                          : "Sisa Scan Kamu Nih!"}
                  </p>
                  <div
                    className={cn(
                      "px-1 py-0.5 rounded flex items-center gap-0.5",
                      isSubscribed ? "bg-amber-100" : "bg-primary/10",
                    )}
                  >
                    <Sparkles
                      className={cn(
                        "w-2 h-2",
                        isSubscribed
                          ? "text-amber-600 fill-amber-600"
                          : "text-primary fill-primary",
                      )}
                    />
                    <span
                      className={cn(
                        "text-[7px] font-black uppercase",
                        isSubscribed ? "text-amber-600" : "text-primary",
                      )}
                    >
                      {isSubscribed ? "PRO" : "Free"}
                    </span>
                  </div>
                </div>
                <p className="text-sm font-bold text-slate-800">
                  {isSubscribed ? (
                    <span className="text-slate-800 font-bold text-sm">
                      Scan struk tanpa batas, kapan aja ⚡
                    </span>
                  ) : freeScanCount === maxScanCount ? (
                    <>
                      <span className="text-slate-800 font-bold text-sm">
                        Ada {maxScanCount}x scan gratis nih, sikat gais! 🔥
                      </span>
                    </>
                  ) : isExhausted ? (
                    <>
                      <span className="text-slate-800 font-bold text-sm">
                        Yah scan abis, gas input manual dulu yuk! ✍️
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-slate-800 font-bold text-sm">
                        Sisa {freeScanCount}x scan gratis nih, gas! ✨
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          {showRedirect && (
            <div className="pt-4 flex flex-col items-center gap-2">
              <Link href="/split-bill?step=1" className="w-full block">
                <Button className="w-full text-sm font-bold gap-2 rounded-md shadow-lg shadow-primary/20 group/btn transition-all duration-300">
                  Bagi Tagihan Sekarang
                  <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return content;
};
