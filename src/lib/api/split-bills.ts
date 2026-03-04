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
  activityName: string;
  occurredAt: string;
  participants: BackendParticipant[];
  expenses: BackendExpense[];
  additionalExpenses: BackendAdditionalExpense[];
  paymentMethodIds: string[];
  paymentMethodSnapshots: any[];
  summary: BackendSummary;
  status: "locked" | "editable";
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
  const selectedPaymentMethodIds = bill.selectedPaymentMethodIds || [];
  const selectedMethods = paymentMethods.filter(m => selectedPaymentMethodIds.includes(m.id));

  const paymentMethodSnapshots = selectedMethods.map(m => ({
    id: m.id,
    category: m.type === "bank" ? "bank_transfer" : "ewallet",
    provider: m.providerName,
    ownerName: m.accountName,
    accountNumber: m.accountNumber,
    phoneNumber: m.phoneNumber,
  }));

  return {
    activityName: bill.activityName,
    occurredAt: bill.date || new Date().toISOString(),
    participants: (bill.people || []).map((name: string) => ({
      id: name,
      name: name,
    })),
    expenses: (bill.expenses || []).map((exp: Expense) => ({
      id: exp.id,
      description: exp.item,
      amount: exp.amount,
      paidBy: exp.paidBy,
      participants: exp.who,
      createdAt: Date.now(), // Fallback if not present
    })),
    additionalExpenses: (bill.additionalExpenses || []).map((adx: AdditionalExpense) => ({
      id: adx.id,
      description: adx.name,
      amount: adx.amount,
      paidBy: adx.paidBy,
      participants: adx.who,
      splitType: adx.splitType || "equally",
      createdAt: Date.now(), // Fallback
    })),
    paymentMethodIds: selectedPaymentMethodIds,
    paymentMethodSnapshots,
    summary: {
      total: summary.totalSpent,
      perParticipant: Object.entries(summary.balances || {}).map(([name, b]: [string, any]) => ({
        participantId: name,
        paid: b.paid,
        owed: b.spent,
        balance: b.paid - b.spent,
        owedItems: (b.items || []).map((item: any, idx: number) => ({
          id: `${item.name}-${idx}`,
          description: item.name,
          amount: item.share,
          type: item.isAdditional ? "additional" : "base",
        })),
      })),
      settlements: (summary.settlementInstructions || []).map((s: SettlementInstruction) => ({
        from: s.from,
        to: s.to,
        amount: s.amount,
      })),
    },
  };
};

export const mapBackendToFrontend = (record: BackendSplitBillRecord) => {
  return {
    id: record.id,
    date: record.occurredAt,
    activityName: record.activityName,
    totalAmount: record.summary.total,
    people: record.participants.map(p => p.name),
    expenses: record.expenses.map(exp => ({
      id: exp.id,
      item: exp.description,
      amount: exp.amount,
      who: exp.participants,
      paidBy: exp.paidBy,
    })),
    additionalExpenses: record.additionalExpenses.map(adx => ({
      id: adx.id,
      name: adx.description,
      amount: adx.amount,
      who: adx.participants,
      paidBy: adx.paidBy,
      splitType: adx.splitType || "equally",
    })),
    selectedPaymentMethodIds: record.paymentMethodIds,
    paymentMethodSnapshots: record.paymentMethodSnapshots?.map(s => ({
      id: s.id,
      type: s.category === "bank_transfer" ? "bank" : "ewallet",
      providerName: s.provider,
      accountName: s.ownerName,
      accountNumber: s.accountNumber,
      phoneNumber: s.phoneNumber,
    })) || [],
  };
};

export const splitBillApi = {
  getAll: () => apiClient.request<{ success: boolean; records: BackendSplitBillRecord[] }>("/api/split-bills"),
  getById: (id: string) => apiClient.request<{ success: boolean; record: BackendSplitBillRecord }>(`/api/split-bills/${id}`),
  create: (payload: CreateSplitBillPayload) => apiClient.request<{ success: boolean; record: BackendSplitBillRecord }>("/api/split-bills", {
    method: "POST",
    body: JSON.stringify(payload),
  }),
  delete: (id: string) => apiClient.request<{ success: boolean; message: string }>(`/api/split-bills/${id}`, {
    method: "DELETE",
  }),
};
