"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PromoBannerProps {
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
}: PromoBannerProps) => {
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
      {/* Background styling for the right side */}
      <div className={`absolute -right-9 sm:right-0 top-0 bottom-0 pointer-events-none ${isCompact
        ? "w-[70%]"
        : "w-[65%] lg:w-[55%]"
        }`}>
        <div className={`absolute inset-0 bg-linear-to-l from-transparent from-70% ${gradientToClass} z-10`}></div>
        <div className="absolute right-0 top-0 w-full h-full">
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(max-width: 1024px) 65vw, 55vw"
            className={isCompact
              ? "object-cover object-top-right"
              : "object-cover object-center"
            }
          />
        </div>
      </div>

      <div className={`relative z-10 flex flex-col justify-center ${contentPaddingClassName ?? (isCompact
        ? "p-4 sm:p-5 min-h-[140px] lg:min-h-[170px]"
        : "p-5 lg:p-7 min-h-[180px] lg:min-h-[160px]"
        )}`}>
        <div className={`text-left space-y-1.5 ${isCompact
          ? "w-[50%] lg:w-[45%]"
          : "w-[50%] lg:w-[60%] lg:space-y-4"
          }`}>
          <h2 className={`text-white font-bold tracking-tight leading-[1.2] ${isCompact
            ? "text-[16px] lg:text-xl"
            : "text-[18px] lg:text-4xl"
            }`}>
            {titleText}<br className={isCompact ? "hidden" : "hidden lg:block"} />
            <span className={isCompact ? "text-blue-100/90" : "text-blue-100/90 lg:text-white"}> {titleHighlight}</span>
          </h2>
          <p className={`text-white/90 leading-[1.3] font-medium ${isCompact
            ? "text-[12px] lg:text-sm"
            : "text-[11px] lg:text-lg lg:leading-relaxed"
            }`}>
            {isCompact ? compactDescription : description}
          </p>

          <div className={isCompact ? "pt-2" : "pt-3"}>
            <span className={`inline-flex bg-white ${ctaTextColorClass} font-bold rounded-xl items-center justify-center gap-2 hover:bg-blue-50 transition-all shadow-md group-hover:translate-x-1 duration-300 ${isCompact
              ? "text-[10px] px-4 py-2"
              : "text-[12px] lg:text-base px-5 lg:px-8 py-2.5 lg:py-4 lg:rounded-md"
              }`}>
              {ctaText} <ArrowRight className={`w-3.5 h-3.5 ${isCompact ? "" : "lg:w-5 lg:h-5"}`} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
