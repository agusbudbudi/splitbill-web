import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Expense, AdditionalExpense } from "./useSplitBillStore";
import {
  splitBillApi,
  mapFrontendToBackend,
  mapBackendToFrontend,
} from "@/lib/api/split-bills";

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
  isLoading: boolean;
  error: string | null;

  // Payment Method Actions
  addPaymentMethod: (method: Omit<PaymentMethod, "id">) => string;
  removePaymentMethod: (id: string) => void;

  // History Actions
  fetchBills: () => Promise<void>;
  saveBill: (
    bill: Omit<SavedBill, "id" | "date">,
    summary?: any,
  ) => Promise<string | undefined>;
  deleteBill: (id: string) => Promise<void>;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      paymentMethods: [],
      savedBills: [],
      isLoading: false,
      error: null,

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

      fetchBills: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await splitBillApi.getAll();
          if (response.success) {
            const mappedBills = response.records.map(mapBackendToFrontend);
            set({ savedBills: mappedBills });
          }
        } catch (err: any) {
          console.error("Failed to fetch bills from backend:", err);
          // Don't set error here to allow fallback to local storage
        } finally {
          set({ isLoading: false });
        }
      },

      saveBill: async (bill, summary) => {
        const tempId = Math.random().toString(36).substring(7);
        const tempDate = new Date().toISOString();

        const localBill: SavedBill = {
          ...bill,
          id: tempId,
          date: tempDate,
        };

        // Update local state first for immediate UI feedback
        set((state) => ({
          savedBills: [localBill, ...state.savedBills],
        }));

        try {
          if (summary) {
            const state = get();
            const payload = mapFrontendToBackend(localBill, summary, state.paymentMethods);
            const response = await splitBillApi.create(payload);

            if (response.success) {
              const backendBill = mapBackendToFrontend(response.record);

              // Replace temp local bill with actual backend bill
              set((state) => ({
                savedBills: state.savedBills.map((b) =>
                  b.id === tempId ? backendBill : b,
                ),
              }));
              return backendBill.id;
            }
          }
        } catch (err) {
          console.error("Failed to save bill to backend:", err);
          // Stay with local version if backend fails
        }

        return tempId;
      },

      deleteBill: async (id) => {
        // Update local state first
        set((state) => ({
          savedBills: state.savedBills.filter((b) => b.id !== id),
        }));

        try {
          // If it's a MongoDB ID (usually 24 chars hex), call backend
          if (/^[0-9a-fA-F]{24}$/.test(id)) {
            await splitBillApi.delete(id);
          }
        } catch (err) {
          console.error("Failed to delete bill from backend:", err);
        }
      },
    }),
    {
      name: "wallet-storage",
      // Only persist paymentMethods locally, bills will be from backend
      partialize: (state) => ({
        paymentMethods: state.paymentMethods,
        savedBills: state.savedBills,
      }),
    },
  ),
);
