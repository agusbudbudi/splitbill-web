"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface WalletSummaryHeroProps {
  bankCount: number;
  ewalletCount: number;
  noGradient?: boolean;
}

export const WalletSummaryHero = ({
  bankCount,
  ewalletCount,
  noGradient = false,
}: WalletSummaryHeroProps) => {
  const total = bankCount + ewalletCount;

  return (
    <div
      className={cn(
        "w-full animate-in fade-in duration-300 relative overflow-hidden",
        noGradient
          ? "text-foreground px-1 pt-1 pb-4"
          : "bg-gradient-to-b from-primary via-primary/50 to-transparent text-white px-5 pb-20 pt-1",
      )}
    >
      {/* Background blobs for visual texture */}
      {!noGradient && (
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
      )}

      <div className="flex items-center gap-3 relative z-10">
        {/* Icon besar */}
        {total > 0 && (
          <div
            className={cn(
              "w-14 h-14 rounded-full flex items-center justify-center shrink-0 p-2",
              noGradient ? "bg-primary/5" : "bg-white/90",
            )}
          >
            <Image
              src="/img/menu-wallet.png"
              alt="Wallet"
              width={60}
              height={60}
              className="object-contain shrink-0"
            />
          </div>
        )}

        {/* Title + subtitle di kanan */}
        <div className="space-y-0.5">
          <h2 className="text-xl font-black tracking-tight">
            {total > 0 ? `${total} Wallet` : "Belum Ada Wallet"}
          </h2>
          <p className={cn("text-sm", noGradient ? "text-muted-foreground" : "text-white/80")}>
            {total > 0
              ? `${bankCount} Bank • ${ewalletCount} E-Wallet terdaftar`
              : "Simpan pembayaran biar patungan sat-set"}
          </p>
        </div>
      </div>
    </div>
  );
};
