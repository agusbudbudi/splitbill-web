"use client";

import React, { useState, useEffect } from "react";
import { X, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { usePWA } from "@/hooks/usePWA";
import { useUIStore } from "@/lib/stores/uiStore";
import Image from "next/image";

export const PWAInstallBanner = () => {
  const { isInstallable, isStandalone, isIOS, installPWA } = usePWA();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Check if dismissed in this session or previously
    const dismissed = localStorage.getItem("pwa-banner-dismissed") === "true";
    setIsDismissed(dismissed);

    // Show if installable OR is iOS (and not standalone/dismissed)
    if (
      (isInstallable || isIOS) &&
      !isStandalone &&
      !dismissed &&
      pathname === "/"
    ) {
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
  }, [isInstallable, isStandalone, isIOS, pathname]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    useUIStore.getState().setIsPWABannerVisible(false);
    localStorage.setItem("pwa-banner-dismissed", "true");
  };

  const handleInstall = async () => {
    if (isIOS) {
      // Show simple iOS instructions (toast or alert for now, or maybe a dedicated modal if we had one)
      // For simplicity in this iteration, we'll use a native alert or just rely on the user knowing.
      // Better: Change the button text/action logic below.
      alert(
        "Untuk menginstall aplikasi di iOS:\n1. Tap tombol Share ⎋ dibawah\n2. Pilih 'Add to Home Screen' (Tambah ke Layar Utama) ⊞",
      );
    } else {
      const outcome = await installPWA();
      if (outcome === "accepted") {
        setIsVisible(false);
      }
    }
  };

  if (!isVisible || isDismissed) return null;

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="sticky top-0 w-full max-w-[480px] mx-auto bg-gradient-brand border-b border-white/10 overflow-hidden shadow-lg z-[60]"
    >
      <div className="w-full px-4 py-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-white backdrop-blur-md flex items-center justify-center overflow-hidden border border-white/20">
            <Image
              src="/img/pwa-icon-192.png"
              alt="SplitBill Logo"
              width={32}
              height={32}
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
            {isIOS ? "CARA INSTALL" : "INSTALL"}
          </Button>
          <button
            onClick={handleDismiss}
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors cursor-pointer group"
          >
            <X className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
