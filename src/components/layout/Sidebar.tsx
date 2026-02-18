"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  ChevronLeft, 
  ChevronRight, 
  Home,
  Target,
  History,
  CheckCircle2,
  Sparkles,
  Users,
  Heart,
  Star,
  Share2,
  User
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { FloatingBadge } from "@/components/ui/FloatingBadge";

const menuItems = [
  {
    id: "split",
    label: "Split Bill",
    image: "/img/menu-split-bill.png",
    badge: "Populer",
    href: "/split-bill",
  },
  {
    id: "invoice",
    label: "Invoice",
    image: "/img/menu-invoice.png",
    badge: "Populer",
    href: "/invoice",
  },
  {
    id: "nabung",
    label: "SharedGoal",
    badge: "New",
    image: "/img/menu-shared-goal.png",
    href: "/shared-goals",
  },
  {
    id: "collect",
    label: "Patungan",
    image: "/img/menu-collect-money.png",
    badge: "New",
    href: "/collect-money",
  },
  {
    id: "wallet",
    label: "Wallet",
    image: "/img/menu-wallet.png",
    href: "/wallet",
  },
];

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);

  const shareData = {
    title: "SplitBill Online - Bagi Tagihan Jadi Gampang! ✨",
    text: "Guys, cobain deh SplitBill Online. Bisa scan struk otomatis pakai AI, hitung fair share, dan langsung dapet ringkasan pembayarannya. Praktis banget buat patungan! 🍱✈️",
    url: "https://splitbill.my.id",
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.log("Error sharing:", err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(
          `${shareData.text} \n\nCek di sini: ${shareData.url}`,
        );
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Teman Saya", href: "/profile/friends", icon: Users },
    { label: "Donasi", href: "/donate", icon: Heart },
    { label: "History", href: "/history", icon: History },
    { label: "Profile", href: "/profile", icon: User },
  ];

  return (
    <>
      {/* Sidebar Container */}
      <aside
        className={cn(
          "hidden lg:flex flex-col bg-card h-screen sticky top-0 transition-all duration-500 ease-in-out z-40 overflow-hidden",
          isCollapsed ? "w-0" : "w-2/5 min-w-[320px] max-w-[600px]"
        )}
      >
        <div className={cn(
          "flex flex-col h-full p-10 transition-opacity duration-300 w-full bg-white/80",
          isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
        )}>
          {/* Header - Enhanced Logo Summary */}
          <div className="flex items-start justify-between mb-10">
            <div className="flex flex-col gap-10">
              <Link href="/" className="inline-block hover:opacity-80 transition-opacity duration-300">
                <Image 
                  src="/img/logo-splitbill-black.png" 
                  alt="SplitBill Logo" 
                  width={180} 
                  height={56}
                  className="h-12 w-auto object-contain"
                />
              </Link>
              <div className="space-y-3">
                <h2 className="text-4xl font-black tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-indigo-500">
                  Split Bill Online
                </h2>
                <div className="flex items-start gap-2 max-w-[400px]">
                  <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground/70 font-medium leading-relaxed">
                    Bagi tagihan <span className="text-primary font-bold">sat set</span>, hitung patungan <span className="text-primary font-bold">anti ribet</span> & <span className="text-primary font-bold">akurat</span>. Link pembayaran langsung spill! 💸✨
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-1.5 hover:bg-primary/10 rounded-full transition-all active:scale-95 group mt-1 border border-primary/20 cursor-pointer bg-white/80 backdrop-blur-sm"
              title="Collapse Sidebar"
            >
              <ChevronLeft className="w-5 h-5 text-primary/50 transition-colors" />
            </button>
          </div>

          {/* New Navigation Menu Section */}
          <nav className="mb-8 px-1">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em] mb-6 opacity-70">
              Fitur Kece ✨
            </p>
            <div className="grid grid-cols-5 gap-1.5 px-0">
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="group flex flex-col items-center gap-2 cursor-pointer"
                >
                  <div className="relative">
                    {item.badge && (
                      <FloatingBadge className="scale-[0.8] -top-2.5">
                        {item.badge}
                      </FloatingBadge>
                    )}
                    <div className="w-16 h-16 rounded-[30%] bg-white flex items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-soft border border-border/40">
                      <Image
                        src={item.image}
                        alt={item.label}
                        width={60}
                        height={60}
                        className="w-12 h-12 object-contain"
                        priority
                      />
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground group-hover:text-primary transition-colors text-center leading-tight font-medium">
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </nav>

          {/* Navigation Row (1 Row) */}
          <nav className="mb-10">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em] mb-4 px-1 opacity-70">
              Menu Utama 🏠
            </p>
            <div className="grid grid-cols-5 gap-1.5 bg-muted/20 p-1.5 rounded-lg border border-border/40 backdrop-blur-sm">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex flex-col items-center justify-center gap-1.5 py-3 rounded-md transition-all duration-300 group relative",
                      isActive
                        ? "bg-white text-primary shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
                        : "text-muted-foreground/50 hover:text-primary hover:bg-white/40"
                    )}
                    title={item.label}
                  >
                    <item.icon className={cn(
                      "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
                      isActive ? "text-primary stroke-[2.5px]" : "stroke-[1.5px]"
                    )} />
                    <span className={cn(
                      "text-[9px] font-bold tracking-tight text-center uppercase",
                      isActive ? "text-primary" : ""
                    )}>
                      {item.label}
                    </span>
                    {isActive && (
                      <div className="absolute -top-0.5 w-4 h-0.5 bg-primary rounded-full transition-all" />
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Spacer to push footer down */}
          <div className="flex-1" />

          {/* Footer - Updated for Share Encouragement */}
          <div className="mt-auto">
            <div 
              onClick={handleShare}
              className="bg-primary/5 backdrop-blur-xl p-4 rounded-2xl border border-primary/10 relative overflow-hidden group hover:bg-primary/10 transition-all duration-300 cursor-pointer active:scale-[0.98]"
            >
              <div className="relative z-10 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white shadow-soft flex items-center justify-center text-primary group-hover:rotate-12 transition-transform duration-500">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <p className="text-sm font-bold text-foreground tracking-tight">
                    Bagikan SplitBill ✨
                  </p>
                </div>
                
                <p className="text-[11px] text-muted-foreground/80 font-medium leading-relaxed">
                  {copied ? (
                    <span className="text-primary font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Link Berhasil Di-copy!
                    </span>
                  ) : (
                    "Bantu teman-temanmu biar gak pusing lagi bagi tagihan. 🙌"
                  )}
                </p>
              </div>

              {/* Minimalist decorative peak */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            </div>
            
            <div className="flex items-center gap-2 py-4 px-1">
              <Link href="/privacy" className="text-[9px] font-bold text-muted-foreground/40 hover:text-primary transition-colors uppercase tracking-wider">Privacy Policy</Link>
              <Link href="/terms" className="text-[9px] font-bold text-muted-foreground/40 hover:text-primary transition-colors uppercase tracking-wider">Terms of Use</Link>
            </div>
          </div>
        </div>
      </aside>

      {/* Expand Button (Floating - Repositioned to Middle-Left) */}
      {isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          className="hidden lg:flex fixed left-0 top-1/2 -translate-y-1/2 w-6 h-14 bg-primary text-white shadow-[0_0_20px_rgba(0,0,0,0.1)] rounded-r-2xl items-center justify-center hover:w-8 transition-all z-50 group border border-primary/20 border-l-0 active:scale-95 cursor-pointer"
          title="Expand Sidebar"
        >
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      )}
    </>
  );
};
