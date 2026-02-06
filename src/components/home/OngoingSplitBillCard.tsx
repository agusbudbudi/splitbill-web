"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { useSplitBillStore } from "@/store/useSplitBillStore";
import { ChevronRight, ReceiptText, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const OngoingSplitBillCard = () => {
  const { expenses, activityName } = useSplitBillStore();

  if (expenses.length === 0) return null;

  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
  const itemCount = expenses.length;

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link href="/split-bill?step=2">
        <Card className="group relative overflow-hidden bg-linear-to-tl from-primary/[0.08] to-white/50 backdrop-blur-sm border-1 !border-primary/40 shadow-sm hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer">
          <CardContent className="relative p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <ReceiptText className="w-6 h-6 text-primary" />
              </div>

              <div className="space-y-1">
                <h3 className="text-foreground font-bold text-sm tracking-tight">
                  {activityName || "Split Bill Berjalan"}
                </h3>
                <p className="text-muted-foreground text-[11px] font-medium">
                  {itemCount} transaksi •{" "}
                  <span className="text-foreground font-bold">
                    Rp {totalAmount.toLocaleString("id-ID")}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-primary opacity-0 group-hover:opacity-100 group-hover:mr-1 transition-all duration-300">
                Lanjutkan
              </span>
              <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </section>
  );
};
