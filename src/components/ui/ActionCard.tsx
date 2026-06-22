import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color?: string;
  bgColor?: string;
  className?: string;
  onClick?: () => void;
  count?: number;
}

export const ActionCard = ({
  title,
  description,
  icon: Icon,
  color = "text-primary",
  bgColor = "bg-primary/10",
  className,
  onClick,
  count,
}: ActionCardProps) => {
  return (
    <Card
      className={cn(
        "rounded-lg bg-white backdrop-blur-xs text-card-foreground border-none shadow-soft hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer group overflow-hidden h-full",
        className,
      )}
      onClick={onClick}
    >
      <CardContent className="p-4 flex flex-col gap-3 h-full relative">
        <div className="w-10 h-10">
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
              bgColor,
            )}
          >
            <Icon className={cn("w-5 h-5", color)} />
          </div>
        </div>
        {count !== undefined && count > 0 && (
          <span className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[9.5px] font-black text-white shadow-sm ring-2 ring-white animate-in zoom-in duration-200">
            {count}
          </span>
        )}
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground/80 leading-snug font-medium">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
