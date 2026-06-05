"use client";

import React from "react";
import { useWalletStore } from "@/store/useWalletStore";
import {
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatToIDR } from "@/lib/utils";
import { useAuthStore } from "@/lib/stores/authStore";

interface FeatureHighlightsProps {
  /** When true, renders as a full hero at the very top of the page */
  heroMode?: boolean;
}

export const FeatureHighlights = ({ heroMode = false }: FeatureHighlightsProps) => {
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
  const totalFriends = Array.isArray(savedBills)
    ? new Set(savedBills.flatMap((b) => b?.people || [])).size
    : 0;
  const firstName = user?.name ? user.name.split(" ")[0] : "Teman";

  const metrics = [
    {
      label: "Split Bill",
      value: totalBills.toString(),
      iconSrc: "/img/icon-splitbill.png",
    },
    {
      label: "Total",
      value:
        totalAmount >= 1_000_000
          ? `${(totalAmount / 1_000_000).toFixed(1)}Jt`
          : totalAmount >= 1_000
            ? `${Math.round(totalAmount / 1_000)}Rb`
            : formatToIDR(totalAmount),
      iconSrc: "/img/icon-total.png",
    },
    {
      label: "Teman",
      value: totalFriends.toString(),
      iconSrc: "/img/icon-teman.png",
    },
  ];

  // ── HERO MODE ────────────────────────────────────────────────────────────
  if (heroMode) {
    return (
      <div className="relative w-[calc(100%+2rem)] -mx-4 -mt-4 sm:mx-0 sm:mt-0 sm:w-full overflow-hidden bg-gradient-to-br from-primary via-blue-600 to-indigo-700 pt-6 pb-6 sm:pt-8 sm:pb-8 rounded-none sm:rounded-lg">
        {/* Decorative blobs — same as HeroBanner */}
        <div className="absolute top-0 right-0 w-[80%] h-full bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />
        <div className="absolute top-0 left-[-10%] w-[40%] h-[60%] bg-blue-400/20 rounded-full blur-[60px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-indigo-400/15 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 px-5 sm:px-6 space-y-4">
          {/* Greeting row */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-white font-bold text-[32px] sm:text-[40px] leading-[1.2]">
                Halo,{" "}
                <span className="font-extrabold text-amber-300">
                  {firstName}!
                </span>{" "}
                👋
              </h2>
              <p className="text-blue-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed">
                Yuk selesain patungan tanpa drama hari ini
              </p>
            </div>
          </div>

          {/* Storytelling text */}
          <div className="bg-white/10 mb-2 rounded-sm px-4 py-3">
            <p className="text-blue-100 text-sm font-medium leading-relaxed">
              Mantap!,{" "}
              <span className="font-black text-white">
                {totalBills} split bill 🔥
              </span>{" "}
              selesai tanpa ribet dan kamu udah bantu{" "}
              <span className="font-black text-white">
                {totalFriends} teman
              </span>{" "}
              biar tagihan gak drama. Keep it up! biar gak ada lagi &quot;eh gue transfer ke siapa?&quot; 😌
            </p>
          </div>

          {/* Metric pills — compact horizontal row */}
          <div className="flex items-center justify-between bg-white/10 rounded-sm py-2.5 px-3">
            {metrics.map((m, idx) => (
              <div key={m.label} className={`flex-1 flex items-center justify-center gap-2 px-1 ${idx < metrics.length - 1 ? "border-r border-white/20" : ""}`}>
                <div className="flex items-center gap-1.5">
                  <Image src={m.iconSrc} alt={m.label} width={20} height={20} className="object-contain shrink-0" />
                  <span className="font-black text-white text-xl leading-none">
                    {m.value}
                  </span>
                </div>
                <span className="text-[9px] text-blue-100 font-semibold uppercase tracking-tight">
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── CARD MODE (default) ──────────────────────────────────────────────────
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
          <div className="relative z-10 mb-2">
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
                biar tagihan gak drama. Keep it up! biar gak ada lagi &quot;eh gue transfer ke siapa?&quot; 😌
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
            <div className="relative z-10 flex items-center justify-between bg-slate-50/60 rounded-xs py-2 px-3 text-xs font-bold text-slate-700 divide-x divide-slate-200/60">
              {metrics.map((m) => (
                <div key={m.label} className="flex-1 flex items-center justify-center gap-2 px-1 first:pl-0 last:pr-0">
                  <div className="flex items-center gap-1.5">
                    <Image src={m.iconSrc} alt={m.label} width={20} height={20} className="object-contain shrink-0" />
                    <span className="font-black text-primary text-xl leading-none">
                      {m.value}
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-400 font-medium uppercase tracking-tight">
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
