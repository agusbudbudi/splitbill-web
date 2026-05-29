"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const freeFeatures = [
  "Quota scan struk GRATIS 5x",
  "Fitur hitung split bill basic",
  "Pembagian pajak & service charge",
  "Share rincian via WhatsApp",
  "Metode transfer & rekening bank",
];

const premiumFeatures = [
  "Scan struk sepuasnya tanpa batas!",
  "Proses scan AI super ngebut (OCR Pro)",
  "Desain link invoice premium & kustom",
  "Statistik keuangan & analisis bulanan",
  "Bebas iklan (clean experience)",
  "Dukungan penuh buat developer ❤️",
];

export const PricingSection = () => {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-white to-[#f8f9fd] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4"
          >
            Pilih Paket Sesuai{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
              Kebutuhan Circle-mu
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-base sm:text-lg text-slate-500 font-medium"
          >
            Mulai gratis kapan saja. Upgrade ke premium untuk kepuasan split bill tanpa batas.
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          {/* Free Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="group relative bg-white rounded-3xl p-8 border border-slate-100/80 shadow-[0_4px_20px_-4px_rgba(71,159,234,0.08)] hover:shadow-[0_12px_30px_-6px_rgba(71,159,234,0.15)] hover:border-primary/20 transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Paket Gratisan
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-black text-slate-900">
                    Rp 0
                  </span>
                  <span className="text-slate-500 font-semibold text-sm">
                    / selamanya
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-500 mt-2">
                  Udah cukup banget buat patungan sesekali.
                </p>
              </div>

              <div className="h-px bg-slate-100 my-6" />

              <ul className="space-y-4 mb-8">
                {freeFeatures.map((feat) => (
                  <li key={feat} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-slate-600" strokeWidth={3} />
                    </div>
                    <span className="text-sm font-semibold text-slate-600">
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/split-bill"
              className="flex items-center justify-center w-full py-4 rounded-lg border-2 border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors duration-200"
            >
              Mulai Sekarang - Gratis
            </Link>
          </motion.div>

          {/* Premium Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="bg-gradient-to-br from-violet-600 to-primary rounded-3xl p-8 border border-transparent shadow-xl shadow-primary/20 flex flex-col justify-between relative overflow-hidden text-white"
          >
            {/* Glow effect */}
            <div className="absolute top-[-30%] right-[-30%] w-[300px] h-[300px] bg-white/10 rounded-full blur-[60px] pointer-events-none" />

            {/* Populer Badge */}
            <div className="absolute top-0 right-0 bg-white text-primary text-[10px] font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-wider shadow-md">
              Paling Populer 🔥
            </div>

            <div>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-violet-100 uppercase tracking-wider mb-2">
                  Paket Premium
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-black text-white">
                    Rp 15K
                  </span>
                  <span className="text-violet-200 font-semibold text-sm">
                    / bulan
                  </span>
                </div>
                <p className="text-sm font-semibold text-violet-100/90 mt-2">
                  Buat circle yang hobi nongkrong & kulineran.
                </p>
              </div>

              <div className="h-px bg-white/20 my-6" />

              <ul className="space-y-4 mb-8">
                {premiumFeatures.map((feat) => (
                  <li key={feat} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </div>
                    <span className="text-sm font-semibold text-white">
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/membership"
              className="flex items-center justify-center w-full py-4 rounded-lg bg-white text-primary font-black hover:bg-white/95 transition-colors duration-200 shadow-md"
            >
              Langganan Sekarang ⚡
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
