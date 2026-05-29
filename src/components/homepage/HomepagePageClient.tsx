"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { HomepageNavbar } from "./HomepageNavbar";
import { HeroSection } from "./HeroSection";
import { SocialProofBar } from "./SocialProofBar";
import { FeaturesSection } from "./FeaturesSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { ShareEncouragement } from "../home/ShareEncouragement";
import { Banner } from "../home/Banner";
import { HomepageFooter } from "./HomepageFooter";
import { useAuthStore } from "@/lib/stores/authStore";

// Dynamically import below-the-fold and heavy components
const TestimonialsSection = dynamic(
  () => import("./TestimonialsSection").then((mod) => mod.TestimonialsSection),
  { ssr: true }
);
const ComparisonSection = dynamic(
  () => import("./ComparisonSection").then((mod) => mod.ComparisonSection),
  { ssr: true }
);
const PricingSection = dynamic(
  () => import("./PricingSection").then((mod) => mod.PricingSection),
  { ssr: true }
);
const FAQSectionHomepage = dynamic(
  () => import("./FAQSectionHomepage").then((mod) => mod.FAQSectionHomepage),
  { ssr: true }
);
const BlogSectionHomepage = dynamic(
  () => import("./BlogSectionHomepage").then((mod) => mod.BlogSectionHomepage),
  { ssr: true }
);
const CTABannerSection = dynamic(
  () => import("./CTABannerSection").then((mod) => mod.CTABannerSection),
  { ssr: true }
);
const HomepagePromoSlider = dynamic(
  () => import("./HomepagePromoSlider").then((mod) => mod.HomepagePromoSlider),
  { ssr: true }
);

export const HomepagePageClient = () => {
  const { isAuthenticated } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#f8f9fd] overflow-x-hidden selection:bg-primary selection:text-white">
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

        {/* Encouragement Banner */}
        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ShareEncouragement />
          </div>
        </section>

        {/* Marketing Banner */}
        <section className="bg-white pt-2 sm:pt-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Banner />
          </div>
        </section>

        {/* Comparison Section */}
        <br className="hidden" />
        <ComparisonSection />

        {/* Testimonials Masonry */}
        <TestimonialsSection />

        {/* Pricing/Membership Tiers */}
        <PricingSection />

        {/* Blog Section */}
        <BlogSectionHomepage />

        {/* FAQ Section */}
        <FAQSectionHomepage />

        {/* Final CTA Banner */}
        <CTABannerSection />
      </main>

      {/* Site Footer */}
      <HomepageFooter />
    </div>
  );
};

