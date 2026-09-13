"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { trackCaraPakaiLP } from "@/lib/gtag";

interface CaraPakaiHeroProps {
  /** Nama fitur buat GA tracking, mis. "split-bill", "shared-goals". */
  feature: string;
  imageSrc: string;
  imageAlt: string;
  titleLine1: string;
  titleHighlight: string;
  description: string;
  ctaText: string;
  ctaHref: string;
}

// Mobile: image di bawah teks, normal flow (stacked). sm+: pola PromoBanner
// (bg solid + image kanan absolute dengan teks di kirinya). Cuma tombol CTA
// yang clickable, bukan seluruh section, karena ini hero halaman (banyak
// konten lain di bawahnya), bukan promo card biasa. Dipakai bareng di semua
// halaman "/[fitur]/cara-pakai".
export function CaraPakaiHero({
  feature,
  imageSrc,
  imageAlt,
  titleLine1,
  titleHighlight,
  description,
  ctaText,
  ctaHref,
}: CaraPakaiHeroProps) {
  return (
    <div className="relative block w-full bg-gradient-to-r from-[#4b8df0] to-[#6bcbfa] overflow-hidden">
      {/* Desktop/tablet: image absolute di kanan, sejajar teks */}
      <div className="hidden sm:block absolute inset-y-0 right-0 pointer-events-none w-[65%] lg:w-[62%]">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(max-width: 1024px) 65vw, 62vw"
          className="object-cover object-right-top"
          priority
        />
      </div>

      <div className="relative z-10 flex flex-col sm:justify-center max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-10 pb-0 sm:py-10 lg:py-14 sm:min-h-[200px] lg:min-h-[260px]">
        <div className="text-center sm:text-left space-y-1.5 lg:space-y-4 w-full sm:w-[50%] lg:w-[50%]">
          <h2 className="text-white font-black tracking-tight leading-tight text-3xl sm:text-4xl md:text-5xl">
            {titleLine1}
            <br className="hidden lg:block" />
            <span className="text-blue-100/90 lg:text-white"> {titleHighlight}</span>
          </h2>
          <p className="text-white/90 font-medium leading-relaxed text-base sm:text-lg">
            {description}
          </p>

          <div className="pt-3 flex justify-center sm:justify-start">
            <Link
              href={ctaHref}
              onClick={() => trackCaraPakaiLP.ctaClick(feature, "hero")}
              className="group inline-flex bg-white text-primary font-black rounded-md items-center justify-center gap-2 hover:bg-blue-50 hover:scale-105 active:scale-95 transition-all shadow-md duration-300 text-sm sm:text-base px-7 py-3.5"
            >
              {ctaText} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Mobile only: image di bawah teks, normal flow (bukan overlay).
            Full-bleed (-mx-4, keluar dari px-4 parent) biar gambar kelihatan
            lebih besar. */}
        <div className="sm:hidden relative w-[calc(100%+2rem)] -mx-4 aspect-[3/2] mt-6">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="100vw"
            className="object-cover object-top"
          />
        </div>
      </div>
    </div>
  );
}
