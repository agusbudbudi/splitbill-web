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

  lastPaidBy: string;
  lastWho: string[];

  // Actions
  setActivityName: (name: string) => void;
  setSelectedPaymentMethodIds: (ids: string[]) => void;
  togglePaymentMethodSelection: (id: string) => void;
  addPerson: (name: string) => void;
  removePerson: (name: string) => void;

  addExpense: (expense: Omit<Expense, "id">) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  removeExpense: (id: string) => void;
  setAllExpensesPaidBy: (name: string) => void;
  setAllExpensesWho: (names: string[]) => void;

  addAdditionalExpense: (expense: Omit<AdditionalExpense, "id">) => void;
  updateAdditionalExpense: (
    id: string,
    expense: Partial<AdditionalExpense>,
  ) => void;
  removeAdditionalExpense: (id: string) => void;
  setAllAdditionalExpensesPaidBy: (name: string) => void;
  setAllAdditionalExpensesWho: (names: string[]) => void;

  setLastAssignment: (paidBy: string, who: string[]) => void;
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
      lastPaidBy: "",
      lastWho: [],

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
          lastPaidBy: state.lastPaidBy === name ? "" : state.lastPaidBy,
          lastWho: state.lastWho.filter((w) => w !== name),
        })),

      addExpense: (expense) =>
        set((state) => ({
          expenses: [
            ...state.expenses,
            { ...expense, id: Math.random().toString(36).substring(7) },
          ],
          lastPaidBy: expense.paidBy || state.lastPaidBy,
          lastWho: expense.who.length > 0 ? expense.who : state.lastWho,
        })),

      updateExpense: (id, updatedExpense) =>
        set((state) => ({
          expenses: state.expenses.map((e) =>
            e.id === id ? { ...e, ...updatedExpense } : e,
          ),
          lastPaidBy: updatedExpense.paidBy || state.lastPaidBy,
          lastWho: updatedExpense.who || state.lastWho,
        })),

      removeExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
        })),

      setAllExpensesPaidBy: (name) =>
        set((state) => ({
          expenses: state.expenses.map((e) => ({ ...e, paidBy: name })),
          lastPaidBy: name,
        })),

      setAllExpensesWho: (names) =>
        set((state) => ({
          expenses: state.expenses.map((e) => ({ ...e, who: names })),
          lastWho: names,
        })),

      addAdditionalExpense: (expense) =>
        set((state) => ({
          additionalExpenses: [
            ...state.additionalExpenses,
            { ...expense, id: Math.random().toString(36).substring(7) },
          ],
          lastPaidBy: expense.paidBy || state.lastPaidBy,
          lastWho: expense.who.length > 0 ? expense.who : state.lastWho,
        })),

      updateAdditionalExpense: (id, updatedExpense) =>
        set((state) => ({
          additionalExpenses: state.additionalExpenses.map((e) =>
            e.id === id ? { ...e, ...updatedExpense } : e,
          ),
          lastPaidBy: updatedExpense.paidBy || state.lastPaidBy,
          lastWho: updatedExpense.who || state.lastWho,
        })),

      removeAdditionalExpense: (id) =>
        set((state) => ({
          additionalExpenses: state.additionalExpenses.filter(
            (e) => e.id !== id,
          ),
        })),

      setAllAdditionalExpensesPaidBy: (name) =>
        set((state) => ({
          additionalExpenses: state.additionalExpenses.map((e) => ({
            ...e,
            paidBy: name,
          })),
          lastPaidBy: name,
        })),

      setAllAdditionalExpensesWho: (names) =>
        set((state) => ({
          additionalExpenses: state.additionalExpenses.map((e) => ({
            ...e,
            who: names,
          })),
          lastWho: names,
        })),

      setLastAssignment: (paidBy, who) =>
        set({
          lastPaidBy: paidBy,
          lastWho: who,
        }),

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
