"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSplitBillChatStore } from "@/store/useSplitBillChatStore";
import { trackChatBill } from "@/lib/gtag";

interface ChatAgentFABProps {
  bottomClass?: string;
}

const TOOLTIP_VISIBLE_MS = 4000;

export function ChatAgentFAB({ bottomClass = "bottom-24" }: ChatAgentFABProps) {
  const { openChat, isOpen, step, messages } = useSplitBillChatStore();
  const [showTooltip, setShowTooltip] = useState(true);

  // Session is active if there are messages and the flow isn't finished
  const hasActiveSession = messages.length > 0 && step !== "DONE";

  useEffect(() => {
    setShowTooltip(true);
    const timer = setTimeout(() => setShowTooltip(false), TOOLTIP_VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [hasActiveSession]);

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
    <div className={`fixed ${bottomClass} right-4 z-[45] flex flex-col items-end gap-2.5 pointer-events-none`}>
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

      {/* FAB button */}
      <motion.button
        onClick={handleOpen}
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

        <img src="/img/agent-billy.png" alt="Agent Billy" className="w-full h-full object-cover relative z-10 rounded-full" />

        {/* Session dot */}
        {hasActiveSession && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white shadow-sm z-20" />
        )}
      </motion.button>
    </div>
  );
}
