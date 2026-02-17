"use client";

import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface BrandingFooterProps {
  className?: string;
}

export const BrandingFooter = ({ className }: BrandingFooterProps) => {
  return (
    <div
      className={cn(
        "pt-4 pb-4 flex flex-col items-center text-center space-y-6",
        className,
      )}
    >
      <div className="flex items-center gap-0 opacity-40 grayscale group hover:grayscale-0 hover:opacity-100 transition-all duration-500">
        <Image
          src="/img/footer-icon.png"
          alt="logo"
          width={32}
          height={32}
          className="w-8 h-8 object-contain"
        />
        <span className="text-lg font-bold tracking-tighter text-foreground">
          SplitBill
        </span>
      </div>

      <p className="text-[11px] text-muted-foreground/70 leading-relaxed max-w-[400px]">
        Kelola keuangan pribadi Anda secara efisien melalui fitur split bill,
        tagihan, dan pembuatan invoice, semua dalam satu aplikasi
      </p>

      <div className="flex flex-col items-center gap-1 opacity-40">
        <div className="h-[1px] w-8 bg-muted-foreground" />
        <span className="text-[9px] font-bold uppercase tracking-widest">
          v2.0.0
        </span>
      </div>
    </div>
  );
};
