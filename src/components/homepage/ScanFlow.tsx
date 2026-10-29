"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Check, Camera } from "lucide-react";

// Animated "photo -> scan -> bill" card used in the homepage hero.

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
          alt=""
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
      {/* initial={false}: first overlay paints from the server HTML instead of
          waiting for hydration to fade in */}
      <AnimatePresence initial={false}>
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
              alt="Contoh struk restoran yang sedang discan AI SplitBill"
              fill
              sizes="300px"
              // Eager but not priority: the card only appears ~0.9s in, so a
              // high-priority preload would compete with the hero LCP image
              loading="eager"
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
// startDelay holds the first stage longer, for when the card itself enters late
export const ScanFlow = ({ startDelay = 0 }: { startDelay?: number }) => {
  const [stage, setStage] = React.useState(0);
  const revealed = stage === STAGE_DURATIONS.length - 1;

  React.useEffect(() => {
    if (revealed) return;
    const t = setTimeout(
      () => setStage((s) => s + 1),
      STAGE_DURATIONS[stage] + (stage === 0 ? startDelay : 0)
    );
    return () => clearTimeout(t);
  }, [stage, revealed, startDelay]);

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
          className="absolute -top-12 sm:-top-14 left-1/2 -translate-x-1/2 bg-emerald-500 text-white rounded-md shadow-xl px-3 py-1.5 flex items-center gap-1.5 z-20 whitespace-nowrap pointer-events-none"
        >
          <Camera className="w-3.5 h-3.5" />
          <span className="text-[13px] font-bold">Struk Kebaca Otomatis!</span>
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
          className="absolute -bottom-24 -left-16 sm:-left-20 bg-white rounded-md shadow-2xl shadow-primary/15 px-4 py-3.5 flex items-center gap-3 z-20 pointer-events-none"
        >
          <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center shrink-0 shadow-md shadow-success/30">
            <Check className="w-5 h-5 text-success-foreground" strokeWidth={3} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">AI scan selesai</p>
            <p className="text-sm font-black text-slate-800">5 detik aja! ⚡</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
