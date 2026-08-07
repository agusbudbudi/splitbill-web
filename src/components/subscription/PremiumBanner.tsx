"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

type SubscriptionStatus = "active" | "expired" | "free";

interface PremiumBannerProps {
  status?: SubscriptionStatus;
  className?: string;
  /** When true, renders flush inside a parent card (no gradient border wrapper) */
  embedded?: boolean;
  href?: string;
  /** Smaller icon/text/padding, for tight spaces like a sidebar */
  compact?: boolean;
  onClick?: () => void;
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
  href = "/member/membership",
  compact = false,
  onClick,
}: PremiumBannerProps) {
  const config = BANNER_CONFIG[status];

  const inner = (
    <Link href={href} onClick={onClick}>
      <div
        className={cn(
          "flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer",
          compact ? "gap-2 px-2.5 py-2" : "gap-3 px-3 py-2",
        )}
      >
        {/* Icon + Text */}
        <div className={cn("flex items-center min-w-0", compact ? "gap-2" : "gap-2.5")}>
          <Image
            src="/img/icon-vip.png"
            alt="VIP"
            width={compact ? 30 : 48}
            height={compact ? 30 : 48}
            className="object-contain shrink-0"
          />
          <div className="min-w-0">
            <h4 className={cn("font-bold text-slate-800 truncate", compact ? "text-xs" : "text-sm")}>
              {config.title}
            </h4>
            <p className={cn("text-slate-500 truncate", compact ? "text-[10px] leading-tight" : "text-xs")}>
              {config.subtitle}
            </p>
          </div>
        </div>

        {/* Arrow */}
        <ChevronRight className={cn("text-slate-400 shrink-0", compact ? "w-3.5 h-3.5" : "w-4 h-4")} />
      </div>
    </Link>
  );

  if (embedded) {
    return (
      <div className={`${compact ? "mx-2 mb-2 rounded-xs" : "mx-4 mb-4 rounded-sm"} bg-gradient-to-r from-primary to-violet-600 p-[1.5px] ${className ?? ""}`}>
        <div className={`bg-white overflow-hidden ${compact ? "rounded-[9px]" : "rounded-[11px]"}`}>
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
