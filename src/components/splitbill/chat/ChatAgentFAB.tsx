"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSplitBillChatStore } from "@/store/useSplitBillChatStore";
import { trackChatBill } from "@/lib/gtag";
import { cn } from "@/lib/utils";

interface ChatAgentFABProps {
  bottomClass?: string;
}

const TOOLTIP_VISIBLE_MS = 4000;
const AUTO_HIDE_MS = 6000;

export function ChatAgentFAB({ bottomClass = "bottom-24" }: ChatAgentFABProps) {
  const { openChat, isOpen, step, messages } = useSplitBillChatStore();
  const [showTooltip, setShowTooltip] = useState(true);
  const [autoHidden, setAutoHidden] = useState(false);
  // A manual hide/show wins over auto-hide from then on, so the FAB never slides
  // away right after the user asked to see it.
  const [manualHidden, setManualHidden] = useState<boolean | null>(null);

  // Session is active if there are messages and the flow isn't finished
  const hasActiveSession = messages.length > 0 && step !== "DONE";

  // An unfinished session keeps the FAB out so the user can resume it.
  const isHidden = manualHidden ?? (autoHidden && !hasActiveSession);

  useEffect(() => {
    setShowTooltip(true);
    const timer = setTimeout(() => setShowTooltip(false), TOOLTIP_VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [hasActiveSession]);

  // Paused while chat is open, so closing it gives the FAB a fresh countdown.
  useEffect(() => {
    if (manualHidden !== null || isOpen || hasActiveSession) return;
    const timer = setTimeout(() => setAutoHidden(true), AUTO_HIDE_MS);
    return () => clearTimeout(timer);
  }, [manualHidden, isOpen, hasActiveSession]);

  // Don't render FAB while chat is open
  if (isOpen) return null;

  const handleOpen = () => {
    if (typeof window !== "undefined") {
      const pathname = window.location.pathname;
      const params = new URLSearchParams(window.location.search);
      const wizardStepParam = params.get("step");
      const wizardStep = wizardStepParam ? parseInt(wizardStepParam, 10) : undefined;

      trackChatBill.open({
        referrer_page: pathname,
        ...(pathname === "/split-bill" && wizardStep ? { wizard_step: wizardStep } : {}),
      });
    }
    openChat();
  };

  return (
    <>
    <div
      className={cn(
        "fixed right-4 z-[45] flex flex-col items-end gap-2.5 pointer-events-none transition-transform duration-300 ease-out",
        bottomClass,
        // Clears the screen edge, including the hide button overhanging the FAB
        isHidden && "translate-x-[calc(100%+3rem)]",
      )}
      aria-hidden={isHidden}
    >
      {/* Tooltip label */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ delay: 0.7, duration: 0.3 }}
            className="pointer-events-none"
          >
            <div className="relative bg-white/95 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-lg border border-border/60">
              <p className="text-[11px] font-bold text-foreground whitespace-nowrap">
                {hasActiveSession ? "Lanjut Split Bill 💬" : "Split via Chat ✨"}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative">
      {/* Hide button */}
      <button
        type="button"
        onClick={() => setManualHidden(true)}
        tabIndex={isHidden ? -1 : 0}
        aria-label="Sembunyikan chat Agent Billy"
        className="absolute -left-3 top-1/2 -translate-y-1/2 z-30 w-6 h-6 rounded-full bg-white border border-border/60 shadow-md flex items-center justify-center text-muted-foreground hover:text-primary pointer-events-auto cursor-pointer"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>

      {/* FAB button */}
      <motion.button
        onClick={handleOpen}
        tabIndex={isHidden ? -1 : 0}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 18, stiffness: 280, delay: 0.4 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="relative w-14 h-14 rounded-full bg-slate-100 shadow-xl shadow-primary/35 flex items-center justify-center pointer-events-auto border-2 border-primary cursor-pointer"
      >
        {/* Pulse ring when session is active */}
        {hasActiveSession && showTooltip && (
          <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
        )}

        <img src="/img/agent-billy.webp" alt="Agent Billy" className="w-full h-full object-cover relative z-10 rounded-full" />

        {/* Session dot */}
        {hasActiveSession && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white shadow-sm z-20" />
        )}
      </motion.button>
      </div>
    </div>

    {/* Edge tab shown while hidden */}
    <AnimatePresence>
      {isHidden && (
        <motion.button
          type="button"
          onClick={() => setManualHidden(false)}
          initial={{ x: "100%" }}
          animate={{ x: "0%" }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          aria-label="Tampilkan chat Agent Billy"
          className={cn(
            "fixed right-0 z-[45] mb-1 w-7 h-12 rounded-l-lg bg-white border border-r-0 border-primary/40 shadow-lg shadow-primary/20 flex items-center justify-center text-primary cursor-pointer",
            bottomClass,
          )}
        >
          <ChevronLeft className="w-4 h-4" />
          {/* Keeps the active-session signal visible while the FAB is away */}
          {hasActiveSession && (
            <span className="absolute -top-1 left-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white" />
          )}
        </motion.button>
      )}
    </AnimatePresence>
    </>
  );
}
