"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const paymentLogos = [
  { src: "/img/logo-gopay.png", alt: "GoPay" },
  { src: "/img/logo-ovo.png", alt: "OVO" },
  { src: "/img/logo-dana.png", alt: "Dana" },
  { src: "/img/logo-bca.png", alt: "BCA" },
  { src: "/img/logo-mandiri.png", alt: "Mandiri" },
  { src: "/img/logo-bni.png", alt: "BNI" },
  { src: "/img/logo-bri.png", alt: "BRI" },
  { src: "/img/logo-shopeepay.png", alt: "ShopeePay" },
  { src: "/img/logo-linkaja.png", alt: "LinkAja" },
  { src: "/img/logo-jenius.png", alt: "Jenius" },
];

// Duplicate for seamless loop
const allLogos = [...paymentLogos, ...paymentLogos];

export const SocialProofBar = () => {
  return (
    <section className="bg-white border-y border-slate-100 py-5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
          {/* Left label */}
          <div className="shrink-0 text-center sm:text-left">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
              Bisa bayar via
            </p>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-8 bg-slate-200 shrink-0" />

          {/* Scrolling logos */}
          <div className="relative w-full overflow-hidden">
            {/* Left fade */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            {/* Right fade */}
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 18,
                  ease: "linear",
                },
              }}
              className="flex items-center gap-6 w-max"
            >
              {allLogos.map((logo, i) => (
                <div
                  key={`${logo.alt}-${i}`}
                  className="flex items-center justify-center h-7 px-2 shrink-0"
                >
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={56}
                    height={28}
                    className="h-6 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-50 hover:opacity-100"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
