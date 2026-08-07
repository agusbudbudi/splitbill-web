"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  History,
  ShoppingBag,
  HelpCircle,
  LayoutGrid,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useFriendStore } from "@/lib/stores/friendStore";
import { useWalletStore } from "@/store/useWalletStore";
import { getOrders } from "@/lib/api/subscription";
import { SidebarProfileCard } from "@/components/member/SidebarProfileCard";

type CountKey = "friends" | "history" | "orders" | "wallet";

type NavItem = {
  label: string;
  href: string;
  icon?: React.ElementType;
  image?: string;
  exact?: boolean;
  countKey?: CountKey;
  badge?: string;
};

const topNavItems: NavItem[] = [
  { label: "Home", href: "/member", icon: Home, exact: true },
];

const featureNavItems: NavItem[] = [
  { label: "Split Bill", href: "/member/split-bill", image: "/img/menu-split-bill.png", badge: "Populer 🔥" },
  { label: "Split Later", href: "/member/split-later", image: "/img/menu-split-later.png" },
  { label: "Invoice", href: "/member/invoice", image: "/img/menu-invoice.png" },
  { label: "Wallet", href: "/member/wallet", image: "/img/menu-wallet.png", countKey: "wallet" },
];

const bottomNavItems: NavItem[] = [
  { label: "Teman Saya", href: "/member/friends", icon: Users, countKey: "friends" },
  { label: "Aktivitas", href: "/member/history", icon: History, countKey: "history" },
  { label: "Pesanan Saya", href: "/member/orders", icon: ShoppingBag, countKey: "orders" },
];

interface MemberSidebarNavProps {
  onNavigate?: () => void;
}

export function MemberSidebarNav({ onNavigate }: MemberSidebarNavProps) {
  const pathname = usePathname();
  const friends = useFriendStore((state) => state.friends);
  const { savedBills, paymentMethods, fetchBills } = useWalletStore();
  const [ordersCount, setOrdersCount] = useState(0);
  const [isFeatureGroupOpen, setIsFeatureGroupOpen] = useState(true);

  useEffect(() => {
    fetchBills().catch((err) => console.error("Error fetching bills:", err));
    getOrders()
      .then((orders) => {
        if (Array.isArray(orders)) setOrdersCount(orders.length);
      })
      .catch((err) => console.warn("Failed to fetch orders count:", err));
  }, [fetchBills]);

  const backendBillsCount = savedBills.filter((b) =>
    /^[0-9a-fA-F]{24}$/.test(b.id)
  ).length;

  const counts: Record<CountKey, number> = {
    friends: friends.length,
    history: backendBillsCount,
    orders: ordersCount,
    wallet: paymentMethods.length,
  };

  const renderNavItem = (item: NavItem) => {
    const Icon = item.icon;
    const isActive = item.exact
      ? pathname === item.href
      : pathname.startsWith(item.href);
    const count = item.countKey ? counts[item.countKey] : undefined;

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onNavigate}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-xs text-sm font-medium border transition-colors",
          isActive
            ? "bg-white text-primary font-bold shadow-soft border-border/50"
            : "border-transparent text-foreground/70 hover:bg-accent/40 hover:text-foreground",
        )}
      >
        {item.image ? (
          <Image src={item.image} alt="" width={28} height={28} className="w-7 h-7 -my-1 object-contain shrink-0" />
        ) : Icon ? (
          <Icon className={cn("w-4.5 h-4.5", isActive && "stroke-[2.5px]")} />
        ) : null}
        <span className="flex-1 flex items-center gap-1.5">
          {item.label}
          {item.badge && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[9px] font-black uppercase tracking-wide leading-none">
              {item.badge}
            </span>
          )}
        </span>
        {count !== undefined && count > 0 && (
          <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-white text-[9px] font-black leading-none">
            {count}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <SidebarProfileCard onNavigate={onNavigate} />

      <nav className="flex flex-col gap-1">
        {topNavItems.map(renderNavItem)}

        {/* Fitur — collapsible group, expanded by default */}
        <button
          type="button"
          onClick={() => setIsFeatureGroupOpen((open) => !open)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xs text-sm font-medium border border-transparent text-foreground/70 hover:bg-accent/40 hover:text-foreground transition-colors cursor-pointer"
        >
          <LayoutGrid className="w-4.5 h-4.5" />
          <span className="flex-1 text-left">Fitur</span>
          <ChevronDown
            className={cn(
              "w-4.5 h-4.5 transition-transform",
              isFeatureGroupOpen ? "rotate-0" : "-rotate-90",
            )}
          />
        </button>

        <div
          className={cn(
            "grid transition-all duration-200 ease-in-out",
            isFeatureGroupOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
          )}
        >
          <div className="flex flex-col gap-1 overflow-hidden">
            {featureNavItems.map(renderNavItem)}
          </div>
        </div>

        {bottomNavItems.map(renderNavItem)}
      </nav>

      <div className="h-px bg-border/70" />

      <nav className="flex flex-col gap-1">
        <Link
          href="/faq"
          onClick={onNavigate}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground/70 hover:bg-accent/40 hover:text-foreground transition-all"
        >
          <HelpCircle className="w-4.5 h-4.5" />
          Pusat Bantuan
        </Link>
      </nav>
    </div>
  );
}
