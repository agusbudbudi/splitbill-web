"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { HomepageNavbar } from "./HomepageNavbar";
// Old HeroSection is no longer rendered but kept (it still hosts ScanFlow) until the new hero is final
import { HeroExperimentSection } from "./HeroExperimentSection";
import { SocialProofBar } from "./SocialProofBar";
import { FeaturesSection } from "./FeaturesSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { PromoBanner } from "../ui/PromoBanner";
import { Banner } from "../home/Banner";
import { HomepageFooter } from "./HomepageFooter";
import { SeoContentSection } from "./SeoContentSection";
import { FeatureShowcaseSection } from "./FeatureShowcaseSection";
import { useAuthStore } from "@/lib/stores/authStore";
import { LazyMount } from "@/components/ui/LazyMount";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Blog } from "@/lib/types/blog";
import type { Review } from "@/hooks/useReview";
import type { LandingContent, LandingSectionKey } from "@/lib/landing/types";
import { getPromoTone } from "@/lib/landing/tones";
import type { FAQItem } from "@/data/faqData";
import { LandingTitle } from "./LandingTitle";
import { useIsHydrated } from "@/hooks/useClientOnly";

// Local skeleton fallback so the lazy chunk's own <Suspense> resolves in place —
// without a `loading` option, next/dynamic suspends to the nearest Suspense
// boundary, which is the root app/loading.tsx, blanking the whole page instead
// of just this section.
const sectionSkeleton = (height: number) => {
  const SectionSkeleton = () => <Skeleton className="w-full" style={{ height }} />;
  return SectionSkeleton;
};

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

interface HomepagePageClientProps {
  /** CMS-managed copy (already merged with defaults by getLandingContent). */
  content: LandingContent;
  /** FAQs flagged showOnLanding (CMS, or static fallback). */
  faqs: FAQItem[];
  initialReviews?: Review[];
  initialBlogs?: Blog[];
  /** Server-rendered use-case copy, shown below the feature cards. */
  useCasesSection?: React.ReactNode;
}

export const HomepagePageClient = ({ content, faqs, initialReviews, initialBlogs, useCasesSection }: HomepagePageClientProps) => {
  const { isAuthenticated } = useAuthStore();
  const isMounted = useIsHydrated();
  const [isChatReady, setIsChatReady] = useState(false);

  useEffect(() => {
    // Chat widget isn't needed for first paint — load it once the browser is idle
    // instead of racing the hero's own hydration/animation work.
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(() => setIsChatReady(true), { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(() => setIsChatReady(true), 2000);
    return () => clearTimeout(t);
  }, []);

  const renderSection = (key: LandingSectionKey): React.ReactNode => {
    switch (key) {
      case "socialProof":
        return <SocialProofBar content={content.socialProof} />;
      case "promoSlider":
        // AI Scan card reads per-visitor quota, so the slider renders client-side only
        return isMounted ? <HomepagePromoSlider content={content.promoSlider} /> : null;
      case "featureShowcase":
        return <FeatureShowcaseSection content={content.featureShowcase} items={content.features.items} />;
      case "features":
        return <FeaturesSection content={content.features} />;
      case "useCases":
        return useCasesSection;
      case "howItWorks":
        return <HowItWorksSection content={content.howItWorks} />;
      case "promoBanner": {
        const banner = content.promoBanner;
        const tone = getPromoTone(banner.tone);
        return (
          <section data-landing-section="promoBanner" className="bg-white py-12 sm:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <PromoBanner
                landing
                href={banner.href}
                image={banner.image.url}
                imageAlt={banner.image.alt}
                titleText={banner.titleText}
                titleHighlight={banner.titleHighlight}
                description={banner.description}
                ctaText={banner.ctaLabel}
                bgColorClass={tone.bannerBg}
                gradientToClass={tone.bannerGradientTo}
                ctaTextColorClass={tone.bannerText}
              />
            </div>
          </section>
        );
      }
      case "marketingBanner":
        // Content managed in the admin's Banners menu
        return (
          <section data-landing-section="marketingBanner" className="bg-white py-12 sm:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <LazyMount minHeight={0}>
                <Banner />
              </LazyMount>
            </div>
          </section>
        );
      case "comparison":
        return <ComparisonSection content={content.comparison} />;
      case "testimonials":
        return <TestimonialsSection header={content.testimonials} variant="white" initialReviews={initialReviews} />;
      case "blog":
        return <BlogSectionHomepage header={content.blog} initialBlogs={initialBlogs} />;
      case "faq":
        return (
          <FAQSectionHomepage
            faqs={faqs}
            title={<LandingTitle title={content.faq.title} highlight={content.faq.titleHighlight} />}
            subtitle={content.faq.subtitle}
            defaultOpenFirst
          />
        );
      case "seoContent":
        return <SeoContentSection content={content.seoContent} />;
      case "ctaBanner":
        return <CTABannerSection content={content.ctaBanner} />;
      default:
        return null;
    }
  };

  // overflow-x-clip, not -hidden: hidden makes this div a scroll container,
  // which breaks position: sticky inside it (FeatureShowcaseSection pinning).
  return (
    <div className="relative min-h-screen bg-[#f8f9fd] overflow-x-clip selection:bg-primary selection:text-white">
      {/* Structured data — HowTo, mirrors the visible HowItWorksSection steps */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "Cara Split Bill Online dengan Scan Struk AI",
            description:
              "3 langkah membagi tagihan secara online menggunakan AI Scan di SplitBill",
            step: content.howItWorks.steps.map((step, index) => ({
              "@type": "HowToStep",
              position: index + 1,
              name: step.title,
              text: step.description,
            })),
          }),
        }}
      />

      {/* Header/Navbar */}
      <HomepageNavbar />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <HeroExperimentSection content={content.hero} />

        {/* Everything below the hero, in the CMS layout's order. Comparison,
            Testimonials, Blog, FAQ and CTA stay eager (not lazy-mounted) so their
            headings/copy/schema land in the initial SSR HTML instead of being gated
            behind client JS + IntersectionObserver, which crawlers may never run.
            Pricing is hidden for now — component kept, just not rendered. */}
        {content.layout.sections
          .filter((section) => section.visible)
          .map((section) => (
            <React.Fragment key={section.key}>{renderSection(section.key)}</React.Fragment>
          ))}
      </main>

      {/* Site Footer */}
      <HomepageFooter />

      {/* Chat Agent FAB — deferred to idle, not needed for first paint */}
      {isChatReady && <ChatAgentFAB bottomClass="bottom-6" />}
      {isChatReady && <ChatRoom />}
    </div>
  );
};

