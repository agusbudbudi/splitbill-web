import React from "react";
import Image from "next/image";
import { ArrowRight, Camera } from "lucide-react";
import { LandingLink } from "./LandingLink";
import { LandingIcon } from "@/lib/landing/icons";
import { isUnoptimizableSrc } from "@/lib/landing/image";
import type { LandingContent } from "@/lib/landing/types";
import { LandingTitle } from "./LandingTitle";

interface CTABannerSectionProps {
  content: LandingContent["ctaBanner"];
}

// Compact two-column block on the showcase background: copy + CTAs, and the
// benefits as white rows.
export const CTABannerSection = ({ content }: CTABannerSectionProps) => {
  return (
    <section data-landing-section="ctaBanner" className="py-16 bg-[#f8f9fd]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="reveal grid gap-10 lg:grid-cols-2 lg:gap-16 items-center"
        >
          {/* Copy + CTAs */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
              <LandingTitle title={content.title} highlight={content.titleHighlight} />
              {content.titleSuffix && <> {content.titleSuffix}</>}
            </h2>

            {content.description && (
              <p className="text-base sm:text-lg text-slate-500 font-medium leading-relaxed max-w-xl mb-8">
                {content.description}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <LandingLink
                href={content.primaryCta.href}
                className="group flex items-center justify-center gap-2 px-7 py-4 rounded-md bg-primary text-white font-black text-base shadow-xl shadow-primary/30 hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <LandingIcon name={content.primaryCta.icon} fallback={Camera} className="w-5 h-5" />
                {content.primaryCta.label}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </LandingLink>
              <LandingLink
                href={content.secondaryCta.href}
                className="flex items-center justify-center gap-2 px-7 py-4 rounded-md border border-primary/10 text-primary font-bold text-base hover:bg-primary/5 hover:border-primary/60 hover:scale-105 active:scale-95 transition-all duration-200"
              >
                {content.secondaryCta.label}
              </LandingLink>
            </div>

            {content.footnote && (
              <p className="text-xs font-semibold text-slate-400 mt-5">{content.footnote}</p>
            )}
          </div>

          {/* Benefits */}
          {content.cards.length > 0 && (
            <div className="flex flex-col gap-3">
              {content.cards.map((card, idx) => {
                return (
                  <div
                    key={idx}
                    className="reveal flex items-center gap-3 sm:gap-4 rounded-lg bg-white border border-slate-100/80 p-4 sm:p-5 shadow-[0_4px_20px_-4px_rgba(71,159,234,0.08)]"
                  >
                    <div className="shrink-0 w-12 h-12">
                      <Image
                        src={card.imageUrl}
                        alt=""
                        width={48}
                        height={48}
                        unoptimized={isUnoptimizableSrc(card.imageUrl)}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="min-w-0 text-left">
                      <h3 className="text-sm sm:text-base font-black text-slate-800 leading-snug">{card.title}</h3>
                      <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">{card.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
