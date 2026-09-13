"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { trackCaraPakaiLP } from "@/lib/gtag";

export interface KillerFeature {
  /** Icon sudah di-render (mis. `<Camera className="..." />`), bukan tipe
   * komponen — component reference gak bisa dioper dari Server Component
   * (page.tsx) ke Client Component ini lewat props. */
  icon: ReactNode;
  title: string;
  description: string;
  image: string;
  isNew?: boolean;
}

interface CaraPakaiKillerFeaturesProps {
  /** Nama fitur buat GA tracking, mis. "split-bill", "shared-goals". */
  feature: string;
  titlePrefix: string;
  titleHighlight: string;
  description: string;
  features: KillerFeature[];
  /** Jumlah kolom grid di desktop (lg+). Default 2. */
  columns?: 2 | 3;
  ctaText: string;
  ctaHref: string;
}

// Section "Fitur yang Bikin [Fitur] Beda dari yang Lain" — grid card fitur
// unggulan + CTA. Dipakai bareng di semua halaman "/[fitur]/cara-pakai".
export function CaraPakaiKillerFeatures({
  feature,
  titlePrefix,
  titleHighlight,
  description,
  features,
  columns = 2,
  ctaText,
  ctaHref,
}: CaraPakaiKillerFeaturesProps) {
  return (
    <section id="fitur-unggulan" className="py-16 sm:py-24 bg-[#f8f9fd] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
            {titlePrefix}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
              {titleHighlight}
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-500 font-medium">{description}</p>
        </div>

        <div
          className={`grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 ${
            columns === 3 ? "lg:grid-cols-3" : ""
          }`}
        >
          {features.map((item) => (
            <div
              key={item.title}
              className="relative flex items-start gap-4 bg-white rounded-xl p-5 sm:p-6 border border-slate-100/80 shadow-[0_4px_20px_-4px_rgba(71,159,234,0.08)] overflow-hidden"
            >
              {item.isNew && (
                <span className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-lg">
                  Baru
                </span>
              )}
              <div className="relative shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-md overflow-hidden bg-primary/10 p-2">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-contain p-2"
                  sizes="64px"
                />
              </div>
              <div>
                <h3 className="flex items-center gap-2 text-base sm:text-lg font-black text-slate-800 mb-1">
                  {item.icon}
                  {item.title}
                </h3>
                <p className="text-sm font-medium text-slate-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href={ctaHref}
            onClick={() => trackCaraPakaiLP.ctaClick(feature, "killer-feature")}
            className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-md bg-primary text-white font-black text-sm sm:text-base shadow-xl shadow-primary/30 hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            {ctaText}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
