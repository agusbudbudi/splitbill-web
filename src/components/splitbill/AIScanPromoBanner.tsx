"use client";

import React from "react";
import { Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface AIScanPromoBannerProps {
  onDismiss: () => void;
  className?: string;
  onLoginClick?: () => void;
}

export const AIScanPromoBanner = ({
  onDismiss,
  className,
  onLoginClick,
}: AIScanPromoBannerProps) => {
  const router = useRouter();

  const handleCTA = () => {
    if (onLoginClick) {
      onLoginClick();
    } else {
      const redirectUrl = encodeURIComponent("/split-bill?step=2");
      router.push(`/register?redirect=${redirectUrl}`);
    }
  };

  return (
    <div
      className={cn(
        "relative animate-in fade-in slide-in-from-top-2 duration-300",
        className,
      )}
    >
      {/* Arrow notch pointing UP toward the AI Scan tab (left ~22% of width) */}
      <div
        className="absolute -top-[7px] left-[22%] -translate-x-1/2 w-0 h-0"
        style={{
          borderLeft: "7px solid transparent",
          borderRight: "7px solid transparent",
          borderBottom: "7px solid #2563eb", // matches blue-600
        }}
      />

      {/* Banner body - Simple 1-line text bar with blue primary gradient */}
      <div className="relative rounded-[6px] bg-gradient-to-r from-blue-600 to-blue-500 shadow-md shadow-blue-500/10 text-white">
        <div className="flex items-center justify-between px-3 py-1.5 gap-2">
          <div className="flex items-center min-w-0 text-[11px] font-semibold">
            <span className="truncate">
              Biar cepet, yuk{" "}
              <button
                onClick={handleCTA}
                className="font-black text-yellow-300 underline decoration-yellow-300/60 underline-offset-2 hover:text-yellow-200 cursor-pointer"
              >
                Login & SCAN Struk pakai AI
              </button>{" "}
              di sini!
            </span>
          </div>

          <button
            onClick={onDismiss}
            className="w-5 h-5 rounded-full hover:bg-white/10 flex items-center justify-center shrink-0 transition-colors cursor-pointer text-white/80 hover:text-white"
            aria-label="Tutup banner"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
