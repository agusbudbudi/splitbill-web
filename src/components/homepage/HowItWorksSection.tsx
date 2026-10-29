"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { LandingIcon } from "@/lib/landing/icons";
import { getTone } from "@/lib/landing/tones";
import { isUnoptimizableSrc } from "@/lib/landing/image";
import type { LandingContent } from "@/lib/landing/types";
import { LandingTitle } from "./LandingTitle";

interface HowItWorksSectionProps {
  content: LandingContent["howItWorks"];
}

export const HowItWorksSection = ({ content }: HowItWorksSectionProps) => {
  const { steps } = content;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      const scrollLeft = el.scrollLeft;
      const itemWidth = el.scrollWidth / steps.length;
      const idx = Math.round(scrollLeft / itemWidth);
      setActiveIndex(Math.min(Math.max(idx, 0), steps.length - 1));
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [steps.length]);

  const scrollToIndex = (idx: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const itemWidth = el.scrollWidth / steps.length;
    el.scrollTo({ left: idx * itemWidth, behavior: "smooth" });
  };

  return (
    <section id="cara-pakai" data-landing-section="howItWorks" className="py-16 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <h2
            className="reveal text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4"
          >
            <LandingTitle title={content.title} highlight={content.titleHighlight} />
          </h2>

          {content.subtitle && (
            <p
              className="reveal text-base sm:text-lg text-slate-500 font-medium"
            >
              {content.subtitle}
            </p>
          )}
        </div>

        {/* One list for all breakpoints: horizontal snap slider on mobile,
            3-column grid on desktop (rendering it twice duplicated the DOM). */}
        <div className="-mx-4 overflow-hidden lg:mx-0 lg:overflow-visible">
          <div
            ref={scrollRef}
            className="relative flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-none px-4 pb-4 lg:grid lg:grid-cols-3 lg:gap-8 lg:overflow-visible lg:snap-none lg:px-0 lg:pb-0"
            style={{ scrollbarWidth: "none" }}
          >
            {/* Connecting line (desktop) */}
            <div className="hidden lg:block absolute top-[130px] left-[15%] right-[15%] h-0.5 border-t-2 border-dashed border-slate-200 -z-10" />

            {steps.map((step, index) => {
              const number = String(index + 1).padStart(2, "0");
              return (
                <div
                  key={index}
                  className="reveal flex-shrink-0 w-[82vw] snap-center lg:w-auto flex flex-col items-center text-center group"
                >
                  {/* Image */}
                  <div className="relative w-full max-w-[260px] lg:max-w-[280px] aspect-square rounded-xl overflow-hidden mb-6 lg:mb-8 lg:border lg:border-slate-100 transition-transform duration-300 lg:group-hover:scale-105">
                    <Image
                      src={step.image.url}
                      alt={step.image.alt}
                      fill
                      sizes="(min-width: 1024px) 280px, 80vw"
                      unoptimized={isUnoptimizableSrc(step.image.url)}
                      className="object-cover"
                    />
                    <span className="absolute top-3 left-3 w-11 h-11 rounded-xl bg-white/95 backdrop-blur-sm flex items-center justify-center text-base lg:text-lg font-black text-slate-900 shadow-md">
                      {number}
                    </span>
                  </div>

                  {/* Step Circle Icon */}
                  <div className={`w-12 h-12 rounded-full ${getTone(step.tone).solidBg} text-white flex items-center justify-center mb-4 lg:mb-5 shadow-lg transition-all duration-300 lg:group-hover:scale-110`}>
                    <LandingIcon name={step.icon} className="w-5 h-5" />
                  </div>

                  {/* Info */}
                  <h3 className="text-xl font-black text-slate-800 mb-2">{step.title}</h3>
                  <p className="text-sm font-medium text-slate-500 max-w-xs leading-relaxed px-2 lg:px-0">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dot indicators (mobile slider only) */}
        <div className="flex justify-center gap-2 mt-5 lg:hidden">
          {steps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${activeIndex === idx
                ? "w-6 bg-primary"
                : "w-2 bg-slate-200 hover:bg-slate-300"
                }`}
              aria-label={`Go to step ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
