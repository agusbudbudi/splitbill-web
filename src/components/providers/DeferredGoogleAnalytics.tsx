"use client";

import { useEffect } from "react";

interface DeferredGoogleAnalyticsProps {
  gaId: string;
}

/**
 * Same setup as <GoogleAnalytics>, but gtag.js itself is only fetched once the
 * browser is idle so it doesn't compete with the hero image and JS on first load.
 * The dataLayer stub (js + config) is defined right away, so events fired before
 * the script arrives (e.g. AppEntryTracker) are queued instead of dropped.
 */
export function DeferredGoogleAnalytics({ gaId }: DeferredGoogleAnalyticsProps) {
  useEffect(() => {
    const w = window as unknown as {
      dataLayer: unknown[];
      gtag: (...args: unknown[]) => void;
    };
    w.dataLayer = w.dataLayer || [];
    w.gtag = function gtag() {
      // gtag.js only understands the raw `arguments` object, not a rest array
      // eslint-disable-next-line prefer-rest-params
      w.dataLayer.push(arguments);
    };
    w.gtag("js", new Date());
    w.gtag("config", gaId);

    const load = () => {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(script);
    };

    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(load, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(load, 2000);
    return () => clearTimeout(t);
  }, [gaId]);

  return null;
}
