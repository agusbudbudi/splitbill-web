"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { trackCaraPakaiLP } from "@/lib/gtag";

export interface FeatureGridItem {
  id: string;
  title: string;
  description: string;
  image: string;
  href: string;
  ctaText: string;
  /** Link ke halaman "/[fitur]/cara-pakai", kosong kalau belum ada. */
  caraPakaiHref?: string;
  badge?: string;
  requiresLogin?: boolean;
}

interface CaraPakaiFeatureGridProps {
  /** Nama halaman buat GA tracking, mis. "all-feature". */
  feature: string;
  titlePrefix: string;
  titleHighlight: string;
  description: string;
  features: FeatureGridItem[];
}

// Section grid semua fitur — card clickable ke fitur + link "Cara Pakai"
// kalau tersedia. Gaya card sama dengan CaraPakaiKillerFeatures.
export function CaraPakaiFeatureGrid({
  feature,
  titlePrefix,
  titleHighlight,
  description,
  features,
}: CaraPakaiFeatureGridProps) {
  return (
    <section id="semua-fitur" className="py-16 sm:py-24 bg-[#f8f9fd] scroll-mt-20">
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

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {features.map((item) => (
            <div
              key={item.id}
              className="relative flex flex-col bg-white rounded-xl p-4 sm:p-6 border border-slate-100/80 shadow-[0_4px_20px_-4px_rgba(71,159,234,0.08)] hover:shadow-[0_12px_30px_-6px_rgba(71,159,234,0.15)] hover:border-primary/20 transition-all duration-300 overflow-hidden"
            >
              {item.badge && (
                <span className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-lg">
                  {item.badge}
                </span>
              )}
              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 flex-1">
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
                  <h3 className="text-sm sm:text-lg font-black text-slate-800 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-slate-500 leading-relaxed">
                    {item.description}
                  </p>
                  {item.requiresLogin && (
                    <p className="mt-2 text-xs font-bold text-amber-600">Perlu login</p>
                  )}
                </div>
              </div>

              <div className="mt-4 sm:mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                <Link
                  href={item.href}
                  onClick={() => trackCaraPakaiLP.ctaClick(feature, "feature-card")}
                  className="group inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-md bg-primary text-white font-black text-sm hover:bg-primary/90 active:scale-95 transition-all"
                >
                  {item.ctaText}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                {item.caraPakaiHref && (
                  <Link
                    href={item.caraPakaiHref}
                    onClick={() => trackCaraPakaiLP.ctaClick(feature, "cara-pakai-link")}
                    className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold text-primary hover:underline"
                  >
                    Cara Pakai
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
