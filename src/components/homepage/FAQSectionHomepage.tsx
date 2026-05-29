"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";
import { faqData } from "@/data/faqData";
import Link from "next/link";

export const FAQSectionHomepage = () => {
  const landingFaqs = faqData.filter((item) => item.showOnLanding);
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-20 bg-white relative overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-slate-50 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4"
          >
            Paling Sering{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
              Ditanyain
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-base sm:text-lg text-slate-500 font-semibold"
          >
            Punya pertanyaan lain? Tenang, semuanya sudah kami rangkum di sini.
          </motion.p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4 max-w-3xl mx-auto">
          {landingFaqs.map((faq, index) => {
            const isOpen = openId === faq.id;
            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                style={{ willChange: "transform, opacity" }}
                className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-[0_4px_20px_-6px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.05)] hover:border-slate-200/80 transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className={`w-full px-6 py-5 flex items-center justify-between text-left font-bold transition-colors duration-200 group cursor-pointer ${isOpen ? "text-primary" : "text-slate-800 hover:text-primary"
                    }`}
                >
                  <span className="text-base pr-4">{faq.question}</span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${isOpen
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "bg-slate-50 text-slate-400 group-hover:bg-slate-100 group-hover:text-primary"
                      }`}
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                        }`}
                    />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-1 text-sm font-semibold text-slate-500 leading-relaxed border-t border-slate-50">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-12 flex justify-center"
        >
          <Link
            href="/faq"
            className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-lg border-2 border-primary/30 text-primary font-bold text-sm hover:bg-primary hover:text-white hover:border-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
          >
            Lihat Semua Pertanyaan
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
