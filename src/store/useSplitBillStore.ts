import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Expense {
  id: string;
  item: string;
  amount: number;
  who: string[]; // names of people sharing the expense
  paidBy: string; // name of person who paid
}

export interface AdditionalExpense {
  id: string;
  name: string;
  amount: number;
  who: string[];
  paidBy: string;
  splitType: "equally" | "proportionally";
}

interface SplitBillState {
  activityName: string;
  people: string[];
  expenses: Expense[];
  additionalExpenses: AdditionalExpense[];
  selectedPaymentMethodIds: string[];

  // Actions
  setActivityName: (name: string) => void;
  setSelectedPaymentMethodIds: (ids: string[]) => void;
  togglePaymentMethodSelection: (id: string) => void;
  addPerson: (name: string) => void;
  removePerson: (name: string) => void;

  addExpense: (expense: Omit<Expense, "id">) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  removeExpense: (id: string) => void;

  addAdditionalExpense: (expense: Omit<AdditionalExpense, "id">) => void;
  updateAdditionalExpense: (
    id: string,
    expense: Partial<AdditionalExpense>,
  ) => void;
  removeAdditionalExpense: (id: string) => void;

  clearDraftAfterFinalize: () => void;
}

export const useSplitBillStore = create<SplitBillState>()(
  persist(
    (set) => ({
      activityName: "",
      people: [],
      expenses: [],
      additionalExpenses: [],
      selectedPaymentMethodIds: [],

      setActivityName: (activityName) => set({ activityName }),
      setSelectedPaymentMethodIds: (ids) =>
        set({ selectedPaymentMethodIds: ids }),
      togglePaymentMethodSelection: (id) =>
        set((state) => ({
          selectedPaymentMethodIds: state.selectedPaymentMethodIds.includes(id)
            ? state.selectedPaymentMethodIds.filter((i) => i !== id)
            : [...state.selectedPaymentMethodIds, id],
        })),

      addPerson: (name) =>
        set((state) => {
          if (state.people.includes(name)) return state;
          return { people: [...state.people, name] };
        }),

      removePerson: (name) =>
        set((state) => ({
          people: state.people.filter((p) => p !== name),
          expenses: state.expenses.map((e) => ({
            ...e,
            who: e.who.filter((w) => w !== name),
            paidBy: e.paidBy === name ? "" : e.paidBy,
          })),
        })),

      addExpense: (expense) =>
        set((state) => ({
          expenses: [
            ...state.expenses,
            { ...expense, id: Math.random().toString(36).substring(7) },
          ],
        })),

      updateExpense: (id, updatedExpense) =>
        set((state) => ({
          expenses: state.expenses.map((e) =>
            e.id === id ? { ...e, ...updatedExpense } : e,
          ),
        })),

      removeExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
        })),

      addAdditionalExpense: (expense) =>
        set((state) => ({
          additionalExpenses: [
            ...state.additionalExpenses,
            { ...expense, id: Math.random().toString(36).substring(7) },
          ],
        })),

      updateAdditionalExpense: (id, updatedExpense) =>
        set((state) => ({
          additionalExpenses: state.additionalExpenses.map((e) =>
            e.id === id ? { ...e, ...updatedExpense } : e,
          ),
        })),

      removeAdditionalExpense: (id) =>
        set((state) => ({
          additionalExpenses: state.additionalExpenses.filter(
            (e) => e.id !== id,
          ),
        })),

      clearDraftAfterFinalize: () =>
        set({
          activityName: "",
          expenses: [],
          additionalExpenses: [],
        }),
    }),
    {
      name: "split-bill-storage",
    },
  ),
);
