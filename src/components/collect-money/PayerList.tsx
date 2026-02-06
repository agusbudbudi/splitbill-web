"use client";

import React from "react";
import { Payer } from "@/store/useCollectMoneyStore";
import { formatToIDR, cn } from "@/lib/utils";
import { CheckCircle2, Circle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PayerListProps {
  payers: Payer[];
  onToggleStatus: (payerId: string) => void;
  onRemove: (payerId: string) => void;
}

export const PayerList = ({
  payers,
  onToggleStatus,
  onRemove,
}: PayerListProps) => {
  if (payers.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm border-2 border-dashed border-muted rounded-xl bg-muted/5">
        Belum ada orang di list ini.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {payers.map((payer) => (
        <div
          key={payer.id}
          className={cn(
            "flex items-center justify-between p-3 rounded-xl border transition-all duration-300",
            payer.isPaid
              ? "bg-emerald-50/50 border-emerald-100"
              : "bg-white border-muted/20 hover:border-primary/20",
          )}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => onToggleStatus(payer.id)}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90",
                payer.isPaid
                  ? "bg-emerald-500 text-white shadow-emerald-200"
                  : "bg-muted/20 text-muted-foreground hover:bg-muted/40",
              )}
            >
              {payer.isPaid ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <Circle className="w-5 h-5" />
              )}
            </button>

            <div className="space-y-0.5">
              <p
                className={cn(
                  "text-sm font-bold transition-colors",
                  payer.isPaid ? "text-emerald-700" : "text-foreground",
                )}
              >
                {payer.name}
              </p>
              <p
                className={cn(
                  "text-xs font-medium",
                  payer.isPaid ? "text-emerald-600/70" : "text-primary",
                )}
              >
                {formatToIDR(payer.amount)}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(payer.id)}
            className="h-8 w-8 text-muted-foreground/30 hover:text-destructive hover:bg-destructive/5"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};
