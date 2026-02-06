"use client";

import React, { useState, useEffect } from "react";
import { X, Download } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { usePWA } from "@/hooks/usePWA";
import { useUIStore } from "@/lib/stores/uiStore";

export const PWAInstallBanner = () => {
  const { isInstallable, isStandalone, installPWA } = usePWA();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Check if dismissed in this session or previously
    const dismissed = localStorage.getItem("pwa-banner-dismissed") === "true";
    setIsDismissed(dismissed);

    // Only show if installable, not standalone, not dismissed, AND on landing page
    if (isInstallable && !isStandalone && !dismissed && pathname === "/") {
      // Delay visibility for a smoother entrance
      const timer = setTimeout(() => {
        setIsVisible(true);
        useUIStore.getState().setIsPWABannerVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      useUIStore.getState().setIsPWABannerVisible(false);
    }
  }, [isInstallable, isStandalone, pathname]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    useUIStore.getState().setIsPWABannerVisible(false);
    localStorage.setItem("pwa-banner-dismissed", "true");
  };

  const handleInstall = async () => {
    const outcome = await installPWA();
    if (outcome === "accepted") {
      setIsVisible(false);
    }
  };

  if (!isVisible || isDismissed) return null;

  return (
    <div className="sticky top-0 w-full max-w-[480px] mx-auto bg-gradient-brand border-b border-white/10 overflow-hidden animate-in slide-in-from-top duration-500 shadow-lg z-[60]">
      <div className="w-full px-4 py-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-white backdrop-blur-md flex items-center justify-center overflow-hidden border border-white/20">
            <img
              src="/img/pwa-icon.png"
              alt="SplitBill Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <p className="text-[11px] font-black text-white leading-tight uppercase tracking-wider">
              Install SplitBill App
            </p>
            <p className="text-[10px] text-white/80 font-medium leading-tight">
              Akses lebih cepat & offline!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleInstall}
            size="sm"
            className="h-8 px-4 bg-white text-primary hover:bg-white/90 font-bold text-[10px] rounded-lg shadow-lg shadow-black/10 transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            INSTALL
          </Button>
          <button
            onClick={handleDismiss}
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors cursor-pointer group"
          >
            <X className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
};
