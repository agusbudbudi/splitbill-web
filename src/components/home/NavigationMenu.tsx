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
    id: "later",
    label: "Split Later",
    badge: "New",
    image: "/img/menu-split-later.png",
    href: "/split-later",
  },
  {
    id: "goals",
    label: "Shared Goals",
    image: "/img/menu-shared-goal.png",
    href: "/shared-goals",
  },
  {
    id: "invoice",
    label: "Invoice",
    image: "/img/menu-invoice.png",
    href: "/invoice",
  },
  {
    id: "others",
    label: "Lainnya",
    image: "/img/menu-others.png",
    href: "/all-feature",
  },
];

export const NavigationMenu = ({ variant = "flex" }: { variant?: "flex" | "grid" }) => {
  return (
    <div className={cn(
      "w-full",
      variant === "flex"
        ? "py-6 px-4 flex flex-wrap items-center justify-center gap-6 sm:gap-8 lg:gap-12"
        : "grid grid-cols-4 lg:grid-cols-5 gap-y-8 gap-x-2"
    )}>
      {menuItems.map((item, index) => (
        <Link
          key={item.id}
          href={item.href}
          className={cn(
            "group flex flex-col items-center gap-2 cursor-pointer transition-all duration-300",
            variant === "flex"
              ? "w-[76px]"
              : cn(
                  "w-[76px]",
                  index === 0
                    ? "justify-self-start"
                    : index === menuItems.length - 1
                      ? "justify-self-end"
                      : "justify-self-center",
                  item.id === "invoice" ? "hidden sm:flex" : "flex"
                )
          )}
        >
          <div className="relative pb-2">
            <div className={cn(
              "rounded-[30%] bg-white flex items-center justify-center transition-all group-hover:scale-105 shadow-soft border border-primary/5 w-[72px] h-[72px] overflow-visible relative"
            )}>
              <Image
                src={item.image}
                alt={item.label}
                width={80}
                height={80}
                className="w-14 h-14 object-contain transition-transform duration-300"
              />
              {item.badge && <FloatingBadge position="bottom">{item.badge}</FloatingBadge>}
            </div>
          </div>
          <span className="text-[11px] sm:text-[12px] text-muted-foreground group-hover:text-primary transition-colors text-center font-bold tracking-tight">
            {item.label}
          </span>
        </Link>
      ))}
    </div>
  );
};
