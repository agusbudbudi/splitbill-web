import type { LandingTone } from "./types";

interface ToneClasses {
  /** Icon/text color */
  text: string;
  /** Soft tile behind a small icon */
  softBg: string;
  /** Solid circle behind a white icon */
  solidBg: string;
  /** Tinted card background + border */
  card: string;
  /** Icon tile inside a tinted card */
  cardIcon: string;
  /** Soft gradient panel (use case card art) */
  tint: string;
}

// Full class strings written out literally so Tailwind's scanner picks them up —
// CMS content only ever names a tone, never a class.
const TONES: Record<LandingTone, ToneClasses> = {
  primary: {
    text: "text-primary",
    softBg: "bg-primary/10",
    solidBg: "bg-primary",
    card: "bg-primary/5 border-primary/10",
    cardIcon: "bg-primary/15 group-hover:bg-primary/25",
    tint: "from-primary/15 to-primary/5",
  },
  blue: {
    text: "text-blue-500",
    softBg: "bg-blue-50",
    solidBg: "bg-blue-500",
    card: "bg-blue-50/80 border-blue-100/50",
    cardIcon: "bg-blue-100/90 group-hover:bg-blue-200/90",
    tint: "from-sky-100 to-blue-50",
  },
  amber: {
    text: "text-amber-500",
    softBg: "bg-amber-50",
    solidBg: "bg-[#EEA420]",
    card: "bg-amber-50/80 border-amber-100/50",
    cardIcon: "bg-amber-100/90 group-hover:bg-amber-200/90",
    tint: "from-amber-100 to-orange-50",
  },
  emerald: {
    text: "text-emerald-500",
    softBg: "bg-emerald-50",
    solidBg: "bg-emerald-500",
    card: "bg-emerald-50/80 border-emerald-100/50",
    cardIcon: "bg-emerald-100/90 group-hover:bg-emerald-200/90",
    tint: "from-emerald-100 to-teal-50",
  },
  green: {
    text: "text-green-500",
    softBg: "bg-green-50",
    solidBg: "bg-[#2EC866]",
    card: "bg-green-50/80 border-green-100/50",
    cardIcon: "bg-green-100/90 group-hover:bg-green-200/90",
    tint: "from-green-100 to-emerald-50",
  },
  rose: {
    text: "text-rose-500",
    softBg: "bg-rose-50",
    solidBg: "bg-rose-500",
    card: "bg-rose-50/80 border-rose-100/50",
    cardIcon: "bg-rose-100/90 group-hover:bg-rose-200/90",
    tint: "from-rose-100 to-pink-50",
  },
  violet: {
    text: "text-violet-500",
    softBg: "bg-violet-50",
    solidBg: "bg-violet-500",
    card: "bg-violet-50/80 border-violet-100/50",
    cardIcon: "bg-violet-100/90 group-hover:bg-violet-200/90",
    tint: "from-violet-100 to-purple-50",
  },
  purple: {
    text: "text-purple-500",
    softBg: "bg-purple-50",
    solidBg: "bg-purple-500",
    card: "bg-purple-50/80 border-purple-100/50",
    cardIcon: "bg-purple-100/90 group-hover:bg-purple-200/90",
    tint: "from-purple-100 to-fuchsia-50",
  },
};

export function getTone(tone: string | undefined): ToneClasses {
  return TONES[tone as LandingTone] || TONES.primary;
}

interface PromoClasses {
  /** PromoBanner background / gradient stop / CTA text, see components/ui/PromoBanner */
  bannerBg: string;
  bannerGradientTo: string;
  bannerText: string;
  /** Promo slider card: gradient border, corner badge, outlined CTA, corner glow */
  slideFrame: string;
  slideBadge: string;
  slideButton: string;
  slideGlow: string;
}

// primary/blue/amber reproduce the original hand-styled cards and banner.
const PROMO: Record<LandingTone, PromoClasses> = {
  primary: {
    bannerBg: "bg-primary",
    bannerGradientTo: "to-primary",
    bannerText: "text-primary",
    slideFrame: "from-blue-400 via-blue-500 to-primary shadow-primary/5",
    slideBadge: "bg-primary",
    slideButton: "hover:bg-primary border-primary text-primary",
    slideGlow: "bg-primary/5",
  },
  blue: {
    bannerBg: "bg-[#2E6FF3]",
    bannerGradientTo: "to-[#2E6FF3]",
    bannerText: "text-[#2E6FF3]",
    slideFrame: "from-sky-400 via-blue-500 to-blue-600 shadow-blue-500/5",
    slideBadge: "bg-blue-600",
    slideButton: "hover:bg-blue-600 border-blue-600 text-blue-600",
    slideGlow: "bg-blue-500/5",
  },
  amber: {
    bannerBg: "bg-amber-500",
    bannerGradientTo: "to-amber-500",
    bannerText: "text-amber-600",
    slideFrame: "from-amber-200 via-orange-300 to-yellow-200 shadow-amber-200/5",
    slideBadge: "bg-orange-400",
    slideButton: "hover:bg-orange-500 border-orange-400 text-orange-600",
    slideGlow: "bg-orange-500/5",
  },
  emerald: {
    bannerBg: "bg-emerald-600",
    bannerGradientTo: "to-emerald-600",
    bannerText: "text-emerald-600",
    slideFrame: "from-emerald-300 via-emerald-400 to-teal-400 shadow-emerald-300/5",
    slideBadge: "bg-emerald-500",
    slideButton: "hover:bg-emerald-500 border-emerald-500 text-emerald-600",
    slideGlow: "bg-emerald-500/5",
  },
  green: {
    bannerBg: "bg-green-600",
    bannerGradientTo: "to-green-600",
    bannerText: "text-green-600",
    slideFrame: "from-green-300 via-green-400 to-emerald-400 shadow-green-300/5",
    slideBadge: "bg-green-500",
    slideButton: "hover:bg-green-500 border-green-500 text-green-600",
    slideGlow: "bg-green-500/5",
  },
  rose: {
    bannerBg: "bg-rose-500",
    bannerGradientTo: "to-rose-500",
    bannerText: "text-rose-500",
    slideFrame: "from-rose-300 via-pink-400 to-rose-400 shadow-rose-300/5",
    slideBadge: "bg-rose-500",
    slideButton: "hover:bg-rose-500 border-rose-400 text-rose-600",
    slideGlow: "bg-rose-500/5",
  },
  violet: {
    bannerBg: "bg-violet-600",
    bannerGradientTo: "to-violet-600",
    bannerText: "text-violet-600",
    slideFrame: "from-violet-300 via-violet-400 to-indigo-400 shadow-violet-300/5",
    slideBadge: "bg-violet-500",
    slideButton: "hover:bg-violet-500 border-violet-500 text-violet-600",
    slideGlow: "bg-violet-500/5",
  },
  purple: {
    bannerBg: "bg-purple-600",
    bannerGradientTo: "to-purple-600",
    bannerText: "text-purple-600",
    slideFrame: "from-purple-300 via-fuchsia-400 to-purple-400 shadow-purple-300/5",
    slideBadge: "bg-purple-500",
    slideButton: "hover:bg-purple-500 border-purple-500 text-purple-600",
    slideGlow: "bg-purple-500/5",
  },
};

export function getPromoTone(tone: string | undefined): PromoClasses {
  return PROMO[tone as LandingTone] || PROMO.primary;
}
