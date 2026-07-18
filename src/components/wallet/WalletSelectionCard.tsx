"use client";

import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { PaymentMethod } from "@/store/useWalletStore";
import { BANK_LOGOS, EWALLET_LOGOS, maskNumber } from "./PaymentMethodCard";
import { getProviderLogoInfo } from "@/lib/providerLogos";
import { DynamicFinLogo } from "./DynamicFinLogo";

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
  const isBank = method.type === "bank";
  const logoInfo = getProviderLogoInfo(method.providerName, isBank ? "bank" : "ewallet");

  const rawNumber = isBank ? method.accountNumber : method.phoneNumber;
  const displayNumber = maskNumber(rawNumber);

  return (
    <Card
      onClick={onClick}
      className={cn(
        "relative w-[42vw] sm:w-[220px] shrink-0 aspect-[1.4/1] rounded-sm border p-3.5 flex flex-col justify-between transition-all active:scale-95 text-left overflow-hidden select-none cursor-pointer",
        isSelected
          ? "border-primary bg-primary text-white shadow-md shadow-primary/10"
          : "border-slate-200 bg-white text-slate-800 hover:border-slate-300",
      )}
    >
      {/* Top: Logo */}
      <div className="flex items-start justify-between">
        <div className="h-7 w-16 flex items-center">
          {logoInfo.slug ? (
            <DynamicFinLogo
              slug={logoInfo.slug}
              alt={method.providerName}
              className={cn(
                "filter drop-shadow-xs w-full h-full",
                isSelected && "brightness-0 invert"
              )}
            />
          ) : (
            <img
              src={logoInfo.image}
              alt={method.providerName}
              className={cn(
                "h-full w-auto object-contain filter drop-shadow-xs",
                isSelected && "brightness-0 invert"
              )}
            />
          )}
        </div>
      </div>

      {/* Bottom: Name & Number */}
      <div className="text-left space-y-0.5">
        <p
          className={cn(
            "text-[10px] font-semibold truncate leading-tight",
            isSelected ? "text-white/80" : "text-slate-500"
          )}
        >
          {method.accountName}
        </p>
        <p
          className={cn(
            "text-[9px] font-extrabold uppercase tracking-widest leading-none",
            isSelected ? "text-white/60" : "text-slate-400"
          )}
        >
          {method.providerName}
        </p>
        <div className="flex items-center gap-1.5 pt-0.5">
          <p
            className={cn(
              "font-mono text-sm tracking-widest font-black leading-tight",
              isSelected ? "text-white" : "text-slate-800"
            )}
          >
            {displayNumber}
          </p>
        </div>
      </div>

      {/* Selection Check */}
      {isSelected && (
        <div className="absolute top-1.5 right-1.5 flex items-center justify-center w-3.5 h-3.5 bg-white rounded-full text-primary shadow-sm animate-in zoom-in duration-300">
          <Plus className="w-2 h-2 rotate-45" />
        </div>
      )}
    </Card>
  );
};
