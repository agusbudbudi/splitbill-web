"use client";

import React from "react";
import { AlertCircle } from "lucide-react";

export const HowToReadSummary = () => {
  return (
    <div className="p-4 bg-muted/20 border border-primary/5 rounded-sm space-y-3 relative overflow-hidden">
      <div className="absolute -right-4 -bottom-4 opacity-5">
        <AlertCircle className="w-20 h-20 text-primary" />
      </div>
      <div className="flex items-center gap-2 text-primary">
        <AlertCircle className="w-4 h-4 fill-primary/10" />
        <h4 className="font-bold text-xs">Cara Baca Ringkasan</h4>
      </div>
      <div className="grid gap-2 relative z-10">
        <div className="flex items-center gap-3 text-[11px] bg-white/60 p-2 rounded-sm border border-primary/5">
          <span className="text-destructive font-black text-[9px] whitespace-nowrap text-center bg-destructive/10 py-0.5 px-1.5 rounded">
            Harus Bayar
          </span>
          <span className="text-muted-foreground font-medium">
            Uang yang harus kamu bayarkan ke teman.
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] bg-white/60 p-2 rounded-sm border border-primary/5">
          <span className="text-emerald-600 font-black text-[9px] whitespace-nowrap text-center bg-emerald-500/10 py-0.5 px-1.5 rounded">
            Akan Menerima
          </span>
          <span className="text-muted-foreground font-medium">
            Uang yang bakal kamu terima dari teman.
          </span>
        </div>
      </div>
    </div>
  );
};
