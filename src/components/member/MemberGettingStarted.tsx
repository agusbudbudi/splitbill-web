"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ActionCard } from "@/components/ui/ActionCard";
import { Users, Wallet, ReceiptText, ShoppingBag } from "lucide-react";
import { useFriendStore } from "@/lib/stores/friendStore";
import { useWalletStore } from "@/store/useWalletStore";
import { getOrders } from "@/lib/api/subscription";

export const MemberGettingStarted = () => {
  const friends = useFriendStore((state) => state.friends);
  const { paymentMethods, savedBills, fetchBills } = useWalletStore();
  const [ordersCount, setOrdersCount] = useState(0);

  useEffect(() => {
    fetchBills().catch((err) => console.error("Error fetching bills:", err));
    
    getOrders()
      .then((orders) => {
        if (Array.isArray(orders)) {
          setOrdersCount(orders.length);
        }
      })
      .catch((err) => {
        console.warn("Failed to fetch orders count:", err);
      });
  }, [fetchBills]);

  const backendBillsCount = savedBills.filter((b) =>
    /^[0-9a-fA-F]{24}$/.test(b.id)
  ).length;

  const memberGuideItems = [
    {
      title: "Save Geng Squad",
      desc: "Simpan squad nongkrong biar gak cape ketik ulang pas split bill",
      icon: Users,
      href: "/profile/friends",
      count: friends.length,
    },
    {
      title: "Kantong QR & Rek",
      desc: "Set up e-wallet/rekening biar temen langsung sat set transfer",
      icon: Wallet,
      href: "/wallet",
      count: paymentMethods.length,
    },
    {
      title: "Pantau History",
      desc: "Cek riwayat tagihan biar tau siapa aja yang belom bayar",
      icon: ReceiptText,
      href: "/history",
      count: backendBillsCount,
    },
    {
      title: "Orderan Kamu",
      desc: "Cek list pesanan & tagihan aktif kamu biar gak boncos",
      icon: ShoppingBag,
      href: "/profile/orders",
      count: ordersCount,
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
            count={item.count}
          />
        </Link>
      ))}
    </div>
  );
};
