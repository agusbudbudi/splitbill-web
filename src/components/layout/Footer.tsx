"use client";

import React from "react";
import { ReceiptText, ScrollText, Target, History, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Footer = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  const menuItems = [
    {
      path: "/",
      label: "Home",
      icon: Home,
    },
    {
      path: "/split-bill",
      label: "Split Bill",
      icon: ReceiptText,
    },
    {
      path: "/invoice",
      label: "Invoice",
      icon: ScrollText,
    },
    {
      path: "/shared-goals",
      label: "Goals",
      icon: Target,
    },
    {
      path: "/history",
      label: "History",
      icon: History,
    },
  ];

  return (
    <div className="sticky bottom-0 w-full max-w-[600px] mx-auto bg-background/60 backdrop-blur-xl border-t border-primary/5 py-3 px-6 flex justify-around shadow-[0_-10px_30px_rgba(0,0,0,0.04)] z-40 pb-safe mt-auto lg:hidden">
      {menuItems.map((item) => {
        const active = isActive(item.path);
        const Icon = item.icon;

        return (
          <Link
            key={item.path}
            href={item.path}
            className={cn(
              "relative flex flex-col items-center justify-center gap-1 transition-all duration-300 cursor-pointer min-w-[64px]",
              active
                ? "text-primary"
                : "text-muted-foreground hover:text-primary/70",
            )}
          >
            {/* Active Indicator Pill */}
            {active && (
              <span className="absolute -top-3 w-8 h-1 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.6)] animate-in fade-in slide-in-from-top-1 duration-500" />
            )}

            <div
              className={cn(
                "p-1.5 rounded-sm transition-all duration-300",
                active ? "bg-primary/5" : "hover:bg-accent/40",
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 transition-all duration-300",
                  active
                    ? "text-primary scale-105"
                    : "text-muted-foreground/60",
                )}
                strokeWidth={active ? 2.2 : 1.8}
              />
            </div>

            <span
              className={cn(
                "text-[10px] font-medium transition-all duration-300 tracking-tight",
                active
                  ? "text-primary font-semibold"
                  : "text-muted-foreground/60",
              )}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
};
