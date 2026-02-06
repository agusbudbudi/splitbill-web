import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Invoice,
  InvoiceItem,
  BilledEntity,
  PaymentMethod,
} from "@/lib/types/invoice";
import {
  generateInvoiceNumber,
  calculateDiscount,
  numberToWords,
} from "@/lib/utils/invoice";

interface InvoiceState {
  // Current invoice being created
  currentInvoice: Partial<Invoice>;
  currentStep: number;

  // Billed entities
  billedByList: BilledEntity[];
  billedToList: BilledEntity[];
  selectedBilledByIndex: number | null;
  selectedBilledToIndex: number | null;

  // Invoice history
  invoiceHistory: Invoice[];

  // Actions
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  updateInvoice: (data: Partial<Invoice>) => void;

  // Billed By/To management
  addBilledBy: (entity: Omit<BilledEntity, "id">) => void;
  addBilledTo: (entity: Omit<BilledEntity, "id">) => void;
  selectBilledBy: (index: number | null) => void;
  selectBilledTo: (index: number | null) => void;
  removeBilledBy: (index: number) => void;
  removeBilledTo: (index: number) => void;

  // Invoice items management
  addItem: (item: Omit<InvoiceItem, "id" | "amount">) => void;
  updateItem: (id: string, data: Partial<InvoiceItem>) => void;
  removeItem: (id: string) => void;

  // Calculations
  calculateTotals: () => void;

  // Invoice number generation
  generateInvoiceNo: (prefix: string) => void;

  // Finalize and save
  finalizeInvoice: () => Invoice;
  saveToHistory: (invoice: Invoice) => void;

  // Reset
  resetInvoice: () => void;

  // Toggle Payment Method
  togglePaymentMethod: (method: PaymentMethod) => void;
}

const initialInvoiceState: Partial<Invoice> = {
  invoiceNo: "",
  invoiceDate: new Date().toISOString().split("T")[0],
  dueDate: new Date().toISOString().split("T")[0],
  logo: undefined,
  billedBy: null,
  billedTo: null,
  items: [],
  discountType: "amount",
  discountValue: 0,
  subtotal: 0,
  discountAmount: 0,
  total: 0,
  totalInWords: "",
  paymentMethods: [],
  tnc: "",
  footer: "",
  status: "draft",
};

export const useInvoiceStore = create<InvoiceState>()(
  persist(
    (set, get) => ({
      currentInvoice: { ...initialInvoiceState },
      currentStep: 1,
      billedByList: [],
      billedToList: [],
      selectedBilledByIndex: null,
      selectedBilledToIndex: null,
      invoiceHistory: [],

      setCurrentStep: (step: number) => {
        if (step >= 1 && step <= 6) {
          set({ currentStep: step });
        }
      },

      nextStep: () => {
        const { currentStep } = get();
        if (currentStep < 6) {
          set({ currentStep: currentStep + 1 });
        }
      },

      prevStep: () => {
        const { currentStep } = get();
        if (currentStep > 1) {
          set({ currentStep: currentStep - 1 });
        }
      },

      updateInvoice: (data: Partial<Invoice>) => {
        set((state) => ({
          currentInvoice: { ...state.currentInvoice, ...data },
        }));
      },

      // Billed By/To management
      addBilledBy: (entity: Omit<BilledEntity, "id">) => {
        const newEntity: BilledEntity = {
          ...entity,
          id: Date.now().toString(),
        };
        set((state) => ({
          billedByList: [...state.billedByList, newEntity],
        }));
      },

      addBilledTo: (entity: Omit<BilledEntity, "id">) => {
        const newEntity: BilledEntity = {
          ...entity,
          id: Date.now().toString(),
        };
        set((state) => ({
          billedToList: [...state.billedToList, newEntity],
        }));
      },

      selectBilledBy: (index: number | null) => {
        const { selectedBilledByIndex } = get();
        const newIndex = selectedBilledByIndex === index ? null : index;

        set({ selectedBilledByIndex: newIndex });
        const { billedByList } = get();
        if (newIndex !== null && billedByList[newIndex]) {
          get().updateInvoice({ billedBy: billedByList[newIndex] });
        } else {
          get().updateInvoice({ billedBy: null });
        }
      },

      selectBilledTo: (index: number | null) => {
        const { selectedBilledToIndex } = get();
        const newIndex = selectedBilledToIndex === index ? null : index;

        set({ selectedBilledToIndex: newIndex });
        const { billedToList } = get();
        if (newIndex !== null && billedToList[newIndex]) {
          get().updateInvoice({ billedTo: billedToList[newIndex] });
        } else {
          get().updateInvoice({ billedTo: null });
        }
      },

      removeBilledBy: (index: number) => {
        set((state) => {
          const newList = state.billedByList.filter((_, i) => i !== index);
          let newSelectedIndex = state.selectedBilledByIndex;
          let newBilledBy = state.currentInvoice.billedBy;

          if (newSelectedIndex === index) {
            newSelectedIndex = null;
            newBilledBy = null;
          } else if (newSelectedIndex !== null && newSelectedIndex > index) {
            newSelectedIndex--;
          }

          return {
            billedByList: newList,
            selectedBilledByIndex: newSelectedIndex,
            currentInvoice: { ...state.currentInvoice, billedBy: newBilledBy },
          };
        });
      },

      removeBilledTo: (index: number) => {
        set((state) => {
          const newList = state.billedToList.filter((_, i) => i !== index);
          let newSelectedIndex = state.selectedBilledToIndex;
          let newBilledTo = state.currentInvoice.billedTo;

          if (newSelectedIndex === index) {
            newSelectedIndex = null;
            newBilledTo = null;
          } else if (newSelectedIndex !== null && newSelectedIndex > index) {
            newSelectedIndex--;
          }

          return {
            billedToList: newList,
            selectedBilledToIndex: newSelectedIndex,
            currentInvoice: { ...state.currentInvoice, billedTo: newBilledTo },
          };
        });
      },

      // Invoice items management
      addItem: (item: Omit<InvoiceItem, "id" | "amount">) => {
        const newItem: InvoiceItem = {
          ...item,
          id: Date.now().toString(),
          amount: item.qty * item.rate,
        };

        set((state) => ({
          currentInvoice: {
            ...state.currentInvoice,
            items: [...(state.currentInvoice.items || []), newItem],
          },
        }));

        get().calculateTotals();
      },

      updateItem: (id: string, data: Partial<InvoiceItem>) => {
        set((state) => {
          const items = state.currentInvoice.items || [];
          const updatedItems = items.map((item) => {
            if (item.id === id) {
              const updated = { ...item, ...data };
              // Recalculate amount if qty or rate changed
              if (data.qty !== undefined || data.rate !== undefined) {
                updated.amount = updated.qty * updated.rate;
              }
              return updated;
            }
            return item;
          });

          return {
            currentInvoice: {
              ...state.currentInvoice,
              items: updatedItems,
            },
          };
        });

        get().calculateTotals();
      },

      removeItem: (id: string) => {
        set((state) => ({
          currentInvoice: {
            ...state.currentInvoice,
            items: (state.currentInvoice.items || []).filter(
              (item) => item.id !== id,
            ),
          },
        }));

        get().calculateTotals();
      },

      // Calculations
      calculateTotals: () => {
        set((state) => {
          const items = state.currentInvoice.items || [];
          const subtotal = items.reduce((sum, item) => sum + item.amount, 0);

          const discountAmount = calculateDiscount(
            subtotal,
            state.currentInvoice.discountType || "amount",
            state.currentInvoice.discountValue || 0,
          );

          const total = Math.max(0, subtotal - discountAmount);
          const totalInWords = numberToWords(total);

          return {
            currentInvoice: {
              ...state.currentInvoice,
              subtotal,
              discountAmount,
              total,
              totalInWords,
            },
          };
        });
      },

      // Invoice number generation
      generateInvoiceNo: (prefix: string) => {
        const invoiceNo = generateInvoiceNumber(prefix);
        get().updateInvoice({ invoiceNo });
      },

      // Finalize and save
      finalizeInvoice: () => {
        const { currentInvoice } = get();
        const finalizedInvoice: Invoice = {
          ...(currentInvoice as Invoice),
          id: currentInvoice.id || Date.now().toString(),
          status: "unpaid",
          finalizedAt: new Date().toISOString(),
          createdAt: currentInvoice.createdAt || new Date().toISOString(),
        };

        get().saveToHistory(finalizedInvoice);

        // Generate new invoice number with same prefix
        let prefix = "INV-";
        const currentInvoiceNo = currentInvoice.invoiceNo;
        if (currentInvoiceNo && currentInvoiceNo.length > 11) {
          // Format is PREFIX + DDMMYYYY + XXX (11 chars suffix)
          prefix = currentInvoiceNo.slice(0, currentInvoiceNo.length - 11);
        }

        const newInvoiceNo = generateInvoiceNumber(prefix);

        // Reset to new draft but keep Billed By, Billed To, Payment Methods, TnC, Footer, Logo, and Prefix (via new invoice no)
        // This allows creating the next invoice with same entities immediately
        set({
          currentInvoice: {
            ...initialInvoiceState,
            invoiceNo: newInvoiceNo,
            logo: currentInvoice.logo,
            billedBy: currentInvoice.billedBy,
            billedTo: currentInvoice.billedTo,
            paymentMethods: currentInvoice.paymentMethods,
            tnc: currentInvoice.tnc,
            footer: currentInvoice.footer,
          },
          currentStep: 1,
        });

        return finalizedInvoice;
      },

      saveToHistory: (invoice: Invoice) => {
        set((state) => {
          const existingIndex = state.invoiceHistory.findIndex(
            (inv) => inv.invoiceNo === invoice.invoiceNo,
          );

          let newHistory;
          if (existingIndex !== -1) {
            // Update existing invoice
            newHistory = [...state.invoiceHistory];
            newHistory[existingIndex] = invoice;
          } else {
            // Add new invoice
            newHistory = [...state.invoiceHistory, invoice];
          }

          return { invoiceHistory: newHistory };
        });
      },

      // Reset
      resetInvoice: () => {
        set({
          currentInvoice: { ...initialInvoiceState },
          currentStep: 1,
          selectedBilledByIndex: null,
          selectedBilledToIndex: null,
        });
      },

      togglePaymentMethod: (method: PaymentMethod) => {
        const { currentInvoice } = get();
        const paymentMethods = currentInvoice.paymentMethods || [];
        const exists = paymentMethods.some((m) => m.id === method.id);

        let newMethods;
        if (exists) {
          newMethods = paymentMethods.filter((m) => m.id !== method.id);
        } else {
          newMethods = [...paymentMethods, method];
        }

        get().updateInvoice({ paymentMethods: newMethods });
      },
    }),
    {
      name: "invoice-storage",
      partialize: (state) => ({
        billedByList: state.billedByList,
        billedToList: state.billedToList,
        invoiceHistory: state.invoiceHistory,
        currentInvoice: state.currentInvoice,
        currentStep: state.currentStep,
        selectedBilledByIndex: state.selectedBilledByIndex,
        selectedBilledToIndex: state.selectedBilledToIndex,
      }),
    },
  ),
);
