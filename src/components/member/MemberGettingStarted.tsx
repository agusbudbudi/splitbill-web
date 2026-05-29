"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { UserPlus, Wallet, History, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { ActionCard } from "@/components/ui/ActionCard";

export const MemberGettingStarted = () => {
  const memberGuideItems = [
    {
      title: "Save Geng Squad",
      desc: "Simpan squad nongkrong biar gak cape ketik ulang pas split bill",
      icon: UserPlus,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      href: "/profile/friends",
    },
    {
      title: "Kantong QR & Rek",
      desc: "Set up e-wallet/rekening biar temen langsung sat set transfer",
      icon: Wallet,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      href: "/wallet",
    },
    {
      title: "Pantau History",
      desc: "Cek riwayat tagihan biar tau siapa aja yang belom bayar",
      icon: History,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      href: "/history",
    },
    {
      title: "Orderan Kamu",
      desc: "Cek list pesanan & tagihan aktif kamu biar gak boncos",
      icon: ShoppingBag,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      href: "/profile/orders",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {memberGuideItems.map((item) => (
        <Link
          key={item.title}
          href={item.href}
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
  );
};
