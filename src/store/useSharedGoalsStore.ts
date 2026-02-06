import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Contribution {
  id: string;
  memberId: string; // The person who contributed (name)
  amount: number;
  date: string; // ISO string
  note?: string;
}

export interface SharedGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string; // ISO string
  members: string[]; // List of names
  contributions: Contribution[];
  status: "active" | "completed" | "converted";
  createdAt: string;
}

interface SharedGoalsState {
  goals: SharedGoal[];

  // Actions
  addGoal: (
    goal: Omit<
      SharedGoal,
      "id" | "currentAmount" | "contributions" | "createdAt" | "status"
    >,
  ) => void;
  updateGoal: (id: string, updates: Partial<SharedGoal>) => void;
  deleteGoal: (id: string) => void;

  addContribution: (
    goalId: string,
    contribution: Omit<Contribution, "id" | "date">,
  ) => void;
  removeContribution: (goalId: string, contributionId: string) => void;
}

export const useSharedGoalsStore = create<SharedGoalsState>()(
  persist(
    (set) => ({
      goals: [],

      addGoal: (goal) =>
        set((state) => ({
          goals: [
            {
              ...goal,
              id: Math.random().toString(36).substring(7),
              currentAmount: 0,
              contributions: [],
              status: "active",
              createdAt: new Date().toISOString(),
            },
            ...state.goals,
          ],
        })),

      updateGoal: (id, updates) =>
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === id ? { ...g, ...updates } : g,
          ),
        })),

      deleteGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((g) => g.id !== id),
        })),

      addContribution: (goalId, contribution) =>
        set((state) => ({
          goals: state.goals.map((g) => {
            if (g.id !== goalId) return g;

            const newContribution = {
              ...contribution,
              id: Math.random().toString(36).substring(7),
              date: new Date().toISOString(),
            };

            return {
              ...g,
              contributions: [newContribution, ...g.contributions],
              currentAmount: g.currentAmount + contribution.amount,
            };
          }),
        })),

      removeContribution: (goalId, contributionId) =>
        set((state) => ({
          goals: state.goals.map((g) => {
            if (g.id !== goalId) return g;

            const contributionToRemove = g.contributions.find(
              (c) => c.id === contributionId,
            );
            if (!contributionToRemove) return g;

            return {
              ...g,
              contributions: g.contributions.filter(
                (c) => c.id !== contributionId,
              ),
              currentAmount: g.currentAmount - contributionToRemove.amount,
            };
          }),
        })),
    }),
    {
      name: "shared-goals-storage",
    },
  ),
);
