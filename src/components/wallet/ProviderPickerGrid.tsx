"use client";

import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Check } from "lucide-react";
import { DynamicFinLogo } from "./DynamicFinLogo";
import { BANK_LOGOS, EWALLET_LOGOS } from "@/lib/providerLogos";

interface ProviderPickerGridProps {
  selectedProvider: string;
  onChange: (value: string) => void;
}

/** Derive picker lists from the central logo map — no manual duplication needed. */
const BANK_PROVIDERS = Object.entries(BANK_LOGOS).map(([key, info]) => ({
  value: key,
  label: key === "BankTransfer" ? "Bank Lain" : key,
  slug: info.slug,
  logo: info.image,
  color: info.color,  // raw hex — applied via inline style
}));

const EWALLET_PROVIDERS = Object.entries(EWALLET_LOGOS).map(([key, info]) => ({
  value: key,
  label: key,
  slug: info.slug,
  logo: info.image,
  color: info.color,  // raw hex — applied via inline style
}));

export const ProviderPickerGrid = ({
  selectedProvider,
  onChange,
}: ProviderPickerGridProps) => {
  const renderButton = (provider: { value: string; label: string; logo?: string; slug?: string; color: string }, isBank = false) => {
    const isSelected = selectedProvider === provider.value;
    const isBankTransfer = provider.value === "BankTransfer";

    return (
      <button
        key={provider.value}
        type="button"
        onClick={() => onChange(provider.value)}
        className={cn(
          "relative h-13 rounded-md border bg-white flex items-center justify-center p-2 transition-all active:scale-[0.98] cursor-pointer",
          isSelected
            ? "border-2"
            : "border-muted-foreground/15 hover:border-primary/30"
        )}
        style={isSelected ? {
          borderColor: provider.color,
          boxShadow: `0 0 0 2px ${provider.color}22`,
        } : undefined}
      >
        {isBankTransfer ? (
          <span className="text-[11px] font-bold text-foreground truncate max-w-full leading-tight text-center">
            Bank Lain
          </span>
        ) : provider.slug ? (
          <div className="h-7 w-20 flex items-center justify-center overflow-hidden">
            <DynamicFinLogo
              slug={provider.slug}
              alt={provider.label}
              className="w-full h-full"
            />
          </div>
        ) : (
          <img
            src={provider.logo}
            alt={provider.label}
            className="object-contain max-h-7 w-auto"
          />
        )}
        {isSelected && (
          <div className="absolute -top-1 -right-1 bg-primary text-white rounded-full p-0.5 shadow-sm">
            <Check className="w-2.5 h-2.5" />
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="space-y-4">
      {/* Banks */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2 ml-1">
          Pilih Bank
        </p>
        <div className="grid grid-cols-3 gap-2">
          {BANK_PROVIDERS.map((provider) => renderButton(provider, true))}
        </div>
      </div>

      {/* E-Wallets */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2 ml-1">
          Pilih E-Wallet
        </p>
        <div className="grid grid-cols-3 gap-2">
          {EWALLET_PROVIDERS.map((provider) => renderButton(provider))}
        </div>
      </div>
    </div>
  );
};
