"use client";

import React, { forwardRef } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { cn, formatToIDR } from "@/lib/utils";
import { CollectionSession } from "@/store/useCollectMoneyStore";
import { CheckCircle2, Clock, Wallet } from "lucide-react";

interface ShareStatusCardProps {
  collection: CollectionSession;
}

export const ShareStatusCard = forwardRef<HTMLDivElement, ShareStatusCardProps>(
  ({ collection }, ref) => {
    const paidPayers = collection.payers.filter((p) => p.isPaid);
    const unpaidPayers = collection.payers.filter((p) => !p.isPaid);

    const paidTotal = paidPayers.reduce((acc, p) => acc + p.amount, 0);
    const totalCollectedPct =
      collection.totalAmount > 0
        ? Math.round((paidTotal / collection.totalAmount) * 100)
        : 0;

    return (
      <div
        ref={ref}
        className="w-[480px] bg-background p-6 text-foreground"
        id="share-status-card"
      >
        <Card className="border-none shadow-xl bg-gradient-to-b from-white to-primary/5 overflow-hidden ring-1 ring-primary/20">
          {/* Header */}
          <div className="bg-primary/10 p-6 border-b border-primary/10 text-center space-y-2">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Wallet className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground">
              {collection.title}
            </h2>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 border border-primary/10">
              <span className="text-xs font-medium text-muted-foreground">
                Total Terkumpul:
              </span>
              <span className="text-sm font-bold text-primary">
                {formatToIDR(paidTotal)}
              </span>
              <span className="text-xs text-muted-foreground">
                ({totalCollectedPct}%)
              </span>
            </div>
          </div>

          <CardContent className="p-6 space-y-6">
            {/* Paid Section */}
            {paidPayers.length > 0 && (
              <div className="space-y-3">
                <h3 className="flex items-center gap-2 text-sm font-bold text-emerald-600 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  Sudah Bayar ({paidPayers.length})
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {paidPayers.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-100"
                    >
                      <span className="text-xs font-bold text-foreground truncate max-w-[100px]">
                        {p.name}
                      </span>
                      <span className="text-[10px] font-medium text-emerald-600 bg-white px-1.5 py-0.5 rounded-md border border-emerald-100">
                        Lunas
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Unpaid Section */}
            {unpaidPayers.length > 0 && (
              <div className="space-y-3">
                <h3 className="flex items-center gap-2 text-sm font-bold text-amber-600 uppercase tracking-wider">
                  <Clock className="w-4 h-4" />
                  Belum Bayar ({unpaidPayers.length})
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {unpaidPayers.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-red-50/50 border border-red-100/50 hover:bg-red-50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                        <span className="text-xs font-bold text-foreground">
                          {p.name}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-primary">
                        {formatToIDR(p.amount)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-muted/30 rounded-lg text-center">
                  <p className="text-[10px] text-muted-foreground italic">
                    Bantu lunasi yuk, biar cepat beres! 🙏
                  </p>
                </div>
              </div>
            )}
          </CardContent>

          <div className="p-3 bg-muted/10 border-t border-border/50 flex justify-center">
            <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">
              Generated by SplitBill App
            </p>
          </div>
        </Card>
      </div>
    );
  },
);

ShareStatusCard.displayName = "ShareStatusCard";
