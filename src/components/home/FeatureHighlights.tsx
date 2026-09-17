"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { formatToIDR } from "@/lib/utils";
import { useAuthStore } from "@/lib/stores/authStore";
import { fetchMyLevel } from "@/lib/api/levels";
import type { UserLevelStats } from "@/lib/types/level";

const GREETINGS_BY_HOUR: [maxHour: number, word: string][] = [
  [10, "Pagi"],
  [15, "Siang"],
  [18, "Sore"],
  [24, "Malam"],
];

export const FeatureHighlights = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<UserLevelStats | null>(null);
  const [greetingWord, setGreetingWord] = useState("Halo");

  // Jam device beda antara server & client, jadi baru di-set setelah mount
  // biar gak mismatch hydration — render pertama tetep pakai "Halo".
  useEffect(() => {
    const hour = new Date().getHours();
    const match = GREETINGS_BY_HOUR.find(([maxHour]) => hour < maxHour);
    setGreetingWord(match?.[1] ?? "Halo");
  }, []);

  // Sumber sama dengan stats di halaman level (GET /api/levels/me) biar
  // angkanya konsisten — jangan hitung ulang dari savedBills lokal.
  useEffect(() => {
    let cancelled = false;
    fetchMyLevel()
      .then((res) => {
        if (!cancelled) setStats(res.stats);
      })
      .catch((err) => {
        console.warn("Failed to load level stats:", err);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const totalBills = stats?.splitCount ?? 0;
  const totalAmount = stats?.totalAmount ?? 0;
  const totalFriends = stats?.friendCount ?? 0;
  const firstName = user?.name ? user.name.split(" ")[0] : "Teman";
  // Komponen ini cuma mount kalau user udah punya bill (lihat hasHistory di
  // MemberHomeContent), jadi selama stats belum kebaca jangan klaim "belum
  // mulai" — itu keliru kalau fetchMyLevel() gagal/lambat.
  const headline =
    stats === null
      ? "Yuk selesain patungan tanpa drama hari ini"
      : totalBills > 0
        ? `Udah ${totalBills}x split bill kelar, makin auto-cair!`
        : "Yuk mulai split bill pertama, no drama dari awal!";

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
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-white/80 sm:text-primary/70 uppercase tracking-widest leading-none">
                {greetingWord}, {firstName}
              </p>
              <h2 className="text-white sm:text-foreground text-base sm:text-lg font-bold leading-snug tracking-tight mt-1">
                {headline}
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
