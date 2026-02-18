"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";
import { FloatingBadge } from "@/components/ui/FloatingBadge";
import {
  ReceiptText,
  FileText,
  Wallet,
  PiggyBank,
  LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils";

import Link from "next/link";
import Image from "next/image";

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

export const NavigationMenu = () => {
  return (
    <div className="grid grid-cols-5 sm:flex sm:flex-wrap items-start justify-items-center justify-center gap-4 sm:gap-12 py-4 px-2 mb-0 lg:hidden">
      {menuItems.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className="group flex flex-col items-center gap-2 w-[60px] cursor-pointer"
        >
          <div className="relative">
            {item.badge && <FloatingBadge>{item.badge}</FloatingBadge>}
            <div className="w-16 h-16 rounded-[30%] bg-white flex items-center justify-center transition-all group-hover:scale-105 shadow-soft">
              <Image
                src={item.image}
                alt={item.label}
                width={48}
                height={48}
                className="w-12 h-12 object-contain"
              />
            </div>
          </div>
          <span className="text-[12px] text-muted-foreground group-hover:text-primary transition-colors text-center leading-tight font-medium">
            {item.label}
          </span>
        </Link>
      ))}
    </div>
  );
};
