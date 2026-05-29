"use client";

import React, { ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface HeroBannerProps {
  badgeText: string;
  badgeIcon?: ReactNode;
  title: ReactNode;
  description: ReactNode;
  primaryButtonText: string;
  primaryButtonIcon?: ReactNode;
  onPrimaryClick: () => void;
  imageSrc: string;
  floatingCard?: ReactNode;
  className?: string;
  variant?: "light" | "primary-gradient";
  trustText?: ReactNode;
}

export const HeroBanner = ({
  badgeText,
  badgeIcon,
  title,
  description,
  primaryButtonText,
  primaryButtonIcon,
  onPrimaryClick,
  imageSrc,
  floatingCard,
  className,
  variant = "light",
  trustText,
}: HeroBannerProps) => {
  const isPrimaryGrad = variant === "primary-gradient";

  return (
    <div
      className={cn(
        "relative w-full rounded-[24px] overflow-hidden px-6 py-4 sm:px-8 sm:py-6 flex flex-row items-center justify-between gap-2 sm:gap-6",
        isPrimaryGrad
          ? "bg-gradient-to-br from-primary via-blue-600 to-indigo-700 border-none"
          : "bg-primary/[0.03]",
        className,
      )}
    >
      {/* Background decorations */}
      <div
        className={cn(
          "absolute top-0 right-0 w-[80%] h-full pointer-events-none",
          isPrimaryGrad
            ? "bg-gradient-to-l from-white/10 to-transparent"
            : "bg-gradient-to-l from-primary/5 to-transparent"
        )}
      />

      {/* Left Content (Text & Button) */}
      <div className="flex flex-col items-start w-full sm:w-1/2 relative z-30 pointer-events-none">
        {/* Text Container (Constrained on mobile so it doesn't overlap image) */}
        <div className="w-[55%] sm:w-full flex flex-col items-start">
          <div
            className={cn(
              "flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 rounded-[8px] font-bold text-xs sm:text-sm mb-3 sm:mb-5",
              isPrimaryGrad
                ? "bg-white/20 text-white backdrop-blur-sm"
                : "bg-primary/10 text-primary"
            )}
          >
            {badgeIcon && (
              <span className="[&>svg]:w-2.5 [&>svg]:h-2.5 sm:[&>svg]:w-3 sm:[&>svg]:h-3">
                {badgeIcon}
              </span>
            )}
            {badgeText}
          </div>

          <h2
            className={cn(
              "text-[30px] sm:text-[35px] md:text-[40px] leading-[1.2] sm:leading-[1.15] font-bold mb-2 sm:mb-4",
              isPrimaryGrad ? "text-white" : "text-[#111827]"
            )}
          >
            {title}
          </h2>

          <p
            className={cn(
              "text-[10px] sm:text-[15px] mb-4 sm:mb-8 font-medium leading-relaxed pr-0 sm:pr-4",
              isPrimaryGrad ? "text-blue-100" : "text-slate-600"
            )}
          >
            {description}
          </p>
        </div>

        <button
          onClick={onPrimaryClick}
          className={cn(
            "relative z-40 pointer-events-auto cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 w-[55%] sm:w-auto font-bold py-3 sm:py-3.5 px-6 rounded-md transition-all active:scale-[0.98] text-sm sm:text-base mt-2 sm:mt-0",
            isPrimaryGrad
              ? "bg-white hover:bg-white/90 text-primary shadow-lg shadow-black/10"
              : "bg-primary hover:bg-primary/90 text-white shadow-md sm:shadow-lg shadow-primary/30"
          )}
        >
          {primaryButtonIcon && (
            <span className="[&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-6 sm:[&>svg]:h-6">
              {primaryButtonIcon}
            </span>
          )}
          {primaryButtonText}
        </button>
        {trustText && (
          <p
            className={cn(
              "text-[9px] sm:text-[11px] font-bold mt-2.5 sm:mt-3 w-[55%] sm:w-full tracking-tight pointer-events-auto leading-relaxed",
              isPrimaryGrad ? "text-white/80" : "text-slate-500"
            )}
          >
            {trustText}
          </p>
        )}
      </div>

      {/* Right Content / Illustration */}
      <div className="absolute right-0 bottom-0 h-full w-full flex items-end justify-end pointer-events-none">
        {/* Main Image (Phone/Hand) */}
        <div className="relative w-[260px] sm:w-[350px] h-auto z-10 mr-[-35px] sm:mr-[-10px] pointer-events-auto">
          <Image
            src={imageSrc}
            alt="Hero Illustration"
            width={400}
            height={400}
            className="w-full h-auto object-contain drop-shadow-2xl origin-bottom object-bottom"
            priority
          />
        </div>

        {/* Floating Card */}
        {floatingCard && (
          <div className="absolute right-[3%] sm:right-[3%] top-[32%] sm:top-[40%] z-20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 scale-[0.65] sm:scale-90 origin-right pointer-events-auto">
            {floatingCard}
          </div>
        )}
      </div>
    </div>
  );
};
