"use client";

import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

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
      <div className="opacity-40 grayscale group hover:grayscale-0 hover:opacity-100 transition-all duration-500">
        <Image
          src="/img/split-bill-logo-basic.png"
          alt="SplitBill"
          width={130}
          height={36}
          className="h-8 w-auto object-contain"
        />
      </div>

      <p className="text-[11px] text-muted-foreground/70 leading-relaxed max-w-[400px]">
        Kelola keuangan pribadi Anda secara efisien melalui fitur split bill,
        tagihan, dan pembuatan invoice, semua dalam satu aplikasi
      </p>

      <div className="flex flex-col items-center gap-1.5 opacity-40">
        <div className="h-[1px] w-8 bg-muted-foreground" />
        <span className="text-[9px] font-bold uppercase tracking-widest">
          v3.0.0
        </span>
        <div className="flex items-center gap-3 pt-1">
          <Link
            href="/privacy"
            className="text-[9px] font-bold uppercase tracking-wider hover:text-primary transition-colors"
          >
            Kebijakan Privasi
          </Link>
          <Link
            href="/terms"
            className="text-[9px] font-bold uppercase tracking-wider hover:text-primary transition-colors"
          >
            Syarat & Ketentuan
          </Link>
        </div>
      </div>
    </div>
  );
};
