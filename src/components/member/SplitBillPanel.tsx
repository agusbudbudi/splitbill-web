"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { OngoingSplitBillCard } from "@/components/home/OngoingSplitBillCard";
import { AIScanEncourageBanner } from "@/components/home/AIScanEncourageBanner";
import { PromoBanner } from "@/components/ui/PromoBanner";
import { IllustratedEmptyState } from "@/components/ui/IllustratedEmptyState";
import { useSplitBillStore } from "@/store/useSplitBillStore";
import { useWalletStore } from "@/store/useWalletStore";
import { SplitBillListCard } from "@/components/splitbill/SplitBillListCard";

export function SplitBillPanel() {
  const savedBills = useWalletStore((state) => state.savedBills);
  const expenses = useSplitBillStore((state) => state.expenses);
  const activityName = useSplitBillStore((state) => state.activityName);
  const people = useSplitBillStore((state) => state.people);

  const hasActiveBill =
    (activityName && activityName.trim().length > 0) ||
    expenses.length > 0 ||
    people.length > 0;

  const latestBills = [...savedBills]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Section 1: Scan / Ongoing tagihan */}
      <div className="space-y-4">
        {hasActiveBill ? (
          <div className="space-y-4">
            <div className="px-1 space-y-1">
              <h2 className="text-xl font-extrabold text-foreground tracking-tight">
                Tagihan On-Going 🔥
              </h2>
              <p className="text-sm text-muted-foreground font-medium">
                Lanjutin split bill kemarin biar sirkel tetep aman no-drama.
              </p>
            </div>
            <OngoingSplitBillCard />
          </div>
        ) : (
          <AIScanEncourageBanner />
        )}
      </div>

      {/* Section 2: 3 latest activity cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-foreground">
            Split Bill Terbaru
          </h2>
          {latestBills.length > 0 && (
            <Link
              href="/member/history"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-0.5"
            >
              Lihat Lainnya
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {latestBills.length > 0 ? (
          <div className="space-y-3">
            {latestBills.map((bill) => (
              <SplitBillListCard key={bill.id} bill={bill} />
            ))}
          </div>
        ) : (
          <IllustratedEmptyState
            illustration="/img/empty-state/empty-transaction-image.png"
            title="Belum Ada Aktivitas"
            description="Split bill pertamamu bakal muncul di sini."
          />
        )}
      </div>

      {/* Section 3: Share encouragement banner */}
      <PromoBanner isCompact image="/img/promoBanner-split-later.jpg" />
    </div>
  );
}
