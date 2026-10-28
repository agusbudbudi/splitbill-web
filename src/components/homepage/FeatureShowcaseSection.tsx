"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import { LandingLink } from "./LandingLink";
import { RichText } from "@/lib/landing/RichText";
import { getTone } from "@/lib/landing/tones";
import { isUnoptimizableSrc } from "@/lib/landing/image";
import type { LandingContent } from "@/lib/landing/types";
import { LandingTitle } from "./LandingTitle";

type ShowcaseContent = LandingContent["featureShowcase"];
type ShowcaseItem = LandingContent["features"]["items"][number];

// Scroll distance (in viewport heights) spent on each card change while pinned
const SCROLL_PER_CARD_VH = 70;

// `fit`: the card has a fixed height (pinned stack). On mobile the image then
// takes whatever height the copy leaves (capped at square) instead of a fixed
// square, so the copy never gets squeezed on short screens.
const ShowcaseCard = ({ item, fit = false }: { item: ShowcaseItem; fit?: boolean }) => (
  <article className="relative h-full w-full bg-white rounded-xl border border-slate-100 overflow-hidden flex flex-col md:grid md:grid-cols-2">
    {/* Left (top on mobile): image over a light tone tint, in a panel inset
        from the card's top and sides, flush with the bottom (square on mobile) */}
    <div
      className={`px-4 pt-4 md:px-8 md:pt-8 md:h-full ${
        fit ? "grow-[999] basis-0 min-h-24 max-h-[calc(100vw-3rem)] md:max-h-none" : "shrink-0"
      }`}
    >
      <div
        className={`relative w-full md:aspect-auto md:h-full rounded-t-2xl md:rounded-t-3xl overflow-hidden ${
          fit ? "h-full" : "aspect-square"
        }`}
      >
        <div className={`absolute inset-0 bg-gradient-to-br opacity-75 ${getTone(item.tone).tint}`} />
        <Image
          src={item.image.url}
          alt={item.image.alt}
          fill
          sizes="(min-width: 768px) 560px, 90vw"
          unoptimized={isUnoptimizableSrc(item.image.url)}
          className="object-cover object-top md:object-center"
        />
      </div>
    </div>

    {item.badge && (
      <span className="absolute top-3 right-3 md:top-5 md:right-5 z-10 bg-emerald-500 text-white text-[10px] md:text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full">
        {item.badge}
      </span>
    )}

    {/* Right (bottom on mobile): copy + CTAs. When `fit`, never shrinks on mobile —
        it keeps its natural height and absorbs space the capped image leaves */}
    <div className={`flex flex-col ${fit ? "grow shrink-0 md:shrink md:min-h-0" : "flex-1 min-h-0"}`}>
      <div className="flex flex-col justify-center flex-1 min-h-0 p-5 sm:p-8 lg:p-12">
        {/* Icon (same as the bento grid's), desktop only */}
        {item.imageUrl && (
          <div className="relative shrink-0 hidden md:block w-20 h-20 rounded-xl bg-primary/10 mb-5">
            <Image
              src={item.imageUrl}
              alt=""
              fill
              sizes="80px"
              unoptimized={isUnoptimizableSrc(item.imageUrl)}
              className="object-contain p-3"
            />
          </div>
        )}
        <h3 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
          {item.title}
        </h3>
        <p className="shrink-0 mt-2 md:mt-4 text-sm md:text-lg font-medium text-slate-500 leading-relaxed line-clamp-4 md:line-clamp-none">
          {item.description}
        </p>
        {item.requiresLogin && (
          <p className="mt-2 text-xs md:text-sm font-bold text-amber-600">
            Perlu login
          </p>
        )}
        {/* Mobile: CTAs fill the card width (one full, or two 50:50); desktop: inline */}
        <div
          className={`mt-4 md:mt-8 grid ${item.guideHref ? "grid-cols-2" : "grid-cols-1"} gap-3 md:flex md:flex-wrap md:items-center md:gap-x-5 md:gap-y-3`}
        >
          <LandingLink
            href={item.href}
            className="group min-w-0 inline-flex items-center justify-center gap-2 px-3 py-3.5 md:px-6 md:py-3 rounded-md bg-primary text-white font-black text-base shadow-lg shadow-primary/25 hover:bg-primary/90 active:scale-95 transition-all"
          >
            {/* Always one line — long labels truncate instead of wrapping */}
            <span className="truncate">{item.ctaLabel}</span>
            <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" />
          </LandingLink>
          {item.guideHref && (
            <LandingLink
              href={item.guideHref}
              className="min-w-0 inline-flex items-center justify-center px-3 py-3.5 rounded-md border border-primary/30 text-base md:text-sm font-bold text-primary active:scale-95 transition-all md:p-0 md:border-0 md:rounded-none md:hover:underline"
            >
              <span className="truncate">Cara Pakai</span>
            </LandingLink>
          )}
        </div>
      </div>
    </div>
  </article>
);

/**
 * One card in the pinned stack: slides up over the previous card while its
 * share of the scroll range plays, then shrinks and dims as the next one
 * arrives (no shadow). Card 0 starts in place.
 */
const PinnedCard = ({
  item,
  index,
  total,
  progress,
}: {
  item: ShowcaseItem;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) => {
  const steps = total - 1;
  const isFirst = index === 0;
  const isLast = index === steps;
  // Ranges must increase; first/last cards get a no-op range on the side they don't animate.
  const y = useTransform(
    progress,
    isFirst ? [0, 1] : [(index - 1) / steps, index / steps],
    isFirst ? ["0%", "0%"] : ["110%", "0%"],
  );
  const exitRange = isLast ? [0, 1] : [index / steps, (index + 1) / steps];
  const scale = useTransform(progress, exitRange, isLast ? [1, 1] : [1, 0.92]);
  const dim = useTransform(progress, exitRange, isLast ? [0, 0] : [0, 0.35]);

  return (
    <motion.div
      style={{ y, scale, zIndex: index }}
      className="absolute inset-0 origin-top"
    >
      <ShowcaseCard item={item} fit />
      <motion.div
        style={{ opacity: dim }}
        className="absolute inset-0 rounded-xl bg-slate-900 pointer-events-none"
      />
    </motion.div>
  );
};

const ShowcaseHeader = ({
  content,
  className = "",
}: {
  content: ShowcaseContent;
  className?: string;
}) => (
  <div className={`text-center max-w-3xl mx-auto ${className}`}>
    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
      <LandingTitle title={content.title} highlight={content.titleHighlight} />
    </h2>
    {content.subtitle && (
      <p className="mt-3 text-base sm:text-lg text-slate-500 font-medium">
        <RichText text={content.subtitle} />
      </p>
    )}
  </div>
);

/**
 * Feature cards (image left, copy right) shown one at a time: the section
 * pins to the viewport and each scroll step stacks the next card over the
 * previous one; after the last card the page scrolls on normally. All cards
 * are in the server HTML, so every title/description stays crawlable.
 * Visitors who prefer reduced motion get a plain vertical list instead.
 */
export const FeatureShowcaseSection = ({
  content,
  items,
}: {
  content: ShowcaseContent;
  items: ShowcaseItem[];
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const total = items.length;
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setActive(Math.min(total - 1, Math.max(0, Math.round(p * (total - 1)))));
  });

  // Scroll to the point in the pinned range where card `index` is fully in place
  const goTo = (index: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const pinnedRange = el.offsetHeight - window.innerHeight;
    const sectionTop = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: sectionTop + (pinnedRange * index) / (total - 1),
      behavior: "smooth",
    });
  };

  // The scroll math needs at least two cards (the backend enforces this)
  if (total < 2) return null;

  if (reduceMotion) {
    return (
      <section
        id="fitur"
        data-landing-section="featureShowcase"
        className="py-16 bg-[#f8f9fd]"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ShowcaseHeader content={content} className="mb-10" />
          <div className="space-y-6">
            {items.map((item, i) => (
              <div key={i} className="md:h-[440px]">
                <ShowcaseCard item={item} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="fitur"
      data-landing-section="featureShowcase"
      className="relative bg-[#f8f9fd]"
      style={{ height: `calc(100svh + ${(total - 1) * SCROLL_PER_CARD_VH}vh)` }}
    >
      {/* Pinned viewport. Top padding clears the fixed navbar plus the login
          banner it grows once the page scrolls (two lines tall on mobile).
          svh, not dvh: dvh changes while mobile toolbars collapse mid-scroll,
          resizing the cards during the animation and making it stutter. */}
      <div className="sticky top-0 h-svh overflow-hidden flex flex-col pt-28 sm:pt-32 lg:pt-28 pb-6">
        <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col flex-1 min-h-0">
          <ShowcaseHeader content={content} className="mb-5 sm:mb-8" />

          <div className="relative flex-1 min-h-0 md:max-h-[560px] w-full mx-auto overflow-hidden rounded-xl">
            {items.map((item, i) => (
              <PinnedCard
                key={i}
                item={item}
                index={i}
                total={total}
                progress={scrollYProgress}
              />
            ))}
          </div>

          {/* Progress */}
          <div className="flex justify-center gap-2 mt-5">
            {items.map((item, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Lihat ${item.title}`}
                aria-current={active === i}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  active === i
                    ? "w-8 bg-primary"
                    : "w-2 bg-slate-200 hover:bg-slate-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
