import React from "react";
import { LandingIcon } from "@/lib/landing/icons";
import { getTone } from "@/lib/landing/tones";
import type { LandingContent } from "@/lib/landing/types";

interface SocialProofBarProps {
  content: LandingContent["socialProof"];
}

export const SocialProofBar = ({ content }: SocialProofBarProps) => {
  return (
    <section data-landing-section="socialProof" className="bg-white border-y border-slate-100 py-4 md:py-6 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-row flex-wrap items-center justify-center gap-x-5 gap-y-2 md:grid md:grid-cols-3 md:gap-8 md:divide-x divide-slate-100">
          {content.items.map((hl, idx) => {
            const tone = getTone(hl.tone);
            return (
              <div
                key={idx}
                className={`flex items-center gap-1.5 md:gap-4 justify-center md:justify-start ${
                  idx === 0 ? "" : "md:pl-8"
                }`}
              >
                <div
                  className={`w-6 h-6 md:w-10 md:h-10 rounded-md md:rounded-xl flex items-center justify-center shrink-0 ${tone.softBg}`}
                >
                  <LandingIcon name={hl.icon} className={`w-3 h-3 md:w-5 md:h-5 ${tone.text}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm md:text-base font-extrabold text-slate-800 tracking-tight leading-none">
                    {hl.title}
                  </p>
                  {hl.desc && (
                    <p className="hidden md:block text-xs text-slate-500 font-medium mt-0.5 leading-normal">
                      {hl.desc}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
