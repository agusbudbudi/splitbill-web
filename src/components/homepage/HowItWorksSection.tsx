"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { UserPlus, Camera, Send } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Camera,
    title: "Foto / Upload Struk",
    description: "Tinggal cekrek struk makan-makan lo. Gak usah repot ketik ulang menu satu-satu.",
    image: "/img/step-scan.jpg",
    color: "from-blue-500 to-cyan-500",
    iconBg: "bg-primary",
  },
  {
    number: "02",
    icon: UserPlus,
    title: "Pilih Teman & Menu",
    description: "Assign siapa aja yang makan menu apa. Biar AI yang kalkulasiin pembagian pajaknya.",
    image: "/img/step-add-friend.jpg",
    color: "from-[#EEA420] to-[#F5BE4E]",
    iconBg: "bg-[#EEA420]",
  },
  {
    number: "03",
    icon: Send,
    title: "Share Link Tagihan",
    description: "Kirim link rincian tagihan ke WhatsApp grup. Temen lo tinggal bayar via e-wallet/bank.",
    image: "/img/step-share.jpg",
    color: "from-[#2EC866] to-[#4AD37A]",
    iconBg: "bg-[#2EC866]",
  },
];

export const HowItWorksSection = () => {
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
    <section id="cara-pakai" className="py-16 sm:py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4"
          >
            3 Langkah Gampang,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-primary">
              Sat-Set Beres!
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-base sm:text-lg text-slate-500 font-medium"
          >
            Gak pake ribet instal aplikasi atau daftar akun. Langsung cobain lewat web.
          </motion.p>
        </div>

        {/* === Mobile Slider === */}
        <div className="lg:hidden">
          <div className="-mx-4 overflow-hidden">
            <div
              ref={scrollRef}
              className="flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-none px-4 pb-4"
              style={{ scrollbarWidth: "none" }}
            >
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.number}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                    style={{ willChange: "transform, opacity" }}
                    className="flex-shrink-0 w-[82vw] snap-center flex flex-col items-center text-center"
                  >
                    {/* Image */}
                    <div className="relative w-full max-w-[260px] aspect-square rounded-3xl overflow-hidden mb-6">
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

                    {/* Step Circle Icon */}
                    <div className={`w-12 h-12 rounded-full ${step.iconBg} text-white flex items-center justify-center mb-4 shadow-lg`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Info */}
                    <h3 className="text-xl font-black text-slate-800 mb-2">{step.title}</h3>
                    <p className="text-sm font-medium text-slate-500 max-w-xs leading-relaxed px-2">{step.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-5">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollToIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${activeIndex === idx
                  ? "w-6 bg-primary"
                  : "w-2 bg-slate-200 hover:bg-slate-300"
                  }`}
                aria-label={`Go to step ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* === Desktop Grid === */}
        <div className="hidden lg:grid grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="absolute top-[130px] left-[15%] right-[15%] h-0.5 border-t-2 border-dashed border-slate-200 -z-10" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                style={{ willChange: "transform, opacity" }}
                className="flex flex-col items-center text-center group"
              >
                {/* Image Showcase */}
                <div className="relative w-full max-w-[280px] aspect-square rounded-xl overflow-hidden border border-slate-100 mb-8 transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    sizes="300px"
                    className="object-cover"
                  />
                  <span className="absolute top-3 left-3 w-11 h-11 rounded-xl bg-white/95 backdrop-blur-sm flex items-center justify-center text-base sm:text-lg font-black text-slate-900 shadow-md">
                    {step.number}
                  </span>
                </div>

                {/* Step Circle Icon */}
                <div className={`w-12 h-12 rounded-full ${step.iconBg} text-white flex items-center justify-center mb-5 shadow-lg transition-all duration-300 relative group-hover:scale-110`}>
                  <Icon className="w-5 h-5" />
                </div>

                {/* Info */}
                <h3 className="text-xl font-black text-slate-800 mb-2">{step.title}</h3>
                <p className="text-sm font-medium text-slate-500 max-w-xs leading-relaxed">{step.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
