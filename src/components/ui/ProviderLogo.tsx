"use client";

import React from "react";
import { Wallet, Landmark } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProviderLogoProps {
  name: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  iconOnly?: boolean;
}

export const ProviderLogo = ({
  name,
  className,
  size = "md",
  iconOnly = false,
}: ProviderLogoProps) => {
  const lowerName = name.toLowerCase();

  const getLogoPath = (provider: string) => {
    if (provider.includes("bca")) return "/img/logo-bca.png";
    if (provider.includes("bni")) return "/img/logo-bni.png";
    if (provider.includes("bri")) return "/img/logo-bri.png";
    if (provider.includes("bsi")) return "/img/logo-bsi.png";
    if (provider.includes("btn")) return "/img/logo-btn.png";
    if (provider.includes("dana")) return "/img/logo-dana.png";
    if (provider.includes("danamon")) return "/img/logo-danamon.png";
    if (provider.includes("gopay")) return "/img/logo-gopay.png";
    if (provider.includes("jenius")) return "/img/logo-jenius.png";
    if (provider.includes("linkaja")) return "/img/logo-linkaja.png";
    if (provider.includes("mandiri")) return "/img/logo-mandiri.png";
    if (provider.includes("ovo")) return "/img/logo-ovo.png";
    if (provider.includes("permata")) return "/img/logo-permata.png";
    if (provider.includes("shopeepay")) return "/img/logo-shopeepay.png";
    return null;
  };

  const logoPath = getLogoPath(lowerName);

  const sizeClasses = {
    sm: "w-8 h-8 p-1",
    md: "w-12 h-12 p-1.5",
    lg: "w-16 h-16 p-2",
  };

  const iconSizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  if (!logoPath) {
    const isEwallet = ["gopay", "ovo", "dana", "shopeepay", "linkaja"].some(
      (kw) => lowerName.includes(kw),
    );

    return (
      <div
        className={cn(
          "bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border border-primary/5",
          sizeClasses[size],
          className,
        )}
      >
        {isEwallet ? (
          <Wallet className={cn("text-primary/60", iconSizeClasses[size])} />
        ) : (
          <Landmark className={cn("text-primary/60", iconSizeClasses[size])} />
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border border-primary/5 overflow-hidden",
        sizeClasses[size],
        className,
      )}
    >
      <img
        src={logoPath}
        alt={name}
        className="w-full h-full object-contain"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
    </div>
  );
};
