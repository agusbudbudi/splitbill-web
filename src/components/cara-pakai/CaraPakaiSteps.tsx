"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";

export interface CaraPakaiStep {
  number: string;
  /** Icon sudah di-render (mis. `<UserPlus className="..." />`), bukan tipe
   * komponen — component reference gak bisa dioper dari Server Component
   * (page.tsx) ke Client Component ini lewat props. */
  icon: ReactNode;
  title: string;
  description: string;
  image: string;
}

interface CaraPakaiStepsSectionProps {
  titleHighlight: string;
  subtitle: string;
  steps: CaraPakaiStep[];
  /** false buat gambar yang udah pas ngisi frame sendiri (mis. screenshot
   * mockup HP) dan gak butuh napas ekstra. Default true (padded), cocok
   * buat ikon/ilustrasi placeholder. */
  imagePadding?: boolean;
}

// Section "Cara Pakai dalam N Langkah" lengkap (heading + slider/grid step).
// Mobile/tablet: horizontal snap-scroll slider + dot indicators. Desktop
// (lg+): grid 3 kolom statis. Dipakai bareng di semua halaman
// "/[fitur]/cara-pakai".
export function CaraPakaiStepsSection({
  titleHighlight,
  subtitle,
  steps,
  imagePadding = true,
}: CaraPakaiStepsSectionProps) {
  const mobileImageClass = imagePadding ? "object-contain p-10" : "object-contain";
  const desktopImageClass = imagePadding ? "object-contain p-8" : "object-contain";
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
    <section id="langkah-langkah" className="py-16 sm:py-24 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Cara Pakai{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-primary">
              {titleHighlight}
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-500 font-medium">{subtitle}</p>
        </div>

        {/* === Mobile/Tablet Slider === */}
        <div className="lg:hidden">
          <div className="-mx-4 overflow-hidden">
            <div
              ref={scrollRef}
              className="flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-none px-4 pb-4"
              style={{ scrollbarWidth: "none" }}
            >
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="flex-shrink-0 w-[82vw] snap-center flex flex-col items-center text-center"
                >
                  <div className={`relative w-full max-w-[300px] aspect-square rounded-xl overflow-hidden border border-primary/10 mb-6 bg-primary/5 ${imagePadding ? "p-10" : ""}`}>
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      sizes="80vw"
                      className={mobileImageClass}
                    />
                    <span className="absolute top-3 left-3 w-11 h-11 rounded-xl bg-primary flex items-center justify-center text-base font-black text-white shadow-md">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-800 flex items-center gap-2 mb-1.5">
                    {step.icon}
                    {step.title}
                  </h3>
                  <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-xs">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center flex-wrap gap-2 mt-5">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollToIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${activeIndex === idx ? "w-6 bg-primary" : "w-2 bg-slate-200 hover:bg-slate-300"
                  }`}
                aria-label={`Ke langkah ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* === Desktop Grid === */}
        <div className="hidden lg:grid grid-cols-3 gap-8 gap-y-12">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center text-center">
              <div className={`relative w-full max-w-[260px] aspect-square rounded-xl overflow-hidden border border-primary/10 mb-6 bg-primary/5 ${imagePadding ? "p-8" : ""}`}>
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  sizes="220px"
                  className={desktopImageClass}
                />
                <span className="absolute top-3 left-3 w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-sm font-black text-white shadow-md">
                  {step.number}
                </span>
              </div>
              <h3 className="text-base sm:text-xl font-black text-slate-800 flex items-center gap-2 mb-1.5">
                {step.icon}
                {step.title}
              </h3>
              <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-xs">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
