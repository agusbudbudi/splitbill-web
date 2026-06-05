"use client";

import React from "react";
import { Sparkles, UserCheck, Zap } from "lucide-react";

const highlights = [
  {
    icon: Zap,
    title: "Cuma 3 Step",
    desc: "Bikin list, scan struk, langsung bagi.",
    color: "text-amber-500",
    bgColor: "bg-amber-50",
  },
  {
    icon: UserCheck,
    title: "Gak Perlu Login",
    desc: "Langsung pakai instan tanpa drama OTP.",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    icon: Sparkles,
    title: "Scan Struk AI",
    desc: "Deteksi otomatis item dan hitung presisi.",
    color: "text-emerald-500",
    bgColor: "bg-emerald-50",
  },
];

export const SocialProofBar = () => {
  return (
    <section className="bg-white border-y border-slate-100 py-4 md:py-6 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-row flex-wrap items-center justify-center gap-x-5 gap-y-2 md:grid md:grid-cols-3 md:gap-8 md:divide-x divide-slate-100">
          {highlights.map((hl, idx) => {
            const Icon = hl.icon;
            return (
              <div
                key={hl.title}
                className={`flex items-center gap-1.5 md:gap-4 justify-center md:justify-start ${
                  idx === 0 ? "" : "md:pl-8"
                }`}
              >
                <div
                  className={`w-6 h-6 md:w-10 md:h-10 rounded-md md:rounded-xl flex items-center justify-center shrink-0 ${hl.bgColor}`}
                >
                  <Icon className={`w-3 h-3 md:w-5 md:h-5 ${hl.color}`} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm md:text-base font-extrabold text-slate-800 tracking-tight leading-none">
                    {hl.title}
                  </h4>
                  <p className="hidden md:block text-xs text-slate-500 font-medium mt-0.5 leading-normal">
                    {hl.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
