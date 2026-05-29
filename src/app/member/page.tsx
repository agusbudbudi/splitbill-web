"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/authStore";
import { Footer } from "@/components/layout/Footer";
import { FeatureHighlights } from "@/components/home/FeatureHighlights";
import { OngoingSplitBillCard } from "@/components/home/OngoingSplitBillCard";
import { SplitBillHeroCard } from "@/components/home/SplitBillHeroCard";
import { NavigationMenu } from "@/components/home/NavigationMenu";
import { VisualFlowPreview } from "@/components/home/VisualFlowPreview";
import { LatestBlogSlider } from "@/components/blog/LatestBlogSlider";
import { MemberGettingStarted } from "@/components/member/MemberGettingStarted";
import { ReviewRewardBanner } from "@/components/home/ReviewRewardBanner";
import { FAQCard } from "@/components/home/FAQCard";
import { Header } from "@/components/layout/Header";
import { MerchandisingBanner } from "@/components/ui/MerchandisingBanner";
import { AIScanEncourageBanner } from "@/components/home/AIScanEncourageBanner";
import { ShareEncouragement } from "@/components/home/ShareEncouragement";
import { useSplitBillStore } from "@/store/useSplitBillStore";
import { useWalletStore } from "@/store/useWalletStore";
import { cn } from "@/lib/utils";
import { usePWA } from "@/hooks/usePWA";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";

export default function MemberPage() {
  const router = useRouter();
  const { isAuthenticated, isInitialized, initialize } = useAuthStore();
  const { savedBills, fetchBills } = useWalletStore();
  const expenses = useSplitBillStore((state) => state.expenses);
  const activityName = useSplitBillStore((state) => state.activityName);
  const people = useSplitBillStore((state) => state.people);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Ensure auth is initialized if not already
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);

  useEffect(() => {
    if (isMounted && isInitialized && !isAuthenticated) {
      router.push("/login");
    }
  }, [isMounted, isInitialized, isAuthenticated, router]);

  const { isInstallable, isStandalone, isIOS, installPWA } = usePWA();
  const [showPwaBanner, setShowPwaBanner] = useState(false);

  useEffect(() => {
    if (isMounted && isAuthenticated) {
      fetchBills();
    }
  }, [isMounted, isAuthenticated, fetchBills]);

  // Check if we should show the install PWA banner
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

  if (!isMounted || !isInitialized || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const hasHistory = Array.isArray(savedBills) && savedBills.length >= 1;
  const hasActiveBill =
    (activityName && activityName.trim().length > 0) ||
    expenses.length > 0 ||
    people.length > 0;

  return (
    <div className="min-h-screen bg-[#f8f9fd] flex flex-col items-center relative">
      <Header wide />

      {/* Sticky Banner Encourage to Install PWA */}
      <AnimatePresence>
        {showPwaBanner && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="w-full overflow-hidden bg-white/90 backdrop-blur-md bg-gradient-to-r from-primary/10 via-primary/5 to-white border-t border-slate-100 text-slate-700 sticky top-14 lg:top-16 z-40 shadow-[0_8px_30px_rgba(0,0,0,0.03)]"
          >
            <div className="w-full py-2 px-4 flex items-center justify-between max-w-7xl mx-auto">
              <span className="text-xs sm:text-sm font-medium flex items-center gap-1.5 tracking-wide">
                📱 <span className="sm:hidden">Install SplitBill di Home Screen!</span><span className="hidden sm:inline">Install SplitBill App untuk akses lebih cepat langsung dari Home Screen!</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePwaInstall}
                  className="cursor-pointer font-black text-primary text-xs flex items-center gap-1 hover:underline"
                >
                  ⚡ {isIOS ? "Cara Install" : "Install"}
                </button>
                <button
                  onClick={handleDismissPwa}
                  className="cursor-pointer text-slate-400 hover:text-slate-600 p-0.5"
                  aria-label="Tutup banner"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <MerchandisingBanner
        imageSrc="/img/banner-merchandising.png"
        altText="Promo Spesial SplitBill Premium — Nikmati fitur eksklusif sekarang"
      />

      <main className="w-full max-w-[600px] lg:max-w-7xl mx-auto px-4 pt-4 lg:pt-12 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-14 items-start">

          {/* Left Side: Activity Content (Activity Pane) */}
          <div className="lg:col-span-7 space-y-6 lg:space-y-10">

            {hasHistory ? (
              <section className="space-y-4">
                <FeatureHighlights heroMode />
              </section>
            ) : (
              <section className="space-y-4">
                <SplitBillHeroCard />
              </section>
            )}

            {hasActiveBill ? (
              <section className="space-y-4">
                <div className="flex flex-col items-start px-1">
                  <div className="space-y-1">
                    <h2 className="text-xl font-extrabold text-foreground tracking-tight">
                      Tagihan On-Going 🔥
                    </h2>
                    <p className="text-sm text-muted-foreground font-medium">
                      Lanjutin split bill kemarin biar sirkel tetep aman no-drama.
                    </p>
                  </div>
                </div>
                <OngoingSplitBillCard />
              </section>
            ) : (
              <section className="space-y-4">
                <AIScanEncourageBanner />
              </section>
            )}

            <section className="space-y-4">
              <ReviewRewardBanner />
            </section>

            <section className="space-y-4">
              <ShareEncouragement isCompact />
            </section>
          </div>

          {/* Right Side: System Content (System Pane) */}
          <div className="lg:col-span-5 space-y-6 lg:space-y-10">
            <section className="space-y-4">
              <div className="flex flex-col items-start px-1 hidden lg:block">
                <div className="space-y-1">
                  <h2 className="text-xl font-extrabold text-foreground tracking-tight">
                    Menu Fitur
                  </h2>
                  <p className="text-sm text-muted-foreground font-medium">
                    Akses cepat ke berbagai fitur utama SplitBill Online.
                  </p>
                </div>
              </div>
              <div className="w-full">
                <NavigationMenu variant="grid" />
              </div>
            </section>

            {!hasHistory && (
              <section className="space-y-4">
                <VisualFlowPreview />
              </section>
            )}

            {!hasHistory && (
              <section className="space-y-4">
                <FeatureHighlights />
              </section>
            )}

            <section className="space-y-4">
              <div className="flex flex-col items-start px-1">
                <div className="space-y-1">
                  <h2 className="text-xl font-extrabold text-foreground tracking-tight">
                    Mulai Sat Set ⚡
                  </h2>
                  <p className="text-sm text-muted-foreground font-medium">
                    Biar acara nongkrong no-drama, cobain navigasi gampang ini.
                  </p>
                </div>
              </div>
              <MemberGettingStarted />
            </section>

            <section className="space-y-4">
              <LatestBlogSlider />
            </section>

            <section className="space-y-2">
              <FAQCard compact />
            </section>
          </div>
        </div>
      </main>

      {/* Footer Navbar for Mobile */}
      <Footer />

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[150px]" />
      </div>
    </div>
  );
}
