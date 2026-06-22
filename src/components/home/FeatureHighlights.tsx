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
      <div className="w-[calc(100%+2rem)] -mx-4 -mt-4 pt-6 bg-gradient-to-b from-primary via-primary/50 to-transparent sm:w-full sm:mx-0 sm:mt-0 sm:pt-0 sm:pb-0 sm:bg-none">
        <div className="bg-white rounded-2xl border border-slate-100/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-5 sm:p-6 mx-4 sm:mx-0 space-y-4">
          {/* Greeting row */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-slate-900 font-bold text-2xl sm:text-3xl leading-[1.2]">
                Halo,{" "}
                <span className="font-extrabold text-primary">
                  {firstName}!
                </span>{" "}
                👋
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1 leading-relaxed">
                Yuk selesain patungan tanpa drama hari ini
              </p>
            </div>
          </div>

          {/* Storytelling text */}
          <p className="text-slate-600 text-sm font-medium leading-relaxed">
            Mantap!,{" "}
            <span className="font-black text-slate-800">
              {totalBills} split bill 🔥
            </span>{" "}
            selesai tanpa ribet dan kamu udah bantu{" "}
            <span className="font-black text-slate-800">
              {totalFriends} teman
            </span>{" "}
            biar tagihan gak drama. Keep it up! biar gak ada lagi &quot;eh gue transfer ke siapa?&quot; 😌
          </p>

          {/* Metric cards grid */}
          <div className="grid grid-cols-3 gap-3 pt-1">
            {metrics.map((m) => (
              <div
                key={m.label}
                className="bg-slate-50/80 rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center text-center border border-slate-100/80 hover:shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:scale-[1.02] hover:bg-white transition-all duration-300 group/metric"
              >
                <div className="mb-2 transition-transform group-hover/metric:scale-110 shrink-0">
                  <Image
                    src={m.iconSrc}
                    alt={m.label}
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                </div>
                <span className="font-black text-slate-900 text-lg sm:text-xl leading-none">
                  {m.value}
                </span>
                <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 leading-none">
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
