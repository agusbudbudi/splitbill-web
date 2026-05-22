"use client";

import React from "react";
import { useWalletStore } from "@/store/useWalletStore";
import {
  Sparkles,
  ReceiptText,
  TrendingUp,
  Users,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { formatToIDR } from "@/lib/utils";
import { useAuthStore } from "@/lib/stores/authStore";

export const FeatureHighlights = () => {
  const { savedBills, fetchBills } = useWalletStore();
  const { isAuthenticated, user } = useAuthStore();

  React.useEffect(() => {
    if (isAuthenticated) {
      fetchBills();
    }
  }, [isAuthenticated, fetchBills]);

  // Compute storytelling statistics
  const totalBills = Array.isArray(savedBills) ? savedBills.length : 0;
  const totalAmount = Array.isArray(savedBills)
    ? savedBills.reduce((sum, b) => sum + (b?.totalAmount || 0), 0)
    : 0;
  const avgAmount = totalBills > 0 ? Math.round(totalAmount / totalBills) : 0;
  const totalFriends = Array.isArray(savedBills)
    ? new Set(savedBills.flatMap((b) => b?.people || [])).size
    : 0;
  const firstName = user?.name ? user.name.split(" ")[0] : "Teman";

  const metrics = [
    {
      label: "Split Bill",
      value: totalBills.toString(),
      sublabel: "Dibuat",
      icon: ReceiptText,
      href: "/history?tab=split-bill",
    },
    {
      label: "Total",
      value:
        totalAmount >= 1_000_000
          ? `${(totalAmount / 1_000_000).toFixed(1)}Jt`
          : totalAmount >= 1_000
            ? `${Math.round(totalAmount / 1_000)}Rb`
            : formatToIDR(totalAmount),
      sublabel: "Di-split",
      icon: TrendingUp,
      href: "/history?tab=split-bill",
    },
    {
      label: "Teman",
      value: totalFriends.toString(),
      sublabel: "Dibantu",
      icon: Users,
      href: "/history?tab=split-bill",
    },
  ];

  return (
    <Link href="/history?tab=split-bill" className="block">
      <div className="relative px-[1.5px] pt-[1.5px] pb-[4px] rounded-2xl bg-gradient-to-r from-violet-400 via-pink-400 to-primary/70 shadow-lg shadow-pink-500/5 group hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 overflow-hidden cursor-pointer">
        <div className="relative overflow-hidden bg-white rounded-[calc(1rem-1.5px)] z-10 p-5 space-y-4">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none" />

          {/* Header */}
          <div className="relative z-10 flex items-center justify-between gap-2">
            <div className="flex flex-col items-start">
              <p className="text-sm font-bold text-primary">
                Welcome back,{" "}
                <span className="font-black">{firstName}</span> 👋
              </p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Yuk selesain patungan tanpa drama hari ini
              </p>
            </div>
            <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300 shrink-0">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* Storytelling text */}
          <div className="relative z-10">
            {totalBills > 0 ? (
              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                Mantap!,{" "}
                <span className="font-black text-slate-800">
                  {totalBills} split bill 🔥
                </span>{" "} selesai tanpa ribet
                dan kamu udah bantu {" "}
                <span className="font-black text-slate-800">
                  {totalFriends} teman
                </span>{" "}
                biar tagihan gak drama. Keep it up! biar gak ada lagi “eh gue transfer ke siapa?” 😌
              </p>
            ) : (
              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                🚀 Mulai perjalanan split bill pertamamu sekarang, biar
                patungan jadi bebas drama!
              </p>
            )}
          </div>

          {/* Metric pills */}
          {totalBills > 0 && (
            <div className="relative z-10 grid grid-cols-3 gap-2 pt-1">
              {metrics.map((m) => (
                <div
                  key={m.label}
                  className="flex flex-col items-center gap-0.5 bg-slate-50 border border-slate-100 rounded-md py-3 px-1 transition-all duration-300"
                >
                  <m.icon className="w-3.5 h-3.5 text-primary/75 mb-0.5" />
                  <span className="text-base font-black text-slate-800 tracking-tight leading-none">
                    {m.value}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                    {m.sublabel}
                  </span>
                  <span className="text-[9px] font-medium text-slate-400">
                    {m.label}
                  </span>
                </div>
              ))}
            </div>
          )}


        </div>
      </div>
    </Link>
  );
};
