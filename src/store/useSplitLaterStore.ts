import { create } from "zustand";
import { persist } from "zustand/middleware";

export type BucketType =
  | "trip"
  | "hangout"
  | "event"
  | "office"
  | "household"
  | "other";

export type ReceiptStatus = "pending" | "completed";

export interface BucketReceipt {
  id: string;
  bucketId: string;
  imageUrl: string; // Vercel Blob URL
  notes?: string;
  status: ReceiptStatus;
  splitBillId?: string; // Set when receipt is processed into a split bill
  merchant?: string; // Populated after AI scan
  totalAmount?: number; // Populated after AI scan
  createdAt: string;
}

export interface SplitLaterBucket {
  id: string;
  title: string;
  emoji: string;
  bucketType: BucketType;
  participants: string[]; // Name list, mirrors Split Bill "people"
  startDate?: string;
  endDate?: string;
  status: "active" | "done";
  createdAt: string;
}

interface SplitLaterState {
  buckets: SplitLaterBucket[];
  receipts: BucketReceipt[];

  // Bucket actions
  createBucket: (
    bucket: Omit<SplitLaterBucket, "id" | "createdAt" | "status">,
  ) => string;
  updateBucket: (id: string, updates: Partial<SplitLaterBucket>) => void;
  deleteBucket: (id: string) => void;

  // Receipt actions
  addReceipt: (receipt: Omit<BucketReceipt, "id" | "createdAt">) => string;
  updateReceipt: (id: string, updates: Partial<BucketReceipt>) => void;
  removeReceipt: (id: string) => void;
  markReceiptCompleted: (
    receiptId: string,
    splitBillId: string,
    merchant?: string,
    totalAmount?: number,
  ) => void;

  // Selectors
  getBucketReceipts: (bucketId: string) => BucketReceipt[];
  getBucketStats: (
    bucketId: string,
  ) => { total: number; pending: number; completed: number };
}

export const useSplitLaterStore = create<SplitLaterState>()(
  persist(
    (set, get) => ({
      buckets: [],
      receipts: [],

      createBucket: (bucket) => {
        const id = `bucket_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        const newBucket: SplitLaterBucket = {
          ...bucket,
          id,
          status: "active",
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ buckets: [newBucket, ...state.buckets] }));
        return id;
      },

      updateBucket: (id, updates) =>
        set((state) => ({
          buckets: state.buckets.map((b) =>
            b.id === id ? { ...b, ...updates } : b,
          ),
        })),

      deleteBucket: (id) =>
        set((state) => ({
          buckets: state.buckets.filter((b) => b.id !== id),
          receipts: state.receipts.filter((r) => r.bucketId !== id),
        })),

      addReceipt: (receipt) => {
        const id = `receipt_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        const newReceipt: BucketReceipt = {
          ...receipt,
          id,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ receipts: [newReceipt, ...state.receipts] }));
        return id;
      },

      updateReceipt: (id, updates) =>
        set((state) => ({
          receipts: state.receipts.map((r) =>
            r.id === id ? { ...r, ...updates } : r,
          ),
        })),

      removeReceipt: (id) =>
        set((state) => ({
          receipts: state.receipts.filter((r) => r.id !== id),
        })),

      markReceiptCompleted: (receiptId, splitBillId, merchant, totalAmount) =>
        set((state) => ({
          receipts: state.receipts.map((r) =>
            r.id === receiptId
              ? {
                  ...r,
                  status: "completed" as ReceiptStatus,
                  splitBillId,
                  merchant,
                  totalAmount,
                }
              : r,
          ),
        })),

      getBucketReceipts: (bucketId) =>
        get().receipts.filter((r) => r.bucketId === bucketId),

      getBucketStats: (bucketId) => {
        const receipts = get().receipts.filter((r) => r.bucketId === bucketId);
        return {
          total: receipts.length,
          pending: receipts.filter((r) => r.status === "pending").length,
          completed: receipts.filter((r) => r.status === "completed").length,
        };
      },
    }),
    {
      name: "split-later-storage",
    },
  ),
);
