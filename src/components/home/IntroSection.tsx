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
            Split Bill Jadi Lebih <span className="text-primary italic">Sat Set</span> & <span className="text-primary italic">Anti Ribet</span> ✨
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Aplikasi bagi tagihan online gratis! Scan struk otomatis, hitung patungan fair share, dan selesaikan pembayaran no drama. 100% praktis & akurat!
          </p>
        </div>
      </div>
    </div>
  );
};
