"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Camera } from "lucide-react";

export const CTABannerSection = () => {
  const cards = [
    {
      title: "Privacy First",
      desc: "Data kamu tersimpan aman di server kami, bisa diakses kapan saja dari perangkat mana saja.",
      imageSrc: "/img/icon-privacy.png",
      bg: "bg-emerald-50/80 border-emerald-100/50",
      bgLight: "bg-emerald-100/90",
      bgHover: "group-hover:bg-emerald-200/90",
    },
    {
      title: "No Login Required",
      desc: "Bisa langsung pakai tanpa ribet daftar. Cocok buat yang mau sat-set!",
      imageSrc: "/img/icon-no-login.png",
      bg: "bg-blue-50/80 border-blue-100/50",
      bgLight: "bg-blue-100/90",
      bgHover: "group-hover:bg-blue-200/90",
    },
    {
      title: "AI Powered",
      desc: "Gak perlu ngetik manual satu-satu, cukup jepret & biar AI yang hitung.",
      imageSrc: "/img/icon-ai-powered.png",
      bg: "bg-purple-50/80 border-purple-100/50",
      bgLight: "bg-purple-100/90",
      bgHover: "group-hover:bg-purple-200/90",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-white via-[#f0f7ff] to-primary/8 relative overflow-hidden">
      {/* Subtle background orbs — light & airy, matching Hero */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top-right: soft primary blue wash */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.25, 0.4, 0.25] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-5%] w-[45vw] h-[45vw] max-w-[650px] max-h-[650px] rounded-full bg-primary/20 blur-[90px]"
        />
        {/* Bottom-left: lighter blue-white glow */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-10%] left-[-5%] w-[40vw] h-[40vw] max-w-[550px] max-h-[550px] rounded-full bg-sky-300/20 blur-[80px]"
        />
      </div>

      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.12]"
        style={{
          backgroundImage: `radial-gradient(circle, #479fea 1.5px, transparent 1.5px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center lg:items-start text-center lg:text-left lg:col-span-7"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-6">
              Mulai Split Bill{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#2563eb]">
                Sat-Set & No Drama
              </span>{" "}
              Sekarang!
            </h2>

            {/* Paragraph */}
            <p className="text-base sm:text-lg md:text-xl text-slate-600 font-medium max-w-xl mb-10 leading-relaxed">
              Nongkrong seru tanpa drama bayar-bayar. AI scan struk siap bantu hitungin semua pengeluaran geng lo.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                href="/split-bill"
                className="group flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-primary text-white font-black text-base shadow-2xl shadow-primary/30 hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <Camera className="w-5 h-5" />
                Coba Gratis Sekarang
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/login"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-white border border-primary/30 text-primary font-bold text-base hover:bg-primary/5 hover:border-primary/60 hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm"
              >
                Buat Akun Baru
              </Link>
            </div>

            {/* Bottom stats micro-copy */}
            <p className="text-xs font-semibold text-slate-500 mt-6">
              Gak perlu kartu kredit · Langsung pakai · Gak wajib bikin akun
            </p>
          </motion.div>

          {/* Right Column - Cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col gap-4 lg:col-span-5 w-full"
          >
            {cards.map((card, idx) => {
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 * idx }}
                  whileHover={{ x: 6, scale: 1.02 }}
                  className={`flex gap-4 p-5 sm:p-6 rounded-2xl bg-white/70 backdrop-blur-md border ${card.bg} shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgba(71,159,234,0.06)] transition-[box-shadow,border-color,background-color] duration-300`}
                >
                  <div className={`flex-shrink-0 w-12 h-12 rounded-lg ${card.bgLight} ${card.bgHover} flex items-center justify-center p-1 transition-all duration-300 group-hover:scale-105`}>
                    <img
                      src={card.imageSrc}
                      alt={card.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-col">
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-800 mb-1">
                      {card.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

        </div>
      </div>
    </section>
  );
};
