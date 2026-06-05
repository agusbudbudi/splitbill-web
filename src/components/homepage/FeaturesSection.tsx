"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";


const features = [
  {
    imageSrc: "/img/menu-split-bill.png",
    title: "Split Bill",
    description:
      "Foto struk biar AI hitung otomatis (Scan AI) atau bagi rincian secara manual. Sat-set!",
    badge: "Populer 🔥",
    color: "from-blue-500 to-cyan-500",
    bgLight: "bg-blue-100/90",
    bgHover: "group-hover:bg-blue-200/90",
    href: "/split-bill",
  },
  {
    imageSrc: "/img/menu-split-later.png",
    title: "Split Later",
    description:
      "Nongkrong sepuasnya dulu, kumpulin struknya, dan bagi tagihannya nanti pas udah santai.",
    badge: "NEW ✨",
    color: "from-purple-500 to-indigo-500",
    bgLight: "bg-purple-100/90",
    bgHover: "group-hover:bg-purple-200/90",
    href: "/split-later",
  },
  {
    imageSrc: "/img/menu-shared-goal.png",
    title: "Shared Goals",
    description:
      "Nabung bareng squad buat rencana liburan, kado nikahan teman, atau impian bersama.",
    color: "from-emerald-500 to-teal-500",
    bgLight: "bg-emerald-100/90",
    bgHover: "group-hover:bg-emerald-200/90",
    href: "/shared-goals",
  },
  {
    imageSrc: "/img/menu-collect-money.png",
    title: "Collect Money (Patungan)",
    description:
      "Bikin link patungan uang kas, sewa lapangan futsal, atau donasi secara transparan.",
    color: "from-amber-500 to-orange-500",
    bgLight: "bg-amber-100/90",
    bgHover: "group-hover:bg-amber-200/90",
    href: "/collect-money",
  },
  {
    imageSrc: "/img/menu-invoice.png",
    title: "Invoice",
    description:
      "Kirim rincian tagihan digital yang rapi, transparan, dan estetik langsung ke WhatsApp.",
    color: "from-rose-500 to-pink-500",
    bgLight: "bg-rose-100/90",
    bgHover: "group-hover:bg-rose-200/90",
    href: "/invoice",
  },
  {
    imageSrc: "/img/menu-wallet.png",
    title: "Wallet",
    description:
      "Kelola dana masuk dari teman, pantau saldo patungan squad, dan catat pengeluaran grup.",
    color: "from-violet-500 to-fuchsia-500",
    bgLight: "bg-violet-100/90",
    bgHover: "group-hover:bg-violet-200/90",
    href: "/wallet",
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
          {features.map((feat) => {
            return (
              <motion.div
                key={feat.title}
                variants={cardVariants}
                className="h-full"
              >
                <Link href={feat.href} className="block h-full">
                  <div
                    className="group relative bg-white rounded-3xl p-4 sm:p-6 lg:p-8 border border-slate-100/80 shadow-[0_4px_20px_-4px_rgba(71,159,234,0.08)] hover:shadow-[0_12px_30px_-6px_rgba(71,159,234,0.15)] hover:border-primary/20 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer h-full"
                  >
                    <div className="flex flex-col h-full justify-between">
                      <div>
                        {/* Card Icon Container */}
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                          <div className={`w-12 h-12 sm:w-16 sm:h-16 ${feat.bgLight} ${feat.bgHover} rounded-xl sm:rounded-2xl flex items-center justify-center p-2 sm:p-2.5 transition-all duration-300 group-hover:scale-105 relative`}>
                            <Image
                              src={feat.imageSrc}
                              alt={feat.title}
                              width={64}
                              height={64}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          {feat.badge && (
                            <span className={`text-[8px] sm:text-[10px] font-black px-2 py-0.5 sm:py-1 rounded-full uppercase tracking-wider ${feat.badge.toLowerCase().includes("new")
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                              }`}>
                              {feat.badge}
                            </span>
                          )}
                        </div>

                        {/* Card Info */}
                        <h3 className="text-sm sm:text-base lg:text-xl font-extrabold text-slate-800 mb-1.5 sm:mb-2.5 group-hover:text-primary transition-colors duration-200">
                          {feat.title}
                        </h3>
                        <p className="text-[11px] sm:text-xs lg:text-sm font-semibold text-slate-500 leading-normal sm:leading-relaxed">
                          {feat.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
