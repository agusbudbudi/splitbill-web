"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { useSplitBillStore } from "@/store/useSplitBillStore";
import { ChevronRight, ReceiptText, Users } from "lucide-react";
import Link from "next/link";
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
        <Card className="group relative overflow-hidden bg-gradient-to-br from-primary/[0.08] to-white/50 backdrop-blur-sm border-1 !border-primary/40 shadow-soft hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer">
          <CardContent className="relative p-4 space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <ReceiptText className="w-5 h-5 text-primary" />
                </div>

                <div className="space-y-0.5">
                  <h3 className="text-foreground font-bold text-sm tracking-tight">
                    {activityName || "Split Bill Berjalan"}
                  </h3>
                  <p className="text-muted-foreground text-[10px] font-medium">
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
              <div className="flex items-center gap-2 pl-1">
                <Users className="w-3.5 h-3.5 text-primary/60" />
                <p className="text-[11px] text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {getFriendsList()}
                  </span>{" "}
                  sedang menunggu dihitung...
                </p>
              </div>
            )}

            {/* Progress Bar */}
            <div className="space-y-1.5">
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
          </CardContent>
        </Card>
      </Link>
    </section>
  );
};
