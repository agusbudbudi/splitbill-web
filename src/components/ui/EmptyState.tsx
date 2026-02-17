import React from "react";
import { LucideIcon, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  message: string;
  subtitle?: string;
  icon?: LucideIcon;
  className?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  message,
  subtitle,
  icon: Icon = Info,
  className,
  action,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-6 px-4 rounded-2xl bg-gradient-to-br from-white to-primary/5",
        className,
      )}
    >
      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 animate-in zoom-in duration-500">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="font-bold text-md text-foreground/90 mb-2 text-center leading-tight">
        {message}
      </h3>
      {subtitle && (
        <p className="text-xs text-muted-foreground/90 text-center max-w-[300px] mb-2 leading-relaxed">
          {subtitle}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

