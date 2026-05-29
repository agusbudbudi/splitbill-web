"use client";

import React from "react";
import { motion } from "framer-motion";
import { XCircle, CheckCircle } from "lucide-react";

const withoutSplitBill = [
  "Pusing hitung manual pake kalkulator HP pas kasir udah nungguin",
  "Bingung bagi nominal pajak, service charge, sama diskon persenan",
  "Sungkan atau canggung buat nagih temen yang belum bayar",
  "Salah transfer gara-gara gak ada rincian rekening/e-wallet",
  "Catatan patungan hilang karena nyampur di chat WhatsApp",
];

const withSplitBill = [
  "Cukup foto struk belanjaan, AI kelar hitung dalam 3 detik!",
  "Pajak & service charge otomatis kebagi presisi per item menu",
  "Link tagihan transparan dikirim ke grup, otomatis pada sadar diri",
  "Info rekening & e-wallet langsung tertera, tinggal salin & transfer",
  "History patungan tersimpan aman, rapi, dan mudah diakses kapan aja",
];

export const ComparisonSection = () => {
  return (
    <section className="py-16 sm:py-24 bg-white relative overflow-hidden">
      {/* Background shape */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-slate-50 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4"
          >
            Kenapa Harus Pakai{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
              SplitBill?
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-base sm:text-lg text-slate-500 font-medium"
          >
            Udah gak zaman ribet bagi tagihan. Liat bedanya kehidupan lo sebelum vs sesudah pakai SplitBill.
          </motion.p>
        </div>

        {/* Comparison grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Without SplitBill Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            style={{ willChange: "transform, opacity" }}
            className="bg-rose-50/50 border border-rose-100/80 rounded-3xl p-6 sm:p-8 hover:shadow-[0_12px_30px_-6px_rgba(244,63,94,0.15)] hover:border-rose-400/70 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">😩</span>
              <h3 className="text-lg sm:text-xl font-black text-rose-900">
                Sebelum pake SplitBill
              </h3>
            </div>

            <ul className="space-y-4">
              {withoutSplitBill.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold text-rose-800 leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* With SplitBill Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            style={{ willChange: "transform, opacity" }}
            className="bg-emerald-50/50 border border-emerald-300 rounded-3xl p-6 sm:p-8 hover:shadow-[0_12px_30px_-6px_rgba(16,185,129,0.15)] hover:border-emerald-400 hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden cursor-pointer"
          >
            {/* Glow badge */}
            <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-wider">
              Solusi Terbaik ✨
            </div>

            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">😎</span>
              <h3 className="text-lg sm:text-xl font-black text-emerald-900">
                Setelah pake SplitBill
              </h3>
            </div>

            <ul className="space-y-4">
              {withSplitBill.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span className="text-sm font-semibold text-emerald-800 leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
