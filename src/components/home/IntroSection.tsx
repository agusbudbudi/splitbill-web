"use client";

import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/Card";

export const IntroSection = () => {
  return (
    <div className="flex flex-col items-start py-6 px-5 rounded-3xl bg-gradient-to-br from-white to-primary/5 shadow-soft">
      <div className="flex flex-col items-start gap-4 text-left w-full">
        <div className="bg-white py-2 px-4 rounded-xl border border-primary/10">
          <Image
            src="/img/logo-splitbill-black.png"
            alt="SplitBill Logo"
            width={100}
            height={28}
            className="h-6 w-auto object-contain"
            priority
          />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-foreground tracking-tight leading-tight">
            Split Bill Jadi Lebih <span className="text-primary italic">Practical</span> ✨
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Aplikasi split bill online gratis untuk bagi tagihan dan patungan dengan teman. Scan foto struk otomatis, hitung fair share, dan selesaikan pembayaran dengan mudah.
          </p>
        </div>
      </div>
    </div>
  );
};
