"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { LandingLink } from "./LandingLink";
import { RichText } from "@/lib/landing/RichText";
import { isUnoptimizableSrc } from "@/lib/landing/image";
import type { LandingContent } from "@/lib/landing/types";
import { LandingTitle } from "./LandingTitle";


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

interface FeaturesSectionProps {
  content: LandingContent["features"];
}

export const FeaturesSection = ({ content }: FeaturesSectionProps) => {
  return (
    <section data-landing-section="features" className="py-16 bg-[#f8f9fd] relative overflow-hidden">
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
            <LandingTitle title={content.title} highlight={content.titleHighlight} />
          </motion.h2>

          {content.subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-base sm:text-lg text-slate-500 font-medium"
            >
              <RichText text={content.subtitle} />
            </motion.p>
          )}
        </div>

        {/* Bento Grid — 2 Columns on Mobile, 3 Columns on Large Screens */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8"
        >
          {content.items.map((feat, idx) => (
            <motion.div
              key={idx}
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
                      src={feat.imageUrl}
                      alt=""
                      fill
                      className="object-contain p-2"
                      sizes="64px"
                      unoptimized={isUnoptimizableSrc(feat.imageUrl)}
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
                  <LandingLink
                    href={feat.href}
                    className="group inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-md bg-primary text-white font-black text-sm hover:bg-primary/90 active:scale-95 transition-all"
                  >
                    {feat.ctaLabel}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </LandingLink>
                  {feat.guideHref && (
                    <LandingLink
                      href={feat.guideHref}
                      className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold text-primary hover:underline"
                    >
                      Cara Pakai
                    </LandingLink>
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
