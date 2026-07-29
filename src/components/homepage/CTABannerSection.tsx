"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
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
    <section className="py-16 sm:py-24 bg-white relative overflow-hidden">
      {/* Soft bottom spotlight */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_110%,rgba(71,159,234,0.16),transparent)]" />

      {/* Aurora blobs — matches Hero */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.12, 1], x: [0, 24, 0], y: [0, -18, 0], opacity: [0.28, 0.42, 0.28] }}
          transition={{ repeat: Infinity, duration: 9, ease: "easeInOut" }}
          className="absolute top-[-15%] right-[-8%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] rounded-full bg-primary/25 blur-[100px]"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], x: [0, -22, 0], y: [0, 18, 0], opacity: [0.18, 0.32, 0.18] }}
          transition={{ repeat: Infinity, duration: 11, ease: "easeInOut", delay: 1.5 }}
          className="absolute bottom-[-15%] left-[-10%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] rounded-full bg-sky-300/25 blur-[90px]"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.28, 0.15] }}
          transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 3 }}
          className="absolute top-[18%] right-[8%] w-[25vw] h-[25vw] max-w-[350px] max-h-[350px] rounded-full bg-emerald-300/20 blur-[80px]"
        />
      </div>

      {/* Fine grid, faded toward the edges — matches Hero */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#479fea0d 1px, transparent 1px), linear-gradient(90deg, #479fea0d 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse 70% 55% at 50% 75%, black, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 55% at 50% 75%, black, transparent 75%)",
        }}
      />

      {/* Subtle grain — matches Hero */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
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
                className="group flex items-center justify-center gap-2 px-8 py-4 rounded-md bg-primary text-white font-black text-base shadow-2xl shadow-primary/30 hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <Camera className="w-5 h-5" />
                Coba Gratis Sekarang
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/register"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-md border border-primary/20 text-primary font-bold text-base hover:bg-primary/5 hover:border-primary/60 hover:scale-105 active:scale-95 transition-all duration-200"
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
                  className={`flex gap-4 p-5 sm:p-6 rounded-md bg-white/70 backdrop-blur-md border ${card.bg} shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgba(71,159,234,0.06)] transition-[box-shadow,border-color,background-color] duration-300`}
                >
                  <div className={`flex-shrink-0 w-12 h-12 rounded-sm ${card.bgLight} ${card.bgHover} flex items-center justify-center p-1 transition-all duration-300 group-hover:scale-105 relative`}>
                    <Image
                      src={card.imageSrc}
                      alt={card.title}
                      width={48}
                      height={48}
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
