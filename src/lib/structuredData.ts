import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/seo";

// Shared schema.org nodes. Describe only what is visible on the page: no
// aggregateRating (no stored aggregate of all reviews) and no paid Offer
// until the price shown in the product copy matches the live packages.

export const ORGANIZATION_ID = `${SITE_URL}/#org`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const organizationNode = {
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/img/split-bill-icon.png`,
  sameAs: ["https://www.instagram.com/splitbill.app/"],
};

export const websiteNode = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: SITE_URL,
  name: SITE_NAME,
  inLanguage: "id-ID",
  publisher: { "@id": ORGANIZATION_ID },
};

const FREE_OFFER = { "@type": "Offer", name: "Gratis", price: "0", priceCurrency: "IDR" };

export function webApplicationNode({
  name,
  path,
  description,
}: {
  name: string;
  path: string;
  description: string;
}) {
  return {
    "@type": "WebApplication",
    name,
    url: absoluteUrl(path),
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    inLanguage: "id-ID",
    description,
    offers: FREE_OFFER,
    publisher: { "@id": ORGANIZATION_ID },
  };
}

export function breadcrumbNode(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** Wrap nodes in one @graph document for a single ld+json script. */
export function jsonLdGraph(...nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}
