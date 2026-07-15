"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Zap,
  Star,
  Users,
  Sparkles,
  Check,
  Camera,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

// CSS-only avatar — zero external requests, instant render
const AVATAR_COLORS = [
  ["#dbeafe", "#1d4ed8"], // blue
  ["#dcfce7", "#15803d"], // green
  ["#fce7f3", "#be185d"], // pink
  ["#fef9c3", "#a16207"], // yellow
  ["#ede9fe", "#6d28d9"], // purple
  ["#ffedd5", "#c2410c"], // orange
];

const CSSAvatar = ({ name }: { name: string }) => {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  const [bg, text] = AVATAR_COLORS[idx];
  return (
    <span
      style={{ background: bg, color: text }}
      className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black shrink-0"
      aria-label={name}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
};

const MockBillCard = () => (
  <div className="relative bg-white rounded-2xl shadow-2xl shadow-primary/15 p-5 border border-slate-100 min-w-[260px] max-w-[300px]">
    {/* Header */}
    <div className="flex items-center justify-between mb-4">
      <div>
        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
          Makan Bareng Squad 🍜
        </p>
        <p className="text-lg font-black text-slate-900 mt-0.5">
          Rp 842.500
        </p>
      </div>
      <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center overflow-hidden">
        <Image
          src="/img/ai-icon.png"
          alt="AI"
          width={20}
          height={20}
          className="w-5 h-5 object-contain"
        />
      </div>
    </div>

    <div className="h-px bg-slate-100 mb-4" />

    {/* Breakdown */}
    <div className="space-y-2.5 mb-4">
      {[
        { name: "Budi", amount: "Rp 210.625", paid: true },
        { name: "Siti", amount: "Rp 210.625", paid: true },
        { name: "Andi", amount: "Rp 210.625", paid: false },
        { name: "Dinda", amount: "Rp 210.625", paid: false },
      ].map((person) => (
        <div key={person.name} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CSSAvatar name={person.name} />
            <span className="text-xs font-semibold text-slate-700">
              {person.name}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-900">
              {person.amount}
            </span>
            {person.paid ? (
              <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
              </span>
            ) : (
              <span className="w-4 h-4 rounded-full bg-slate-200" />
            )}
          </div>
        </div>
      ))}
    </div>

    {/* AI Badge */}
    <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-[8px] px-2.5 py-1.5">
      <Sparkles className="w-3 h-3 text-amber-500" />
      <span className="text-[10px] font-bold text-amber-700">
        AI auto-hitung dari foto struk 🔥
      </span>
    </div>
  </div>
);

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-white via-[#f0f7ff] to-primary/80">
      {/* Subtle background orbs — light & airy */}
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

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12 lg:pt-28 lg:pb-16">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* Left — Text */}
          <div className="flex-1 text-center lg:text-left">

            {/* Eyebrow pill */}
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-bold px-2 py-2 pl-4 rounded-full mb-6"
            >
              Gak Perlu Login
              <span className="ml-1 bg-emerald-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                NEW
              </span>
            </motion.div>

            {/* H1 — dark text on white bg, high contrast */}
            <motion.h1
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 leading-[1.15] tracking-tight mb-6"
            >
              Split Bill Jadi{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#2563eb]">
                Lebih Sat Set
              </span>{" "}
              & Anti Ribet
            </motion.h1>

            {/* Subheadline — slate-600 for comfortable reading on white */}
            <motion.p
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-lg mx-auto lg:mx-0 mb-8"
            >
              Aplikasi bagi tagihan online gratis! Scan struk otomatis, hitung patungan fair share, dan selesaikan pembayaran no drama. 100% praktis & akurat!
            </motion.p>

            {/* CTAs */}
            <motion.div
              custom={3}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
            >
              <Link
                href="/split-bill"
                className="group flex items-center justify-center gap-2 px-7 py-4 rounded-lg bg-primary text-white font-black text-base shadow-xl shadow-primary/30 hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <Camera className="w-5 h-5" />
                Coba Sekarang - Gratis!
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
               <a
                href="#cara-pakai"
                onClick={(e) => {
                  e.preventDefault();
                  // Find the target element
                  const target = document.getElementById("cara-pakai");
                  if (target) {
                    // 1. Calculate and scroll immediately (this will trigger scrolled=true and start rendering the banner)
                    const header = document.querySelector("header");
                    let headerHeight = header ? header.offsetHeight : 64;
                    let elementPosition = target.getBoundingClientRect().top;
                    let offsetPosition = elementPosition + window.scrollY - headerHeight - 2;

                    window.scrollTo({
                      top: offsetPosition,
                      behavior: "smooth",
                    });

                    // 2. Perform a secondary adjustment after 260ms once the banner height animation finishes
                    setTimeout(() => {
                      const updatedHeader = document.querySelector("header");
                      const updatedHeaderHeight = updatedHeader ? updatedHeader.offsetHeight : 64;
                      const updatedElementPosition = target.getBoundingClientRect().top;
                      const updatedOffset = updatedElementPosition + window.scrollY - updatedHeaderHeight - 2;
                      
                      window.scrollTo({
                        top: updatedOffset,
                        behavior: "smooth",
                      });
                    }, 260);
                  }
                }}
                className="flex items-center justify-center gap-2 px-7 py-4 rounded-lg bg-white border border-primary/30 text-primary font-bold text-base hover:bg-primary/5 hover:border-primary/60 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer shadow-sm"
              >
                Lihat Cara Pakainya
              </a>
            </motion.div>

            {/* Trust micro-row — dark text on white */}
            <motion.div
              custom={4}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="flex flex-wrap items-center gap-4 justify-center lg:justify-start mt-8"
            >
              <div className="flex items-center gap-1.5 text-slate-600 text-sm font-semibold">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <span>4.9/5 rating</span>
              </div>
              <div className="w-px h-4 bg-slate-200" />
              <div className="flex items-center gap-1.5 text-slate-600 text-sm font-semibold">
                <Users className="w-3.5 h-3.5 text-primary" />
                <span>Ribuan pengguna aktif</span>
              </div>
              <div className="w-px h-4 bg-slate-200" />
              <div className="flex items-center gap-1.5 text-slate-600 text-sm font-semibold">
                <Zap className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
                <span>No login needed</span>
              </div>
            </motion.div>
          </div>

          {/* Right — Mock UI Card */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 flex justify-center lg:justify-end relative"
          >
            {/* Glow behind card */}
            <div className="absolute inset-0 bg-primary/15 blur-[50px] rounded-full scale-75 pointer-events-none" />

            <div className="relative flex flex-col items-center justify-center min-h-[460px] sm:min-h-[650px] w-full max-w-[600px] lg:translate-x-16 xl:translate-x-24 overflow-visible">
              {/* Phone Mock behind the main card - shifted left */}
              <div className="absolute -z-10 pointer-events-none opacity-90 -translate-x-20 xs:-translate-x-24 sm:-translate-x-28 transition-transform w-[500px] xs:w-[480px] sm:w-[560px] h-auto">
                <Image
                  src="/img/mockup-phone.webp"
                  alt="Phone Mockup"
                  width={720}
                  height={720}
                  sizes="(max-width: 640px) 280px, 560px"
                  className="object-contain w-full h-auto"
                  priority
                  fetchPriority="high"
                />
              </div>

              {/* Main card - shifted right */}
              <div className="relative z-10 scale-[0.9] xs:scale-95 sm:scale-95 md:scale-100 transition-transform translate-x-16 xs:translate-x-20 sm:translate-x-24">
                <MockBillCard />

                {/* Camera floating badge (Foto struk -> beres!) */}
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut", delay: 0.4 }}
                  className="absolute -top-12 sm:-top-14 left-1/2 -translate-x-1/2 bg-emerald-500 text-white rounded-xl shadow-xl px-3 py-2 sm:px-3 sm:py-2 flex items-center gap-1.5 sm:gap-2 z-20 whitespace-nowrap"
                >
                  <Camera className="w-3.5 h-3.5 sm:w-3.5 sm:h-3.5" />
                  <span className="text-xs sm:text-[10px] font-black">Foto struk → beres!</span>
                </motion.div>
              </div>

              {/* Floating success card (AI scan selesai) — bottom-left of phone mockup */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 0.8 }}
                className="absolute bottom-10 sm:bottom-26 left-2 sm:left-8 -translate-x-2 sm:-translate-x-28 bg-white rounded-lg shadow-xl px-3 py-2 sm:px-4 sm:py-3 border border-slate-100 flex items-center gap-2 sm:gap-2.5 z-20"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" strokeWidth={3} />
                </div>
                <div>
                  <p className="text-[9px] sm:text-[10px] text-slate-400 font-medium">AI scan selesai</p>
                  <p className="text-[11px] sm:text-xs font-black text-slate-800">3 detik aja! ⚡</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

    </section>
  );
};
