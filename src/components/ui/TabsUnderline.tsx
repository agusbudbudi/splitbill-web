"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface TabOption {
  id: string;
  label: string;
  icon?: LucideIcon;
  badge?: string;
  rightContent?: React.ReactNode;
}

interface TabsUnderlineProps {
  options: readonly TabOption[] | TabOption[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
  id?: string;
}

export const TabsUnderline = ({
  options,
  activeId,
  onChange,
  className,
  id,
}: TabsUnderlineProps) => {
  return (
    <div
      id={id}
      className={cn(
        "flex items-center gap-6 border-b border-border/60",
        className,
      )}
    >
      {options.map((option) => {
        const isActive = activeId === option.id;
        return (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={cn(
              "relative flex items-center gap-2 py-3 text-sm font-bold transition-colors cursor-pointer",
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {option.icon && (
              <option.icon className="w-4 h-4" />
            )}
            <span>{option.label}</span>
            {option.rightContent && (
              <div className="flex items-center">
                {option.rightContent}
              </div>
            )}
            {option.badge && (
              <span className="bg-gradient-to-r from-primary to-violet-600 text-white text-[10px] px-1.5 py-[3px] rounded-full shadow-sm shadow-primary/30 leading-none font-black">
                {option.badge}
              </span>
            )}
            {isActive && (
              <motion.div
                layoutId={`tabs-underline${id ? `-${id}` : ""}`}
                className="absolute left-0 right-0 -bottom-px h-0.5 rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
