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
}

export function LoadingModal({ isOpen }: LoadingModalProps) {
  const [mounted, setMounted] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
    setMessageIndex(Math.floor(Math.random() * LOADING_MESSAGES.length));

    if (isOpen) {
      const interval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center z-[1000] p-6 text-slate-800 overflow-hidden animate-in fade-in duration-500">
      {/* Custom Styles for Shimmer Progress Animation */}
      <style>{`
        @keyframes shimmer-progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer-progress {
          animation: shimmer-progress 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>

      {/* Premium Soft Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-primary/10 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 -translate-x-1/2 w-[280px] h-[280px] bg-indigo-500/5 rounded-full filter blur-[80px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[250px] h-[250px] bg-cyan-500/5 rounded-full filter blur-[90px] pointer-events-none" />

      {/* Main Content Container */}
      <div className="relative max-w-md w-full flex flex-col items-center text-center gap-6 z-10">

        {/* Simple Premium Illustration */}
        <div className="relative w-60 h-60 md:w-64 md:h-64 flex items-center justify-center animate-pulse duration-[3000ms]">
          <img
            src="/img/illustration-scan-bill.png"
            alt="Scan Bill illustration"
            className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.06)]"
          />
        </div>

        {/* Loading Message */}
        <div className="px-4">
          <p className="text-base md:text-lg text-slate-700 font-semibold leading-relaxed min-h-[56px] transition-all duration-300 max-w-sm">
            {LOADING_MESSAGES[messageIndex]}
          </p>
        </div>

        {/* Infinity Progress Loading Bar */}
        <div className="w-56 bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/50 relative shadow-inner">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-primary to-indigo-500 rounded-full w-full h-full animate-shimmer-progress" />
        </div>

        {/* Scan Time Estimate */}
        <p className="text-xs text-muted-foreground animate-pulse duration-[2000ms]">
          ⏳ Estimasi scan 1-2 menit, stay tune ya bestie! 💅✨
        </p>
      </div>
    </div>,
    document.body,
  );
}

