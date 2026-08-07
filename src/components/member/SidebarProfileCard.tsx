"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn, getAvatarUrl } from "@/lib/utils";
import { useAuthStore } from "@/lib/stores/authStore";
import { PremiumBanner } from "@/components/subscription/PremiumBanner";

interface SidebarProfileCardProps {
  onNavigate?: () => void;
}

export function SidebarProfileCard({ onNavigate }: SidebarProfileCardProps) {
  const { user: authUser } = useAuthStore();

  const user = authUser || {
    name: "Guest User",
    email: "guest@splitbill.app",
  };
  const avatarUrl = getAvatarUrl(user);
  const isVip = authUser?.subscriptionStatus === "active";

  return (
    <div className="rounded-xs border border-border/50 bg-card overflow-hidden">
      <Link
        href="/member/profile"
        onClick={onNavigate}
        className="flex items-center gap-3 p-3 hover:bg-accent/40 transition-colors"
      >
        <div
          className={cn(
            "relative flex items-center justify-center rounded-full transition-all duration-500 shrink-0",
            isVip
              ? "w-12 h-12 p-[3px] bg-gradient-gold shadow-[0_0_15px_rgba(246,226,122,0.3)]"
              : "w-11 h-11 border-2 border-primary/20 bg-primary/5 shadow-sm",
          )}
        >
          <div className="w-full h-full rounded-full overflow-hidden bg-white/20">
            <img src={avatarUrl} alt="User Avatar" className="w-full h-full object-cover" />
          </div>
          {isVip && (
            <div className="absolute -bottom-0 -right-0 w-4.5 h-4.5 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-100 z-10 p-0.5">
              <Image src="/img/icon-vip.png" alt="VIP" width={16} height={16} className="w-full h-full object-contain" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-0.5">
          <div className="flex items-center gap-1.5">
            <h2 className="font-bold text-sm leading-tight tracking-tight text-foreground truncate">
              {user.name}
            </h2>
            {isVip && (
              <span className="shrink-0 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-primary to-violet-600 text-[9px] font-black text-white uppercase tracking-wider">
                VIP
              </span>
            )}
          </div>
          <p className="text-[12px] font-medium text-muted-foreground truncate">{user.email}</p>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground/50 shrink-0" />
      </Link>

      <PremiumBanner
        status={(authUser?.subscriptionStatus as "active" | "expired" | "free") ?? "free"}
        className="m-0"
        embedded
        compact
        href="/member/membership"
        onClick={onNavigate}
      />
    </div>
  );
}
