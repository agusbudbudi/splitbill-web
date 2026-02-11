"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Banner } from "@/components/home/Banner";
import { NavigationMenu } from "@/components/home/NavigationMenu";
import { AIScanBanner } from "@/components/home/AIScanBanner";
import { GettingStarted } from "@/components/home/GettingStarted";
import { FeatureHighlights } from "@/components/home/FeatureHighlights";
import { FloatingBadge } from "@/components/ui/FloatingBadge";
import { OngoingSplitBillCard } from "@/components/home/OngoingSplitBillCard";
import { LoginEncouragementCard } from "@/components/home/LoginEncouragementCard";
import { useSplitBillStore } from "@/store/useSplitBillStore";
import { useWalletStore } from "@/store/useWalletStore";
import { cn } from "@/lib/utils";
import { MerchandisingBanner } from "@/components/ui/MerchandisingBanner";
import { useAuthStore } from "@/lib/stores/authStore";
import { QuickStartScenarios } from "@/components/home/QuickStartScenarios";
import { TrustHighlights } from "@/components/home/TrustHighlights";
import { FAQSection } from "@/components/home/FAQSection";
import { FAQCard } from "@/components/home/FAQCard";
import { AdsCarousel } from "@/components/home/AdsCarousel";
import { VisualFlowPreview } from "@/components/home/VisualFlowPreview";

const BackgroundDecoration = () => (
  <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
    <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[150px]" />
  </div>
);

export default function Home() {
  const { isAuthenticated } = useAuthStore();
  const expenses = useSplitBillStore((state) => state.expenses);
  const people = useSplitBillStore((state) => state.people);
  const [isMounted, setIsMounted] = useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center relative">
      <BackgroundDecoration />
      <MerchandisingBanner imageSrc="/img/banner-merchandising.png" />
      <Header transparent />

      <main className="w-full max-w-[480px] pb-24 relative z-10 -mt-14">
        {/* Hero Section */}
        <div className="w-full">
          <Banner />
        </div>

        <div className="px-4 pt-4 space-y-4">
          <div>
            <NavigationMenu />
          </div>

          {isMounted && <OngoingSplitBillCard />}

          {isMounted && !isAuthenticated && (
            <div>
              <LoginEncouragementCard />
            </div>
          )}

          <div>
            <GettingStarted />
          </div>

          <div>
            <AIScanBanner />
          </div>

          <div>
            <QuickStartScenarios />
          </div>

          {/* Dashboard Section */}
          {isMounted && isAuthenticated && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <h2 className="text-sm font-bold text-foreground/70">
                  Progress Kamu 🙌
                </h2>
              </div>
              <FeatureHighlights />
            </section>
          )}

          <VisualFlowPreview />
          <AdsCarousel />
          {isMounted && isAuthenticated ? <FAQCard /> : <FAQSection />}
          {isMounted && !isAuthenticated && <TrustHighlights />}
        </div>
      </main>

      <Footer />
    </div>
  );
}
