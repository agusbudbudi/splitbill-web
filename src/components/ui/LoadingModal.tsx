"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const LOADING_MESSAGES = [
  "Tunggu sebentar, AI lagi kerja keras buat split nih... 🤖",
  "Sabar yak, AI lagi masak menu-menu kamu biar gak pusing... 🍳",
  "Chill dulu aja, biar AI yang pusing ngitungnya... 🍹",
  "AI lagi deteksi harga-harga nih, jangan kemana-mana ya! ✨",
  "Lagi baca struk kamu... AI lagi mode fokus banget nih! 🔍",
  "Dikit lagi selesai! AI lagi rapihin data kamu nih... 💅",
  "POV: Kamu lagi nunggu AI beresin urusan bill kamu... 🍿",
  "Bebas pusing! AI lagi urus semuanya, stay cool... 😎",
];

interface LoadingModalProps {
  isOpen: boolean;
  /** Uploaded receipt image (data URL) shown inside the scan frame. Falls
   * back to the static illustration when not provided. */
  image?: string | null;
}

export function LoadingModal({ isOpen, image }: LoadingModalProps) {
  const [mounted, setMounted] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(10);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setProgress(10);
      setMessageIndex(Math.floor(Math.random() * LOADING_MESSAGES.length));

      const messageInterval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 2500);

      // Simulated progress bar: climbs toward 90% while the real request is
      // in flight. It never claims completion on its own — only the actual
      // scan resolving (isOpen -> false below) pushes it to 100%. This is
      // purely a perceived-speed cue (same trick splitbillin.com uses); it
      // doesn't reflect real backend progress since there's no streaming API.
      const progressInterval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? Math.min(90, prev + Math.random() * 8) : prev));
      }, 400);

      return () => {
        clearInterval(messageInterval);
        clearInterval(progressInterval);
      };
    }

    if (visible) {
      // Scan just finished — snap to 100% briefly instead of yanking the
      // modal away mid-climb, then hide.
      setProgress(100);
      const hideTimeout = setTimeout(() => setVisible(false), 400);
      return () => clearTimeout(hideTimeout);
    }
  }, [isOpen]);

  if (!visible || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center z-[1000] p-6 text-slate-800 overflow-hidden animate-in fade-in duration-500">
      {/* Scan-line sweep keyframes */}
      <style>{`
        @keyframes scan-line-sweep {
          0%, 100% { top: 2%; }
          50% { top: 98%; }
        }
        .animate-scan-line {
          animation: scan-line-sweep 2.4s ease-in-out infinite;
        }
      `}</style>

      {/* Premium Soft Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-primary/10 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 -translate-x-1/2 w-[280px] h-[280px] bg-indigo-500/5 rounded-full filter blur-[80px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[250px] h-[250px] bg-cyan-500/5 rounded-full filter blur-[90px] pointer-events-none" />

      {/* Main Content Container */}
      <div className="relative max-w-md w-full flex flex-col items-center text-center gap-6 z-10">

        {/* Square Scan Frame — shows the uploaded receipt with a sweeping scan line */}
        <div className="relative w-60 h-60 md:w-64 md:h-64 rounded-2xl overflow-hidden border border-primary/15 bg-slate-50 shadow-[0_12px_24px_rgba(0,0,0,0.08)]">
          {image ? (
            <img
              src={image}
              alt="Struk yang di-scan"
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src="/img/illustration-scan-bill.png"
              alt="Scan Bill illustration"
              className="w-full h-full object-contain p-4"
            />
          )}

          {/* Dimming overlay so the scan line reads clearly on busy receipts */}
          <div className="absolute inset-0 bg-black/5 pointer-events-none" />

          {/* Sweeping scan line */}
          <div className="absolute left-0 right-0 h-[3px] animate-scan-line pointer-events-none">
            <div className="h-full w-full bg-gradient-to-r from-transparent via-primary to-transparent" />
            <div className="absolute inset-x-0 -top-2 h-5 bg-primary/40 blur-md" />
          </div>

          {/* Corner brackets for a "scanner frame" feel */}
          <div className="absolute inset-2.5 pointer-events-none">
            <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-primary/70 rounded-tl-md" />
            <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-primary/70 rounded-tr-md" />
            <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-primary/70 rounded-bl-md" />
            <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-primary/70 rounded-br-md" />
          </div>
        </div>

        {/* Loading Message */}
        <div className="px-4">
          <p className="text-base md:text-lg text-slate-700 font-semibold leading-relaxed min-h-[56px] transition-all duration-300 max-w-sm">
            {LOADING_MESSAGES[messageIndex]}
          </p>
        </div>

        {/* Determinate Progress Bar (simulated, snaps to 100% on real completion) */}
        <div className="w-56 bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/50 relative shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-primary to-indigo-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Scan Time Estimate */}
        <p className="text-xs text-muted-foreground animate-pulse duration-[2000ms]">
          ⏳ Biasanya cuma butuh beberapa detik kok, stay tune ya bestie! 💅✨
        </p>
      </div>
    </div>,
    document.body,
  );
}

