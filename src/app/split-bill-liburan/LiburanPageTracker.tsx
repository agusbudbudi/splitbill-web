"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { trackLiburanLP } from "@/lib/gtag";

const SCROLL_MILESTONES = [25, 50, 75, 100] as const;

export function LiburanPageTracker() {
  const searchParams = useSearchParams();
  const firedMilestones = useRef(new Set<number>());
  const hasTrackedView = useRef(false);

  useEffect(() => {
    if (hasTrackedView.current) return;
    hasTrackedView.current = true;
    trackLiburanLP.view({
      utm_source: searchParams.get("utm_source"),
      utm_medium: searchParams.get("utm_medium"),
      utm_campaign: searchParams.get("utm_campaign"),
    });
  }, [searchParams]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollableHeight <= 0) return;
      const scrolledPercent = (window.scrollY / scrollableHeight) * 100;

      for (const milestone of SCROLL_MILESTONES) {
        if (scrolledPercent >= milestone && !firedMilestones.current.has(milestone)) {
          firedMilestones.current.add(milestone);
          trackLiburanLP.scrollDepth(milestone);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return null;
}
