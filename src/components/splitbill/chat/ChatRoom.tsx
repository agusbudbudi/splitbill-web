"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, RotateCcw, Sparkles } from "lucide-react";
import { trackChatBill } from "@/lib/gtag";
import { useSplitBillChatStore } from "@/store/useSplitBillChatStore";
import { useChatAgent } from "@/hooks/useChatAgent";
import { ChatMessage, TypingIndicator } from "./ChatMessage";
import {
  GREETING_MESSAGES,
  friendsConfirmedMessages,
  receiptConfirmedMessages,
  taxPromptMessages,
  noTaxActivityPromptMessages,
  activityPromptMessages,
  activitySetMessages,
  paymentSetMessages,
  reviewPromptMessages,
  reviewDoneMessages,
  userText,
} from "@/lib/chat/splitBillChatEngine";
import type { ReceiptScanResult } from "@/lib/AIService";
import { v4 as uuidv4 } from "uuid";
import { useAuthStore } from "@/lib/stores/authStore";
import { useSaveChatBill } from "@/hooks/useSaveChatBill";

// ─── Step metadata ────────────────────────────────────────────────────────────
const STEP_LABELS: Record<string, string> = {
  GREETING: "Memulai...",
  ADD_FRIENDS: "Tambah Teman",
  SCAN_RECEIPT: "Scan Struk",
  ASSIGN_ITEMS: "Assign Item",
  SET_TAX_METHOD: "Atur Pajak",
  SET_ACTIVITY: "Nama Kegiatan",
  SET_PAYMENT: "Metode Bayar",
  REVIEW: "Ringkasan",
  GIVE_REVIEW: "Review",
  DONE: "Selesai 🎉",
};

const STEP_PROGRESS: Record<string, number> = {
  GREETING: 0,
  ADD_FRIENDS: 1,
  SCAN_RECEIPT: 2,
  ASSIGN_ITEMS: 3,
  SET_TAX_METHOD: 4,
  SET_ACTIVITY: 5,
  SET_PAYMENT: 6,
  REVIEW: 7,
  GIVE_REVIEW: 8,
  DONE: 8,
};
const TOTAL_STEPS = 8;

// ─── Component ────────────────────────────────────────────────────────────────
export function ChatRoom() {
  const {
    isOpen,
    openChat,
    closeChat,
    step,
    setStep,
    messages,
    isTyping,
    expenses,
    additionalExpenses,
    setScannedResult,
    setExpenses,
    setAdditionalExpenses,
    setActivityName,
    setSelectedPaymentMethodIds,
    addMessage,
    resetChat,
  } = useSplitBillChatStore();

  const { isAuthenticated, isInitialized } = useAuthStore();
  const { handleSaveBill } = useSaveChatBill();
  const { sendAgentMessages } = useChatAgent();
  const feedRef = useRef<HTMLDivElement>(null);
  const hasInitializedRef = useRef(false);

  // ── Auto-scroll on new messages / typing / open ─────────────────────────────
  useEffect(() => {
    if (!feedRef.current) return;
    // rAF ensures layout is complete before scrolling
    const id = requestAnimationFrame(() => {
      if (feedRef.current) {
        feedRef.current.scrollTop = feedRef.current.scrollHeight;
      }
    });
    return () => cancelAnimationFrame(id);
  }, [messages.length, isTyping, isOpen]);

  // ── Lock body scroll when chatroom is open ──────────────────────────────────
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (isOpen) {
      const originalStyle = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  // ── Auto-save chat split bill on mount if ?finalizeChat=true ────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const finalizeChat = params.get("finalizeChat") === "true";
    if (finalizeChat && isInitialized) {
      // Clear flag from URL immediately so it doesn't loop/trigger again
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);

      if (isAuthenticated && expenses.length > 0) {
        openChat();
        handleSaveBill();
      }
    }
  }, [isInitialized, isAuthenticated, openChat, handleSaveBill, expenses.length]);

  // ── Initialize greeting on first open ──────────────────────────────────────
  const initializeGreeting = useCallback(async () => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;
    await sendAgentMessages(GREETING_MESSAGES);
    setStep("ADD_FRIENDS");
  }, [sendAgentMessages, setStep]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeGreeting();
    }
  }, [isOpen, messages.length, initializeGreeting]);

  // Reset init flag when messages cleared (e.g. after resetChat)
  useEffect(() => {
    if (messages.length === 0) {
      hasInitializedRef.current = false;
    }
  }, [messages.length]);

  // ── Step transition handlers ────────────────────────────────────────────────

  const handleFriendsConfirmed = useCallback(
    async (names: string[]) => {
      addMessage(userText(`Oke siap, ada ${names.join(", ")} 👍`));
      await sendAgentMessages(friendsConfirmedMessages(names), 600);
      setStep("SCAN_RECEIPT");
    },
    [addMessage, sendAgentMessages, setStep]
  );

  const handleReceiptConfirmed = useCallback(
    async (result: ReceiptScanResult, _imageDataUrl: string) => {
      setScannedResult(result);

      // Convert scan items → Expense[]
      const newExpenses = (result.items ?? []).map((item) => ({
        id: uuidv4(),
        item: item.name,
        amount: item.price * (item.quantity || 1),
        who: [] as string[],
        paidBy: "",
      }));

      // Convert tax/service/discount → AdditionalExpense[]
      const newAdditional: Array<{
        id: string;
        name: string;
        amount: number;
        who: string[];
        paidBy: string;
        splitType: "equally" | "proportionally";
      }> = [];

      if (result.tax) {
        newAdditional.push({
          id: uuidv4(),
          name: "Tax",
          amount: result.tax,
          who: [],
          paidBy: "",
          splitType: "proportionally",
        });
      }
      if (result.service_charge) {
        newAdditional.push({
          id: uuidv4(),
          name: "Service Charge",
          amount: result.service_charge,
          who: [],
          paidBy: "",
          splitType: "proportionally",
        });
      }
      if (result.discount) {
        newAdditional.push({
          id: uuidv4(),
          name: "Discount",
          amount: -Math.abs(result.discount),
          who: [],
          paidBy: "merchant",
          splitType: "equally",
        });
      }

      setExpenses(newExpenses);
      setAdditionalExpenses(newAdditional);
      if (result.merchant_name) setActivityName(result.merchant_name);

      await sendAgentMessages(
        receiptConfirmedMessages(result.items?.length ?? 0, result.merchant_name),
        700
      );
      setStep("ASSIGN_ITEMS");
    },
    [
      setScannedResult,
      setExpenses,
      setAdditionalExpenses,
      setActivityName,
      sendAgentMessages,
      setStep,
    ]
  );

  const handleItemsAssigned = useCallback(async () => {
    // Read latest additional expenses directly from store to avoid stale closure
    const currentAdditional =
      useSplitBillChatStore.getState().additionalExpenses;
    if (currentAdditional.length > 0) {
      await sendAgentMessages(taxPromptMessages(), 600);
      setStep("SET_TAX_METHOD");
    } else {
      await sendAgentMessages(noTaxActivityPromptMessages(), 600);
      setStep("SET_ACTIVITY");
    }
  }, [sendAgentMessages, setStep]);

  const handleTaxMethodSet = useCallback(async () => {
    await sendAgentMessages(activityPromptMessages(), 600);
    setStep("SET_ACTIVITY");
  }, [sendAgentMessages, setStep]);

  const handleActivityConfirmed = useCallback(async (activityName: string) => {
    setActivityName(activityName);
    await sendAgentMessages(activitySetMessages(activityName), 600);
    setStep("SET_PAYMENT");
  }, [setActivityName, sendAgentMessages, setStep]);

  const handlePaymentConfirmed = useCallback(async (selectedIds: string[]) => {
    setSelectedPaymentMethodIds(selectedIds);
    await sendAgentMessages(paymentSetMessages(selectedIds.length), 600);
    setStep("REVIEW");
    // Automatically show review prompt messages after the summary
    await sendAgentMessages(reviewPromptMessages(), 600);
    setStep("GIVE_REVIEW");
  }, [setSelectedPaymentMethodIds, sendAgentMessages, setStep]);

  const handlePaymentSkipped = useCallback(async () => {
    setSelectedPaymentMethodIds([]);
    await sendAgentMessages(paymentSetMessages(0), 600);
    setStep("REVIEW");
    // Automatically show review prompt messages after the summary
    await sendAgentMessages(reviewPromptMessages(), 600);
    setStep("GIVE_REVIEW");
  }, [setSelectedPaymentMethodIds, sendAgentMessages, setStep]);

  const handleReviewDone = useCallback(
    async (skipped: boolean) => {
      await sendAgentMessages(reviewDoneMessages(skipped), 600);
      setStep("DONE");
    },
    [sendAgentMessages, setStep]
  );

  const handleReset = () => {
    trackChatBill.headerRefreshClicked({ current_step: step });
    hasInitializedRef.current = false;
    resetChat();
  };

  const handleClose = () => {
    trackChatBill.closed({ at_step: step });
    closeChat();
  };

  const progress = STEP_PROGRESS[step] ?? 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="chat-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[50] bg-black/25 backdrop-blur-[2px]"
            onClick={handleClose}
          />

          {/* Panel Wrapper */}
          <div className="fixed inset-0 z-[51] flex justify-center pointer-events-none">
            <motion.div
              key="chat-panel"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="absolute bottom-0 w-full max-w-[600px] z-[51] flex flex-col bg-gradient-to-b from-slate-50 to-white pointer-events-auto shadow-2xl"
              style={{
                height: "100dvh",
              }}
            >
              {/* ── Header ─────────────────────────────────────────────────── */}
              <div className="shrink-0 bg-gradient-to-r from-primary to-blue-600 text-white shadow-md z-10">

                {/* Title row */}
                <div className="flex items-center px-4 py-2.5">
                  <div className="relative shrink-0">
                    <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center shadow-md shadow-black/10 bg-slate-100">
                      <img src="/img/agent-billy.png" alt="Agent Billy" className="w-full h-full object-cover" />
                    </div>
                    {/* Online indicator dot */}
                    <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-black text-white">
                        Agent Billy
                      </p>
                      <span className="text-[10px] font-bold text-white bg-white/20 px-1.5 py-0.5 rounded-full leading-none">
                        Beta
                      </span>
                    </div>
                    <p className="text-[10px] text-white/70 font-medium mt-0.5">
                      {STEP_LABELS[step] ?? ""}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {step !== "GREETING" && step !== "DONE" && (
                      <button
                        onClick={handleReset}
                        className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:bg-white/20 hover:text-white transition cursor-pointer"
                        title="Reset chat"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={handleClose}
                      className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:bg-white/20 hover:text-white transition cursor-pointer"
                      title="Tutup"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-0.5 bg-white/20 w-full overflow-hidden">
                  <motion.div
                    className="h-full bg-white"
                    initial={false}
                    animate={{ width: `${(progress / TOTAL_STEPS) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* ── Message feed ───────────────────────────────────────────── */}
              <div
                ref={feedRef}
                className="flex-1 overflow-y-auto px-4 py-5 space-y-4 scroll-smooth"
              >
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22 }}
                  >
                    <ChatMessage
                      message={msg}
                      onFriendsConfirmed={handleFriendsConfirmed}
                      onReceiptConfirmed={handleReceiptConfirmed}
                      onItemsAssigned={handleItemsAssigned}
                      onTaxMethodSet={handleTaxMethodSet}
                      onActivityConfirmed={handleActivityConfirmed}
                      onPaymentConfirmed={handlePaymentConfirmed}
                      onPaymentSkipped={handlePaymentSkipped}
                      onReviewDone={handleReviewDone}
                    />
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <TypingIndicator />
                  </motion.div>
                )}

                {/* Bottom padding so last message isn't under the input bar */}
                <div className="h-2" />
              </div>

              {/* ── Hint bar ───────────────────────────────────────────────── */}
              <div className="shrink-0 px-4 py-3 border-t border-slate-100 bg-white">
                <div className="flex items-center gap-2 h-10 px-4 bg-muted/40 rounded-sm border border-border/50">
                  <Sparkles className="w-3.5 h-3.5 text-primary/40 shrink-0" />
                  <p className="text-xs text-muted-foreground/70 font-medium select-none">
                    Gunakan kartu interaktif di atas untuk lanjut 👆
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
