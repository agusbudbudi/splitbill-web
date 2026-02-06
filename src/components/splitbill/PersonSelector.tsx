"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const AVATAR_BASE_URL =
  "https://api.dicebear.com/9.x/personas/svg?backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&size=48&scale=100&seed=";

interface PersonSelectorProps {
  name: string;
  isSelected: boolean;
  onClick: (name: string) => void;
  size?: "sm" | "md";
}

export const PersonSelector = ({
  name,
  isSelected,
  onClick,
  size = "md",
}: PersonSelectorProps) => {
  const containerSize = size === "sm" ? "w-8 h-8" : "w-10 h-10";
  const iconSize = size === "sm" ? "w-3 h-3" : "w-4 h-4";

  return (
    <button
      onClick={() => onClick(name)}
      className="group flex flex-col items-center gap-1.5 cursor-pointer"
    >
      <div
        className={cn(
          "relative rounded-full border transition-all p-0.5",
          containerSize,
          isSelected
            ? "border-primary bg-primary/5 shadow-sm"
            : "border-primary/5 opacity-40 grayscale-[50%]",
        )}
      >
        <img
          src={`${AVATAR_BASE_URL}${encodeURIComponent(name)}`}
          alt={name}
          className="w-full h-full rounded-full"
        />
        {isSelected && (
          <div className="absolute -top-1 -right-1 bg-white rounded-full">
            <CheckCircle2
              className={cn(
                "text-primary fill-primary text-white scale-90",
                iconSize,
              )}
            />
          </div>
        )}
      </div>
      <span
        className={cn(
          "text-[10px] transition-colors truncate max-w-[60px]",
          isSelected ? "text-primary" : "text-muted-foreground/50",
        )}
      >
        {name}
      </span>
    </button>
  );
};
