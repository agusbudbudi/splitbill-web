"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  Check,
  AlertCircle,
  Edit2,
} from "lucide-react";
import {
  useSplitBillChatStore,
  type ChatStep,
} from "@/store/useSplitBillChatStore";
import type { Expense } from "@/store/useSplitBillStore";
import { formatToIDR, cn } from "@/lib/utils";
import { toast } from "sonner";
import { EditChatExpenseBottomSheet } from "./EditChatExpenseBottomSheet";
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

interface ItemAssignCardProps {
  onConfirm: () => void;
}

export function ItemAssignCard({ onConfirm }: ItemAssignCardProps) {
  const { step, expenses, participants, updateExpense } = useSplitBillChatStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const isCompleted =
    STEP_ORDER.indexOf(step) > STEP_ORDER.indexOf("ASSIGN_ITEMS");

  // ── Frozen state ────────────────────────────────────────────────────────────
  if (isCompleted) {
    const assignedCount = expenses.filter(
      (e) => e.who.length > 0 && e.paidBy
    ).length;
    return (
      <div className="rounded-2xl border border-primary/15 bg-white overflow-hidden shadow-sm">
        <div className="flex items-center gap-2 px-4 py-3 bg-primary/5 border-b border-primary/10">
          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
            <Check className="w-3 h-3 text-white" />
          </div>
          <p className="text-xs font-bold text-primary">Item di-assign</p>
          <span className="ml-auto text-xs text-muted-foreground font-semibold">
            {assignedCount}/{expenses.length} item
          </span>
        </div>
        <div className="px-4 py-3 space-y-1.5">
          {expenses.map((e) => (
            <div key={e.id} className="flex justify-between items-center text-xs gap-3">
              <span className="text-foreground/80 flex-1 break-words whitespace-normal flex items-center gap-1.5">
                <button
                  onClick={() => setEditingId(e.id)}
                  className="p-1 rounded-md text-muted-foreground hover:bg-primary/5 hover:text-primary transition-all cursor-pointer flex-shrink-0"
                  title="Edit detail item"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <span>{e.item}</span>
              </span>
              <span className="font-bold shrink-0">{formatToIDR(e.amount)}</span>
            </div>
          ))}
        </div>
        <EditChatExpenseBottomSheet
          isOpen={!!editingId}
          onClose={() => setEditingId(null)}
          expenseId={editingId}
        />
      </div>
    );
  }

  // ── Interactive ─────────────────────────────────────────────────────────────
  const handleToggleWho = (expenseId: string, person: string) => {
    const expense = expenses.find((e) => e.id === expenseId);
    if (!expense) return;
    const isSelected = expense.who.includes(person);
    const newWho = isSelected
      ? expense.who.filter((w) => w !== person)
      : [...expense.who, person];
    updateExpense(expenseId, { who: newWho });
  };

  const handleSetPaidBy = (expenseId: string, person: string) => {
    updateExpense(expenseId, { paidBy: person });
  };

  const handleSelectAll = (expenseId: string) => {
    updateExpense(expenseId, { who: [...participants] });
  };

  const handleConfirm = () => {
    const unassigned = expenses.filter((e) => e.who.length === 0 || !e.paidBy);
    if (unassigned.length > 0) {
      toast.error(
        `${unassigned.length} item belum di-assign 'Siapa' atau 'Dibayar oleh'.`
      );
      return;
    }
    trackChatBill.itemsAssigned({ total_items: expenses.length });
    onConfirm();
  };

  const totalAssigned = expenses.filter(
    (e) => e.who.length > 0 && e.paidBy
  ).length;

  return (
    <div className="rounded-2xl border border-primary/20 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-primary/5 to-violet-500/5 border-b border-primary/10">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-primary uppercase tracking-wide">
            Assign Item
          </p>
          <span className="text-xs text-muted-foreground font-semibold">
            {totalAssigned}/{expenses.length} selesai
          </span>
        </div>
      </div>

      <div className="divide-y divide-border/60">
        {expenses.map((expense) => (
          <ExpenseRow
            key={expense.id}
            expense={expense}
            participants={participants}
            onToggleWho={handleToggleWho}
            onSetPaidBy={handleSetPaidBy}
            onSelectAll={handleSelectAll}
            onEdit={() => setEditingId(expense.id)}
          />
        ))}
      </div>

      {/* CTA */}
      <div className="p-4 border-t border-border/60">
        <button
          onClick={handleConfirm}
          className={cn(
            "w-full h-10 rounded-sm font-bold text-sm flex items-center justify-center gap-2 transition-all",
            totalAssigned === expenses.length
              ? "bg-primary text-white shadow-md shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] cursor-pointer"
              : "bg-muted text-muted-foreground"
          )}
        >
          {totalAssigned === expenses.length ? (
            <>
              Lanjut <ChevronRight className="w-4 h-4" />
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4" />
              {expenses.length - totalAssigned} item belum selesai
            </>
          )}
        </button>
      </div>

      <EditChatExpenseBottomSheet
        isOpen={!!editingId}
        onClose={() => setEditingId(null)}
        expenseId={editingId}
      />
    </div>
  );
}

// ── Per-expense row ──────────────────────────────────────────────────────────
interface ExpenseRowProps {
  expense: Expense;
  participants: string[];
  onToggleWho: (id: string, person: string) => void;
  onSetPaidBy: (id: string, person: string) => void;
  onSelectAll: (id: string) => void;
  onEdit: () => void;
}

function ExpenseRow({
  expense,
  participants,
  onToggleWho,
  onSetPaidBy,
  onSelectAll,
  onEdit,
}: ExpenseRowProps) {
  const isFullyAssigned = expense.who.length > 0 && !!expense.paidBy;

  return (
    <div className={cn("px-4 py-3 space-y-2.5", isFullyAssigned && "bg-emerald-50/40")}>
      {/* Item name + amount */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 flex-1 pr-2 min-w-0">
          <button
            onClick={onEdit}
            className="p-1 rounded-md text-muted-foreground hover:bg-primary/5 hover:text-primary transition-all cursor-pointer flex-shrink-0"
            title="Edit detail item"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <p className="text-sm font-bold text-foreground break-words whitespace-normal">
            {expense.item}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isFullyAssigned && (
            <Check className="w-3.5 h-3.5 text-emerald-500" />
          )}
          <span className="text-sm font-black text-primary">
            {formatToIDR(expense.amount)}
          </span>
        </div>
      </div>

      {/* Who pays (paidBy) — single select */}
      <div>
        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-wider mb-1.5">
          Dibayar oleh
        </p>
        <div className="flex flex-wrap gap-1.5">
          {participants.map((person) => (
            <button
              key={person}
              onClick={() => onSetPaidBy(expense.id, person)}
              className={cn(
                "px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer",
                expense.paidBy === person
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-foreground border-border hover:border-primary/40"
              )}
            >
              {person}
            </button>
          ))}
        </div>
      </div>

      {/* Who gets (who) — multi-select */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-wider">
            Dibagi ke
          </p>
          <button
            onClick={() => onSelectAll(expense.id)}
            className="text-[9px] font-bold text-primary hover:underline cursor-pointer"
          >
            Semua
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {participants.map((person) => {
            const isSelected = expense.who.includes(person);
            return (
              <button
                key={person}
                onClick={() => onToggleWho(expense.id, person)}
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
