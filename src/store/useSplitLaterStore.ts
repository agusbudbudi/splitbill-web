import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  splitLaterApi,
  type BackendBucket,
  type BackendBucketReceipt,
} from "@/lib/api/split-later";

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

function mapBackendReceipt(bucketId: string, r: BackendBucketReceipt): BucketReceipt {
  return {
    id: r.id,
    bucketId,
    imageUrl: r.imageUrl,
    notes: r.notes ?? undefined,
    status: r.status,
    splitBillId: r.splitBillId ?? undefined,
    merchant: r.merchant ?? undefined,
    totalAmount: r.totalAmount ?? undefined,
    createdAt: r.createdAt,
  };
}

function mapBackendBucket(b: BackendBucket): SplitLaterBucket {
  return {
    id: b.id,
    title: b.title,
    emoji: b.emoji,
    bucketType: b.bucketType,
    participants: b.participants,
    startDate: b.startDate ?? undefined,
    endDate: b.endDate ?? undefined,
    status: b.status,
    createdAt: b.createdAt,
  };
}

// A bucket id from the old local-only store (pre backend-sync). Real buckets
// use Mongo ObjectIds (24 hex chars).
const isLegacyLocalId = (id: string) => !/^[0-9a-f]{24}$/i.test(id);

interface SplitLaterState {
  buckets: SplitLaterBucket[];
  receipts: BucketReceipt[];
  isLoaded: boolean;
  isLoading: boolean;

  // Backend sync
  fetchBuckets: () => Promise<void>;
  /** One-time upgrade path: uploads any pre-login-gate local buckets to the
   * backend so in-progress guest work isn't lost, then refreshes from server. */
  migrateLegacyBuckets: () => Promise<void>;

  // Bucket actions
  createBucket: (
    bucket: Omit<SplitLaterBucket, "id" | "createdAt" | "status">,
  ) => Promise<string>;
  updateBucket: (id: string, updates: Partial<SplitLaterBucket>) => Promise<void>;
  deleteBucket: (id: string) => Promise<void>;

  // Receipt actions
  addReceipt: (receipt: Omit<BucketReceipt, "id" | "createdAt">) => Promise<string>;
  updateReceipt: (id: string, updates: Partial<BucketReceipt>) => Promise<void>;
  removeReceipt: (id: string) => Promise<void>;
  markReceiptCompleted: (
    receiptId: string,
    splitBillId: string,
    merchant?: string,
    totalAmount?: number,
  ) => Promise<void>;

  // Selectors
  getBucketReceipts: (bucketId: string) => BucketReceipt[];
  getBucketStats: (
    bucketId: string,
  ) => { total: number; pending: number; completed: number };
}

export const useSplitLaterStore = create<SplitLaterState>()(
  persist(
    (set, get) => {
      // Replaces one bucket (and its receipts) in local state from a fresh
      // backend response — used after every mutation so we don't need a
      // full re-fetch on every create/update/delete. Only a genuinely new
      // bucket (isNew) is moved to the front; updates keep their position
      // so editing/adding a receipt doesn't reshuffle the list.
      const applyBucket = (
        backendBucket: BackendBucket,
        { isNew = false }: { isNew?: boolean } = {},
      ) => {
        const bucket = mapBackendBucket(backendBucket);
        const bucketReceipts = backendBucket.receipts.map((r) =>
          mapBackendReceipt(bucket.id, r),
        );
        set((state) => {
          const others = state.buckets.filter((b) => b.id !== bucket.id);
          const existingIndex = state.buckets.findIndex((b) => b.id === bucket.id);
          const buckets =
            isNew || existingIndex === -1
              ? [bucket, ...others]
              : [
                  ...others.slice(0, existingIndex),
                  bucket,
                  ...others.slice(existingIndex),
                ];
          return {
            buckets,
            receipts: [
              ...bucketReceipts,
              ...state.receipts.filter((r) => r.bucketId !== bucket.id),
            ],
          };
        });
      };

      return {
        buckets: [],
        receipts: [],
        isLoaded: false,
        isLoading: false,

        fetchBuckets: async () => {
          set({ isLoading: true });
          try {
            const { buckets } = await splitLaterApi.list();
            const allReceipts = buckets.flatMap((b) =>
              b.receipts.map((r) => mapBackendReceipt(b.id, r)),
            );
            set({
              buckets: buckets.map(mapBackendBucket),
              receipts: allReceipts,
              isLoaded: true,
              isLoading: false,
            });
          } catch (error) {
            console.error("Failed to fetch split-later buckets:", error);
            set({ isLoading: false });
          }
        },

        migrateLegacyBuckets: async () => {
          const legacyBuckets = get().buckets.filter((b) => isLegacyLocalId(b.id));
          if (legacyBuckets.length === 0) return;

          const results = await Promise.all(
            legacyBuckets.map(async (bucket) => {
              let createdId: string | undefined;
              try {
                const { bucket: created } = await splitLaterApi.create({
                  title: bucket.title,
                  emoji: bucket.emoji,
                  bucketType: bucket.bucketType,
                  participants: bucket.participants,
                  startDate: bucket.startDate,
                  endDate: bucket.endDate,
                });
                createdId = created.id;

                const legacyReceipts = get().receipts.filter(
                  (r) => r.bucketId === bucket.id,
                );
                await Promise.all(
                  legacyReceipts.map((receipt) =>
                    splitLaterApi.addReceipt(created.id, {
                      imageUrl: receipt.imageUrl,
                      merchant: receipt.merchant,
                      totalAmount: receipt.totalAmount,
                      notes: receipt.notes,
                    }),
                  ),
                );

                return { legacyId: bucket.id, migrated: true as const };
              } catch (error) {
                console.error(
                  `Failed to migrate legacy split-later bucket ${bucket.id}:`,
                  error,
                );
                if (createdId) {
                  // Roll back the partially-migrated bucket so the next
                  // retry (on next mount) doesn't pile up a duplicate —
                  // the legacy bucket stays local and gets a clean retry.
                  await splitLaterApi.delete(createdId).catch((cleanupError) => {
                    console.error(
                      `Failed to roll back partially-migrated bucket ${createdId}:`,
                      cleanupError,
                    );
                  });
                }
                return { legacyId: bucket.id, migrated: false as const };
              }
            }),
          );

          // Only drop the local-only entries that actually made it to the
          // backend — a bucket whose migration failed (network hiccup,
          // validation error, backend down) stays local so it isn't lost.
          const migratedIds = new Set(
            results.filter((r) => r.migrated).map((r) => r.legacyId),
          );
          if (migratedIds.size === 0) return;

          set((state) => ({
            buckets: state.buckets.filter((b) => !migratedIds.has(b.id)),
            receipts: state.receipts.filter((r) => !migratedIds.has(r.bucketId)),
          }));
          await get().fetchBuckets();
        },

        createBucket: async (bucket) => {
          const { bucket: created } = await splitLaterApi.create({
            title: bucket.title,
            emoji: bucket.emoji,
            bucketType: bucket.bucketType,
            participants: bucket.participants,
            startDate: bucket.startDate,
            endDate: bucket.endDate,
          });
          applyBucket(created, { isNew: true });
          return created.id;
        },

        updateBucket: async (id, updates) => {
          const { bucket: updated } = await splitLaterApi.update(id, {
            title: updates.title,
            emoji: updates.emoji,
            bucketType: updates.bucketType,
            participants: updates.participants,
            startDate: updates.startDate,
            endDate: updates.endDate,
            status: updates.status,
          });
          applyBucket(updated);
        },

        deleteBucket: async (id) => {
          await splitLaterApi.delete(id);
          set((state) => ({
            buckets: state.buckets.filter((b) => b.id !== id),
            receipts: state.receipts.filter((r) => r.bucketId !== id),
          }));
        },

        addReceipt: async (receipt) => {
          const { bucket: updated, receiptId } = await splitLaterApi.addReceipt(
            receipt.bucketId,
            {
              imageUrl: receipt.imageUrl,
              merchant: receipt.merchant,
              totalAmount: receipt.totalAmount,
              notes: receipt.notes,
            },
          );
          applyBucket(updated);
          return receiptId;
        },

        updateReceipt: async (id, updates) => {
          const bucketId = get().receipts.find((r) => r.id === id)?.bucketId;
          if (!bucketId) {
            throw new Error(`updateReceipt: receipt ${id} not found in local state`);
          }
          const { bucket: updated } = await splitLaterApi.updateReceipt(bucketId, id, {
            merchant: updates.merchant,
            totalAmount: updates.totalAmount,
            notes: updates.notes,
            status: updates.status,
            splitBillId: updates.splitBillId,
          });
          applyBucket(updated);
        },

        removeReceipt: async (id) => {
          const bucketId = get().receipts.find((r) => r.id === id)?.bucketId;
          if (!bucketId) {
            throw new Error(`removeReceipt: receipt ${id} not found in local state`);
          }
          const { bucket: updated } = await splitLaterApi.deleteReceipt(bucketId, id);
          applyBucket(updated);
        },

        markReceiptCompleted: async (receiptId, splitBillId, merchant, totalAmount) => {
          const bucketId = get().receipts.find((r) => r.id === receiptId)?.bucketId;
          if (!bucketId) {
            throw new Error(
              `markReceiptCompleted: receipt ${receiptId} not found in local state`,
            );
          }
          const { bucket: updated } = await splitLaterApi.updateReceipt(bucketId, receiptId, {
            status: "completed",
            splitBillId,
            merchant,
            totalAmount,
          });
          applyBucket(updated);
        },

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
      };
    },
    {
      name: "split-later-storage",
      version: 1,
      // Instant-paint cache only — fetchBuckets() reconciles with the
      // backend (the source of truth) on mount of the list/detail pages.
      // isLoaded/isLoading are excluded: persisting isLoaded:true would
      // make a fresh session's stale cache look "loaded" before the real
      // fetch runs, so the loading-guard in bucket detail pages must always
      // start from a real false on every session.
      partialize: (state) => ({ buckets: state.buckets, receipts: state.receipts }),
      // The bucket/receipt shape didn't change between version 0 and 1 —
      // this bump only added isLoaded/isLoading, which are excluded above
      // anyway. Pass persisted data through unchanged instead of the
      // default "no migrate = discard on mismatch" behavior, which would
      // silently wipe every existing guest's local buckets on deploy.
      migrate: (persistedState) =>
        persistedState as Pick<SplitLaterState, "buckets" | "receipts">,
    },
  ),
);
