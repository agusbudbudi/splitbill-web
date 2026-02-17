"use client";

import React from "react";
import { Sparkles, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface AIScanQuotaBannerProps {
  freeScanCount: number;
  maxScanCount?: number;
  className?: string;
  showRedirect?: boolean;
}

export const AIScanQuotaBanner = ({
  freeScanCount,
  maxScanCount = 10,
  className,
  showRedirect = false,
}: AIScanQuotaBannerProps) => {
  const content = (
    <div className={cn(
      "relative p-[1.5px] rounded-2xl bg-gradient-to-r from-violet-400 via-pink-400 to-primary/70 shadow-lg shadow-pink-500/5 transition-all duration-300 overflow-hidden",
      showRedirect && "group hover:scale-[1.01] active:scale-[0.99] cursor-pointer",
      className
    )}>
      <div className="relative overflow-hidden px-4 py-4 bg-white rounded-[calc(1rem-1.5px)] z-10">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none" />
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 overflow-hidden">
              <Image 
                src="/img/ai-icon.png" 
                alt="AI Icon" 
                width={28}
                height={28}
                className="w-7 h-7 object-contain" 
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <p className="text-[9px] font-bold text-primary/80 uppercase leading-none">
                  {freeScanCount === maxScanCount 
                    ? "Gift spesial buat kamu " 
                    : freeScanCount === 0 
                      ? "Kuota Scan Habis" 
                      : "Sisa Kuota Scan Struk AI"}
                </p>
                <div className="bg-primary/10 px-1 py-0.5 rounded flex items-center gap-0.5">
                  <Sparkles className="w-2 h-2 text-primary fill-primary" />
                  <span className="text-[7px] font-black text-primary uppercase">Free</span>
                </div>
              </div>
              <p className="text-sm font-bold text-slate-800">
                {freeScanCount === maxScanCount ? (
                  <>
                    <span className="text-slate-800 font-bold text-xs">Gratis {maxScanCount}x Scan Struk! 🎉</span>
                  </>   
                ) : freeScanCount === 0 ? (
                  <>
                    <span className="text-slate-800 font-bold text-xs">Tenang masih bisa input manual kok ✍️</span>
                  </>
                ) : (
                  <>
                    {freeScanCount} <span className="text-slate-800 font-bold text-xs">dari {maxScanCount} Scan Gratis</span>
                  </>
                )}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {freeScanCount > 0 && (
              <div className="flex flex-col items-end gap-1.5">
                <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-400 to-pink-400 transition-all duration-700 ease-out shadow-[0_0_8px_rgba(244,114,182,0.2)]"
                    style={{ width: `${(freeScanCount / maxScanCount) * 100}%` }}
                  />
                </div>
              </div>
            )}
            {showRedirect && (
              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <ChevronRight className="w-4 h-4" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (showRedirect) {
    return (
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Link href="/split-bill?step=2">
          {content}
        </Link>
      </section>
    );
  }

  return content;
};
