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
      title: "Kelola Teman",
      desc: "Tambah anggota geng kamu dulu, biar patungan gampang.",
      icon: UserPlus,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      href: "/split-bill?step=1",
    },
    {
      title: "Catat Pengeluaran",
      desc: "Input manual expense yang mau dibagi.",
      icon: ClipboardList,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      href: "/split-bill?step=2",
    },
    {
      title: "Payment Method",
      desc: "Simpan detail pembayaran favorite kamu.",
      icon: CreditCard,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      href: "/split-bill?step=3",
    },
    {
      title: "Lihat Ringkasan",
      desc: "Cek siapa bayar berapa & siapa harus transfer.",
      icon: BarChart3,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      href: "/split-bill?step=4",
    },
  ];

  return (
    <section className="space-y-4">
      <div className="px-1">
        <h2 className="text-md font-bold text-foreground/70">
          Mulai Cepat ⚡️
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {guideItems.map((item) => (
          <Link key={item.title} href={item.href} rel="nofollow">
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
