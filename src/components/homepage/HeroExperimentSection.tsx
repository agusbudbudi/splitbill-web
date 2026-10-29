"use client";

import React from "react";
import Image, { getImageProps } from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Camera, CheckCheck } from "lucide-react";
import { LandingLink } from "./LandingLink";
import { LandingEyebrow } from "./LandingEyebrow";
import { ScanFlow } from "./ScanFlow";
import { LandingIcon } from "@/lib/landing/icons";
import { getTone } from "@/lib/landing/tones";
import { isUnoptimizableSrc } from "@/lib/landing/image";
import type { LandingContent, LandingImage } from "@/lib/landing/types";
import { LandingTitle } from "./LandingTitle";

// Centered hero.

// Delay before the scan flow starts and the desktop WA card pops in
const CARDS_DELAY = 0.9;

// Same story as the ScanFlow card on the right (Makan Bareng Squad, Andi owes Budi) —
// this is the "share the result" step that follows the scan.

// WhatsApp share preview — desktop only, mobile keeps the stage uncluttered
const WhatsAppShareCard = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.85 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{
      opacity: { duration: 0.3, delay: CARDS_DELAY },
      scale: { type: "spring", stiffness: 320, damping: 18, delay: CARDS_DELAY },
    }}
    className="absolute hidden lg:block left-0 xl:-left-[4%] top-[4%] w-[280px] rounded-lg bg-white p-4 border-[5px] border-white shadow-2xl shadow-primary/15 pointer-events-none z-20 text-left"
  >
    {/* Header — share target */}
    <div className="flex items-center gap-2 mb-3">
      <Image
        src="/img/whatsApp-logo.png"
        alt=""
        width={24}
        height={24}
        className="w-6 h-6 rounded-full shrink-0"
      />
      <span className="text-[11px] font-bold text-slate-500">Share ke WhatsApp</span>
    </div>

    {/* Sender */}
    <div className="flex items-start gap-2">
      <span className="w-8 h-8 rounded-full bg-[#dbeafe] text-[#1d4ed8] flex items-center justify-center text-xs font-black shrink-0">
        B
      </span>
      <div className="min-w-0">
        <p className="text-xs font-black text-slate-800 mb-1">Budi</p>

        {/* Bubble */}
        <div className="rounded-md rounded-tl-xs bg-[#d9fdd3] px-3 py-2">
          <p className="text-xs text-slate-800 leading-snug">
            Andi, abis seru-seruan di <strong>Makan Bareng Squad 🍜</strong> nih! Bagian lo{" "}
            <strong>Rp 300.000</strong> ya, gas transfer biar ga nyangkut 😆💸
          </p>

          {/* Link preview */}
          <div className="mt-2 flex items-center gap-2 rounded-xs bg-white/70 px-2 py-1.5">
            <Image
              src="/img/icon-splitbill.png"
              alt=""
              width={18}
              height={18}
              className="w-[18px] h-[18px] object-contain shrink-0"
            />
            <span className="min-w-0">
              <span className="block text-[10px] font-black text-slate-800 leading-tight truncate">
                Rincian Split Bill
              </span>
              <span className="block text-[9px] text-slate-500 leading-tight truncate">splitbill.my.id</span>
            </span>
          </div>

          <div className="mt-1 flex items-center justify-end gap-0.5 text-[9px] text-slate-500">
            19.42
            <CheckCheck className="w-3 h-3 text-sky-500" />
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const PHONE_IMAGE_CLASS = "object-contain w-full h-auto drop-shadow-[0_30px_50px_rgba(15,23,42,0.18)]";

// With a CMS mobile image, <picture> art-directs per breakpoint so each device
// downloads only its own image (both are the LCP candidate, hence priority).
const HeroImage = ({ image, imageMobile }: { image: LandingImage; imageMobile?: LandingImage | null }) => {
  if (!imageMobile) {
    return (
      <Image
        src={image.url}
        alt={image.alt}
        width={image.width || 1440}
        height={image.height || 1440}
        sizes="(max-width: 640px) 580px, 700px"
        priority
        unoptimized={isUnoptimizableSrc(image.url)}
        className={PHONE_IMAGE_CLASS}
      />
    );
  }

  const { props: desktop } = getImageProps({
    src: image.url,
    alt: image.alt,
    width: image.width || 1440,
    height: image.height || 1440,
    sizes: "700px",
    priority: true,
    unoptimized: isUnoptimizableSrc(image.url),
  });
  const { props: mobile } = getImageProps({
    src: imageMobile.url,
    alt: imageMobile.alt,
    width: imageMobile.width || 1080,
    height: imageMobile.height || 1440,
    sizes: "580px",
    priority: true,
    unoptimized: isUnoptimizableSrc(imageMobile.url),
  });
  const MOBILE_MEDIA = "(max-width: 639px)";
  const DESKTOP_MEDIA = "(min-width: 640px)";

  return (
    <>
      {/* getImageProps doesn't preload like <Image priority> does. React hoists
          these into <head>; `media` makes each device fetch only its own image. */}
      <link rel="preload" as="image" media={MOBILE_MEDIA} href={mobile.src} imageSrcSet={mobile.srcSet} imageSizes={mobile.sizes} fetchPriority="high" />
      <link rel="preload" as="image" media={DESKTOP_MEDIA} href={desktop.src} imageSrcSet={desktop.srcSet} imageSizes={desktop.sizes} fetchPriority="high" />
      <picture>
        {/* `sizes` is required with w-descriptor srcsets, else browsers assume 100vw and over-fetch */}
        <source media={MOBILE_MEDIA} srcSet={mobile.srcSet ?? mobile.src} sizes={mobile.sizes} />
        <source media={DESKTOP_MEDIA} srcSet={desktop.srcSet ?? desktop.src} sizes={desktop.sizes} />
        {/* eslint-disable-next-line jsx-a11y/alt-text -- alt comes from getImageProps */}
        <img {...desktop} className={PHONE_IMAGE_CLASS} />
      </picture>
    </>
  );
};

interface HeroExperimentSectionProps {
  content: LandingContent["hero"];
}

export const HeroExperimentSection = ({ content }: HeroExperimentSectionProps) => {
  const title = content.title.split("\n").map((line) => line.trim()).filter(Boolean).join(" ");

  return (
    <section
      data-landing-section="hero"
      className="relative isolate overflow-hidden bg-white"
    >
      {/* Soft wash — primary from the top, a hint of sky/emerald at the sides, fades to white */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(71,159,234,0.18),transparent_70%)]" />
      {/* Glows are radial gradients, not blur-[110px] filters: WebKit skipped painting the
          hero text under those large filter layers until something else repainted it */}
      <div className="absolute -z-10 top-[10%] -left-[10%] w-[40vw] h-[40vw] max-w-[520px] max-h-[520px] bg-[radial-gradient(closest-side,rgba(186,230,253,0.35),transparent)]" />
      <div className="absolute -z-10 top-[25%] -right-[8%] w-[34vw] h-[34vw] max-w-[460px] max-h-[460px] bg-[radial-gradient(closest-side,rgba(167,243,208,0.25),transparent)]" />

      {/* Soft glow behind the phone stage */}
      <div className="absolute -z-10 left-1/2 bottom-[-10%] -translate-x-1/2 w-[720px] h-[520px] bg-[radial-gradient(closest-side,rgba(71,159,234,0.15),transparent)]" />

      {/* Content */}
      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-20 sm:pt-24 text-center">
        {content.eyebrow.text && (
          <div
            className="mb-6"
          >
            <LandingEyebrow badge={content.eyebrow.badge}>{content.eyebrow.text}</LandingEyebrow>
          </div>
        )}

        <h1
          className="max-w-6xl mx-auto text-4xl sm:text-[2.75rem] lg:text-5xl font-black text-slate-900 leading-tight tracking-tight mb-6 text-balance"
        >
          {/* CMS line breaks are ignored here — the title flows as one sentence and
              text-balance splits it evenly, so desktop lands on 2 lines */}
          <LandingTitle title={title} highlight={content.titleHighlight} />
        </h1>

        <p
          className="text-base sm:text-lg text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto mb-8"
        >
          {content.description}
        </p>

        <div
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <LandingLink
            href={content.primaryCta.href}
            className="group flex items-center justify-center gap-2 px-7 py-4 rounded-md bg-primary text-white font-black text-base shadow-xl shadow-primary/30 hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <LandingIcon name={content.primaryCta.icon} fallback={Camera} className="w-5 h-5" />
            {content.primaryCta.label}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </LandingLink>
          <LandingLink
            href={content.secondaryCta.href}
            className="flex items-center justify-center gap-2 px-7 py-4 rounded-md border border-primary/10 text-primary font-bold text-base hover:bg-primary/5 hover:border-primary/60 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            {content.secondaryCta.label}
          </LandingLink>
        </div>

        {content.trustItems.length > 0 && (
          <div
            className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-7"
          >
            {content.trustItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-slate-600 text-sm font-semibold">
                <LandingIcon name={item.icon} className={`w-3.5 h-3.5 ${getTone(item.tone).text}`} />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stage — phone centered (mobile: bigger, pushed left and cropped so the scan card fits whole), scan card + chips floating around it. Phone is cropped
          at the section's bottom edge and fades into white so it blends into the next section. */}
      <div className="relative mx-auto sm:mt-8 pt-8 sm:pt-0 w-full max-w-5xl h-[540px] sm:h-[500px] lg:h-[530px] overflow-hidden lg:overflow-visible">
        {/* Phone — static, it's the LCP image and must paint from SSR HTML at its final position */}
        {/* Mobile: mockup enlarged and pushed left (cropped) so the scan card fits whole */}
        <div className="absolute left-1/2 top-8 sm:top-0 -translate-x-[68%] sm:-translate-x-1/2 w-[580px] sm:w-[640px] lg:w-[700px] pointer-events-none">
          <HeroImage image={content.image} imageMobile={content.imageMobile} />
        </div>

        {/* Scan card — overlaps the phone's right side. Painted from SSR HTML; only its inner flow animates after hydration */}
        {/* Mobile mirrors the old hero: card centered in the stage, nudged 64px right at 0.9 scale */}
        <div className="absolute z-10 inset-x-0 top-8 -bottom-[72px] flex items-center justify-center sm:block sm:inset-auto sm:top-[18%] sm:right-[4%] lg:right-[2%] xl:-right-[4%]">
          <div className="translate-x-16 scale-[0.9] sm:translate-x-0 lg:scale-100 sm:origin-top-right">
          <div className="origin-top-right">
            <ScanFlow startDelay={CARDS_DELAY * 1000} />
          </div>
          </div>
        </div>

        <WhatsAppShareCard />

        {/* Bottom fade into white */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-[5]" />
      </div>
    </section>
  );
};
