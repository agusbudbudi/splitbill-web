"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Banner } from "@/components/home/Banner";
import { NavigationMenu } from "@/components/home/NavigationMenu";
import { FloatingBadge } from "@/components/ui/FloatingBadge";
import { OngoingSplitBillCard } from "@/components/home/OngoingSplitBillCard";
import { useSplitBillStore } from "@/store/useSplitBillStore";
import { useWalletStore } from "@/store/useWalletStore";
import { cn } from "@/lib/utils";
import { MerchandisingBanner } from "@/components/ui/MerchandisingBanner";
import { useAuthStore } from "@/lib/stores/authStore";
import dynamic from "next/dynamic";

// Dynamic imports for below-the-fold components
const GettingStarted = dynamic(() => import("@/components/home/GettingStarted").then(mod => mod.GettingStarted));
const AIScanBanner = dynamic(() => import("@/components/home/AIScanBanner").then(mod => mod.AIScanBanner));
const AIScanEncourageBanner = dynamic(() => import("@/components/home/AIScanEncourageBanner").then(mod => mod.AIScanEncourageBanner));
const IntroSection = dynamic(() => import("@/components/home/IntroSection").then(mod => mod.IntroSection));
const QuickStartScenarios = dynamic(() => import("@/components/home/QuickStartScenarios").then(mod => mod.QuickStartScenarios));
const VisualFlowPreview = dynamic(() => import("@/components/home/VisualFlowPreview").then(mod => mod.VisualFlowPreview));
const ShareEncouragement = dynamic(() => import("@/components/home/ShareEncouragement").then(mod => mod.ShareEncouragement));
const AdsCarousel = dynamic(() => import("@/components/home/AdsCarousel").then(mod => mod.AdsCarousel));
const FAQSection = dynamic(() => import("@/components/home/FAQSection").then(mod => mod.FAQSection));
const FAQCard = dynamic(() => import("@/components/home/FAQCard").then(mod => mod.FAQCard));
const TrustHighlights = dynamic(() => import("@/components/home/TrustHighlights").then(mod => mod.TrustHighlights));
const SiteFooter = dynamic(() => import("@/components/layout/SiteFooter").then(mod => mod.SiteFooter));
const FeatureHighlights = dynamic(() => import("@/components/home/FeatureHighlights").then(mod => mod.FeatureHighlights));
const LoginEncouragementCard = dynamic(() => import("@/components/home/LoginEncouragementCard").then(mod => mod.LoginEncouragementCard));

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
      {/* Search Engine Optimization */}
      <h1 className="sr-only">
        Split Bill Online - Aplikasi Bagi Tagihan Gratis dengan Scan Struk
      </h1>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "SplitBill Online",
            url: "https://splitbill.my.id",
            description:
              "Split bill online gratis! Scan struk, hitung pajak otomatis, dan bagi tagihan praktis bareng teman. Aplikasi patungan terbaik yang 100% free, cepat & akurat.",
            applicationCategory: "FinanceApplication",
            operatingSystem: "Web",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "IDR",
            },
            author: {
              "@type": "Organization",
              name: "SplitBill Team",
            },
          }),
        }}
      />
      <BackgroundDecoration />
      {isMounted && isAuthenticated && (
        <MerchandisingBanner imageSrc="/img/banner-merchandising.png" />
      )}
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

          {isMounted && people.length === 0 && (
            <div>
              <AIScanEncourageBanner />
            </div>
          )}


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

          {isMounted && !isAuthenticated && (
            <div>
              <IntroSection />
            </div>
          )}

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
          <ShareEncouragement />
          <AdsCarousel />
          {isMounted && isAuthenticated ? <FAQCard /> : <FAQSection />}
          {isMounted && !isAuthenticated && <TrustHighlights />}
        </div>
        
        {isMounted && !isAuthenticated && <SiteFooter />}
      </main>

      <Footer />
    </div>
  );
}
