"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { useWalletStore } from "@/store/useWalletStore";
import {
  Sparkles,
  Wallet,
  History,
  ChevronRight,
  TrendingUp,
  ReceiptText,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { useAuthStore } from "@/lib/stores/authStore";

export const FeatureHighlights = () => {
  const { paymentMethods, savedBills } = useWalletStore();
  const { isAuthenticated } = useAuthStore();

  const highlights = [
    {
      title: "Dompet Saya",
      value: isAuthenticated ? paymentMethods.length.toString() : "3",
      label: isAuthenticated ? "Metode Terdaftar" : "Bank & E-wallet",
      icon: Wallet,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      href: "/wallet",
    },
    {
      title: "Riwayat",
      value: isAuthenticated ? savedBills.length.toString() : "12",
      label: isAuthenticated ? "Split Bill Beres" : "Riwayat Transaksi",
      icon: History,
      color: "text-primary",
      bgColor: "bg-primary/10",
      href: "/history",
    },
  ];

  const shortcuts = [
    {
      title: "Split Bill",
      desc: "Patungan kilat bareng teman-teman.",
      icon: ReceiptText,
      href: "/split-bill",
      badge: "Favorite",
      gradient: "bg-gradient-brand",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {highlights.map((item) => (
          <Link key={item.title} href={item.href}>
            <Card className="rounded-[1.2rem] bg-white/80 backdrop-blur-xs text-card-foreground border-none shadow-soft hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer group overflow-hidden active:scale-95">
              <CardContent className="p-4 relative">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <div className={cn("p-1.5 rounded-lg", item.bgColor)}>
                      <item.icon className={cn("w-4 h-4", item.color)} />
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-foreground/80">
                      {item.value}
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      {item.title}
                    </p>
                    <p className="text-[9px] text-muted-foreground/60 leading-none">
                      {item.label}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Feature Shortcut Cards */}
      <div className="grid grid-cols-1 gap-3">
        {shortcuts.map((card) => (
          <Link key={card.title} href={card.href}>
            <div
              className={cn(
                "relative overflow-hidden rounded-2xl p-5 text-white active:scale-[0.98] transition-all group cursor-pointer",
                card.gradient,
              )}
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 transition-transform group-hover:scale-110 group-hover:rotate-12">
                <card.icon className="w-24 h-24" />
              </div>

              <div className="relative z-10 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest leading-none">
                      {card.badge}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>

                <h3 className="text-xl font-black mt-1">{card.title}</h3>
                <p className="text-xs text-white/80 font-medium max-w-[300px]">
                  {card.desc}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Mini Promotion / Info */}
      {/* Split Bill Statistics */}
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          {/* Active Users */}
          <Card className="rounded-md bg-blue-50/50 border-none shadow-soft">
            <CardContent className="p-3 text-center flex flex-col items-center justify-center gap-1">
              <span className="text-xl font-black text-blue-600 tracking-tight">
                12k+
              </span>
              <span className="text-[9px] font-bold text-blue-600/60 uppercase tracking-wide leading-none">
                Active Users
              </span>
            </CardContent>
          </Card>

          {/* Split Bills */}
          <Card className="rounded-md bg-primary/5 border-none shadow-soft">
            <CardContent className="p-3 text-center flex flex-col items-center justify-center gap-1">
              <span className="text-xl font-black text-primary tracking-tight">
                150rb+
              </span>
              <span className="text-[9px] font-bold text-primary/60 uppercase tracking-wide leading-none">
                Split Bills
              </span>
            </CardContent>
          </Card>

          {/* Rating */}
          <Card className="rounded-md bg-amber-50/50 border-none shadow-soft">
            <CardContent className="p-3 text-center flex flex-col items-center justify-center gap-1">
              <div className="flex items-center gap-1 mb-0.5">
                <span className="text-xl font-black text-amber-500 tracking-tight">
                  4.8
                </span>
                <span className="text-xs text-amber-400">★</span>
              </div>
              <span className="text-[9px] font-bold text-amber-600/60 uppercase tracking-wide leading-none">
                User Rating
              </span>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
