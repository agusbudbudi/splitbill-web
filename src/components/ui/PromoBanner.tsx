"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { isUnoptimizableSrc } from "@/lib/landing/image";

// Eased fades (many stops, not a 2-stop linear ramp) so the image dissolves into
// the banner color without a visible edge. Landing only: phones stack the image
// on top (fades downward), wider screens keep it on the right (fades leftward).
const easedFade = (direction: string, solidUntil: number) => {
  const span = 100 - solidUntil;
  const stops = [0.88, 0.68, 0.44, 0.22, 0.07].map(
    (alpha, i) => `rgba(0,0,0,${alpha}) ${solidUntil + span * [0.2, 0.4, 0.6, 0.77, 0.91][i]}%`,
  );
  return `linear-gradient(${direction}, #000 0%, #000 ${solidUntil}%, ${stops.join(", ")}, transparent 100%)`;
};
const LANDING_FADE_VARS = {
  "--fade-mobile": easedFade("to bottom", 50),
  "--fade-desktop": easedFade("to left", 65),
} as React.CSSProperties;
const LANDING_FADE_CLASS =
  "[mask-image:var(--fade-mobile)] [-webkit-mask-image:var(--fade-mobile)] sm:[mask-image:var(--fade-desktop)] sm:[-webkit-mask-image:var(--fade-desktop)]";

interface PromoBannerProps {
  /** Set when the banner is above the fold (LCP image). */
  priority?: boolean;
  href?: string;
  image?: string;
  imageAlt?: string;
  titleText?: string;
  titleHighlight?: string;
  description?: string;
  compactDescription?: string;
  ctaText?: string;
  bgColorClass?: string;
  gradientToClass?: string;
  ctaTextColorClass?: string;
  isCompact?: boolean;
  onClick?: () => void;
  /** Rounded corners on the outer card. Default true (existing behavior everywhere else). */
  rounded?: boolean;
  /** Override the text block's outer padding — e.g. to align its left edge with the page's shared max-w container instead of the banner's own fixed p-5/p-7. */
  contentPaddingClassName?: string;
  /** Homepage styling: type scale, padding and CTA matched to the other landing sections. */
  landing?: boolean;
}

export const PromoBanner = ({
  href = "/split-later",
  image = "/img/promoBanner-split-later.jpg",
  imageAlt = "SplitBill Promo Banner",
  titleText = "Fokus healing dulu,",
  titleHighlight = "split bill belakangan!",
  description = "Tinggal catat pengeluaran, bagi rata pas udah santai. Anti ribet!",
  compactDescription = "Catat dulu, bagi rata pas santai.",
  ctaText = "Coba Sekarang",
  bgColorClass = "bg-[#2E6FF3]",
  gradientToClass = "to-[#2E6FF3]",
  ctaTextColorClass = "text-[#2E6FF3]",
  isCompact = false,
  onClick,
  rounded = true,
  contentPaddingClassName,
  priority = false,
  landing = false,
}: PromoBannerProps) => {
  const contentPadding = contentPaddingClassName ?? (landing
    ? "px-6 pb-6 -mt-6 sm:mt-0 sm:p-8 lg:p-12 sm:min-h-[220px] lg:min-h-[280px]"
    : isCompact
      ? "p-4 sm:p-5 min-h-[140px] lg:min-h-[170px]"
      : "p-5 lg:p-7 min-h-[180px] lg:min-h-[160px]");
  const titleClass = landing
    ? "text-2xl sm:text-3xl lg:text-4xl font-black leading-tight"
    : `font-bold leading-[1.2] ${isCompact ? "text-[16px] lg:text-xl" : "text-[18px] lg:text-4xl"}`;
  const descriptionClass = landing
    ? "text-base lg:text-lg leading-relaxed"
    : `leading-[1.3] ${isCompact ? "text-[12px] lg:text-sm" : "text-[11px] lg:text-lg lg:leading-relaxed"}`;
  const ctaClass = landing
    ? "flex w-full sm:inline-flex sm:w-auto rounded-md font-black text-sm sm:text-base px-5 py-3.5 sm:px-7 sm:py-4 shadow-lg"
    : `font-bold rounded-xl shadow-md ${isCompact
      ? "text-[10px] px-4 py-2"
      : "text-[12px] lg:text-base px-5 lg:px-8 py-2.5 lg:py-4 lg:rounded-md"}`;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`relative block w-full ${bgColorClass} overflow-hidden shadow-soft transition-all duration-500 group cursor-pointer active:scale-[0.99] ${rounded
        ? isCompact
          ? "rounded-md"
          : "rounded-md lg:rounded-lg"
        : ""
        }`}
    >
      {/* Background styling for the right side (landing on phones: a block on top) */}
      <div className={`pointer-events-none ${landing
        ? "relative h-52 w-full sm:absolute sm:inset-y-0 sm:right-0 sm:h-auto sm:w-[65%] lg:w-[55%]"
        : `absolute -right-9 sm:right-0 top-0 bottom-0 ${isCompact ? "w-[70%]" : "w-[65%] lg:w-[55%]"}`
        }`}>
        {!landing && (
          <div className={`absolute inset-0 bg-linear-to-l from-transparent from-70% ${gradientToClass} z-10`}></div>
        )}
        <div
          className={`absolute right-0 top-0 w-full h-full ${landing ? LANDING_FADE_CLASS : ""}`}
          style={landing ? LANDING_FADE_VARS : undefined}
        >
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority={priority}
            unoptimized={isUnoptimizableSrc(image)}
            sizes={landing ? "(max-width: 640px) 100vw, (max-width: 1024px) 65vw, 55vw" : "(max-width: 1024px) 65vw, 55vw"}
            className={isCompact
              ? "object-cover object-top-right"
              : "object-cover object-center"
            }
          />
        </div>
      </div>

      <div className={`relative z-10 flex flex-col justify-center ${contentPadding}`}>
        <div className={`space-y-1.5 ${isCompact
          ? "text-left w-[50%] lg:w-[45%]"
          : landing
            ? "text-center sm:text-left w-full sm:w-[50%] lg:w-[60%] space-y-2 lg:space-y-4"
            : "text-left w-[50%] lg:w-[60%] lg:space-y-4"
          }`}>
          <h2 className={`text-white tracking-tight ${titleClass}`}>
            {titleText}<br className={isCompact ? "hidden" : "hidden lg:block"} />
            <span className={isCompact ? "text-blue-100/90" : "text-blue-100/90 lg:text-white"}> {titleHighlight}</span>
          </h2>
          <p className={`text-white/90 font-medium ${descriptionClass}`}>
            {isCompact ? compactDescription : description}
          </p>

          <div className={isCompact ? "pt-2" : "pt-3"}>
            <span className={`${landing ? "" : "inline-flex"} bg-white ${ctaTextColorClass} items-center justify-center gap-2 hover:bg-blue-50 transition-all group-hover:translate-x-1 duration-300 ${ctaClass}`}>
              {ctaText} <ArrowRight className={landing ? "w-4 h-4" : `w-3.5 h-3.5 ${isCompact ? "" : "lg:w-5 lg:h-5"}`} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
