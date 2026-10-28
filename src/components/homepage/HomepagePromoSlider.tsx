"use client";

import React, { useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { LandingLink } from "./LandingLink";
import { LandingIcon } from "@/lib/landing/icons";
import { getPromoTone } from "@/lib/landing/tones";
import { isUnoptimizableSrc } from "@/lib/landing/image";
import type { LandingContent } from "@/lib/landing/types";

// loading: () => null — same reasoning as ChatAgentFAB in HomepagePageClient:
// without it, next/dynamic suspends to the root app/loading.tsx instead of
// failing locally, blanking the whole page while this chunk fetches.
const HomepageAIScanCard = dynamic(
  () =>
    import("./HomepageAIScanCard").then(
      (mod) => mod.HomepageAIScanCard,
    ),
  { ssr: false, loading: () => null },
);

interface HomepagePromoSliderProps {
  content: LandingContent["promoSlider"];
}

export const HomepagePromoSlider = ({ content }: HomepagePromoSliderProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!content.showAiScanCard && content.slides.length === 0) return null;

  return (
    <section data-landing-section="promoSlider" className="py-10 bg-white border-b border-slate-100 relative group/section overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Navigation Buttons - Hidden on touch devices, shown on hover/desktop */}
        <div className="absolute top-1/2 -translate-y-1/2 left-2 z-20 opacity-0 group-hover/section:opacity-100 transition-opacity duration-300 pointer-events-none sm:block hidden">
          <button
            onClick={() => scroll("left")}
            className="w-10 h-10 rounded-full bg-white border border-slate-200/80 shadow-md flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white hover:border-primary active:scale-95 transition-all pointer-events-auto cursor-pointer"
            aria-label="Slide kiri"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="absolute top-1/2 -translate-y-1/2 right-2 z-20 opacity-0 group-hover/section:opacity-100 transition-opacity duration-300 pointer-events-none sm:block hidden">
          <button
            onClick={() => scroll("right")}
            className="w-10 h-10 rounded-full bg-white border border-slate-200/80 shadow-md flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white hover:border-primary active:scale-95 transition-all pointer-events-auto cursor-pointer"
            aria-label="Slide kanan"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Container with Bleed support - Matched with TestimonialsSection alignment */}
        <div className="-mx-4 sm:mx-0 overflow-hidden">
          <div
            ref={scrollContainerRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide px-4 sm:px-0 scroll-pl-4 sm:scroll-pl-0 items-stretch"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {/* AI Scan quota card — live per-visitor data, so only toggled from the CMS */}
            {content.showAiScanCard && (
              <div className="flex-shrink-0 w-[85vw] sm:w-[480px] snap-start h-auto flex">
                <HomepageAIScanCard />
              </div>
            )}

            {content.slides.map((slide, idx) => {
              const theme = getPromoTone(slide.tone);
              return (
                <div key={idx} className="flex-shrink-0 w-[85vw] sm:w-[480px] snap-start h-auto flex">
                  <LandingLink href={slide.href} className="block w-full h-full group/card transition-all duration-300 hover:scale-[1.005] active:scale-[0.99]">
                    <div className={`relative p-[1.5px] rounded-md bg-gradient-to-br ${theme.slideFrame} shadow-lg h-full flex flex-col overflow-hidden`}>
                      {slide.badge && (
                        <div className={`absolute top-0 right-0 px-3 py-1.5 rounded-bl-xl flex items-center gap-1.5 text-[9px] font-black uppercase ${theme.slideBadge} text-white z-30 shadow-md transition-transform group-hover/card:scale-105 origin-top-right`}>
                          {slide.badgeIcon ? (
                            <LandingIcon name={slide.badgeIcon} className="w-3 h-3 fill-current" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          )}
                          <span>{slide.badge}</span>
                        </div>
                      )}

                      <div className="bg-white rounded-[calc(var(--radius-md)-1.5px)] p-6 flex-grow flex flex-col justify-between relative overflow-hidden">
                        <div className={`absolute top-0 right-0 w-24 h-24 ${theme.slideGlow} rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none`} />

                        <div className="flex items-center gap-4">
                          <div className="shrink-0 w-16 h-16 rounded-full flex items-center justify-center transition-transform group-hover/card:scale-110 overflow-hidden relative">
                            <Image
                              src={slide.imageUrl}
                              alt=""
                              width={64}
                              height={64}
                              unoptimized={isUnoptimizableSrc(slide.imageUrl)}
                              className="w-full h-full object-contain"
                            />
                          </div>

                          <div className="space-y-1">
                            <h4 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight leading-tight">
                              {slide.title}
                            </h4>
                          </div>
                        </div>

                        <div className="pt-5 mt-auto">
                          <div className={`w-full flex items-center justify-center gap-2 h-12 bg-white ${theme.slideButton} border-1 hover:text-white font-bold text-sm rounded-sm transition-all cursor-pointer`}>
                            {slide.ctaLabel}
                            <ChevronRight className="w-4 h-4 group-hover/card:translate-x-0.5 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </LandingLink>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
