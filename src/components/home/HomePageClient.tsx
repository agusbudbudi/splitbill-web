"use client";

/**
 * HomePageClient — Client Component
 *
 * Contains all homepage UI logic (auth state, isMounted checks, interactive
 * components). Imported by the Server Component page.tsx so that:
 *   1. page.tsx can export metadata (Server Components only)
 *   2. SEO-critical components (FAQSection, VisualFlowPreview, etc.) are
 *      no longer blocked by `ssr: false` and will appear in the initial
 *      HTML response that Googlebot indexes.
 *
 * Components that KEEP ssr:false → truly client-only (auth state, native APIs,
 * API fetches on mount).
 * Components WITHOUT ssr:false → rendered on server AND hydrated on client.
 */

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
import { useRouter } from "next/navigation";
import { Sparkles, Camera, Check } from "lucide-react";
import { HeroBanner } from "@/components/ui/HeroBanner";

// ── SSR-ENABLED (no ssr:false) ─────────────────────────────────────────────
// These render in the initial HTML response → Googlebot indexes them.
import { GettingStarted } from "@/components/home/GettingStarted";
import { AIScanBanner } from "@/components/home/AIScanBanner";
import { IntroSection } from "@/components/home/IntroSection";
import { VisualFlowPreview } from "@/components/home/VisualFlowPreview";
import { ShareEncouragement } from "@/components/home/ShareEncouragement";
import { FAQSection } from "@/components/home/FAQSection";
import { TrustHighlights } from "@/components/home/TrustHighlights";
import { BlogLatestSlider } from "@/components/home/BlogLatestSlider";
import { SiteFooter } from "@/components/layout/SiteFooter";

// ── CLIENT-ONLY (keep ssr:false) ───────────────────────────────────────────
// These genuinely need the browser environment or auth state.
const AIScanEncourageBanner = dynamic(
  () =>
    import("@/components/home/AIScanEncourageBanner").then(
      (mod) => mod.AIScanEncourageBanner,
    ),
  { ssr: false },
);
import { AdsCarousel } from "@/components/home/AdsCarousel";
import { FAQCard } from "@/components/home/FAQCard";
const TrustHighlightsClient = dynamic(
  () =>
    import("@/components/home/TrustHighlights").then(
      (mod) => mod.TrustHighlights,
    ),
  { ssr: false },
);
const FeatureHighlights = dynamic(
  () =>
    import("@/components/home/FeatureHighlights").then(
      (mod) => mod.FeatureHighlights,
    ),
  { ssr: false },
);
const LoginEncouragementCard = dynamic(
  () =>
    import("@/components/home/LoginEncouragementCard").then(
      (mod) => mod.LoginEncouragementCard,
    ),
  { ssr: false },
);
const TestimonialSlider = dynamic(
  () =>
    import("@/components/home/TestimonialSlider").then(
      (mod) => mod.TestimonialSlider,
    ),
  { ssr: false },
);
const ReviewRewardBanner = dynamic(
  () =>
    import("@/components/home/ReviewRewardBanner").then(
      (mod) => mod.ReviewRewardBanner,
    ),
  { ssr: false },
);

const BackgroundDecoration = () => (
  <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
    <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[150px]" />
  </div>
);

const HeroFloatingCard = () => (
  <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-3.5 border border-slate-100/60 min-w-[150px]">
    <p className="text-[10px] text-slate-500 font-medium mb-0.5">
      Total Tagihan
    </p>
    <p className="text-[15px] font-black text-slate-900 mb-3 tracking-tight">
      Rp 842.500
    </p>

    <div className="w-full h-px bg-slate-100 mb-3" />

    <p className="text-[10px] text-slate-500 font-medium mb-0.5">
      Dibagi ke 4 orang
    </p>
    <p className="text-[13px] font-black text-slate-900 mb-3 tracking-tight">
      Rp 210.625{" "}
      <span className="text-[10px] text-slate-400 font-medium ml-0.5">
        / orang
      </span>
    </p>

    <div className="flex items-center justify-between mt-1">
      <div className="flex -space-x-1.5">
        {["Budi", "Siti", "Andi"].map((name, i) => (
          <div
            key={i}
            className="w-[22px] h-[22px] rounded-full border-[1.5px] border-white overflow-hidden bg-slate-100 shadow-sm"
          >
            <img
              src={`https://api.dicebear.com/9.x/personas/png?backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&seed=${name}`}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      <div className="w-5 h-5 rounded-full bg-[#10B981] text-white flex items-center justify-center shadow-sm">
        <Check className="w-3 h-3" strokeWidth={3.5} />
      </div>
    </div>
  </div>
);

export const HomePageClient = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const expenses = useSplitBillStore((state) => state.expenses);
  const people = useSplitBillStore((state) => state.people);
  const { savedBills, fetchBills } = useWalletStore();
  const [isMounted, setIsMounted] = useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    if (isMounted && isAuthenticated) {
      fetchBills();
    }
  }, [isMounted, isAuthenticated, fetchBills]);

  return (
    <div className="min-h-dvh bg-background flex flex-col items-center relative">
      {/* H1 – screen-reader accessible, visible to crawlers */}
      <h1 className="sr-only">
        Split Bill Online Gratis — Scan Struk & Bagi Tagihan Instan
      </h1>

      {/* Structured data — WebApplication + AggregateRating + HowTo */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "SplitBill Online",
            url: "https://splitbill.my.id",
            description:
              "Split bill online gratis sat set! Scan struk otomatis, hitung pajak, dan bagi tagihan no drama bareng teman. 100% free, praktis & akurat.",
            applicationCategory: "FinanceApplication",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: "0", priceCurrency: "IDR" },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.9",
              reviewCount: "200",
              bestRating: "5",
            },
            author: { "@type": "Organization", name: "SplitBill Team" },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "Cara Split Bill Online dengan Scan Struk AI",
            description:
              "Panduan lengkap cara membagi tagihan secara online menggunakan AI Scan di SplitBill.my.id",
            step: [
              {
                "@type": "HowToStep",
                position: 1,
                name: "Tambah Teman",
                text: "Tambahkan nama teman-teman yang ikut patungan ke dalam daftar.",
              },
              {
                "@type": "HowToStep",
                position: 2,
                name: "Foto atau Upload Struk",
                text: "Upload foto struk belanja. AI otomatis membaca dan menghitung total tagihan per item.",
              },
              {
                "@type": "HowToStep",
                position: 3,
                name: "Share Hasil ke WhatsApp",
                text: "Bagikan hasil split bill lengkap dengan rincian siapa bayar berapa langsung ke grup WhatsApp.",
              },
            ],
          }),
        }}
      />

      {isMounted && isAuthenticated && (
        <MerchandisingBanner
          imageSrc="/img/banner-merchandising.png"
          altText="Promo Spesial SplitBill Premium — Nikmati fitur eksklusif sekarang"
        />
      )}
      <Header transparent />

      <main className="w-full max-w-[600px] relative z-10 -mt-14">
        <div className={cn("w-full", isMounted && isAuthenticated ? "hidden" : "")}>
          <Banner />
        </div>

        {isMounted && isAuthenticated && (
          <div className="w-full">
            <HeroBanner
              variant="primary-gradient"
              className="pt-[64px] pb-4 sm:pt-16 sm:pb-5 rounded-none border-x-0 border-t-0 sm:rounded-b-[24px] sm:rounded-t-none sm:border-x w-full"
              badgeText="Scan Struk Otomatis"
              badgeIcon={<Sparkles className="w-3 h-3 text-amber-300 fill-amber-300" />}
              title={
                <>
                  Split Bill <br />
                  <span className="text-amber-300 font-extrabold">Tanpa Ribet</span>
                </>
              }
              description="Tinggal foto struk, biar AI yang urus hitungannya. Langsung Beres!"
              primaryButtonText="Mulai Scan"
              primaryButtonIcon={<Camera className="w-5 h-5" />}
              onPrimaryClick={() => router.push("/split-bill?step=1")}
              imageSrc="/img/hero-splitbill.png"
              floatingCard={<HeroFloatingCard />}
              trustText="Andalan ribuan grup & trip! 🔥"
            />
          </div>
        )}

        <div className="px-4 pt-4 space-y-4 pb-6">
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

          <div className={cn(isMounted && savedBills.length >= 1 ? "hidden" : "")}>
            <VisualFlowPreview />
          </div>

          {/* ── SEO CONTENT — server-rendered ─────────────────────────── */}
          <div>
            <GettingStarted />
          </div>

          <div>
            <AIScanBanner />
          </div>

          {/* IntroSection: server-rendered for SEO; hidden via CSS after
              hydration when user is authenticated (no layout shift) */}
          <div className={cn(isMounted && isAuthenticated ? "hidden" : "")}>
            <IntroSection />
          </div>

          {isMounted && <ReviewRewardBanner />}

          {/* Dashboard Section */}
          {isMounted && isAuthenticated && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <h2 className="text-md font-bold text-foreground">
                  Progress Kamu 🙌
                </h2>
              </div>
              <FeatureHighlights />
            </section>
          )}

          {/* <VisualFlowPreview /> */}
          {/* New homepage hidden */}

          {isMounted && !isAuthenticated && (
            <div className="pt-2">
              <TestimonialSlider />
            </div>
          )}

          {/* <AdsCarousel />
          new homepage hidden */}

          <ShareEncouragement />

          <BlogLatestSlider />

          {/* FAQ: always SSR'd for Googlebot; swap to FAQCard for auth users */}
          {isMounted && isAuthenticated ? <FAQCard /> : <FAQSection />}

          {/* TrustHighlights: SSR'd version for Googlebot; hidden when
              authenticated via conditional rendering */}
          {!isMounted && <TrustHighlights />}
          {isMounted && !isAuthenticated && <TrustHighlightsClient />}
        </div>

        {/* Site footer with nav links – SSR'd for crawlers */}
        {!isMounted && <SiteFooter />}
        {isMounted && !isAuthenticated && <SiteFooter />}
      </main>

      <Footer />
      <BackgroundDecoration />
    </div>
  );
};
