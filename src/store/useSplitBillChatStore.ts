import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import type { Expense, AdditionalExpense } from "./useSplitBillStore";
import type { ReceiptScanResult } from "@/lib/AIService";

// ─── Step Machine ─────────────────────────────────────────────────────────────
export type ChatStep =
  | "GREETING"
  | "ADD_FRIENDS"
  | "SELECT_PAYER"
  | "SCAN_RECEIPT"
  | "ASSIGN_ITEMS"
  | "SET_TAX_METHOD"
  | "SET_ACTIVITY"
  | "SET_PAYMENT"
  | "REVIEW"
  | "GIVE_REVIEW"
  | "DONE";

// ─── Message Types ────────────────────────────────────────────────────────────
export type MessageType =
  | "text"
  | "friend_picker"
  | "payer_picker"
  | "receipt_scan"
  | "item_assign"
  | "tax_method"
  | "activity_input"
  | "payment_picker"
  | "review_input"
  | "summary";

export interface ChatMessage {
  id: string;
  role: "agent" | "user";
  type: MessageType;
  content: string;
  timestamp: number;
  imageUrl?: string;
}

// ─── Store Interface ──────────────────────────────────────────────────────────
interface SplitBillChatState {
  /** UI-only — not persisted */
  isOpen: boolean;
  isTyping: boolean;

  /** Persisted chat state */
  step: ChatStep;
  messages: ChatMessage[];
  participants: string[];
  payerName: string;
  scannedResult: ReceiptScanResult | null;
  expenses: Expense[];
  additionalExpenses: AdditionalExpense[];
  activityName: string;
  selectedPaymentMethodIds: string[];

  // UI actions
  openChat: () => void;
  closeChat: () => void;
  setIsTyping: (val: boolean) => void;

  // Step
  setStep: (step: ChatStep) => void;

  // Messages
  addMessage: (msg: Omit<ChatMessage, "id" | "timestamp">) => void;

  // Participants
  setParticipants: (names: string[]) => void;
  addParticipant: (name: string) => void;
  removeParticipant: (name: string) => void;

  // Payer
  setPayerName: (name: string) => void;

  // Receipt
  setScannedResult: (result: ReceiptScanResult) => void;

  // Expenses
  setExpenses: (expenses: Expense[]) => void;
  updateExpense: (id: string, update: Partial<Expense>) => void;
  removeExpense: (id: string) => void;

  // Additional Expenses
  setAdditionalExpenses: (expenses: AdditionalExpense[]) => void;
  updateAdditionalExpense: (id: string, update: Partial<AdditionalExpense>) => void;
  removeAdditionalExpense: (id: string) => void;

  // Meta
  setActivityName: (name: string) => void;
  setSelectedPaymentMethodIds: (ids: string[]) => void;
  resetChat: () => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────
export const useSplitBillChatStore = create<SplitBillChatState>()(
  persist(
    (set) => ({
      // UI state (not persisted via partialize below)
      isOpen: false,
      isTyping: false,

      // Persisted
      step: "GREETING",
      messages: [],
      participants: [],
      payerName: "",
      scannedResult: null,
      expenses: [],
      additionalExpenses: [],
      activityName: "",
      selectedPaymentMethodIds: [],

      // ── UI Actions ───────────────────────────────────────────────────────
      openChat: () => set({ isOpen: true }),
      closeChat: () => set({ isOpen: false }),
      setIsTyping: (val) => set({ isTyping: val }),

      // ── Step ─────────────────────────────────────────────────────────────
      setStep: (step) => set({ step }),

      // ── Messages ──────────────────────────────────────────────────────────
      addMessage: (msg) =>
        set((state) => ({
          messages: [
            ...state.messages,
            { ...msg, id: uuidv4(), timestamp: Date.now() },
          ],
        })),

      // ── Participants ──────────────────────────────────────────────────────
      setParticipants: (names) => set({ participants: names }),

      addParticipant: (name) =>
        set((state) => ({
          participants: state.participants.includes(name)
            ? state.participants
            : [...state.participants, name],
        })),

      removeParticipant: (name) =>
        set((state) => ({
          participants: state.participants.filter((p) => p !== name),
        })),

      // ── Payer ─────────────────────────────────────────────────────────────
      setPayerName: (name) => set({ payerName: name }),

      // ── Receipt ───────────────────────────────────────────────────────────
      setScannedResult: (result) => set({ scannedResult: result }),

      // ── Expenses ──────────────────────────────────────────────────────────
      setExpenses: (expenses) => set({ expenses }),

      updateExpense: (id, update) =>
        set((state) => ({
          expenses: state.expenses.map((e) =>
            e.id === id ? { ...e, ...update } : e
          ),
        })),

      removeExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
        })),

      // ── Additional Expenses ───────────────────────────────────────────────
      setAdditionalExpenses: (expenses) =>
        set({
          additionalExpenses: expenses.map((e) => {
            const nameLower = e.name.toLowerCase();
            const isDiscount = nameLower.includes("diskon") || nameLower.includes("discount");
            if (isDiscount) {
              return { ...e, amount: -Math.abs(e.amount), paidBy: "merchant" };
            }
            return e;
          }),
        }),

      updateAdditionalExpense: (id, update) =>
        set((state) => ({
          additionalExpenses: state.additionalExpenses.map((e) => {
            if (e.id === id) {
              const newFields = { ...e, ...update };
              const nameLower = newFields.name.toLowerCase();
              const isDiscount = nameLower.includes("diskon") || nameLower.includes("discount");
              const finalAmount = isDiscount ? -Math.abs(newFields.amount) : newFields.amount;
              const finalPaidBy = isDiscount ? "merchant" : newFields.paidBy;
              return { ...newFields, amount: finalAmount, paidBy: finalPaidBy };
            }
            return e;
          }),
        })),

      removeAdditionalExpense: (id) =>
        set((state) => ({
          additionalExpenses: state.additionalExpenses.filter((e) => e.id !== id),
        })),

      // ── Meta ──────────────────────────────────────────────────────────────
      setActivityName: (name) => set({ activityName: name }),
      setSelectedPaymentMethodIds: (ids) => set({ selectedPaymentMethodIds: ids }),

      resetChat: () =>
        set({
          step: "GREETING",
          messages: [],
          participants: [],
          payerName: "",
          scannedResult: null,
          expenses: [],
          additionalExpenses: [],
          activityName: "",
          selectedPaymentMethodIds: [],
          isTyping: false,
        }),
    }),
    {
      name: "split-bill-chat-storage",
      // Only persist the chat data, not UI-only state
      partialize: (state) => ({
        step: state.step,
        messages: state.messages,
        participants: state.participants,
        payerName: state.payerName,
        scannedResult: state.scannedResult,
        expenses: state.expenses,
        additionalExpenses: state.additionalExpenses,
        activityName: state.activityName,
        selectedPaymentMethodIds: state.selectedPaymentMethodIds,
      }),
    }
  )
);
