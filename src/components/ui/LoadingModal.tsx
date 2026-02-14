"use client";

import React, { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
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

const EMOJIS = ["🤖", "📝", "🔍", "⚡", "💸", "🍽️", "✨", "📱"];

interface LoadingModalProps {
  isOpen: boolean;
}

export function LoadingModal({ isOpen }: LoadingModalProps) {
  const [mounted, setMounted] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [emojiIndex, setEmojiIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
    // Randomize initial states
    setMessageIndex(Math.floor(Math.random() * LOADING_MESSAGES.length));
    setEmojiIndex(Math.floor(Math.random() * EMOJIS.length));

    if (isOpen) {
      const interval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
        setEmojiIndex((prev) => (prev + 1) % EMOJIS.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[1000] p-6 animate-in fade-in duration-300">
      <div className="max-w-xs w-full bg-white rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col items-center text-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center animate-bounce shadow-inner border border-primary/10">
            <span className="text-4xl filter drop-shadow-sm transition-all duration-500 ease-in-out">
              {EMOJIS[emojiIndex]}
            </span>
          </div>
          <div className="absolute -top-1 -right-1 bg-amber-400 text-white p-1.5 rounded-full shadow-lg">
            <Sparkles className="w-3 h-3" />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-black text-foreground tracking-tight uppercase italic">
            Thinking... 🚀
          </h3>
          <p className="text-sm text-muted-foreground font-medium leading-relaxed min-h-[40px] transition-all">
            {LOADING_MESSAGES[messageIndex]}
          </p>
        </div>

        <div className="w-full bg-muted/30 h-1.5 rounded-full overflow-hidden border border-black/5">
          <div className="bg-primary h-full w-full origin-left animate-progress-indefinite shadow-[0_0_8px_rgba(var(--primary),0.4)]" />
        </div>
      </div>
    </div>,
    document.body,
  );
}
