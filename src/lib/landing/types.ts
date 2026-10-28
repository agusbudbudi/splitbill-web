// Shape of the CMS-managed homepage content served by splitbill-be
// (GET /api/landing-page). Field rules live in splitbill-be lib/landingPage.js.

/** Homepage sections below the hero, reorderable/hideable from the CMS. */
export type LandingSectionKey =
  | "socialProof"
  | "promoSlider"
  | "featureShowcase"
  | "features"
  | "useCases"
  | "howItWorks"
  | "promoBanner"
  | "marketingBanner"
  | "comparison"
  | "testimonials"
  | "blog"
  | "seoContent"
  | "faq"
  | "ctaBanner";

export type LandingTone = "primary" | "blue" | "amber" | "emerald" | "green" | "rose" | "violet" | "purple";

export interface LandingImage {
  url: string;
  alt: string;
  width?: number | null;
  height?: number | null;
}

export interface LandingCta {
  label: string;
  href: string;
  icon?: string;
}

/** Section heading: title + gradient highlight + subtitle (subtitle may contain **bold** marks). */
export interface LandingHeader {
  title: string;
  titleHighlight: string;
  subtitle: string;
}

export interface LandingContent {
  seo: {
    title: string;
    description: string;
    /** Share-preview overrides; empty = reuse title/description */
    socialTitle: string;
    socialDescription: string;
    /** 1200×630 Open Graph / Twitter image */
    ogImage: LandingImage;
    /** Official social profile URLs for the Organization structured data */
    sameAs: string[];
  };
  hero: {
    eyebrow: { text: string; badge: string };
    title: string;
    titleHighlight: string;
    description: string;
    primaryCta: LandingCta;
    secondaryCta: LandingCta;
    trustItems: { icon: string; text: string; tone: LandingTone }[];
    image: LandingImage;
    /** Optional phone-only image (alt shared with `image`); null = phones use `image` */
    imageMobile?: LandingImage | null;
  };
  socialProof: {
    items: { icon: string; title: string; desc: string; tone: LandingTone }[];
  };
  howItWorks: {
    title: string;
    titleHighlight: string;
    subtitle: string;
    steps: { icon: string; title: string; description: string; image: LandingImage; tone: LandingTone }[];
  };
  features: LandingHeader & {
    items: {
      /** Small icon for the bento grid */
      imageUrl: string;
      /** Large image for the feature showcase */
      image: LandingImage;
      tone: LandingTone;
      title: string;
      description: string;
      badge: string;
      href: string;
      ctaLabel: string;
      guideHref: string;
      requiresLogin: boolean;
      /** Hidden from the landing page when false; missing = active */
      isActive?: boolean;
    }[];
  };
  /** Pinned scroll-through cards; renders features.items, owns only its header */
  featureShowcase: LandingHeader;
  useCases: LandingHeader & {
    eyebrow: string;
    cards: {
      imageUrl: string;
      tone: LandingTone;
      feature: string;
      title: string;
      body: string;
      href: string;
      ctaLabel: string;
    }[];
  };
  comparison: LandingHeader & {
    before: { emoji: string; title: string; points: string[] };
    after: { emoji: string; title: string; badge: string; points: string[] };
  };
  testimonials: LandingHeader;
  blog: LandingHeader;
  faq: LandingHeader;
  promoSlider: {
    showAiScanCard: boolean;
    slides: {
      title: string;
      imageUrl: string;
      href: string;
      ctaLabel: string;
      badge: string;
      /** Lucide icon name; empty = pulsing dot */
      badgeIcon: string;
      tone: LandingTone;
    }[];
  };
  promoBanner: {
    titleText: string;
    titleHighlight: string;
    description: string;
    ctaLabel: string;
    href: string;
    image: LandingImage;
    tone: LandingTone;
  };
  /** Long-form crawlable article; body is markdown-lite (see SeoContentSection) */
  seoContent: {
    title: string;
    titleHighlight: string;
    body: string;
  };
  layout: {
    sections: { key: LandingSectionKey; visible: boolean }[];
  };
  ctaBanner: {
    title: string;
    titleHighlight: string;
    titleSuffix: string;
    description: string;
    primaryCta: LandingCta;
    secondaryCta: LandingCta;
    footnote: string;
    cards: { title: string; desc: string; imageUrl: string; tone: LandingTone }[];
  };
}
