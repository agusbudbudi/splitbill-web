"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  className?: string;
  onClick?: () => void;
}

export const ActionCard = ({
  title,
  description,
  icon: Icon,
  color,
  bgColor,
  className,
  onClick,
}: ActionCardProps) => {
  return (
    <Card
      className={cn(
        "rounded-[1.2rem] bg-white/80 backdrop-blur-xs text-card-foreground border-none shadow-soft hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer group overflow-hidden",
        className,
      )}
      onClick={onClick}
    >
      <CardContent className="p-4 flex flex-col gap-3">
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
            bgColor,
          )}
        >
          <Icon className={cn("w-5 h-5", color)} />
        </div>
        <div className="space-y-1">
          <h3 className="text-xs font-black text-foreground/80 leading-tight">
            {title}
          </h3>
          <p className="text-[10px] text-muted-foreground/80 leading-snug font-medium">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
