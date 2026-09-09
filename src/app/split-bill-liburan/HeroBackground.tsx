"use client";

import { motion } from "framer-motion";

/**
 * Dekorasi background hero — copy persis dari HeroSection LP utama
 * (spotlight, aurora blobs, fine grid, grain) supaya branding align.
 * Diisolasi jadi client island sendiri (framer-motion butuh "use client")
 * biar page.tsx tetap Server Component murni untuk SEO.
 */
export function HeroBackground() {
  return (
    <>
      {/* Soft top spotlight — depth without a heavy corner gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(71,159,234,0.16),transparent)]" />

      {/* Aurora blobs — single settle-in pass, not infinite */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.12, 1], x: [0, 24, 0], y: [0, -18, 0], opacity: [0.28, 0.42, 0.28] }}
          transition={{ repeat: 1, duration: 2.5, ease: "easeInOut" }}
          className="absolute top-[-15%] right-[-8%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] rounded-full bg-primary/25 blur-[100px]"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], x: [0, -22, 0], y: [0, 18, 0], opacity: [0.18, 0.32, 0.18] }}
          transition={{ repeat: 1, duration: 2.5, ease: "easeInOut", delay: 0.3 }}
          className="absolute bottom-[-15%] left-[-10%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] rounded-full bg-sky-300/25 blur-[90px]"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.28, 0.15] }}
          transition={{ repeat: 1, duration: 2.5, ease: "easeInOut", delay: 0.6 }}
          className="absolute top-[18%] right-[8%] w-[25vw] h-[25vw] max-w-[350px] max-h-[350px] rounded-full bg-emerald-300/20 blur-[80px]"
        />
      </div>

      {/* Fine grid, faded toward the edges instead of a uniform repeat */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#479fea0d 1px, transparent 1px), linear-gradient(90deg, #479fea0d 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse 70% 55% at 50% 25%, black, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 55% at 50% 25%, black, transparent 75%)",
        }}
      />

      {/* Subtle grain — keeps the wash from looking flat/plasticky */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </>
  );
}
