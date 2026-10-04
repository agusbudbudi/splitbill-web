"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";


const features = [
  {
    imageSrc: "/img/menu-split-bill.png",
    title: "Split Bill",
    description:
      "Foto struk biar AI hitung otomatis (Scan AI) atau bagi rincian secara manual. Sat-set!",
    badge: "Populer",
    href: "/split-bill",
    cta: "Coba Split Bill",
    caraPakaiHref: "/split-bill/cara-pakai",
  },
  {
    imageSrc: "/img/menu-split-later.png",
    title: "Split Later",
    description:
      "Nongkrong sepuasnya, kumpulin struknya, bagi tagihannya nanti pas santai.",
    badge: "Baru",
    href: "/split-later",
    cta: "Coba Split Later",
    caraPakaiHref: "/split-later/cara-pakai",
    requiresLogin: true,
  },
  {
    imageSrc: "/img/menu-shared-goal.png",
    title: "Shared Goals",
    description:
      "Nabung bareng squad buat rencana liburan, kado nikahan teman, atau impian bersama.",
    href: "/shared-goals",
    cta: "Mulai Nabung",
    caraPakaiHref: "/shared-goals/cara-pakai",
  },
  {
    imageSrc: "/img/menu-collect-money.png",
    title: "Collect Money (Patungan)",
    description:
      "Bikin link patungan uang kas, sewa lapangan futsal, atau donasi secara transparan.",
    href: "/collect-money",
    cta: "Bikin Patungan",
  },
  {
    imageSrc: "/img/menu-invoice.png",
    title: "Invoice",
    description:
      "Kirim rincian tagihan digital yang rapi, transparan, langsung ke WhatsApp.",
    href: "/invoice",
    cta: "Buat Invoice",
  },
  {
    imageSrc: "/img/menu-wallet.png",
    title: "Wallet",
    description:
      "Kelola dana masuk dari teman, pantau saldo patungan squad, dan catat pengeluaran grup.",
    href: "/wallet",
    cta: "Simpan Wallet",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

export const FeaturesSection = () => {
  return (
    <section id="fitur" className="py-16 sm:py-24 bg-[#f8f9fd] relative overflow-hidden">
      {/* Decorative blurry gradients */}
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4"
          >
            Semua yang lo butuhin buat{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
              split bill tanpa drama
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-base sm:text-lg text-slate-500 font-medium"
          >
            Bagi tagihan <span className="text-primary font-bold">sat set</span>, hitung patungan <span className="text-primary font-bold">anti ribet & akurat</span>. Link pembayaran langsung spill!
          </motion.p>
        </div>

        {/* Bento Grid — 2 Columns on Mobile, 3 Columns on Large Screens */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8"
        >
          {features.map((feat) => (
            <motion.div
              key={feat.title}
              variants={cardVariants}
              className="h-full"
            >
              <div className="relative flex flex-col h-full bg-white rounded-xl p-4 sm:p-6 border border-slate-100/80 shadow-[0_4px_20px_-4px_rgba(71,159,234,0.08)] hover:shadow-[0_12px_30px_-6px_rgba(71,159,234,0.15)] hover:border-primary/20 transition-all duration-300 overflow-hidden">
                {feat.badge && (
                  <span className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-lg">
                    {feat.badge}
                  </span>
                )}
                <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 flex-1">
                  <div className="relative shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-md overflow-hidden bg-primary/10 p-2">
                    <Image
                      src={feat.imageSrc}
                      alt={feat.title}
                      fill
                      className="object-contain p-2"
                      sizes="64px"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-lg font-black text-slate-800 mb-1">
                      {feat.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-slate-500 leading-relaxed">
                      {feat.description}
                    </p>
                    {feat.requiresLogin && (
                      <p className="mt-2 text-xs font-bold text-amber-600">Perlu login</p>
                    )}
                  </div>
                </div>

                <div className="mt-4 sm:mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                  <Link
                    href={feat.href}
                    className="group inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-md bg-primary text-white font-black text-sm hover:bg-primary/90 active:scale-95 transition-all"
                  >
                    {feat.cta}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  {feat.caraPakaiHref && (
                    <Link
                      href={feat.caraPakaiHref}
                      className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold text-primary hover:underline"
                    >
                      Cara Pakai
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
