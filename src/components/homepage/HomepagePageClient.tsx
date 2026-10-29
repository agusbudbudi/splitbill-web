"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { HomepageNavbar } from "./HomepageNavbar";
import { HeroExperimentSection } from "./HeroExperimentSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { PromoBanner } from "../ui/PromoBanner";
import { Banner } from "../home/Banner";
import { HomepageFooter } from "./HomepageFooter";
import { FeatureShowcaseSection } from "./FeatureShowcaseSection";
// Below-the-fold sections are imported statically: they're SSR'd anyway, and a
// next/dynamic wrapper emits a Suspense boundary whose reveal WebKit delays until
// window `load`, leaving a skeleton in place of real content on iPhones.
import { TestimonialsSection } from "./TestimonialsSection";
import { FAQSectionHomepage } from "./FAQSectionHomepage";
import { BlogSectionHomepage } from "./BlogSectionHomepage";
import { useAuthStore } from "@/lib/stores/authStore";
import { LazyMount } from "@/components/ui/LazyMount";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Blog } from "@/lib/types/blog";
import type { Review } from "@/hooks/useReview";
import type { LandingSectionKey } from "@/lib/landing/types";
import type { HomepageClientContent, StaticSections } from "./staticSections";
import { getPromoTone } from "@/lib/landing/tones";
import type { FAQItem } from "@/data/faqData";
import { LandingTitle } from "./LandingTitle";
import { useIsHydrated } from "@/hooks/useClientOnly";

// Local skeleton fallback so the lazy chunk's own <Suspense> resolves in place
// instead of suspending to the nearest Suspense boundary.
const sectionSkeleton = (height: number) => {
  const SectionSkeleton = () => <Skeleton className="w-full" style={{ height }} />;
  return SectionSkeleton;
};

// Pricing is hidden for now; the promo slider only renders after mount (per-visitor quota).
const PricingSection = dynamic(
  () => import("./PricingSection").then((mod) => mod.PricingSection),
  { ssr: true, loading: sectionSkeleton(500) }
);
const HomepagePromoSlider = dynamic(
  () => import("./HomepagePromoSlider").then((mod) => mod.HomepagePromoSlider),
  { ssr: true, loading: sectionSkeleton(320) }
);
// loading: () => null — no fallback UI needed, but required so next/dynamic wraps
// its own local Suspense instead of suspending to a parent boundary.
const ChatAgentFAB = dynamic(
  () => import("@/components/splitbill/chat/ChatAgentFAB").then((mod) => mod.ChatAgentFAB),
  { ssr: false, loading: () => null }
);
const ChatRoom = dynamic(
  () => import("@/components/splitbill/chat/ChatRoom").then((mod) => mod.ChatRoom),
  { ssr: false, loading: () => null }
);

// Sections rendered without content-visibility. FeatureShowcaseSection pins
// content with position: sticky, which the paint containment would clip.
const PAINT_EAGER_SECTIONS = new Set<LandingSectionKey>(["featureShowcase"]);

interface HomepagePageClientProps {
  /** CMS-managed copy (already merged with defaults by getLandingContent). */
  content: HomepageClientContent;
  /** FAQs flagged showOnLanding (CMS, or static fallback). */
  faqs: FAQItem[];
  initialReviews?: Review[];
  initialBlogs?: Blog[];
  /** Sections with no client state (see staticSections.tsx), rendered by the caller. */
  staticSections: StaticSections;
}

export const HomepagePageClient = ({ content, faqs, initialReviews, initialBlogs, staticSections }: HomepagePageClientProps) => {
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
    if (key in staticSections) return staticSections[key];
    switch (key) {
      case "promoSlider":
        // AI Scan card reads per-visitor quota, so the slider renders client-side only
        return isMounted ? <HomepagePromoSlider content={content.promoSlider} /> : null;
      case "featureShowcase":
        return <FeatureShowcaseSection content={content.featureShowcase} items={content.features.items} />;
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
            PAINT_EAGER_SECTIONS.has(section.key) ? (
              <React.Fragment key={section.key}>{renderSection(section.key)}</React.Fragment>
            ) : (
              // Off-screen sections skip layout/paint until they near the viewport,
              // so slower phones spend first-load time on the hero. `auto` in the
              // intrinsic size remembers each section's real height once rendered.
              <div key={section.key} className="[content-visibility:auto] [contain-intrinsic-size:auto_600px]">
                {renderSection(section.key)}
              </div>
            )
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

