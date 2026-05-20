"use client";

import React from "react";
import { useSplitBillStore } from "@/store/useSplitBillStore";
import { ChevronRight, ReceiptText, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export const OngoingSplitBillCard = () => {
  const expenses = useSplitBillStore((state) => state.expenses);
  const activityName = useSplitBillStore((state) => state.activityName);
  const people = useSplitBillStore((state) => state.people);

  // Show card if at least 1 person is added
  if (people.length === 0) return null;

  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
  const itemCount = expenses.length;

  // Calculate progress based on requirements:
  // Step 1: People added (33%) - min 1 user already added
  // Step 2: Expenses added (66%) - min 1 item already added
  // Step 3: Ready to finalize (100%) - activity name already filled
  const hasActivity = activityName && activityName.trim().length > 0;
  const hasPeople = people.length > 0;
  const hasExpenses = expenses.length > 0;

  let progress = 0;
  if (hasPeople) progress = 33;
  if (hasPeople && hasExpenses) progress = 66;
  if (hasPeople && hasExpenses && hasActivity) progress = 100;

  // Format friend names
  const getFriendsList = () => {
    if (people.length === 0) return "Belum ada teman";
    if (people.length === 1) return people[0];
    if (people.length === 2) return `${people[0]} dan ${people[1]}`;
    if (people.length === 3)
      return `${people[0]}, ${people[1]}, dan ${people[2]}`;

    const remaining = people.length - 2;
    return `${people[0]}, ${people[1]}, dan ${remaining} lainnya`;
  };

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link href="/split-bill?step=2">
        <div className="relative px-[1.5px] pt-[1.5px] pb-[4px] rounded-2xl bg-gradient-to-r from-violet-400 via-pink-400 to-primary/70 shadow-lg shadow-pink-500/5 group hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 overflow-hidden cursor-pointer">
          <div className="relative overflow-hidden bg-white rounded-[calc(1rem-1.5px)] z-10 p-4 space-y-3">
            {/* Subtle background glow */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                  <Image
                    src="/img/icon-bill.jpg"
                    alt="Bill Icon"
                    width={40}
                    height={40}
                    className="w-full h-full object-contain"
                    unoptimized
                  />
                </div>

                <div className="space-y-0.5">
                  <h3 className="text-foreground font-bold text-sm tracking-tight">
                    {activityName || "Split Bill Berjalan"}
                  </h3>
                  <p className="text-muted-foreground text-xs font-medium">
                    {itemCount} item • Rp {totalAmount.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300 shrink-0">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Friends List */}
            {people.length > 0 && (
              <div className="relative z-10 flex items-center gap-2 pl-1">

                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {getFriendsList()}
                  </span>{" "}
                  sedang menunggu dihitung...
                </p>
              </div>
            )}

            {/* Progress Bar */}
            <div className="relative z-10 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-primary/60 uppercase tracking-wider">
                  Progress
                </span>
                <span className="text-[10px] font-bold text-primary">
                  {progress}%
                </span>
              </div>
              <div className="h-1.5 bg-primary/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-violet-600 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
};
