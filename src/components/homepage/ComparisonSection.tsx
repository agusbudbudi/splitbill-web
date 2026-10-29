"use client";

import React from "react";
import { X, Check } from "lucide-react";
import type { LandingContent } from "@/lib/landing/types";
import { LandingTitle } from "./LandingTitle";

interface ComparisonSectionProps {
  content: LandingContent["comparison"];
}

export const ComparisonSection = ({ content }: ComparisonSectionProps) => {
  return (
    <section
      data-landing-section="comparison"
      className="relative isolate overflow-hidden py-16 bg-[linear-gradient(160deg,#5aaef0_0%,#479fea_45%,#2b86d9_100%)]"
    >
      {/* Top spotlight */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(255,255,255,0.28),transparent_70%)]" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <h2
            className="reveal text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4"
          >
            {/* Highlight as a tilted white "sticker" — reads instantly on the blue */}
            <LandingTitle
              title={content.title}
              highlight={content.titleHighlight}
              highlightClassName="inline-block -rotate-1 rounded-md bg-white px-2.5 pb-0.5 text-primary shadow-[0_6px_16px_-8px_rgba(8,47,92,0.25)]"
            />
          </h2>

          <p
            className="reveal text-base sm:text-lg text-white/85 font-medium"
          >
            {content.subtitle}
          </p>
        </div>

        {/* Comparison grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-stretch">
          {/* Before — muted glass card */}
          <div
            className="reveal reveal-left rounded-lg bg-white/10 ring-1 ring-white/25 backdrop-blur-sm p-6 sm:p-8"
          >
            <div className="flex items-center gap-2.5 mb-6">
              {content.before.emoji && <span className="text-2xl">{content.before.emoji}</span>}
              <h3 className="text-lg sm:text-xl font-black text-white">{content.before.title}</h3>
            </div>

            <ul className="space-y-4">
              {content.before.points.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center shrink-0">
                    <X className="w-3 h-3 text-white" strokeWidth={3.5} />
                  </span>
                  <span className="text-sm sm:text-base font-semibold text-white/85 leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* After — solid white, the winner */}
          <div
            className="reveal reveal-right relative rounded-lg bg-white p-6 sm:p-8 shadow-[0_20px_50px_-24px_rgba(8,47,92,0.3)]"
          >
            {content.after.badge && (
              <span className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                {content.after.badge}
              </span>
            )}

            <div className="flex items-center gap-2.5 mb-6 pr-20">
              {content.after.emoji && <span className="text-2xl">{content.after.emoji}</span>}
              <h3 className="text-lg sm:text-xl font-black text-slate-900">{content.after.title}</h3>
            </div>

            <ul className="space-y-4">
              {content.after.points.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-white" strokeWidth={3.5} />
                  </span>
                  <span className="text-sm sm:text-base font-semibold text-slate-700 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
