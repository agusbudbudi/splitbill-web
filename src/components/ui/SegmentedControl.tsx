"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface TabOption {
  id: string;
  label: string;
  icon?: LucideIcon;
  badge?: string;
}

interface SegmentedControlProps {
  options: readonly TabOption[] | TabOption[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
  variant?: "primary" | "secondary";
}

export const SegmentedControl = ({
  options,
  activeId,
  onChange,
  className,
  variant = "primary",
}: SegmentedControlProps) => {
  return (
    <div
      className={cn(
        "flex p-1 bg-muted/20 rounded-sm gap-1 transition-all",
        className,
      )}
    >
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onChange(option.id)}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-sm text-sm font-bold transition-all duration-300 relative cursor-pointer",
            activeId === option.id
              ? "bg-white text-primary shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.01] scale-[1.01]"
              : "text-muted-foreground hover:bg-white/50 hover:text-foreground",
          )}
        >
          {option.icon && (
            <option.icon
              className={cn(
                "w-4 h-4 transition-transform duration-300",
                activeId === option.id ? "scale-110" : "scale-100",
              )}
            />
          )}
          <span>{option.label}</span>
          {option.badge && (
            <span className="bg-primary text-white text-[10px] px-1.5 py-[3px] rounded-full shadow-sm leading-none font-black animate-in zoom-in duration-300">
              {option.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};
