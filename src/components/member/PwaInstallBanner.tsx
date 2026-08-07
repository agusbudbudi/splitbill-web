"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { usePWA } from "@/hooks/usePWA";
import { useAuthStore } from "@/lib/stores/authStore";
import { cn } from "@/lib/utils";

interface PwaInstallBannerProps {
  containerClassName?: string;
}

export function PwaInstallBanner({ containerClassName }: PwaInstallBannerProps) {
  const { isAuthenticated } = useAuthStore();
  const { isInstallable, isStandalone, isIOS, installPWA } = usePWA();
  const [showPwaBanner, setShowPwaBanner] = useState(false);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem("pwa_dismissed") === "true";
    if (isAuthenticated && !isStandalone && (isInstallable || isIOS) && !isDismissed) {
      setShowPwaBanner(true);
    } else {
      setShowPwaBanner(false);
    }
  }, [isInstallable, isStandalone, isIOS, isAuthenticated]);

  const handlePwaInstall = async () => {
    if (isIOS) {
      alert(
        "Untuk menginstall aplikasi di iOS:\n1. Tap tombol Share ⎋ di browser Anda\n2. Pilih 'Add to Home Screen' (Tambah ke Layar Utama) ⊞"
      );
    } else if (isInstallable) {
      const outcome = await installPWA();
      if (outcome === "accepted") {
        setShowPwaBanner(false);
      }
    } else {
      alert(
        "Untuk menginstall aplikasi di Desktop / Android:\n1. Klik ikon Install ⊕ / Titik Tiga ⋮ di bagian kanan atas address bar browser Anda\n2. Pilih 'Install SplitBill' / 'Tambahkan ke Layar Utama'"
      );
    }
  };

  const handleDismissPwa = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    sessionStorage.setItem("pwa_dismissed", "true");
    setShowPwaBanner(false);
  };

  return (
    <AnimatePresence>
      {showPwaBanner && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="w-full overflow-hidden bg-primary/90 backdrop-blur-md text-white border-t border-white/10"
        >
          <div
            className={cn(
              "w-full py-2 flex items-center justify-between mx-auto",
              containerClassName ?? "max-w-7xl px-4",
            )}
          >
            <span className="text-xs sm:text-sm font-medium flex items-center gap-1.5 tracking-wide">
              📱 <span className="sm:hidden">Install SplitBill di Home Screen!</span><span className="hidden sm:inline">Install SplitBill App untuk akses lebih cepat langsung dari Home Screen!</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePwaInstall}
                className="cursor-pointer font-black text-white text-xs flex items-center gap-1 hover:underline bg-white/15 px-2.5 py-1 rounded-md hover:bg-white/25 transition-all"
              >
                ⚡ {isIOS ? "Cara Install" : "Install"}
              </button>
              <button
                onClick={handleDismissPwa}
                className="cursor-pointer text-white/70 hover:text-white p-0.5"
                aria-label="Tutup banner"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
