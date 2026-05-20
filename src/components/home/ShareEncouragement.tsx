"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const ShareEncouragement = () => {
  return (
    <Link
      href="/split-later"
      className="relative block w-full rounded-lg bg-[#2E6FF3] overflow-hidden shadow-sm cursor-pointer group active:scale-[0.98] transition-all duration-300"
    >
      {/* Background styling for the right side to simulate the image if the asset is missing, 
          or you can uncomment and use the actual image if you have it in public folder */}
      <div className="absolute right-0 top-0 bottom-0 w-[55%] pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-l from-transparent from-80% to-[#2E6FF3] z-10"></div>
        <div className="absolute right-0 top-0 w-full h-full transition-opacity">
          <Image
            src="/img/illustration-share.png"
            alt="SplitBill Share Encouragement"
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="relative z-10 p-5 sm:p-6 flex flex-col justify-center min-h-[170px]">
        <div className="w-[70%] sm:w-[60%] text-left">
          <h2 className="text-white font-bold text-[15px] sm:text-[18px] md:text-xl leading-[1.25] mb-2 tracking-tight">
            Fokus liburan dulu,<br />
            hitung patungan belakangan!
          </h2>
          <p className="text-white/90 text-[11px] sm:text-xs md:text-sm leading-[1.4] mb-4 font-medium">
            Simpan dulu semua pengeluaran tripmu,<br className="hidden sm:block" />
            baginya gampang nanti pas sudah santai.
          </p>
          
          <span className="inline-flex bg-white text-[#2E6FF3] font-bold text-[12px] sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-[12px] items-center justify-center gap-2 hover:bg-blue-50 transition-all shadow-sm">
            Coba Sekarang <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
};
