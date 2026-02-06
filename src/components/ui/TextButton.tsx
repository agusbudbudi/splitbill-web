"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface TextButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon?: LucideIcon;
  iconPlacement?: "left" | "right";
  className?: string;
}

export const TextButton = ({
  label,
  icon: Icon,
  iconPlacement = "left",
  className,
  ...props
}: TextButtonProps) => {
  return (
    <button
      className={cn(
        "text-primary text-xs font-bold shadow-none flex items-center gap-1 hover:bg-primary/5 px-3 py-2 rounded-sm transition-colors cursor-pointer",
        className,
      )}
      {...props}
    >
      {Icon && iconPlacement === "left" && <Icon className="w-3.5 h-3.5" />}
      {label}
      {Icon && iconPlacement === "right" && <Icon className="w-3.5 h-3.5" />}
    </button>
  );
};
