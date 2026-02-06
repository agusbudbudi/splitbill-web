"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { Wallet, Plus } from "lucide-react";
import { PaymentMethod } from "@/store/useWalletStore";

interface WalletSelectionCardProps {
  method: PaymentMethod;
  isSelected: boolean;
  onClick: () => void;
}

export const WalletSelectionCard = ({
  method,
  isSelected,
  onClick,
}: WalletSelectionCardProps) => {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "shrink-0 w-32 h-20 rounded-lg border-1 p-2.5 flex flex-col justify-between transition-all active:scale-95 text-left relative overflow-hidden group cursor-pointer",
        isSelected
          ? "border-primary bg-primary text-white shadow-md shadow-primary/20"
          : "border-primary/10 bg-white text-foreground hover:border-primary/30",
      )}
    >
      <div className="relative z-10">
        <p
          className={cn(
            "text-[9px] font-black uppercase tracking-wider mb-0.5",
            isSelected ? "text-white/80" : "text-primary/60",
          )}
        >
          {method.providerName}
        </p>
        <h4 className="font-bold text-[11px] line-clamp-1 leading-tight mb-0.5">
          {method.accountName}
        </h4>
        <p
          className={cn(
            "text-[9px] font-medium break-all opacity-80",
            isSelected ? "text-white/70" : "text-muted-foreground",
          )}
        >
          {method.accountNumber || method.phoneNumber}
        </p>
      </div>

      {/* Icon Branding */}
      <div className="absolute right-1 bottom-1 opacity-5 group-hover:scale-110 transition-transform">
        <Wallet className="w-10 h-10" />
      </div>

      {/* Selection Check */}
      {isSelected && (
        <div className="absolute top-1.5 right-1.5 flex items-center justify-center w-4 h-4 bg-white rounded-full text-primary shadow-sm animate-in zoom-in duration-300">
          <Plus className="w-2.5 h-2.5 rotate-45" />
        </div>
      )}
    </Card>
  );
};
