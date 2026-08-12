"use client";

import React from "react";
import { useWalletStore } from "@/store/useWalletStore";
import Image from "next/image";
import { formatToIDR } from "@/lib/utils";
import { useAuthStore } from "@/lib/stores/authStore";

export const FeatureHighlights = () => {
  const savedBills = useWalletStore((state) => state.savedBills);
  const { user } = useAuthStore();

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

  return (
    <div className="relative w-[calc(100%+2rem)] -mx-4 -mt-4 sm:w-full sm:mx-0 sm:mt-0">
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary via-primary/80 to-transparent pointer-events-none z-0 sm:hidden" />
      <div className="relative z-10 bg-transparent sm:bg-white mx-4 sm:mx-0 sm:rounded-sm sm:shadow-soft px-1 py-4 sm:p-5">
        <div className="space-y-4">
          {/* Greeting row */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 shrink-0 rounded-full bg-white/10 sm:bg-primary/10 flex items-center justify-center text-xl">
              👋
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-white/80 sm:text-primary/70 uppercase tracking-widest leading-none">
                Halo, {firstName}
              </p>
              <h2 className="text-white sm:text-foreground text-base sm:text-lg font-bold leading-snug tracking-tight mt-1">
                Yuk selesain patungan tanpa drama hari ini
              </h2>
            </div>
          </div>

          {/* Stat row */}
          <div className="flex items-center">
            {metrics.map((m, i) => (
              <div
                key={m.label}
                className={`flex-1 flex items-center gap-2 ${i > 0 ? "border-l border-white/25 sm:border-primary/10 pl-3 ml-3" : ""}`}
              >
                <div className="w-8 h-8 rounded-full bg-white/20 sm:bg-primary/10 flex items-center justify-center shrink-0">
                  <Image
                    src={m.iconSrc}
                    alt={m.label}
                    width={16}
                    height={16}
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col leading-none min-w-0">
                  <span className="text-white sm:text-foreground font-black text-base">
                    {m.value}
                  </span>
                  <span className="text-[8px] text-white/70 sm:text-muted-foreground font-bold uppercase tracking-tight mt-0.5 truncate">
                    {m.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
