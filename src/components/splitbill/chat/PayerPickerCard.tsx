"use client";

import React from "react";
import { Check, Wallet, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface PayerPickerCardProps {
  participants: string[];
  payerName: string;
  isCompleted: boolean;
  onConfirm: (payerName: string) => void;
}

export function PayerPickerCard({
  participants,
  payerName,
  isCompleted,
  onConfirm,
}: PayerPickerCardProps) {
  // ── Frozen state (already completed) ──────────────────────────────────────
  if (isCompleted) {
    return (
      <div className="rounded-2xl border border-primary/15 bg-white overflow-hidden shadow-sm">
        <div className="flex items-center gap-2 px-4 py-3 bg-primary/5 border-b border-primary/10">
          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
            <Check className="w-3 h-3 text-white" />
          </div>
          <p className="text-xs font-bold text-primary">Pembayar Tagihan</p>
        </div>
        <div className="px-4 py-3 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <User className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Dibayar oleh</p>
            <p className="text-sm font-bold text-foreground">{payerName || "Belum dipilih"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-primary/20 bg-white overflow-hidden shadow-sm">
      <div className="px-4 py-3 bg-gradient-to-r from-primary/5 to-violet-500/5 border-b border-primary/10 flex items-center gap-2">
        <Wallet className="w-4 h-4 text-primary" />
        <p className="text-xs font-bold text-primary uppercase tracking-wide">
          Siapa yang membayar bill ini?
        </p>
      </div>

      <div className="p-4">
        <p className="text-xs text-muted-foreground mb-3">
          Jadi siapa yang bayar Bill ini? Semua item dari struk yang di-scan bakal otomatis masuk ke dia dulu.
        </p>

        <div className="flex flex-wrap gap-2">
          {participants.map((name) => (
            <button
              key={name}
              onClick={() => onConfirm(name)}
              className={cn(
                "inline-flex items-center gap-2 py-1.5 pl-1.5 pr-3 rounded-xl border text-left transition-all duration-200",
                "hover:bg-primary/5 hover:border-primary/30 active:scale-[0.98] cursor-pointer",
                "border-border bg-card text-card-foreground"
              )}
            >
              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                {name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-semibold truncate">{name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
