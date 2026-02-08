"use client";

import React from "react";
import { ShieldCheck, UserX, Sparkles, Lock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const highlights = [
  {
    icon: ShieldCheck,
    title: "Privacy First",
    description:
      "Data kamu hanya disimpan di browsermu, kami tidak menyimpannya di server.",
    color: "text-emerald-500",
    bgColor: "bg-emerald-50",
  },
  {
    icon: UserX,
    title: "No Login Required",
    description:
      "Bisa langsung pakai tanpa ribet daftar. Cocok buat yang mau sat-set!",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    icon: Sparkles,
    title: "AI Powered",
    description:
      "Gak perlu ngetik manual satu-satu, cukup jepret & biar AI yang hitung.",
    color: "text-purple-500",
    bgColor: "bg-purple-50",
  },
];

export const TrustHighlights = () => {
  return (
    <section className="py-2 px-2 space-y-6">
      <div className="flex items-center gap-3 px-1">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div className="space-y-0.5">
          <h2 className="text-sm font-bold text-foreground/80 tracking-tight">
            Kenapa SplitBill? 🤔
          </h2>
          <p className="text-[10px] text-muted-foreground font-medium">
            Aman, Cepat, & Tanpa Ribet
          </p>
        </div>
      </div>

      <div className="bg-white/20 border border-white backdrop-blur-sm rounded-3xl p-5 shadow-soft space-y-6">
        {highlights.map((item, idx) => (
          <div key={idx} className="flex items-start gap-4">
            <div
              className={cn(
                "shrink-0 w-9 h-9 rounded-xl flex items-center justify-center",
                item.bgColor,
              )}
            >
              <item.icon className={cn("w-5 h-5", item.color)} />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-xs font-bold text-foreground tracking-tight">
                {item.title}
              </h3>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200">
          <Lock className="w-3 h-3 text-slate-400" />
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
            End-to-End Local Storage
          </span>
        </div>
        <p className="text-[10px] text-muted-foreground text-center max-w-[280px]">
          Kami percaya data keuanganmu adalah privasimu. Tidak ada data yang
          kami jual atau berikan ke pihak ketiga.
        </p>
      </div>
    </section>
  );
};
