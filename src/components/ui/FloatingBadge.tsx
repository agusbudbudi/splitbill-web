import React from "react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface FloatingBadgeProps {
  children: React.ReactNode;
  className?: string;
  position?: "center" | "right";
}

export const FloatingBadge = ({
  children,
  className,
  position = "center",
}: FloatingBadgeProps) => {
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
