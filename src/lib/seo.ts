import type { Metadata } from "next";

export const SITE_URL = "https://www.splitbill.my.id";
export const SITE_NAME = "SplitBill";
export const SITE_LOCALE = "id_ID";

export interface SeoImage {
  url: string;
  width: number;
  height: number;
  alt: string;
}

export const DEFAULT_OG_IMAGE: SeoImage = {
  url: "/img/pwa-banner.png",
  width: 1200,
  height: 630,
  alt: "SplitBill, aplikasi split bill online gratis untuk bagi tagihan bareng teman",
};

/** Absolute URL for a site path, no trailing slash (homepage = SITE_URL). */
export function absoluteUrl(path: string = "/"): string {
  if (/^https?:\/\//.test(path)) return path;
  const clean = path.split(/[?#]/)[0].replace(/\/+$/, "");
  if (!clean || clean === "/") return SITE_URL;
  return `${SITE_URL}${clean.startsWith("/") ? clean : `/${clean}`}`;
}

interface BuildMetadataInput {
  /** The <title>. */
  title: string;
  description: string;
  /** Site path of the page; becomes the self-referencing canonical and og:url. */
  path: string;
  /** Social title/description, when they should differ from title/description. */
  socialTitle?: string;
  socialDescription?: string;
  image?: SeoImage;
  type?: "website" | "article";
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    authors?: string[];
  };
  noindex?: boolean;
}

/**
 * Title, description, canonical, Open Graph and Twitter tags from one input,
 * so no page ships with a missing tag or falls back to the homepage's
 * Twitter text (Next.js replaces, not merges, a parent's openGraph/twitter).
 */
export function buildMetadata({
  title,
  description,
  path,
  socialTitle = title,
  socialDescription = description,
  image = DEFAULT_OG_IMAGE,
  type = "website",
  article,
  noindex,
}: BuildMetadataInput): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: socialTitle,
      description: socialDescription,
      url,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      images: [image],
      ...(type === "article"
        ? { type: "article", ...article }
        : { type: "website" }),
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: socialDescription,
      images: [{ url: image.url, alt: image.alt }],
    },
    ...(noindex && { robots: { index: false, follow: true } }),
  };
}
