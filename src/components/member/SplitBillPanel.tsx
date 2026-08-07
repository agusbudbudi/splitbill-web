"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, ReceiptText, Clock } from "lucide-react";
import { OngoingSplitBillCard } from "@/components/home/OngoingSplitBillCard";
import { AIScanEncourageBanner } from "@/components/home/AIScanEncourageBanner";
import { ShareEncouragement } from "@/components/home/ShareEncouragement";
import { Card, CardContent } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatToIDR } from "@/lib/utils";
import { useSplitBillStore } from "@/store/useSplitBillStore";
import { useWalletStore } from "@/store/useWalletStore";

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
              <Link key={bill.id} href={`/member/history/split-bill/${bill.id}`} className="block">
                <Card className="shadow-md overflow-hidden relative hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer group">
                  <CardContent className="p-4 flex items-stretch justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
                        <ReceiptText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground line-clamp-1">
                          {bill.activityName || "Aktivitas Split Bill"}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-medium">
                          {(bill?.people || []).length} Orang • {(bill?.expenses || []).length} Item
                        </p>
                        <div className="flex items-center gap-1 mt-0.5 opacity-60">
                          <Clock className="w-2.5 h-2.5" />
                          <p className="text-[9px] font-medium">
                            {new Date(bill?.date || "").toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end justify-between py-0.5">
                      <p className="text-xs font-black text-foreground">
                        {formatToIDR(bill?.totalAmount || 0)}
                      </p>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-primary">Lihat Detail</span>
                        <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={ReceiptText}
            message="Belum Ada Aktivitas"
            subtitle="Split bill pertamamu bakal muncul di sini."
          />
        )}
      </div>

      {/* Section 3: Share encouragement banner */}
      <ShareEncouragement isCompact />
    </div>
  );
}
