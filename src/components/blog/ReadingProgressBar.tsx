"use client";

import React, { RefObject } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

interface ReadingProgressBarProps {
  /** Element whose scroll-through is measured (the article body). */
  target: RefObject<HTMLElement | null>;
}

export const ReadingProgressBar = ({ target }: ReadingProgressBarProps) => {
  const { scrollYProgress } = useScroll({ target, offset: ["start start", "end end"] });
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden
      className="fixed top-0 inset-x-0 z-[60] h-1 bg-primary origin-left"
      style={{ scaleX }}
    />
  );
};
