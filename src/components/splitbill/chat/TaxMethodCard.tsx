"use client";

import React from "react";
import { ChevronRight, Check, Scale, Users, Edit2 } from "lucide-react";
import {
  useSplitBillChatStore,
  type ChatStep,
} from "@/store/useSplitBillChatStore";
import type { AdditionalExpense } from "@/store/useSplitBillStore";
import { formatToIDR, cn } from "@/lib/utils";
import { EditChatAdditionalExpenseBottomSheet } from "./EditChatAdditionalExpenseBottomSheet";
import { trackChatBill } from "@/lib/gtag";

const STEP_ORDER: ChatStep[] = [
  "GREETING",
  "ADD_FRIENDS",
  "SCAN_RECEIPT",
  "ASSIGN_ITEMS",
  "SET_TAX_METHOD",
  "SET_ACTIVITY",
  "SET_PAYMENT",
  "REVIEW",
  "GIVE_REVIEW",
  "DONE",
];

interface TaxMethodCardProps {
  onConfirm: () => void;
}

export function TaxMethodCard({ onConfirm }: TaxMethodCardProps) {
  const { step, additionalExpenses, participants, updateAdditionalExpense } =
    useSplitBillChatStore();
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const isCompleted =
    STEP_ORDER.indexOf(step) > STEP_ORDER.indexOf("SET_TAX_METHOD");

  // Ensure all additional expenses have participants assigned by default
  React.useEffect(() => {
    if (isCompleted) return;
    additionalExpenses.forEach((adx) => {
      if (adx.who.length === 0) {
        updateAdditionalExpense(adx.id, {
          who: [...participants],
          paidBy: participants[0] ?? "",
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Frozen state ─────────────────────────────────────────────────────────────
  if (isCompleted) {
    return (
      <div className="rounded-2xl border border-primary/15 bg-white overflow-hidden shadow-sm">
        <div className="flex items-center gap-2 px-4 py-3 bg-primary/5 border-b border-primary/10">
          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
            <Check className="w-3 h-3 text-white" />
          </div>
          <p className="text-xs font-bold text-primary">Metode Pembagian Pajak</p>
        </div>
        <div className="px-4 py-3 space-y-2">
          {additionalExpenses.map((adx) => (
            <div key={adx.id} className="flex justify-between items-center text-xs gap-3">
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <button
                  onClick={() => setEditingId(adx.id)}
                  className="p-1 rounded-md text-muted-foreground hover:bg-primary/5 hover:text-primary transition-all cursor-pointer flex-shrink-0"
                  title="Edit detail biaya tambahan"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <span className="text-foreground/80 font-medium truncate">{adx.name}</span>
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0",
                    adx.splitType === "proportionally"
                      ? "bg-violet-100 text-violet-700"
                      : "bg-sky-100 text-sky-700"
                  )}
                >
                  {adx.splitType === "proportionally" ? "Proporsional" : "Rata"}
                </span>
              </div>
              <span
                className={cn(
                  "font-bold shrink-0",
                  adx.amount < 0 ? "text-emerald-600" : "text-foreground"
                )}
              >
                {formatToIDR(adx.amount)}
              </span>
            </div>
          ))}
        </div>
        <EditChatAdditionalExpenseBottomSheet
          isOpen={!!editingId}
          onClose={() => setEditingId(null)}
          expenseId={editingId}
        />
      </div>
    );
  }

  // ── Interactive ──────────────────────────────────────────────────────────────
  const handleToggle = (
    id: string,
    type: "equally" | "proportionally"
  ) => {
    // Also assign all participants when toggling
    updateAdditionalExpense(id, {
      splitType: type,
      who: [...participants],
      paidBy: participants[0] ?? "",
    });
  };

  const handleLanjut = () => {
    const methods = additionalExpenses.map((a) => a.splitType).join(",");
    trackChatBill.taxMethodConfirmed({
      additional_item_count: additionalExpenses.length,
      methods,
    });
    onConfirm();
  };

  return (
    <div className="rounded-2xl border border-primary/20 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-primary/5 to-violet-500/5 border-b border-primary/10">
        <p className="text-xs font-bold text-primary uppercase tracking-wide">
          Metode Pembagian Biaya Tambahan
        </p>
      </div>

      <div className="divide-y divide-border/60">
        {additionalExpenses.map((adx) => (
          <AdxRow
            key={adx.id}
            adx={adx}
            onToggle={handleToggle}
            onEdit={(id) => setEditingId(id)}
          />
        ))}
      </div>

      {/* CTA */}
      <div className="p-4 border-t border-border/60">
        <button
          onClick={handleLanjut}
          className="w-full h-10 rounded-sm bg-primary text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-[0.98] transition-all shadow-md shadow-primary/20 cursor-pointer"
        >
          Lanjut <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <EditChatAdditionalExpenseBottomSheet
        isOpen={!!editingId}
        onClose={() => setEditingId(null)}
        expenseId={editingId}
      />
    </div>
  );
}

// ── Per-additional-expense row ────────────────────────────────────────────────
interface AdxRowProps {
  adx: AdditionalExpense;
  onToggle: (id: string, type: "equally" | "proportionally") => void;
  onEdit: (id: string) => void;
}

function AdxRow({ adx, onToggle, onEdit }: AdxRowProps) {
  return (
    <div className="px-4 py-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 flex-1 pr-2 min-w-0">
          <button
            onClick={() => onEdit(adx.id)}
            className="p-1 rounded-md text-muted-foreground hover:bg-primary/5 hover:text-primary transition-all cursor-pointer flex-shrink-0"
            title="Edit detail biaya tambahan"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <p className="text-sm font-bold text-foreground truncate">{adx.name}</p>
        </div>
        <span
          className={cn(
            "text-sm font-black",
            adx.amount < 0 ? "text-emerald-600" : "text-primary"
          )}
        >
          {formatToIDR(adx.amount)}
        </span>
      </div>

      <div className="flex gap-2">
        {/* Equally */}
        <button
          onClick={() => onToggle(adx.id, "equally")}
          className={cn(
            "flex-1 h-9 rounded-sm border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer",
            adx.splitType === "equally"
              ? "bg-sky-500 text-white border-sky-500 shadow-sm shadow-sky-200"
              : "bg-white text-muted-foreground border-border hover:border-sky-300 hover:text-sky-600"
          )}
        >
          <Users className="w-3.5 h-3.5" />
          Rata
        </button>

        {/* Proportionally */}
        <button
          onClick={() => onToggle(adx.id, "proportionally")}
          className={cn(
            "flex-1 h-9 rounded-sm border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer",
            adx.splitType === "proportionally"
              ? "bg-violet-500 text-white border-violet-500 shadow-sm shadow-violet-200"
              : "bg-white text-muted-foreground border-border hover:border-violet-300 hover:text-violet-600"
          )}
        >
          <Scale className="w-3.5 h-3.5" />
          Proporsional
        </button>
      </div>

      <p className="text-[10px] text-muted-foreground leading-relaxed">
        {adx.splitType === "proportionally"
          ? "Dibagi sesuai porsi belanja masing-masing orang"
          : "Dibagi rata ke semua orang"}
      </p>
    </div>
  );
}
