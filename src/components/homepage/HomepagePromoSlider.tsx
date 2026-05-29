"use client";

import React, { useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useAuthStore } from "@/lib/stores/authStore";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

const HomepageAIScanCard = dynamic(
  () =>
    import("./HomepageAIScanCard").then(
      (mod) => mod.HomepageAIScanCard,
    ),
  { ssr: false },
);

export const HomepagePromoSlider = () => {
  const { isAuthenticated } = useAuthStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-10 bg-white border-b border-slate-100 relative group/section overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Navigation Buttons - Hidden on touch devices, shown on hover/desktop */}
        <div className="absolute top-1/2 -translate-y-1/2 left-2 z-20 opacity-0 group-hover/section:opacity-100 transition-opacity duration-300 pointer-events-none sm:block hidden">
          <button
            onClick={() => scroll("left")}
            className="w-10 h-10 rounded-full bg-white border border-slate-200/80 shadow-md flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white hover:border-primary active:scale-95 transition-all pointer-events-auto cursor-pointer"
            aria-label="Slide kiri"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="absolute top-1/2 -translate-y-1/2 right-2 z-20 opacity-0 group-hover/section:opacity-100 transition-opacity duration-300 pointer-events-none sm:block hidden">
          <button
            onClick={() => scroll("right")}
            className="w-10 h-10 rounded-full bg-white border border-slate-200/80 shadow-md flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white hover:border-primary active:scale-95 transition-all pointer-events-auto cursor-pointer"
            aria-label="Slide kanan"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Container with Bleed support - Matched with TestimonialsSection alignment */}
        <div className="-mx-4 sm:mx-0 overflow-hidden">
          <div
            ref={scrollContainerRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide px-4 sm:px-0 scroll-pl-4 sm:scroll-pl-0 items-stretch"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {/* Card 1: AI Scan Quota */}
            <div className="flex-shrink-0 w-[85vw] sm:w-[480px] snap-start h-auto flex">
              <HomepageAIScanCard />
            </div>

            {/* Card 2: Split Later Feature */}
            <div className="flex-shrink-0 w-[85vw] sm:w-[480px] snap-start h-auto flex">
              <Link href="/split-later" className="block w-full h-full group/card transition-all duration-300 hover:scale-[1.005] active:scale-[0.99]">
                <div className="relative p-[1.5px] rounded-2xl bg-gradient-to-br from-blue-400 via-blue-500 to-primary shadow-lg shadow-primary/5 h-full flex flex-col overflow-hidden">
                  {/* Stick Badge - Primary Blue Style */}
                  <div className="absolute top-0 right-0 px-3 py-1.5 rounded-bl-xl flex items-center gap-1.5 text-[9px] font-black uppercase bg-primary text-white z-30 shadow-md transition-transform group-hover/card:scale-105 origin-top-right">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span>NEW</span>
                  </div>

                  <div className="bg-white rounded-[calc(1rem-1.5px)] p-6 flex-grow flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none" />

                    <div className="flex items-center gap-4">
                      <div className="shrink-0 w-16 h-16 rounded-full flex items-center justify-center transition-transform group-hover/card:scale-110 overflow-hidden">
                        <img
                          src="/img/menu-split-later.png"
                          alt="Split Later"
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight leading-tight">
                          Bayar Dulu, Bagi Kemudian dengan Split Later! 🕒
                        </h4>
                      </div>
                    </div>

                    <div className="pt-5 mt-auto">
                      <div className="w-full flex items-center justify-center gap-2 h-12 bg-white hover:bg-primary border-1 border-primary text-primary hover:text-white font-bold text-sm rounded-lg transition-all cursor-pointer">
                        Coba Split Later
                        <ChevronRight className="w-4 h-4 group-hover/card:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Card 3: Review Rewards */}
            <div className="flex-shrink-0 w-[85vw] sm:w-[480px] snap-start h-auto flex">
              <Link href="/review" className="block w-full h-full group/card transition-all duration-300 hover:scale-[1.005] active:scale-[0.99]">
                <div className="relative p-[1.5px] rounded-2xl bg-gradient-to-br from-amber-200 via-orange-300 to-yellow-200 shadow-lg shadow-amber-200/5 h-full flex flex-col overflow-hidden">
                  {/* Stick Badge - Pastel Orange Style */}
                  <div className="absolute top-0 right-0 px-3 py-1.5 rounded-bl-xl flex items-center gap-1.5 text-[9px] font-black uppercase bg-orange-400 text-white z-30 shadow-md transition-transform group-hover/card:scale-105 origin-top-right">
                    <Sparkles className="w-3 h-3 fill-current" />
                    <span>REWARDS</span>
                  </div>

                  <div className="bg-white rounded-[calc(1rem-1.5px)] p-6 flex-grow flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none" />

                    <div className="flex items-center gap-4">
                      <div className="shrink-0 w-16 h-16 rounded-full flex items-center justify-center transition-transform group-hover/card:scale-110 overflow-hidden">
                        <img
                          src="/img/icon-rewards.jpg"
                          alt="Review Reward"
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight leading-tight">
                          Kasih Review Pertama & Dapetin Rewards Spesial! 🎁
                        </h4>
                      </div>
                    </div>

                    <div className="pt-5 mt-auto">
                      <div className="w-full flex items-center justify-center gap-2 h-12 bg-white hover:bg-orange-500 border-1 border-orange-400 text-orange-600 hover:text-white font-bold text-sm rounded-lg transition-all cursor-pointer">
                        Tulis Review Sekarang
                        <ChevronRight className="w-4 h-4 group-hover/card:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
