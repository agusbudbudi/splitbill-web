import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Expense, AdditionalExpense } from "./useSplitBillStore";

export type PaymentMethodType = "bank" | "ewallet";

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  providerName: string; // BCA, GoPay, etc.
  accountName: string; // Owner name
  accountNumber?: string; // For banks
  phoneNumber?: string; // For e-wallets
}

export interface SavedBill {
  id: string;
  date: string; // ISO string
  activityName: string;
  totalAmount: number;
  people: string[];
  expenses: Expense[];
  additionalExpenses: AdditionalExpense[];
  selectedPaymentMethodIds?: string[];
  // We could store the full state to restore it later if needed
}

interface WalletState {
  paymentMethods: PaymentMethod[];
  savedBills: SavedBill[];

  // Payment Method Actions
  addPaymentMethod: (method: Omit<PaymentMethod, "id">) => string;
  removePaymentMethod: (id: string) => void;

  // History Actions
  saveBill: (bill: Omit<SavedBill, "id" | "date">) => void;
  deleteBill: (id: string) => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      paymentMethods: [],
      savedBills: [],

      addPaymentMethod: (method) => {
        const id = Math.random().toString(36).substring(7);
        set((state) => ({
          paymentMethods: [...state.paymentMethods, { ...method, id }],
        }));
        return id;
      },

      removePaymentMethod: (id) =>
        set((state) => ({
          paymentMethods: state.paymentMethods.filter((m) => m.id !== id),
        })),

      saveBill: (bill) => {
        const id = Math.random().toString(36).substring(7);
        set((state) => ({
          savedBills: [
            {
              ...bill,
              id,
              date: new Date().toISOString(),
            },
            ...state.savedBills, // Newest first
          ],
        }));
        return id;
      },

      deleteBill: (id) =>
        set((state) => ({
          savedBills: state.savedBills.filter((b) => b.id !== id),
        })),
    }),
    {
      name: "wallet-storage",
    },
  ),
);
