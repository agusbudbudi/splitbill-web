import React from "react";
import { cn } from "@/lib/utils";

interface LandingEyebrowProps {
  children: React.ReactNode;
  /** Optional small pill on the right, e.g. "NEW" */
  badge?: string;
  className?: string;
}

/** Small pill above a landing section title — shared so every section's eyebrow matches the hero's. */
export const LandingEyebrow = ({ children, badge, className }: LandingEyebrowProps) => (
  <span
    className={cn(
      "inline-flex items-center gap-2 rounded-full bg-white/80 ring-1 ring-primary/15 text-primary text-sm font-bold pl-4 py-1.5",
      badge ? "pr-1.5" : "pr-4",
      className,
    )}
  >
    {children}
    {badge && (
      <span className="bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full">
        {badge}
      </span>
    )}
  </span>
);
