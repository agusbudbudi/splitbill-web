"use client";

import React from "react";
import { ChevronRight, Check, Scale, Users, Edit2, AlertCircle } from "lucide-react";
import type { AdditionalExpense } from "@/store/useSplitBillStore";
import { formatToIDR, cn } from "@/lib/utils";
import { EditChatAdditionalExpenseBottomSheet } from "./EditChatAdditionalExpenseBottomSheet";
import { trackChatBill } from "@/lib/gtag";

interface TaxMethodCardProps {
  isCompleted: boolean;
  additionalExpenses: AdditionalExpense[];
  participants: string[];
  payerName: string;
  onUpdateAdditionalExpense: (id: string, update: Partial<AdditionalExpense>) => void;
  onConfirm: () => void;
}

export function TaxMethodCard({
  isCompleted,
  additionalExpenses,
  participants,
  payerName,
  onUpdateAdditionalExpense,
  onConfirm,
}: TaxMethodCardProps) {
  const [editingId, setEditingId] = React.useState<string | null>(null);

  // Ensure all additional expenses have participants and payer assigned by default.
  // Set paidBy to merchant if amount is negative, otherwise default to payerName.
  React.useEffect(() => {
    if (isCompleted) return;
    additionalExpenses.forEach((adx) => {
      const isDiscount = adx.amount < 0;
      const update: Partial<AdditionalExpense> = {};

      if (adx.who.length === 0) {
        update.who = [...participants];
      }

      if (!adx.paidBy) {
        update.paidBy = isDiscount ? "merchant" : (payerName || participants[0] || "");
      } else if (isDiscount && adx.paidBy !== "merchant") {
        update.paidBy = "merchant";
      } else if (!isDiscount && adx.paidBy === "merchant") {
        update.paidBy = payerName || participants[0] || "";
      }

      if (Object.keys(update).length > 0) {
        onUpdateAdditionalExpense(adx.id, update);
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
  const handleToggleWho = (id: string, person: string) => {
    const adx = additionalExpenses.find((e) => e.id === id);
    if (!adx) return;
    const isSelected = adx.who.includes(person);
    const newWho = isSelected
      ? adx.who.filter((w) => w !== person)
      : [...adx.who, person];
    onUpdateAdditionalExpense(id, { who: newWho });
  };

  const handleSetPaidBy = (id: string, person: string) => {
    onUpdateAdditionalExpense(id, { paidBy: person });
  };

  const handleSetSplitType = (id: string, type: "equally" | "proportionally") => {
    onUpdateAdditionalExpense(id, { splitType: type });
  };

  const handleSelectAll = (id: string) => {
    onUpdateAdditionalExpense(id, { who: [...participants] });
  };

  const handleLanjut = () => {
    const methods = additionalExpenses.map((a) => a.splitType).join(",");
    trackChatBill.taxMethodConfirmed({
      additional_item_count: additionalExpenses.length,
      methods,
    });
    onConfirm();
  };

  const totalAssigned = additionalExpenses.filter(
    (a) => a.who.length > 0 && !!a.paidBy
  ).length;

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
            participants={participants}
            onToggleWho={handleToggleWho}
            onSetPaidBy={handleSetPaidBy}
            onSetSplitType={handleSetSplitType}
            onSelectAll={handleSelectAll}
            onEdit={(id) => setEditingId(id)}
          />
        ))}
      </div>

      {/* CTA */}
      <div className="p-4 border-t border-border/60">
        <button
          onClick={handleLanjut}
          disabled={totalAssigned !== additionalExpenses.length}
          className={cn(
            "w-full h-10 rounded-sm font-bold text-sm flex items-center justify-center gap-2 transition-all",
            totalAssigned === additionalExpenses.length
              ? "bg-primary text-white shadow-md shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] cursor-pointer"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          {totalAssigned === additionalExpenses.length ? (
            <>
              Lanjut <ChevronRight className="w-4 h-4" />
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4" />
              {additionalExpenses.length - totalAssigned} biaya belum selesai
            </>
          )}
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
  participants: string[];
  onToggleWho: (id: string, person: string) => void;
  onSetPaidBy: (id: string, person: string) => void;
  onSetSplitType: (id: string, type: "equally" | "proportionally") => void;
  onSelectAll: (id: string) => void;
  onEdit: (id: string) => void;
}

function AdxRow({
  adx,
  participants,
  onToggleWho,
  onSetPaidBy,
  onSetSplitType,
  onSelectAll,
  onEdit,
}: AdxRowProps) {
  const isFullyAssigned = adx.who.length > 0 && !!adx.paidBy;
  const isDiscount = adx.amount < 0;

  return (
    <div className={cn("px-4 py-3 space-y-2.5", isFullyAssigned && "bg-emerald-50/40")}>
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
        <div className="flex items-center gap-2 shrink-0">
          {isFullyAssigned && (
            <Check className="w-3.5 h-3.5 text-emerald-500" />
          )}
          <span
            className={cn(
              "text-sm font-black",
              isDiscount ? "text-emerald-600" : "text-primary"
            )}
          >
            {formatToIDR(adx.amount)}
          </span>
        </div>
      </div>

      {/* Split Type Selector */}
      <div>
        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-wider mb-1.5">
          Metode Bagi (Split)
        </p>
        <div className="flex gap-2">
          {/* Equally */}
          <button
            onClick={() => onSetSplitType(adx.id, "equally")}
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
            onClick={() => onSetSplitType(adx.id, "proportionally")}
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
        <p className="text-[10px] text-muted-foreground leading-relaxed mt-1.5">
          {adx.splitType === "proportionally"
            ? "Dibagi sesuai porsi belanja masing-masing orang"
            : "Dibagi rata ke semua orang"}
        </p>
      </div>

      {/* Who pays (paidBy) — single select */}
      <div>
        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-wider mb-1.5">
          Dibayar oleh
        </p>
        {isDiscount ? (
          <div className="p-2 px-3 bg-emerald-500/5 rounded-md border border-emerald-500/10 text-emerald-600 text-[11px] font-semibold flex items-center gap-1.5">
            <span>🏷️ Diskon dari <strong>Merchant</strong></span>
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {participants.map((person) => (
              <button
                key={person}
                onClick={() => onSetPaidBy(adx.id, person)}
                className={cn(
                  "px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer",
                  adx.paidBy === person
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-foreground border-border hover:border-primary/40"
                )}
              >
                {person}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Who gets (who) — multi-select */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-wider">
            Dibagi ke
          </p>
          <button
            onClick={() => onSelectAll(adx.id)}
            className="text-[9px] font-bold text-primary hover:underline cursor-pointer"
          >
            Semua
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {participants.map((person) => {
            const isSelected = adx.who.includes(person);
            return (
              <button
                key={person}
                onClick={() => onToggleWho(adx.id, person)}
                className={cn(
                  "px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer",
                  isSelected
                    ? "bg-primary/10 text-primary border-primary/30"
                    : "bg-white text-muted-foreground border-border hover:border-primary/30"
                )}
              >
                {isSelected && <span className="mr-0.5">✓</span>}
                {person}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
