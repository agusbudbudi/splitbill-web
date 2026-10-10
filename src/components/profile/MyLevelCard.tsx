"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn, formatToIDR } from "@/lib/utils";
import { fetchMyLevel } from "@/lib/api/levels";
import { useAuthStore } from "@/lib/stores/authStore";
import {
  computeAchievableProgress,
  getLevelThemeIndex,
  LEVEL_ICONS,
  LEVEL_METRIC_LABELS,
  LEVEL_THEMES,
} from "@/lib/utils/level";
import type { UserLevelMeResponse } from "@/lib/types/level";

function buildProgressTeaser(data: UserLevelMeResponse): string | null {
  if (!data.nextLevel) return null;

  const progress = computeAchievableProgress(data.nextLevel.rules, data.stats);
  if (progress.length === 0) return null;

  // Pilih rule yang paling deket kelar (persentase tertinggi) buat teaser 1 baris.
  const closest = [...progress].sort((a, b) => b.percent - a.percent)[0];
  if (closest.remaining <= 0) return null;

  const label = LEVEL_METRIC_LABELS[closest.rule.metric];
  const amount =
    closest.rule.metric === "totalAmount"
      ? formatToIDR(closest.remaining)
      : closest.remaining;

  return `${amount} ${label} lagi menuju ${data.nextLevel.name}`;
}

export function MyLevelCard() {
  const [data, setData] = useState<UserLevelMeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);
  const isSubscribed = user?.subscriptionStatus === "active";
  const freeScanCount = user?.freeScanCount;
  const freeSplitBillCount = user?.freeSplitBillCount;

  useEffect(() => {
    let cancelled = false;
    fetchMyLevel()
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        console.warn("Failed to fetch user level:", err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="relative rounded-sm bg-white p-4 flex items-center gap-4 animate-pulse">
        <div className="absolute top-0 right-0 h-4 w-20 rounded-bl-md rounded-tr-sm bg-muted" />
        <div className="w-20 h-20 rounded-full bg-muted shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-24 rounded bg-muted" />
          <div className="h-3.5 w-40 rounded bg-muted" />
        </div>
        <div className="w-5 h-5 rounded bg-muted shrink-0" />
      </div>
    );
  }

  // Belum ada level terkonfigurasi sama sekali — sembunyikan card, jangan
  // tampilkan empty state yang membingungkan di halaman profile.
  if (!data?.currentLevel) return null;

  const themeIndex = getLevelThemeIndex(data.currentLevel.order);
  const theme = LEVEL_THEMES[themeIndex];
  const icon = data.currentLevel.icon || LEVEL_ICONS[themeIndex];
  const subtitle =
    data.currentLevel.description || buildProgressTeaser(data) || "Lihat detail & benefit level kamu";

  return (
    <Link href="/member/level">
      <div
        className={cn(
          "relative overflow-hidden rounded-sm px-2 flex items-end gap-4 transition-transform active:scale-[0.99]",
          theme.accent,
        )}
      >
        <span
          className={cn(
            "absolute top-0 right-0 inline-flex items-center justify-center rounded-bl-md rounded-tr-sm px-4 py-1 text-xs font-bold text-white",
            theme.badge,
          )}
        >
          Level {data.currentLevel.order}
        </span>

        <div className="relative w-32 h-32 shrink-0 -mb-4 flex items-end justify-center">
          <img
            src={icon}
            alt={data.currentLevel.name}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex-1 min-w-0 self-center">
          <p className="text-xl font-black tracking-tight truncate text-white">
            {data.currentLevel.name}
          </p>
          <p className="text-sm mt-0.5 truncate text-white/85">{subtitle}</p>
          {!isSubscribed && (freeScanCount !== undefined || freeSplitBillCount !== undefined) && (
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {freeScanCount !== undefined && (
                <span className="inline-flex items-center rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-bold text-white">
                  {freeScanCount}x scan gratis
                </span>
              )}
              {freeSplitBillCount !== undefined && (
                <span className="inline-flex items-center rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-bold text-white">
                  {freeSplitBillCount}x split bill
                </span>
              )}
            </div>
          )}
        </div>
        <ChevronRight className="w-5 h-5 shrink-0 self-center text-white/80" />
      </div>
    </Link>
  );
}
