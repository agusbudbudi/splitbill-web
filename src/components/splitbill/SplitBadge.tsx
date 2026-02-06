import { cn } from "@/lib/utils";
import React from "react";

interface SplitBadgeProps {
  type: "equally" | "proportionally";
  className?: string;
}

export const SplitBadge = ({ type, className }: SplitBadgeProps) => {
  return (
    <span
      className={cn(
        "text-[9px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded-[4px] border",
        type === "proportionally"
          ? "bg-primary/5 text-primary border-primary/20"
          : "bg-muted/30 text-muted-foreground border-muted-foreground/20",
        className,
      )}
    >
      {type === "proportionally" ? "% Prop" : "= Rata"}
    </span>
  );
};
