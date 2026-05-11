"use client";

import React from "react";
import { ShieldCheck, UserX, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const highlights = [
  {
    icon: ShieldCheck,
    title: "Privacy First",
    description:
      "Data kamu tersimpan aman di server kami, bisa diakses kapan saja dari perangkat mana saja.",
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
    <section className="space-y-6">
      <div className="flex items-center gap-3 px-1">
        <div className="space-y-0.5">
          <h2 className="text-md font-bold text-foreground">
            Kenapa SplitBill? 🤔
          </h2>
          <p className="text-xs text-muted-foreground font-medium">
            Aman, Cepat, & Tanpa Ribet
          </p>
        </div>
      </div>

      <div className="bg-white border border-white backdrop-blur-sm rounded-lg p-5 shadow-soft space-y-6">
        {highlights.map((item, idx) => (
          <div key={idx} className="flex items-start gap-4">
            <div
              className={cn(
                "shrink-0 w-9 h-9 rounded-sm flex items-center justify-center",
                item.bgColor,
              )}
            >
              <item.icon className={cn("w-5 h-5", item.color)} />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-foreground tracking-tight">
                {item.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
