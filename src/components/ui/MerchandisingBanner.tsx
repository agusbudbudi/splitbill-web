"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface MerchandisingBannerProps {
  imageSrc: string;
  altText?: string;
  storageKey?: string;
  className?: string;
}

export const MerchandisingBanner = ({
  imageSrc,
  altText = "Special Offer",
  storageKey = "merchandisingBannerSeen",
  className,
}: MerchandisingBannerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hasSeen = localStorage.getItem(storageKey) === "true";
    if (!hasSeen) {
      // Small delay to ensure smooth appearance after page load
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [storageKey]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem(storageKey, "true");
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-6 animate-in fade-in duration-300">
      <div
        className={cn(
          "relative max-w-[400px] w-full animate-in zoom-in-95 duration-300",
          className,
        )}
      >
        {/* Floating Close Button */}
        <button
          onClick={handleClose}
          className="absolute -top-3 -right-3 w-10 h-10 bg-white text-foreground rounded-full flex items-center justify-center shadow-xl hover:bg-slate-50 transition-all active:scale-95 z-50 cursor-pointer border border-primary/10"
          aria-label="Close banner"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image Content */}
        <div className="relative overflow-hidden rounded-3xl">
          <Image
            src={imageSrc}
            alt={altText}
            width={400}
            height={400}
            className="w-full h-auto object-contain drop-shadow-2xl"
          />
        </div>
      </div>
    </div>,
    document.body,
  );
};
