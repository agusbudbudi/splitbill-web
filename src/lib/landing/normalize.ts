import { API_BASE_URL } from "@/lib/constants";
import { DEFAULT_LANDING_CONTENT } from "./defaults";
import type { LandingContent, LandingImage, LandingSectionKey } from "./types";

// Navbar "#fitur" / "#cara-pakai" / "#testimoni" targets — never hidden, even
// if a response says so (the backend enforces this too).
const ALWAYS_VISIBLE: LandingSectionKey[] = ["featureShowcase", "howItWorks", "testimonials"];
const DEFAULT_LAYOUT = DEFAULT_LANDING_CONTENT.layout.sections;
const DEFAULT_ORDER = DEFAULT_LAYOUT.map((s) => s.key);

/**
 * Stored order (unknown/duplicate keys dropped). Sections the stored layout
 * predates are inserted right after their closest preceding default
 * neighbor, with their default visibility — same rule as the backend.
 */
function normalizeLayout(layout: LandingContent["layout"]): LandingContent["layout"] {
  const known = new Set<string>(DEFAULT_ORDER);
  const seen = new Set<string>();
  const sections = layout.sections.filter((s) => known.has(s.key) && !seen.has(s.key) && seen.add(s.key));
  DEFAULT_LAYOUT.forEach((entry, defaultIndex) => {
    if (seen.has(entry.key)) return;
    const anchor = DEFAULT_ORDER.slice(0, defaultIndex)
      .reverse()
      .find((key) => sections.some((s) => s.key === key));
    const at = anchor ? sections.findIndex((s) => s.key === anchor) + 1 : 0;
    sections.splice(at, 0, { ...entry });
  });
  return {
    sections: sections.map((s) => ({ key: s.key, visible: s.visible !== false || ALWAYS_VISIBLE.includes(s.key) })),
  };
}

// Uploaded images are stored as API-relative paths ("/api/landing-assets/…") so
// the DB doesn't pin a backend domain; "/img/…" defaults stay on this site.
function resolveAssetUrl(url: string): string {
  return url.startsWith("/api/") ? `${API_BASE_URL}${url}` : url;
}

function resolveImage(image: LandingImage): LandingImage {
  return { ...image, url: resolveAssetUrl(image.url) };
}

const isText = (v: unknown): v is string => typeof v === "string" && v.trim().length > 0;
const isList = (v: unknown, length: number) => Array.isArray(v) && v.length === length;
const isListBetween = (v: unknown, min: number, max: number) =>
  Array.isArray(v) && v.length >= min && v.length <= max;
const hasTitle = (s: { title?: unknown } | undefined) => isText(s?.title);

// The backend validates on save; these checks only guard against a partial or
// unexpected response so one bad section falls back alone instead of crashing
// the page or rendering an empty H1.
const SECTION_GUARDS: { [K in keyof LandingContent]: (s: LandingContent[K]) => boolean } = {
  seo: (s) => isText(s?.title) && isText(s?.description),
  hero: (s) =>
    isText(s?.title) &&
    isText(s?.description) &&
    isText(s?.primaryCta?.href) &&
    isText(s?.secondaryCta?.href) &&
    isText(s?.image?.url) &&
    Array.isArray(s?.trustItems),
  socialProof: (s) => isList(s?.items, 3),
  howItWorks: (s) => isText(s?.title) && isList(s?.steps, 3) && s.steps.every((step) => isText(step?.image?.url)),
  // At least 2 *active* items: inactive ones are filtered out below, and the
  // showcase (an ALWAYS_VISIBLE "#fitur" target) renders nothing with fewer.
  features: (s) =>
    hasTitle(s) &&
    isListBetween(s?.items, 2, 9) &&
    s.items.every((item) => isText(item?.title) && isText(item?.href) && isText(item?.imageUrl)) &&
    s.items.filter((item) => item.isActive !== false).length >= 2,
  featureShowcase: hasTitle,
  useCases: (s) =>
    hasTitle(s) && isList(s?.cards, 3) && s.cards.every((card) => isText(card?.href) && isText(card?.imageUrl)),
  comparison: (s) =>
    hasTitle(s) && isListBetween(s?.before?.points, 2, 8) && isListBetween(s?.after?.points, 2, 8),
  testimonials: hasTitle,
  promoSlider: (s) =>
    isListBetween(s?.slides, 0, 6) && s.slides.every((slide) => isText(slide?.title) && isText(slide?.href) && isText(slide?.imageUrl)),
  promoBanner: (s) => isText(s?.titleText) && isText(s?.href) && isText(s?.image?.url),
  seoContent: (s) => typeof s?.title === "string" && typeof s?.body === "string",
  layout: (s) => Array.isArray(s?.sections) && s.sections.every((section) => typeof section?.key === "string"),
  blog: hasTitle,
  faq: hasTitle,
  ctaBanner: (s) =>
    isText(s?.title) && isText(s?.primaryCta?.href) && isText(s?.secondaryCta?.href) && isList(s?.cards, 3),
};

type FeatureItem = LandingContent["features"]["items"][number];
type LegacyShowcaseItem = Partial<Pick<FeatureItem, "href" | "image" | "tone">>;

/**
 * Content saved before the showcase shared features.items kept its own
 * featureShowcase.items: features lacking a showcase image take the image/tone
 * of the legacy card (or default feature) with the same href, else their icon.
 * Same rule as the backend.
 */
function withShowcaseImage(item: FeatureItem, legacy: LegacyShowcaseItem[]): FeatureItem {
  if (isText(item.image?.url)) return item;
  const source =
    legacy.find((card) => card?.href === item.href) ??
    DEFAULT_LANDING_CONTENT.features.items.find((feature) => feature.href === item.href);
  return {
    ...item,
    image: isText(source?.image?.url) ? source.image : { url: item.imageUrl, alt: item.title },
    tone: item.tone || source?.tone || "blue",
  };
}

/**
 * Fills missing/malformed sections from the shipped defaults and resolves
 * uploaded image paths. Pure, so the live page and the CMS preview
 * (/preview/landing) render content through exactly the same rules.
 */
export function mergeWithDefaults(remote: Partial<LandingContent> | undefined): LandingContent {
  const pick = <K extends keyof LandingContent>(key: K): LandingContent[K] => {
    const section = remote?.[key] as LandingContent[K] | undefined;
    if (section && SECTION_GUARDS[key](section)) return section;
    if (remote) console.warn(`Landing content: invalid "${key}" section, using defaults`);
    return DEFAULT_LANDING_CONTENT[key];
  };

  const hero = pick("hero");
  const howItWorks = pick("howItWorks");
  const ctaBanner = pick("ctaBanner");
  const features = pick("features");
  const useCases = pick("useCases");
  const featureShowcase = pick("featureShowcase");
  const rawShowcaseItems = (remote?.featureShowcase as { items?: unknown } | undefined)?.items;
  const legacyShowcase = Array.isArray(rawShowcaseItems) ? (rawShowcaseItems as LegacyShowcaseItem[]) : [];
  const promoSlider = pick("promoSlider");
  const promoBanner = pick("promoBanner");
  // Stored seo may predate the share/OG fields
  const seo = { ...DEFAULT_LANDING_CONTENT.seo, ...pick("seo") };
  const ogImageOk = isText(seo.ogImage?.url) && isText(seo.ogImage?.alt);

  return {
    seo: {
      ...seo,
      ogImage: resolveImage(ogImageOk ? seo.ogImage : DEFAULT_LANDING_CONTENT.seo.ogImage),
      sameAs: Array.isArray(seo.sameAs) ? seo.sameAs.filter((url) => typeof url === "string" && url.startsWith("https://")) : [],
    },
    hero: {
      ...hero,
      // Optional in the guard: content saved before the eyebrow existed (or
      // with it cleared) just renders without one.
      eyebrow: {
        text: typeof hero.eyebrow?.text === "string" ? hero.eyebrow.text : "",
        badge: typeof hero.eyebrow?.badge === "string" ? hero.eyebrow.badge : "",
      },
      image: resolveImage(hero.image),
      imageMobile: isText(hero.imageMobile?.url)
        ? resolveImage({ ...hero.imageMobile, alt: hero.imageMobile.alt || hero.image.alt })
        : null,
    },
    socialProof: pick("socialProof"),
    howItWorks: {
      ...howItWorks,
      steps: howItWorks.steps.map((step) => ({ ...step, image: resolveImage(step.image) })),
    },
    features: {
      ...features,
      // Inactive cards are hidden from both the showcase and the bento grid
      items: features.items.filter((item) => item.isActive !== false).map((item) => {
        const withImage = withShowcaseImage(item, legacyShowcase);
        return { ...withImage, imageUrl: resolveAssetUrl(item.imageUrl), image: resolveImage(withImage.image) };
      }),
    },
    featureShowcase: {
      title: featureShowcase.title,
      titleHighlight: featureShowcase.titleHighlight,
      subtitle: featureShowcase.subtitle,
    },
    useCases: {
      ...useCases,
      cards: useCases.cards.map((card) => ({ ...card, imageUrl: resolveAssetUrl(card.imageUrl) })),
    },
    comparison: pick("comparison"),
    testimonials: pick("testimonials"),
    blog: pick("blog"),
    faq: pick("faq"),
    promoSlider: {
      ...promoSlider,
      slides: promoSlider.slides.map((slide) => ({ ...slide, imageUrl: resolveAssetUrl(slide.imageUrl) })),
    },
    promoBanner: { ...promoBanner, image: resolveImage(promoBanner.image) },
    seoContent: pick("seoContent"),
    layout: normalizeLayout(pick("layout")),
    ctaBanner: {
      ...ctaBanner,
      cards: ctaBanner.cards.map((card) => ({ ...card, imageUrl: resolveAssetUrl(card.imageUrl) })),
    },
  };
}
