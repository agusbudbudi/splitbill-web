import { apiClient, localApiClient } from "./client";

export type BucketType =
  | "trip"
  | "hangout"
  | "event"
  | "office"
  | "household"
  | "other";

export type ReceiptStatus = "pending" | "completed";

export interface BackendBucketReceipt {
  id: string;
  imageUrl: string;
  merchant: string | null;
  totalAmount: number | null;
  status: ReceiptStatus;
  splitBillId: string | null;
  notes: string | null;
  createdAt: string;
}

export interface BackendBucket {
  id: string;
  title: string;
  emoji: string;
  bucketType: BucketType;
  participants: string[];
  startDate: string | null;
  endDate: string | null;
  status: "active" | "done";
  receipts: BackendBucketReceipt[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateBucketPayload {
  title: string;
  emoji: string;
  bucketType: BucketType;
  participants: string[];
  startDate?: string;
  endDate?: string;
}

export type UpdateBucketPayload = Partial<CreateBucketPayload> & {
  status?: "active" | "done";
};

export interface AddReceiptPayload {
  imageUrl: string;
  merchant?: string;
  totalAmount?: number;
  notes?: string;
}

export type UpdateReceiptPayload = Partial<AddReceiptPayload> & {
  status?: ReceiptStatus;
  splitBillId?: string | null;
};

interface BucketResponse {
  success: boolean;
  bucket: BackendBucket;
}

interface AddReceiptResponse extends BucketResponse {
  receiptId: string;
}

interface BucketListResponse {
  success: boolean;
  buckets: BackendBucket[];
}

export const splitLaterApi = {
  list: () => apiClient.request<BucketListResponse>("/api/split-later/buckets"),

  create: (payload: CreateBucketPayload) =>
    apiClient.request<BucketResponse>("/api/split-later/buckets", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  update: (bucketId: string, payload: UpdateBucketPayload) =>
    apiClient.request<BucketResponse>(`/api/split-later/buckets/${bucketId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  delete: (bucketId: string) =>
    apiClient.request<{ success: boolean }>(`/api/split-later/buckets/${bucketId}`, {
      method: "DELETE",
    }),

  addReceipt: (bucketId: string, payload: AddReceiptPayload) =>
    apiClient.request<AddReceiptResponse>(`/api/split-later/buckets/${bucketId}/receipts`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateReceipt: (bucketId: string, receiptId: string, payload: UpdateReceiptPayload) =>
    apiClient.request<BucketResponse>(
      `/api/split-later/buckets/${bucketId}/receipts/${receiptId}`,
      { method: "PUT", body: JSON.stringify(payload) },
    ),

  deleteReceipt: (bucketId: string, receiptId: string) =>
    apiClient.request<BucketResponse>(
      `/api/split-later/buckets/${bucketId}/receipts/${receiptId}`,
      { method: "DELETE" },
    ),
};

export interface UploadReceiptFileResponse {
  success: boolean;
  url: string;
  pathname: string;
  isLocalFallback?: boolean;
}

export interface CheckImagesResult {
  url: string;
  exists: boolean;
}

// Wraps this app's own /api/split-later/* route handlers (not the backend)
// through localApiClient — same Authorization-header injection and
// 401-refresh-and-retry behavior as splitLaterApi gets from apiClient, so an
// expired access token gets silently refreshed instead of failing the call.
export const splitLaterLocalApi = {
  uploadReceiptFile: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return localApiClient.request<UploadReceiptFileResponse>("/api/split-later/upload", {
      method: "POST",
      body: formData,
    });
  },

  deleteReceiptFiles: (urls: string[]) =>
    localApiClient.request<{ success: boolean }>("/api/split-later/delete", {
      method: "POST",
      body: JSON.stringify({ urls }),
    }),

  checkImages: (urls: string[]) =>
    localApiClient.request<{ success: boolean; results: CheckImagesResult[] }>(
      "/api/split-later/check-images",
      { method: "POST", body: JSON.stringify({ urls }) },
    ),
};
