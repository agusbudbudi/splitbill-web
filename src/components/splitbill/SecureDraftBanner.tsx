"use client";

import React from "react";
import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface SecureDraftBannerProps {
  onLoginClick: () => void;
  className?: string;
}

export const SecureDraftBanner = ({
  onLoginClick,
  className,
}: SecureDraftBannerProps) => {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 px-3 py-2 bg-amber-500/10 rounded-t-lg",
        className,
      )}
    >
      <ShieldAlert className="w-4 h-4 text-amber-800 shrink-0" />
      <p className="text-xs font-semibold text-amber-900 flex-1">
        Rincian ini cuma numpang lewat sementara, lho! Biar gak hilang, yuk{" "}
        <button
          onClick={onLoginClick}
          className="font-black underline underline-offset-2 hover:text-amber-950 cursor-pointer"
        >
          simpan ke akun kamu
        </button>
        !
      </p>
    </div>
  );
};
