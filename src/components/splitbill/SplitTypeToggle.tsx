"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SplitTypeToggleProps {
  value: "equally" | "proportionally";
  onChange: (value: "equally" | "proportionally") => void;
  className?: string;
}

export const SplitTypeToggle = ({ value, onChange, className }: SplitTypeToggleProps) => (
  <div className={cn("flex p-1 bg-primary/5 rounded-sm border border-primary/10", className)}>
    <button
      type="button"
      onClick={() => onChange("proportionally")}
      className={cn(
        "flex-1 py-2 rounded-sm text-[10px] font-bold transition-all cursor-pointer",
        value === "proportionally"
          ? "bg-primary text-white shadow-sm"
          : "text-primary/60 hover:bg-white/80",
      )}
    >
      PROPORSIONAL (%)
    </button>
    <button
      type="button"
      onClick={() => onChange("equally")}
      className={cn(
        "flex-1 py-2 rounded-sm text-[10px] font-bold transition-all cursor-pointer",
        value === "equally"
          ? "bg-primary text-white shadow-sm"
          : "text-primary/60 hover:bg-white/80",
      )}
    >
      BAGI RATA (=)
    </button>
  </div>
);
