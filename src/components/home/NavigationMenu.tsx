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
    id: "kantong",
    label: "Split Later",
    badge: "New",
    image: "/img/menu-split-later.png",
    href: "/split-later",
  },
  {
    id: "nabung",
    label: "SharedGoal",
    image: "/img/menu-shared-goal.png",
    href: "/shared-goals",
  },
  {
    id: "others",
    label: "Lainnya",
    image: "/img/menu-others.png",
    href: "/all-feature",
  },
];

export const NavigationMenu = () => {
  return (
    <div className="grid grid-cols-4 sm:flex sm:flex-wrap items-start justify-items-center justify-center gap-2 sm:gap-12 py-4 px-2 mb-0 lg:hidden">
      {menuItems.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className="group flex flex-col items-center gap-2 w-[76px] cursor-pointer"
        >
          <div className="relative">
            {item.badge && <FloatingBadge>{item.badge}</FloatingBadge>}
            <div className="w-[72px] h-[72px] rounded-[30%] bg-white flex items-center justify-center transition-all group-hover:scale-105 shadow-soft border border-primary/5">
              <Image
                src={item.image}
                alt={item.label}
                width={56}
                height={56}
                className="w-14 h-14 object-contain"
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
