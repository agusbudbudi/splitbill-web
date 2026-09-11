"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Camera, Share2, Users, LucideIcon } from "lucide-react";

interface Step {
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
  image: string;
}

const steps: Step[] = [
  {
    number: "01",
    icon: Camera,
    title: "Foto struknya",
    description: "Upload kapan aja selama liburan.",
    image: "/img/step-scan.jpg",
  },
  {
    number: "02",
    icon: Users,
    title: "Atur yang ikut bayar",
    description: "Split rata atau assign item ke orang tertentu.",
    image: "/img/step-add-friend.jpg",
  },
  {
    number: "03",
    icon: Share2,
    title: "Share hasilnya",
    description: "Kirim rincian ke grup WhatsApp.",
    image: "/img/step-share.jpg",
  },
];

// Mobile/tablet: horizontal snap slider + dot indicators, sama pola dengan
// HowItWorksSection di LP utama. Desktop (lg+): grid 3 kolom statis.
export const CaraKerjaSteps = () => {
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
  }, []);

  const scrollToIndex = (idx: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const itemWidth = el.scrollWidth / steps.length;
    el.scrollTo({ left: idx * itemWidth, behavior: "smooth" });
  };

  return (
    <>
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
                <div className="relative w-full max-w-[260px] aspect-square rounded-xl overflow-hidden border border-slate-100 mb-6 shadow-[0_4px_20px_-4px_rgba(71,159,234,0.1)]">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    sizes="80vw"
                    className="object-cover"
                  />
                  <span className="absolute top-3 left-3 w-11 h-11 rounded-xl bg-white/95 backdrop-blur-sm flex items-center justify-center text-base font-black text-slate-900 shadow-md">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-800 flex items-center gap-2 mb-1.5">
                  <step.icon className="h-5 w-5 text-primary" />
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
        <div className="flex justify-center gap-2 mt-5">
          {steps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                activeIndex === idx ? "w-6 bg-primary" : "w-2 bg-slate-200 hover:bg-slate-300"
              }`}
              aria-label={`Ke langkah ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* === Desktop Grid === */}
      <div className="hidden lg:grid grid-cols-3 gap-8">
        {steps.map((step) => (
          <div key={step.number} className="flex flex-col items-center text-center">
            <div className="relative w-full max-w-[220px] aspect-square rounded-xl overflow-hidden border border-slate-100 mb-6 shadow-[0_4px_20px_-4px_rgba(71,159,234,0.1)]">
              <Image
                src={step.image}
                alt={step.title}
                fill
                sizes="220px"
                className="object-cover"
              />
              <span className="absolute top-3 left-3 w-10 h-10 rounded-xl bg-white/95 backdrop-blur-sm flex items-center justify-center text-sm font-black text-slate-900 shadow-md">
                {step.number}
              </span>
            </div>
            <h3 className="text-base sm:text-xl font-black text-slate-800 flex items-center gap-2 mb-1.5">
              <step.icon className="h-5 w-5 text-primary" />
              {step.title}
            </h3>
            <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-xs">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};
