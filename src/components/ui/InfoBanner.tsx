"use client";

import React from "react";
import { Info, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface InfoBannerProps {
  message: string;
  subtitle?: string;
  variant?: "blue" | "amber" | "primary" | "destructive";
  icon?: LucideIcon;
  layout?: "horizontal" | "vertical";
  className?: string;
}

export const InfoBanner = ({
  message,
  subtitle,
  variant = "blue",
  icon: Icon = Info,
  layout = "horizontal",
  className,
}: InfoBannerProps) => {
  const styles = {
    blue: {
      container: "bg-blue-50 border-blue-200",
      iconBg: "bg-blue-500/10",
      icon: "text-blue-600",
      text: "text-blue-700",
      subtitle: "text-blue-600/60",
    },
    amber: {
      container: "bg-amber-50 border-amber-200",
      iconBg: "bg-amber-500/10",
      icon: "text-amber-600",
      text: "text-amber-700",
      subtitle: "text-amber-600/60",
    },
    primary: {
      container: "bg-primary/5 border-primary/20",
      iconBg: "bg-primary/10",
      icon: "text-primary",
      text: "text-primary",
      subtitle: "text-primary/60",
    },
    destructive: {
      container: "bg-destructive/5 border-destructive/10",
      iconBg: "bg-destructive/10",
      icon: "text-destructive",
      text: "text-destructive",
      subtitle: "text-destructive/60",
    },
  };

  const currentStyle = styles[variant] || styles.blue;

  if (layout === "vertical") {
    return (
      <div
        className={cn(
          "py-4 flex flex-col items-center justify-center gap-3 border-1 border-dashed rounded-2xl animate-in fade-in zoom-in-95",
          currentStyle.container,
          className,
        )}
      >
        <div
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center",
            currentStyle.iconBg,
          )}
        >
          <Icon className={cn("w-6 h-6 opacity-60", currentStyle.icon)} />
        </div>
        <div className="text-center px-4">
          <p className={cn("text-xs font-bold", currentStyle.text)}>
            {message}
          </p>
          {subtitle && (
            <p
              className={cn(
                "text-[10px] font-medium mt-0.5",
                currentStyle.subtitle,
              )}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "border rounded-2xl p-3 px-4 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2",
        currentStyle.container,
        className,
      )}
    >
      <div className={cn("p-1.5 rounded-lg shrink-0", currentStyle.iconBg)}>
        <Icon className={cn("w-4 h-4", currentStyle.icon)} />
      </div>
      <p className={cn("text-[11px] leading-tight", currentStyle.text)}>
        {message}
      </p>
    </div>
  );
};
