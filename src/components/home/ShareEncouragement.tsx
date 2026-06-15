"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ShareEncouragementProps {
  isCompact?: boolean;
}

export const ShareEncouragement = ({ isCompact = false }: ShareEncouragementProps) => {
  return (
    <Link
      href="/split-later"
      className={`relative block w-full bg-[#2E6FF3] overflow-hidden shadow-soft transition-all duration-500 group cursor-pointer active:scale-[0.99] ${isCompact
        ? "rounded-2xl"
        : "rounded-2xl lg:rounded-xl"
        }`}
    >
      {/* Background styling for the right side */}
      <div className={`absolute -right-9 sm:right-0 top-0 bottom-0 pointer-events-none ${isCompact
        ? "w-[65%]"
        : "w-[65%] lg:w-[55%]"
        }`}>
        <div className="absolute inset-0 bg-linear-to-l from-transparent from-80% to-[#2E6FF3] z-10"></div>
        <div className="absolute right-0 top-0 w-full h-full transition-transform duration-700 group-hover:scale-105">
          <Image
            src="/img/hero-split-later.png"
            alt="SplitBill Share Encouragement"
            fill
            sizes="(max-width: 1024px) 65vw, 55vw"
            className={`object-cover object-center ${isCompact
              ? ""
              : "lg:object-right"
              }`}
          />
        </div>
      </div>

      <div className={`relative z-10 flex flex-col justify-center ${isCompact
        ? "p-6 min-h-[180px]"
        : "p-6 lg:p-8 min-h-[180px] lg:min-h-[160px]"
        }`}>
        <div className={`text-left space-y-2 ${isCompact
          ? "w-[50%]"
          : "w-[50%] lg:w-[45%] lg:space-y-4"
          }`}>
          <h2 className={`text-white font-bold tracking-tight leading-[1.2] ${isCompact
            ? "text-[18px]"
            : "text-[18px] lg:text-4xl"
            }`}>
            Fokus healing dulu bestie,<br className={isCompact ? "hidden" : "hidden lg:block"} />
            <span className={isCompact ? "text-blue-100/90" : "text-blue-100/90 lg:text-white"}> split bill-nya belakangan!</span>
          </h2>
          <p className={`text-white/90 leading-[1.4] font-medium ${isCompact
            ? "text-[11px]"
            : "text-[11px] lg:text-lg lg:leading-relaxed"
            }`}>
            Tinggal catat pengeluaran,<br className={isCompact ? "hidden" : "hidden lg:block"} />
            bagi rata pas udah santai. Anti ribet!
          </p>

          <div className="pt-2">
            <span className={`inline-flex bg-white text-[#2E6FF3] font-bold rounded-xl items-center justify-center gap-2 hover:bg-blue-50 transition-all shadow-md group-hover:translate-x-1 duration-300 ${isCompact
              ? "text-[12px] px-5 py-2.5"
              : "text-[12px] lg:text-base px-5 lg:px-8 py-2.5 lg:py-4 lg:rounded-2xl"
              }`}>
              Coba Sekarang <ArrowRight className={`w-4 h-4 ${isCompact ? "" : "lg:w-5 lg:h-5"}`} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
