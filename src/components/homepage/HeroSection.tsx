"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Zap,
  Star,
  Users,
  Check,
  Camera,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

// CSS-only avatar — zero external requests, instant render
const AVATAR_COLORS = [
  ["#dbeafe", "#1d4ed8"], // blue
  ["#dcfce7", "#15803d"], // green
  ["#fce7f3", "#be185d"], // pink
  ["#fef9c3", "#a16207"], // yellow
  ["#ede9fe", "#6d28d9"], // purple
  ["#ffedd5", "#c2410c"], // orange
];

const CSSAvatar = ({ name }: { name: string }) => {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  const [bg, text] = AVATAR_COLORS[idx];
  return (
    <span
      style={{ background: bg, color: text }}
      className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black shrink-0"
      aria-label={name}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
};

const PEOPLE = [
  { name: "Budi", amount: "Rp 300.000", status: "Lunas" as const },
  { name: "Siti", amount: "Rp 300.000", status: "Lunas" as const },
  { name: "Andi", amount: "Rp 300.000", status: "Harus Bayar" as const },
];

const SETTLEMENT = { from: "Andi", to: "Budi", amount: "Rp 300.000" };

// Items that "pop in" one by one while the scan-line sweeps — makes the AI parsing feel active, not just a bare progress bar
const SCAN_FINDINGS = ["8 menu", "Pajak", "Service"];

// Kept short — Lighthouse Speed Index counts every pixel change until the page settles,
// so a slow multi-second reveal directly tanks SI even though FCP/LCP land fine.
const STAGE_DURATIONS = [500, 1600, 500, 3800]; // capture -> scanning -> done -> result (last unused, reveal stops the loop)

// Same card frame throughout — only the content inside swaps (skeleton -> overlay -> real numbers)
// Content mirrors the real split-bill detail summary (header stats + settlement + per-person status), simplified for a compact hero mockup.
const MockBillCard = ({ stage }: { stage: number }) => {
  const revealed = stage === 3;

  return (
    <div className="relative bg-white rounded-lg shadow-2xl shadow-primary/15 p-4 border-[5px] border-white min-w-[260px] max-w-[300px] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Image
          src="/img/icon-splitbill.png"
          alt="Split Bill"
          width={22}
          height={22}
          className="w-[22px] h-[22px] object-contain shrink-0"
        />
        <p className="text-xs font-black text-slate-900 truncate">
          Makan Bareng Squad 🍜
        </p>
      </div>

      {/* Stats row — Total Tagihan / Total Orang */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-3 mb-3">
        <div>
          <p className="text-[8px] uppercase font-black text-primary/60 tracking-wider">
            Total Tagihan
          </p>
          <div className="h-[26px] flex items-center mt-0.5">
            {revealed ? (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg font-black text-primary tracking-tight leading-none"
              >
                Rp 900.000
              </motion.p>
            ) : (
              <div className="h-[20px] w-24 bg-slate-100 rounded animate-pulse" />
            )}
          </div>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-[8px] uppercase font-black text-slate-400 tracking-wider">
            Total Orang
          </p>
          <div className="flex items-center gap-1 mt-0.5">
            <Users className="w-3 h-3 text-primary" />
            <span className="text-sm font-black text-slate-900">3</span>
          </div>
        </div>
      </div>

      {/* Settlement instruction — mirrors "Instruksi Transfer" banner */}
      <div
        className={`rounded-xs bg-primary px-2.5 py-2 mb-3 transition-opacity duration-300 ${revealed ? "opacity-100" : "opacity-0"
          }`}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-medium text-white/90 truncate">
            <strong className="font-black">{SETTLEMENT.from}</strong> transfer ke{" "}
            <strong className="font-black">{SETTLEMENT.to}</strong>
          </span>
          <span className="text-[10px] font-black text-white shrink-0">
            {SETTLEMENT.amount}
          </span>
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-2">
        {PEOPLE.map((person) => (
          <div key={person.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CSSAvatar name={person.name} />
              <span className="text-xs font-semibold text-slate-700">
                {person.name}
              </span>
            </div>
            <div className="h-[26px] flex flex-col items-end justify-center">
              {revealed ? (
                <>
                  <span
                    className={`text-[8px] font-black px-1.5 py-0.5 rounded-full leading-none ${person.status === "Lunas"
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-destructive/10 text-destructive"
                      }`}
                  >
                    {person.status}
                  </span>
                  <span className="text-[10px] font-bold text-slate-900 leading-none mt-1">
                    {person.amount}
                  </span>
                </>
              ) : (
                <div className="flex flex-col items-end gap-1">
                  <div className="h-2.5 w-14 bg-slate-100 rounded animate-pulse" />
                  <div className="h-2.5 w-10 bg-slate-100 rounded animate-pulse" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Overlay — actual receipt photo being "scanned", fades out once the bill is revealed */}
      <AnimatePresence>
        {!revealed && (
          <motion.div
            key={`overlay-${stage}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 rounded-md overflow-hidden"
          >
            <Image
              src="/img/mockup-struk.webp"
              alt="Struk"
              fill
              sizes="300px"
              priority
              fetchPriority="high"
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/60" />

            {/* Scan-line sweep during the scanning stage */}
            {stage === 1 && (
              <motion.div
                initial={{ top: "-10%" }}
                animate={{ top: ["-10%", "110%"] }}
                transition={{ repeat: Infinity, duration: 1.1, ease: "linear" }}
                className="absolute left-0 right-0 h-12 bg-gradient-to-b from-transparent via-primary/70 to-transparent"
              />
            )}

            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center">
              {stage === 0 && (
                <>
                  <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ repeat: Infinity, duration: 0.9, ease: "easeInOut" }}
                    className="w-14 h-14 rounded-md bg-white/90 flex items-center justify-center shadow-lg"
                  >
                    <Camera className="w-7 h-7 text-primary" />
                  </motion.div>
                  <p className="text-sm font-bold text-white drop-shadow-md">📸 Foto struk...</p>
                </>
              )}

              {stage === 1 && (
                <div className="mt-auto mb-4 flex flex-col items-center gap-2.5">
                  <p className="text-sm font-bold text-white drop-shadow-md">Scanning...</p>
                  <div className="w-32 h-1.5 bg-white/30 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.6, ease: "easeInOut" }}
                      className="h-full bg-primary"
                    />
                  </div>
                  <div className="flex flex-col items-start gap-1">
                    {SCAN_FINDINGS.map((item, i) => (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.45, duration: 0.25 }}
                        className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm rounded-full pl-1.5 pr-2 py-0.5"
                      >
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.3 + i * 0.45 + 0.1, type: "spring", stiffness: 400, damping: 15 }}
                          className="w-3 h-3 rounded-full bg-emerald-500 flex items-center justify-center shrink-0"
                        >
                          <Check className="w-2 h-2 text-white" strokeWidth={4} />
                        </motion.span>
                        <span className="text-[10px] font-bold text-white whitespace-nowrap">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {stage === 2 && (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg"
                  >
                    <Check className="w-7 h-7 text-white" strokeWidth={3} />
                  </motion.div>
                  <p className="text-sm font-bold text-white drop-shadow-md">Struk terbaca!</p>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// One-shot micro-demo on page load: photo -> scanning -> checkmark -> bill appears, then stays put.
// Card frame is always mounted — MockBillCard swaps its internal content per stage, no card-shape jumps.
const ScanFlow = () => {
  const [stage, setStage] = React.useState(0);
  const revealed = stage === STAGE_DURATIONS.length - 1;

  React.useEffect(() => {
    if (revealed) return;
    const t = setTimeout(
      () => setStage((s) => s + 1),
      STAGE_DURATIONS[stage]
    );
    return () => clearTimeout(t);
  }, [stage]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <MockBillCard stage={stage} />

        {/* Camera floating badge (Foto struk -> beres!) — only once the bill has landed, pops in first */}
        <motion.div
          animate={{
            y: revealed ? [0, -4, 0] : 0,
            opacity: revealed ? 1 : 0,
            scale: revealed ? 1 : 0.8,
          }}
          transition={{
            y: { repeat: 2, duration: 2.8, ease: "easeInOut" },
            opacity: { duration: 0.25, delay: revealed ? 0.1 : 0 },
            scale: { type: "spring", stiffness: 350, damping: 16, delay: revealed ? 0.1 : 0 },
          }}
          className="absolute -top-12 sm:-top-14 left-1/2 -translate-x-1/2 bg-emerald-500 text-white rounded-md shadow-xl px-3 py-2 flex items-center gap-1.5 sm:gap-2 z-20 whitespace-nowrap pointer-events-none"
        >
          <Camera className="w-3.5 h-3.5" />
          <span className="text-xs sm:text-[10px] font-black">Struk Kebaca Otomatis!</span>
        </motion.div>

        {/* Floating success card (AI scan selesai) — pops in a beat after the badge above, so the reveal feels sequential rather than synced */}
        <motion.div
          animate={{
            y: revealed ? [0, -5, 0] : 0,
            opacity: revealed ? 1 : 0,
            scale: revealed ? 1 : 0.8,
          }}
          transition={{
            y: { repeat: 2, duration: 3, ease: "easeInOut" },
            opacity: { duration: 0.25, delay: revealed ? 0.45 : 0 },
            scale: { type: "spring", stiffness: 350, damping: 16, delay: revealed ? 0.45 : 0 },
          }}
          className="absolute -bottom-20 sm:-bottom-20 -left-16 sm:-left-20 bg-white rounded-md shadow-xl px-4 py-3 sm:px-4 sm:py-3 flex items-center gap-2.5 sm:gap-2.5 z-20 pointer-events-none"
        >
          <div className="w-10 h-10 sm:w-8 sm:h-8 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
            <Check className="w-5 h-5 sm:w-4 sm:h-4 text-emerald-600" strokeWidth={3} />
          </div>
          <div>
            <p className="text-xs sm:text-[10px] text-slate-400 font-medium">AI scan selesai</p>
            <p className="text-sm sm:text-xs font-black text-slate-800">5 detik aja! ⚡</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-white">
      {/* Soft top spotlight — depth without a heavy corner gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(71,159,234,0.16),transparent)]" />

      {/* Aurora blobs — single settle-in pass, not infinite. An endless loop never lets
          Lighthouse consider the page "visually stable," which tanks Speed Index even
          after real content has painted. */}
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

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12 lg:pt-28 lg:pb-16">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* Left — Text */}
          <div className="flex-1 text-center lg:text-left">

            {/* Eyebrow pill */}
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="inline-flex items-center gap-2 border border-primary/20 text-primary text-xs font-bold px-2 py-2 pl-4 rounded-full mb-6"
            >
              ⚡ Foto Struk → Tagihan Jadi
              <span className="ml-1 bg-emerald-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                NEW
              </span>
            </motion.div>

            {/* H1 — dark text on white bg, high contrast */}
            <motion.h1
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 leading-[1.15] tracking-tight mb-6"
            >
              Split Tagihan dari Foto Struk{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#2563eb]">
                dalam 5 Detik
              </span>
            </motion.h1>

            {/* Subheadline — slate-600 for comfortable reading on white */}
            <motion.p
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-lg mx-auto lg:mx-0 mb-8"
            >
              Foto struk, AI otomatis membaca total belanja dan langsung membagi tagihan dengan adil. Gratis tanpa login.
            </motion.p>

            {/* CTAs */}
            <motion.div
              custom={3}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
            >
              <Link
                href="/split-bill"
                className="group flex items-center justify-center gap-2 px-7 py-4 rounded-md bg-primary text-white font-black text-base shadow-xl shadow-primary/30 hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <Camera className="w-5 h-5" />
                Scan Struk Gratis
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#cara-pakai"
                onClick={(e) => {
                  e.preventDefault();
                  // Find the target element
                  const target = document.getElementById("cara-pakai");
                  if (target) {
                    // 1. Calculate and scroll immediately (this will trigger scrolled=true and start rendering the banner)
                    const header = document.querySelector("header");
                    let headerHeight = header ? header.offsetHeight : 64;
                    let elementPosition = target.getBoundingClientRect().top;
                    let offsetPosition = elementPosition + window.scrollY - headerHeight - 2;

                    window.scrollTo({
                      top: offsetPosition,
                      behavior: "smooth",
                    });

                    // 2. Perform a secondary adjustment after 260ms once the banner height animation finishes
                    setTimeout(() => {
                      const updatedHeader = document.querySelector("header");
                      const updatedHeaderHeight = updatedHeader ? updatedHeader.offsetHeight : 64;
                      const updatedElementPosition = target.getBoundingClientRect().top;
                      const updatedOffset = updatedElementPosition + window.scrollY - updatedHeaderHeight - 2;

                      window.scrollTo({
                        top: updatedOffset,
                        behavior: "smooth",
                      });
                    }, 260);
                  }
                }}
                className="flex items-center justify-center gap-2 px-7 py-4 rounded-md border border-primary/10 text-primary font-bold text-base hover:bg-primary/5 hover:border-primary/60 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                Lihat Cara Pakainya
              </a>
            </motion.div>

            {/* Trust micro-row — dark text on white */}
            <motion.div
              custom={4}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="flex flex-wrap items-center gap-4 justify-center lg:justify-start mt-8"
            >
              <div className="flex items-center gap-1.5 text-slate-600 text-sm font-semibold">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <span>4.9/5 rating</span>
              </div>
              <div className="w-px h-4 bg-slate-200" />
              <div className="flex items-center gap-1.5 text-slate-600 text-sm font-semibold">
                <Users className="w-3.5 h-3.5 text-primary" />
                <span>5.000+ Tagihan dibuat</span>
              </div>
              <div className="w-px h-4 bg-slate-200" />
              <div className="flex items-center gap-1.5 text-slate-600 text-sm font-semibold">
                <Zap className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
                <span>No login needed</span>
              </div>
            </motion.div>
          </div>

          {/* Right — Mock UI Card */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 flex justify-center lg:justify-end relative"
          >
            {/* Glow behind card */}
            <div className="absolute inset-0 bg-primary/15 blur-[50px] rounded-full scale-75 pointer-events-none" />

            <div className="relative flex flex-col items-center justify-center min-h-[460px] sm:min-h-[650px] w-full max-w-[600px] lg:translate-x-16 xl:translate-x-24 overflow-visible">
              {/* Phone Mock behind the main card - shifted left */}
              <div className="absolute -z-10 pointer-events-none opacity-90 -translate-x-28 xs:-translate-x-32 sm:-translate-x-36 transition-transform w-[530px] xs:w-[510px] sm:w-[595px] h-auto">
                <Image
                  src="/img/mockup-phone.webp"
                  alt="Phone Mockup"
                  width={720}
                  height={720}
                  sizes="(max-width: 640px) 280px, 560px"
                  className="object-contain w-full h-auto"
                />
              </div>

              {/* Main card - shifted right */}
              <div className="relative z-10 scale-[0.9] xs:scale-95 sm:scale-95 md:scale-100 transition-transform translate-x-16 xs:translate-x-20 sm:translate-x-24">
                <ScanFlow />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

    </section>
  );
};
