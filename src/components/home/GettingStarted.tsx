"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import {
  UserPlus,
  ClipboardList,
  BarChart3,
  CreditCard,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

import Link from "next/link";
import { ActionCard } from "@/components/ui/ActionCard";

export const GettingStarted = () => {
  const guideItems = [
    {
      title: "Simpan Geng kamu",
      desc: "Simpan geng nongkrong kamu biar gak input ulang",
      icon: UserPlus,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      href: "/split-bill?step=1",
    },
    {
      title: "Catat Pengeluaran",
      desc: "Catat pengeluaran cuma 5 detik",
      icon: ClipboardList,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      href: "/split-bill?step=2",
    },
    {
      title: "Payment Method",
      desc: "Tinggal copy rekening & langsung transfer",
      icon: CreditCard,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      href: "/split-bill?step=3",
    },
    {
      title: "Lihat Ringkasan",
      desc: "Siapa bayar siapa langsung jelas",
      icon: BarChart3,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      href: "/split-bill?step=4",
    },
  ];

  return (
    <section className="space-y-4">
      <div className="px-1">
        <h2 className="text-md font-bold text-foreground">Mulai Cepat ⚡️</h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {guideItems.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            rel="nofollow"
            className="h-full"
          >
            <ActionCard
              title={item.title}
              description={item.desc}
              icon={item.icon}
              color={item.color}
              bgColor={item.bgColor}
            />
          </Link>
        ))}
      </div>
    </section>
  );
};
