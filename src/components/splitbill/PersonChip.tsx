"use client";

import React from "react";
import { cn, getFriendAvatarUrl } from "@/lib/utils";

interface PersonChipProps {
  name: string;
  selected: boolean;
  onClick: (name: string) => void;
  /** Selected-state color scheme: "payer" (success/green) or "who" (primary/blue) */
  variant?: "payer" | "who";
}

const SELECTED_STYLES = {
  payer: "bg-success/10 border-success/40 text-success shadow-xs",
  who: "bg-primary/10 border-primary/30 text-primary shadow-xs",
};

export const PersonChip = ({ name, selected, onClick, variant = "who" }: PersonChipProps) => (
  <button
    type="button"
    onClick={() => onClick(name)}
    title={name}
    className={cn(
      "flex items-center gap-1.5 rounded-full pl-1 pr-2.5 py-1 border transition-all cursor-pointer text-[10px] font-bold",
      selected
        ? SELECTED_STYLES[variant]
        : "bg-muted/30 border-muted text-muted-foreground hover:bg-muted/60",
    )}
  >
    <img
      src={getFriendAvatarUrl(name)}
      alt={name}
      className={cn(
        "w-5 h-5 rounded-full transition-transform duration-200",
        selected ? "scale-105" : "opacity-60",
      )}
    />
    <span className="truncate max-w-[60px]">{name}</span>
  </button>
);
