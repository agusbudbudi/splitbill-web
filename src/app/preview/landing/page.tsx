import type { Metadata } from "next";
import { LandingPreviewClient } from "@/components/homepage/LandingPreviewClient";
import { getFaqs } from "@/lib/faq";
import { getFreshLandingContent } from "@/lib/landing/content";

// Internal tool page: never indexed (also blocked in robots.ts and sent with
// X-Robots-Tag: noindex from next.config.ts), never cached.
export const metadata: Metadata = {
  title: "Landing Preview",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function LandingPreviewPage() {
  const [allFaqs, { content, updatedAt }] = await Promise.all([getFaqs(), getFreshLandingContent()]);
  const faqs = allFaqs.filter((faq) => faq.showOnLanding);
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <>
      {/* Admin previews shouldn't count as homepage visits. gtag reads this
          flag before sending any hit, and this inline script runs before the
          afterInteractive GA script loads. */}
      {gaId && (
        <script dangerouslySetInnerHTML={{ __html: `window["ga-disable-${gaId}"]=true;` }} />
      )}
      <LandingPreviewClient
        faqs={faqs}
        initialContent={content}
        // null = backend unreachable/timed out, so these are shipped defaults
        initialIsFallback={updatedAt === null}
      />
    </>
  );
}
