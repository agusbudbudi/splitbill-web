import { create } from "zustand";
import type { Order } from "@/lib/types/subscription";

interface OrderState {
  currentOrder: Order | null;
  setCurrentOrder: (order: Order | null) => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  currentOrder: null,
  setCurrentOrder: (order) => set({ currentOrder: order }),
}));
