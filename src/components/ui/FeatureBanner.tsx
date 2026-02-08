"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface FeatureBannerProps {
  title: string;
  description: string | React.ReactNode;
  ctaText: string;
  ctaHref: string;
  onCtaClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  illustration?: string;
  icon?: LucideIcon;
  variant?: "primary" | "secondary" | "plain";
  className?: string;
  pulsing?: boolean;
}

export const FeatureBanner = ({
  title,
  description,
  ctaText,
  ctaHref,
  onCtaClick,
  illustration,
  icon: Icon,
  variant = "primary",
  className,
  pulsing = false,
}: FeatureBannerProps) => {
  return (
    <div className={cn("w-full relative py-1", className)}>
      {/* 3D Illustration / Big Icon Background */}
      {illustration && (
        <div className="absolute -top-2 right-4 w-28 h-28 opacity-100 transition-transform hover:scale-105 pointer-events-none z-20">
          <Image
            src={illustration}
            alt="Decoration"
            width={112}
            height={112}
            className="w-full h-full object-contain"
          />
        </div>
      )}

      {!illustration && Icon && (
        <div className="absolute -top-2 -right-4 p-6 opacity-10 transition-transform hover:scale-110 hover:rotate-12 pointer-events-none">
          <Icon className="w-32 h-32" />
        </div>
      )}

      <div
        className={cn(
          "w-full rounded-xl p-6 sm:p-6 relative overflow-hidden transition-all duration-300",
          variant === "primary" &&
            "bg-primary text-white shadow-xl shadow-primary/20",
          variant === "secondary" && "bg-[#f0f4ff] text-foreground",
          variant === "plain" &&
            "bg-white border border-border shadow-soft text-foreground",
        )}
      >
        <div className="relative z-10 flex flex-col gap-8 w-full">
          <div className="space-y-3 max-w-[70%]">
            <h2
              className={cn(
                "text-lg font-bold leading-tight",
                variant === "primary" ? "text-white" : "text-[#1e293b]",
              )}
            >
              {title}
            </h2>
            <div
              className={cn(
                "text-xs leading-relaxed",
                variant === "primary" ? "text-white/80" : "text-slate-500",
              )}
            >
              {description}
            </div>
          </div>

          <Link href={ctaHref} className="w-full">
            <Button
              onClick={onCtaClick}
              className={cn(
                "w-full h-12 rounded-2xl font-bold text-base shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 relative overflow-hidden",
                variant === "primary"
                  ? "bg-white text-primary hover:bg-white/95"
                  : "bg-primary text-white hover:opacity-90",
                pulsing && "animate-pulse shadow-primary/30",
              )}
            >
              {pulsing && (
                <div className="absolute inset-0 bg-white/20 animate-[ping_2s_infinite] pointer-events-none" />
              )}
              {ctaText}
            </Button>
          </Link>
        </div>

        {/* Decorative background blurs */}
        {variant === "primary" && (
          <>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl" />
          </>
        )}
        {variant === "secondary" && (
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-blue-400/10 blur-[60px] rounded-full" />
        )}
      </div>
    </div>
  );
};
