import React from "react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface FloatingBadgeProps {
  children: React.ReactNode;
  className?: string;
  position?: "center" | "right" | "bottom";
}

export const FloatingBadge = ({
  children,
  className,
  position = "center",
}: FloatingBadgeProps) => {
  if (position === "bottom") {
    return (
      <div
        className={cn(
          "absolute -bottom-0 left-0 right-0 z-10",
          className,
        )}
      >
        <span className="flex items-center justify-center w-full py-[4px] text-[9px] font-black uppercase tracking-wide bg-gradient-to-r from-violet-400 via-pink-400 to-primary/70 text-white rounded-b-2xl rounded-t-none shadow-sm leading-none">
          {children}
        </span>
      </div>
    );
  }

  return (
    <Badge
      className={cn(
        "absolute -top-3 z-10 bg-primary text-white border-none rounded-full whitespace-nowrap min-w-[max-content] shadow-sm px-2 py-0.5 text-[10px]",
        position === "center" && "left-1/2 -translate-x-1/2",
        position === "right" && "-right-2",
        className,
      )}
    >
      {children}
    </Badge>
  );
};
