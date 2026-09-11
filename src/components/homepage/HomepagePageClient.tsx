"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { HomepageNavbar } from "./HomepageNavbar";
import { HeroSection } from "./HeroSection";
import { SocialProofBar } from "./SocialProofBar";
import { FeaturesSection } from "./FeaturesSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { PromoBanner } from "../ui/PromoBanner";
import { Banner } from "../home/Banner";
import { HomepageFooter } from "./HomepageFooter";
import { useAuthStore } from "@/lib/stores/authStore";
import { LazyMount } from "@/components/ui/LazyMount";
import { Skeleton } from "@/components/ui/Skeleton";

// Local skeleton fallback so the lazy chunk's own <Suspense> resolves in place —
// without a `loading` option, next/dynamic suspends to the nearest Suspense
// boundary, which is the root app/loading.tsx, blanking the whole page instead
// of just this section.
const sectionSkeleton = (height: number) => () => (
  <Skeleton className="w-full" style={{ height }} />
);

// Dynamically import below-the-fold and heavy components
const TestimonialsSection = dynamic(
  () => import("./TestimonialsSection").then((mod) => mod.TestimonialsSection),
  { ssr: true, loading: sectionSkeleton(500) }
);
const ComparisonSection = dynamic(
  () => import("./ComparisonSection").then((mod) => mod.ComparisonSection),
  { ssr: true, loading: sectionSkeleton(500) }
);
const PricingSection = dynamic(
  () => import("./PricingSection").then((mod) => mod.PricingSection),
  { ssr: true, loading: sectionSkeleton(500) }
);
const FAQSectionHomepage = dynamic(
  () => import("./FAQSectionHomepage").then((mod) => mod.FAQSectionHomepage),
  { ssr: true, loading: sectionSkeleton(400) }
);
const BlogSectionHomepage = dynamic(
  () => import("./BlogSectionHomepage").then((mod) => mod.BlogSectionHomepage),
  { ssr: true, loading: sectionSkeleton(400) }
);
const CTABannerSection = dynamic(
  () => import("./CTABannerSection").then((mod) => mod.CTABannerSection),
  { ssr: true, loading: sectionSkeleton(200) }
);
const HomepagePromoSlider = dynamic(
  () => import("./HomepagePromoSlider").then((mod) => mod.HomepagePromoSlider),
  { ssr: true, loading: sectionSkeleton(320) }
);
// loading: () => null — no fallback UI needed, but required so next/dynamic wraps
// its own local Suspense instead of suspending to the root app/loading.tsx and
// blanking the whole page while the chunk fetches (same bug as HomepagePromoSlider).
const ChatAgentFAB = dynamic(
  () => import("@/components/splitbill/chat/ChatAgentFAB").then((mod) => mod.ChatAgentFAB),
  { ssr: false, loading: () => null }
);
const ChatRoom = dynamic(
  () => import("@/components/splitbill/chat/ChatRoom").then((mod) => mod.ChatRoom),
  { ssr: false, loading: () => null }
);

export const HomepagePageClient = () => {
  const { isAuthenticated } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);
  const [isChatReady, setIsChatReady] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Chat widget isn't needed for first paint — load it once the browser is idle
    // instead of racing the hero's own hydration/animation work.
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(() => setIsChatReady(true), { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(() => setIsChatReady(true), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#f8f9fd] overflow-x-hidden selection:bg-primary selection:text-white">
      {/* Keyword-rich blurb for crawlers/screen readers — kept as <p>, not <h1>,
          since HeroSection already renders the page's one real H1. */}
      <p className="sr-only">
        Split Bill Online Gratis — Scan Struk & Bagi Tagihan Instan
      </p>

      {/* Structured data — HowTo */}
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

      {/* Header/Navbar */}
      <HomepageNavbar />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Social Proof Stripe */}
        <SocialProofBar />

        {/* AI Scan Banner / Login Encouragement Slider */}
        {isMounted && <HomepagePromoSlider />}

        {/* Features Bento Grid */}
        <FeaturesSection />

        {/* How It Works Steps */}
        <HowItWorksSection />

        {/* Promo Banner */}
        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <PromoBanner />
          </div>
        </section>

        {/* Marketing Banner */}
        <section className="bg-white pt-2 sm:pt-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <LazyMount minHeight={0}>
              <Banner />
            </LazyMount>
          </div>
        </section>

        {/* Comparison, Testimonials, Pricing, Blog, FAQ, CTA — kept eager (not lazy-mounted)
            so their headings/copy/schema land in the initial SSR HTML instead of being
            gated behind client JS + IntersectionObserver, which crawlers may never run. */}
        <br className="hidden" />
        <ComparisonSection />

        <TestimonialsSection />

        {/* Pricing hidden for now — keep component, just not rendered */}
        {/* <PricingSection /> */}

        <BlogSectionHomepage />

        <FAQSectionHomepage defaultOpenFirst />

        <CTABannerSection />
      </main>

      {/* Site Footer */}
      <HomepageFooter />

      {/* Chat Agent FAB — deferred to idle, not needed for first paint */}
      {isChatReady && <ChatAgentFAB bottomClass="bottom-6" />}
      {isChatReady && <ChatRoom />}
    </div>
  );
};

