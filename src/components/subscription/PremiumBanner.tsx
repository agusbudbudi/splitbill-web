"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/Card";

type SubscriptionStatus = "active" | "expired" | "free";

interface PremiumBannerProps {
  status?: SubscriptionStatus;
  className?: string;
  /** When true, renders flush inside a parent card (no gradient border wrapper) */
  embedded?: boolean;
}

const BANNER_CONFIG: Record<
  SubscriptionStatus,
  { title: string; subtitle: string }
> = {
  active: {
    title: "VIP Member Aktif",
    subtitle: "Kamu bebas scan struk AI sepuasnya tanpa limit! 👑",
  },
  expired: {
    title: "Masa VIP Berakhir",
    subtitle: "Yuk perpanjang biar scan AI tetep jalan! ⏳",
  },
  free: {
    title: "Upgrade ke VIP",
    subtitle: "Scan struk AI tanpa batas & tanpa iklan. ✨",
  },
};

export function PremiumBanner({
  status = "free",
  className,
  embedded = false,
}: PremiumBannerProps) {
  const config = BANNER_CONFIG[status];

  const inner = (
    <Link href="/membership">
      <div className="flex items-center justify-between gap-3 px-3 py-2 hover:bg-slate-50 transition-colors cursor-pointer">
        {/* Icon + Text */}
        <div className="flex items-center gap-2.5 min-w-0">
          <Image
            src="/img/icon-vip.png"
            alt="VIP"
            width={48}
            height={48}
            className="object-contain shrink-0"
          />
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-slate-800">{config.title}</h4>
            <p className="text-xs text-slate-500 truncate">{config.subtitle}</p>
          </div>
        </div>

        {/* Arrow */}
        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
      </div>
    </Link>
  );

  if (embedded) {
    return (
      <div className={`mx-4 mb-4 bg-gradient-to-r from-primary to-violet-600 p-[1.5px] rounded-sm ${className ?? ""}`}>
        <div className="bg-white rounded-[11px] overflow-hidden">
          {inner}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-primary to-violet-600 p-[1.5px] rounded-xl ${className ?? ""}`}>
      <Card className="relative overflow-hidden bg-white rounded-[11px] border-0 shadow-none">
        {inner}
      </Card>
    </div>
  );
}
