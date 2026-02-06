import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

export interface Payer {
  id: string;
  name: string;
  amount: number;
  isPaid: boolean;
  transferTo?: string; // The recipient of this transfer
  paymentMethod?: string; // Optional, e.g., "BCA", "OVO"
  paidAt?: string; // ISO date string
}

export interface CollectionSession {
  id: string;
  title: string;
  createdAt: string;
  totalAmount: number; // Target amount
  payers: Payer[];
  description?: string;
  paymentMethodIds?: string[];
  isArchived?: boolean;
  sourceId?: string; // e.g., split bill ID
}

interface CollectMoneyState {
  collections: CollectionSession[];
  activeCollectionId: string | null;

  // Actions
  createCollection: (
    title: string,
    payers: Omit<Payer, "id" | "isPaid">[],
    paymentMethodIds?: string[],
    sourceId?: string,
  ) => string;
  setActiveCollection: (id: string | null) => void;
  togglePayerStatus: (collectionId: string, payerId: string) => void;
  markAllAsPaid: (collectionId: string) => void;
  addPayer: (collectionId: string, name: string, amount: number) => void;
  removePayer: (collectionId: string, payerId: string) => void;
  deleteCollection: (id: string) => void;
  toggleArchiveCollection: (id: string) => void;
  updateCollectionTitle: (id: string, title: string) => void;
  getActiveCollection: () => CollectionSession | undefined;
}

export const useCollectMoneyStore = create<CollectMoneyState>()(
  persist(
    (set, get) => ({
      collections: [],
      activeCollectionId: null,

      createCollection: (title, initialPayers, paymentMethodIds, sourceId) => {
        const id = uuidv4();
        const newCollection: CollectionSession = {
          id,
          title: title || "Patungan Baru",
          createdAt: new Date().toISOString(),
          totalAmount: initialPayers.reduce((acc, p) => acc + p.amount, 0),
          payers: initialPayers.map((p) => ({
            ...p,
            id: uuidv4(),
            isPaid: false,
          })),
          paymentMethodIds,
          isArchived: false,
          sourceId,
        };

        set((state) => ({
          collections: [newCollection, ...state.collections],
          activeCollectionId: id,
        }));

        return id;
      },

      setActiveCollection: (id) => set({ activeCollectionId: id }),

      togglePayerStatus: (collectionId, payerId) =>
        set((state) => ({
          collections: state.collections.map((c) =>
            c.id === collectionId
              ? {
                  ...c,
                  payers: c.payers.map((p) =>
                    p.id === payerId
                      ? {
                          ...p,
                          isPaid: !p.isPaid,
                          paidAt: !p.isPaid
                            ? new Date().toISOString()
                            : undefined,
                        }
                      : p,
                  ),
                }
              : c,
          ),
        })),

      markAllAsPaid: (collectionId) =>
        set((state) => ({
          collections: state.collections.map((c) =>
            c.id === collectionId
              ? {
                  ...c,
                  payers: c.payers.map((p) =>
                    !p.isPaid
                      ? {
                          ...p,
                          isPaid: true,
                          paidAt: new Date().toISOString(),
                        }
                      : p,
                  ),
                }
              : c,
          ),
        })),

      addPayer: (collectionId, name, amount) =>
        set((state) => ({
          collections: state.collections.map((c) =>
            c.id === collectionId
              ? {
                  ...c,
                  totalAmount: c.totalAmount + amount,
                  payers: [
                    ...c.payers,
                    {
                      id: uuidv4(),
                      name,
                      amount,
                      isPaid: false,
                    },
                  ],
                }
              : c,
          ),
        })),

      removePayer: (collectionId, payerId) =>
        set((state) => ({
          collections: state.collections.map((c) => {
            if (c.id !== collectionId) return c;
            const payer = c.payers.find((p) => p.id === payerId);
            return {
              ...c,
              totalAmount: c.totalAmount - (payer?.amount || 0),
              payers: c.payers.filter((p) => p.id !== payerId),
            };
          }),
        })),

      deleteCollection: (id) =>
        set((state) => ({
          collections: state.collections.filter((c) => c.id !== id),
          activeCollectionId:
            state.activeCollectionId === id ? null : state.activeCollectionId,
        })),

      toggleArchiveCollection: (id) =>
        set((state) => ({
          collections: state.collections.map((c) =>
            c.id === id ? { ...c, isArchived: !c.isArchived } : c,
          ),
        })),

      updateCollectionTitle: (id, title) =>
        set((state) => ({
          collections: state.collections.map((c) =>
            c.id === id ? { ...c, title } : c,
          ),
        })),

      getActiveCollection: () => {
        const { collections, activeCollectionId } = get();
        return collections.find((c) => c.id === activeCollectionId);
      },
    }),
    {
      name: "collect-money-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
