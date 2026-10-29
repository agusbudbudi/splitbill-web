"use client";

import React, { useEffect, useState } from "react";
import { HomepagePageClient } from "./HomepagePageClient";
import { renderStaticSections } from "./staticSections";
import type { FAQItem } from "@/data/faqData";
import { mergeWithDefaults } from "@/lib/landing/normalize";
import { scrollBelowHeader } from "@/lib/landing/scroll";
import { CMS_SOURCE, PREVIEW_SOURCE, isAllowedCmsOrigin } from "@/lib/landing/preview";
import type { LandingContent } from "@/lib/landing/types";

interface LandingPreviewClientProps {
  faqs: FAQItem[];
  /** Latest saved CMS content; shown until the admin sends an unsaved draft. */
  initialContent: LandingContent;
  /** The saved content couldn't be loaded and `initialContent` is the defaults. */
  initialIsFallback?: boolean;
}

// A half-typed field can make a section throw (e.g. an image URL on a host
// next/image doesn't allow). The boundary clears itself on the next content
// update, so the following keystroke gets a fresh try. It is not remounted per
// update — that would restart the hero animation and jump the scroll position.
class PreviewErrorBoundary extends React.Component<
  { resetKey: number; children: React.ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidUpdate(prevProps: { resetKey: number }) {
    if (this.state.error && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 text-center bg-white">
          <div>
            <p className="text-sm font-bold text-slate-800 mb-1">Preview belum bisa dirender</p>
            <p className="text-xs text-slate-500 break-words">{this.state.error.message}</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Jumps instead of smooth-scrolling: the navbar grows a banner once the page
// scrolls, and that layout shift cancels a long smooth scroll partway.
function scrollToSection(section: string) {
  // Escaped: the key comes from a postMessage, and a quote or bracket would
  // make querySelector throw inside the message handler.
  const el = document.querySelector<HTMLElement>(`[data-landing-section="${CSS.escape(section)}"]`);
  if (el) scrollBelowHeader(el, { behavior: "instant", underHeader: section === "hero" });
}

/**
 * The real homepage, starting from the latest saved CMS content and then
 * driven by unsaved drafts sent from the admin via postMessage. Renders the exact production components so the phone preview
 * matches the live page; navigation is disabled so clicks stay in the preview.
 */
export const LandingPreviewClient = ({ faqs, initialContent, initialIsFallback = false }: LandingPreviewClientProps) => {
  const [content, setContent] = useState<LandingContent>(initialContent);
  // Cleared by the first draft from the admin, which replaces the fallback.
  const [isFallback, setIsFallback] = useState(initialIsFallback);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.source !== window.parent || !isAllowedCmsOrigin(event.origin)) return;
      const data = event.data;
      if (data?.source !== CMS_SOURCE) return;

      if (data.type === "landing:content") {
        setContent(mergeWithDefaults(data.content));
        setIsFallback(false);
        setVersion((v) => v + 1);
      } else if (data.type === "landing:focus" && typeof data.section === "string") {
        scrollToSection(data.section);
      }
    };

    window.addEventListener("message", onMessage);
    // Parent origin isn't known yet; the message carries no data, and the
    // admin checks event.source before trusting it.
    window.parent?.postMessage({ source: PREVIEW_SOURCE, type: "landing:ready" }, "*");
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // Keep every click inside the preview: links would navigate the iframe away.
  // In-page "#anchor" CTAs still scroll (LandingLink handles them itself).
  const blockNavigation = (e: React.MouseEvent) => {
    const link = (e.target as HTMLElement).closest("a");
    if (link && !link.getAttribute("href")?.startsWith("#")) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div onClickCapture={blockNavigation}>
      {isFallback && (
        <div className="fixed bottom-3 inset-x-3 z-[100] rounded-md bg-amber-500 text-white text-xs font-semibold px-3 py-2 shadow-lg text-center">
          Konten tersimpan gagal dimuat dari API (timeout/error). Yang tampil adalah konten default, bukan dari CMS.
        </div>
      )}
      <PreviewErrorBoundary resetKey={version}>
        {/* Static sections render client-side here (server-side on the live page)
            so they follow the draft too. */}
        <HomepagePageClient
          content={content}
          faqs={faqs}
          staticSections={renderStaticSections(content)}
        />
      </PreviewErrorBoundary>
    </div>
  );
};
