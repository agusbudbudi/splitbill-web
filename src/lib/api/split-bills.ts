import { apiClient } from "./client";
import { Expense, AdditionalExpense } from "@/store/useSplitBillStore";
import { SettlementInstruction } from "@/hooks/useBillCalculations";

export interface BackendParticipant {
  id: string;
  name: string;
}

export interface BackendExpense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  participants: string[];
  createdAt: number;
}

export interface BackendAdditionalExpense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  participants: string[];
  splitType: "equally" | "proportionally";
  createdAt: number;
}

export interface BackendOwedItem {
  id: string;
  description: string;
  amount: number;
  type: "base" | "additional";
}

export interface BackendParticipantSummary {
  participantId: string;
  paid: number;
  owed: number;
  balance: number;
  owedItems: BackendOwedItem[];
}

export interface BackendSettlement {
  from: string;
  to: string;
  amount: number;
}

export interface BackendSummary {
  total: number;
  perParticipant: BackendParticipantSummary[];
  settlements: BackendSettlement[];
}

export interface BackendSplitBillRecord {
  id: string;
  ownerId?: string;
  activityName: string;
  occurredAt: string;
  participants: BackendParticipant[];
  expenses: BackendExpense[];
  additionalExpenses: BackendAdditionalExpense[];
  paymentMethodIds: string[];
  paymentMethodSnapshots: any[];
  summary: BackendSummary;
  status: "locked" | "editable";
  last_step?: "STEP_1" | "STEP_2" | "STEP_3" | "FINALIZED" | null;
  createdAt: string;
  updatedAt: string;
}

/** Draft record shape — all bill-data fields are nullable until fully populated */
export interface BackendDraft {
  id: string;
  userId: string | null;
  status: "editable" | "locked";
  last_step: "STEP_1" | "STEP_2" | "STEP_3" | "FINALIZED" | null;
  activityName: string | null;
  occurredAt: string | null;
  participants: BackendParticipant[];
  expenses: BackendExpense[];
  additionalExpenses: BackendAdditionalExpense[];
  paymentMethodIds: string[];
  paymentMethodSnapshots: any[];
  summary: BackendSummary | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSplitBillPayload {
  activityName: string;
  occurredAt: string;
  participants: BackendParticipant[];
  expenses: BackendExpense[];
  additionalExpenses: BackendAdditionalExpense[];
  paymentMethodIds: string[];
  paymentMethodSnapshots: any[];
  summary: BackendSummary;
}

// Mappers
export const mapFrontendToBackend = (
  bill: any, // SavedBill from useWalletStore
  summary: any, // From useBillCalculations
  paymentMethods: any[] = [] // Full payment methods from store
): CreateSplitBillPayload => {
  const selectedPaymentMethodIds = bill?.selectedPaymentMethodIds || [];
  const selectedMethods = Array.isArray(paymentMethods)
    ? paymentMethods.filter(m => selectedPaymentMethodIds.includes(m?.id))
    : [];

  const paymentMethodSnapshots = selectedMethods.map(m => ({
    id: m?.id || "",
    category: m?.type === "bank" ? "bank_transfer" : "ewallet",
    provider: m?.providerName || "",
    ownerName: m?.accountName || "",
    accountNumber: m?.accountNumber || "",
    phoneNumber: m?.phoneNumber || "",
  }));

  return {
    activityName: bill?.activityName || "Unnamed Activity",
    occurredAt: bill?.date || new Date().toISOString(),
    participants: Array.isArray(bill?.people)
      ? bill.people.map((name: string) => ({
          id: name || "",
          name: name || "",
        }))
      : [],
    expenses: Array.isArray(bill?.expenses)
      ? bill.expenses.map((exp: Expense) => ({
          id: exp?.id || "",
          description: exp?.item || "",
          amount: exp?.amount || 0,
          paidBy: exp?.paidBy || "",
          participants: Array.isArray(exp?.who) ? exp.who : [],
          createdAt: Date.now(), // Fallback if not present
        }))
      : [],
    additionalExpenses: Array.isArray(bill?.additionalExpenses)
      ? bill.additionalExpenses.map((adx: AdditionalExpense) => ({
          id: adx?.id || "",
          description: adx?.name || "",
          amount: adx?.amount || 0,
          paidBy: adx?.paidBy || "",
          participants: Array.isArray(adx?.who) ? adx.who : [],
          splitType: adx?.splitType || "equally",
          createdAt: Date.now(), // Fallback
        }))
      : [],
    paymentMethodIds: selectedPaymentMethodIds,
    paymentMethodSnapshots,
    summary: {
      total: summary?.totalSpent || 0,
      perParticipant: Object.entries(summary?.balances || {}).map(([name, b]: [string, any]) => ({
        participantId: name,
        paid: b?.paid || 0,
        owed: b?.spent || 0,
        balance: (b?.paid || 0) - (b?.spent || 0),
        owedItems: Array.isArray(b?.items)
          ? b.items.map((item: any, idx: number) => ({
              id: `${item?.name || "item"}-${idx}`,
              description: item?.name || "item",
              amount: item?.share || 0,
              type: item?.isAdditional ? "additional" : "base",
            }))
          : [],
      })),
      settlements: Array.isArray(summary?.settlementInstructions)
        ? summary.settlementInstructions.map((s: SettlementInstruction) => ({
            from: s?.from || "",
            to: s?.to || "",
            amount: s?.amount || 0,
          }))
        : [],
    },
  };
};

export const mapBackendToFrontend = (record: BackendSplitBillRecord) => {
  if (!record) {
    return {
      id: "",
      date: new Date().toISOString(),
      activityName: "Unnamed Activity",
      totalAmount: 0,
      people: [],
      expenses: [],
      additionalExpenses: [],
      selectedPaymentMethodIds: [],
      paymentMethodSnapshots: [],
    };
  }
  return {
    id: record.id || "",
    date: record.occurredAt || new Date().toISOString(),
    activityName: record.activityName || "Unnamed Activity",
    totalAmount: record.summary?.total || 0,
    people: Array.isArray(record.participants)
      ? record.participants.map(p => p?.name || "").filter(Boolean)
      : [],
    expenses: Array.isArray(record.expenses)
      ? record.expenses.map(exp => ({
          id: exp?.id || "",
          item: exp?.description || "",
          amount: exp?.amount || 0,
          who: Array.isArray(exp?.participants) ? exp.participants : [],
          paidBy: exp?.paidBy || "",
        }))
      : [],
    additionalExpenses: Array.isArray(record.additionalExpenses)
      ? record.additionalExpenses.map(adx => ({
          id: adx?.id || "",
          name: adx?.description || "",
          amount: adx?.amount || 0,
          who: Array.isArray(adx?.participants) ? adx.participants : [],
          paidBy: adx?.paidBy || "",
          splitType: adx?.splitType || "equally",
        }))
      : [],
    selectedPaymentMethodIds: Array.isArray(record.paymentMethodIds)
      ? record.paymentMethodIds
      : [],
    paymentMethodSnapshots: Array.isArray(record.paymentMethodSnapshots)
      ? record.paymentMethodSnapshots.map(s => ({
          id: s?.id || "",
          type: s?.category === "bank_transfer" ? "bank" : "ewallet",
          providerName: s?.provider || "",
          accountName: s?.ownerName || "",
          accountNumber: s?.accountNumber || "",
          phoneNumber: s?.phoneNumber || "",
        }))
      : [],
  };
};

export interface GetAllSplitBillsResponse {
  success: boolean;
  data: {
    records: BackendSplitBillRecord[];
    pagination: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    };
  };
}

export interface GetSplitBillByIdResponse {
  success: boolean;
  data?: { record: BackendSplitBillRecord };
  record?: BackendSplitBillRecord; // fallback
}

export interface CreateSplitBillResponse {
  success: boolean;
  data?: { record: BackendSplitBillRecord };
  record?: BackendSplitBillRecord; // fallback
}

export const splitBillApi = {
  getAll: (params?: { status?: string }) => {
    const qs = params?.status ? `?status=${params.status}` : "";
    return apiClient.request<GetAllSplitBillsResponse>(`/api/split-bills${qs}`);
  },
  getById: (id: string) => apiClient.request<GetSplitBillByIdResponse>(`/api/split-bills/${id}`),
  create: (payload: CreateSplitBillPayload) => apiClient.request<CreateSplitBillResponse>("/api/split-bills", {
    method: "POST",
    body: JSON.stringify(payload),
  }),
  delete: (id: string) => apiClient.request<{ success: boolean; message: string }>(`/api/split-bills/${id}`, {
    method: "DELETE",
  }),
};

// ─── Draft API ────────────────────────────────────────────────────────────────

export interface CreateDraftPayload {
  participants?: BackendParticipant[];
  activityName?: string;
  occurredAt?: string;
}

export interface UpdateDraftPayload {
  last_step: "STEP_1" | "STEP_2" | "STEP_3";
  activityName?: string;
  occurredAt?: string;
  participants?: BackendParticipant[];
  expenses?: BackendExpense[];
  additionalExpenses?: BackendAdditionalExpense[];
  paymentMethodIds?: string[];
  paymentMethodSnapshots?: any[];
  summary?: BackendSummary;
}

export interface DraftResponse {
  success: boolean;
  draft: BackendDraft;
}

export interface FinalizeDraftResponse {
  success: boolean;
  record: BackendSplitBillRecord;
}

export const draftApi = {
  /** Create a new draft (Step 1). Auth is optional — sends token if available. */
  create: (payload: CreateDraftPayload) =>
    apiClient.request<DraftResponse>("/api/split-bills/drafts", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  /** Fetch a draft by ID. */
  getById: (draftId: string) =>
    apiClient.request<DraftResponse>(`/api/split-bills/drafts/${draftId}`),

  /** Update draft step data. last_step must be provided. */
  update: (draftId: string, payload: UpdateDraftPayload) =>
    apiClient.request<DraftResponse>(`/api/split-bills/drafts/${draftId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  /** Finalize the draft (auth required). Returns finalized SplitBillRecord. */
  finalize: (draftId: string) =>
    apiClient.request<FinalizeDraftResponse>(
      `/api/split-bills/drafts/${draftId}/finalize`,
      { method: "POST" }
    ),
};
