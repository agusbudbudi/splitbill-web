"use client";

import React, { useState } from "react";
import { useSplitBillStore } from "@/store/useSplitBillStore";
import { Card, CardContent } from "@/components/ui/Card";
import { Trash2, Edit2, User, Users, AlertCircle } from "lucide-react";
import { formatToIDR, cn } from "@/lib/utils";
import { EditExpenseBottomSheet } from "./EditExpenseBottomSheet";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";

import { QuickAssignHeader } from "./QuickAssignHeader";

const AVATAR_SM_URL =
  "https://api.dicebear.com/9.x/personas/svg?backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&size=24&scale=100&seed=";

export const ExpenseList = () => {
  const { expenses, removeExpense } = useSplitBillStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (expenses.length === 0) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <QuickAssignHeader />

      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-bold">Rincian Belanja 🧾</h3>
          <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {expenses.length} Item
          </span>
        </div>

        <div className="space-y-3">
          {expenses.map((expense) => (
            <Card
              key={expense.id}
              className={cn(
                "overflow-hidden transition-all duration-300 border",
                expense.who.length === 0 || !expense.paidBy
                  ? "rounded-[1.2rem] border-amber-200 bg-amber-50/20 backdrop-blur-xs shadow-soft text-card-foreground"
                  : "rounded-xl border-primary/0 bg-white shadow-sm",
              )}
            >
              <CardContent className="p-3 sm:p-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs sm:text-sm text-foreground/80 truncate">
                      {expense.item}
                    </h4>
                    <p className="text-primary font-black text-sm sm:text-base mt-0.5">
                      {formatToIDR(expense.amount)}
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => setEditingId(expense.id)}
                      className="p-1.5 rounded-lg bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(expense.id)}
                      className="p-1.5 rounded-lg bg-destructive/5 text-destructive hover:bg-destructive hover:text-white transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 flex flex-col gap-2.5 pt-3 border-t border-dashed border-primary/10">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[9px] text-muted-foreground/60 uppercase font-bold tracking-wider shrink-0">
                      Split dengan
                    </span>
                    <div className="flex flex-wrap gap-1 justify-end">
                      {expense.who.length > 0 ? (
                        expense.who.map((name) => (
                          <div
                            key={name}
                            className="flex items-center gap-1.5 bg-primary/5 rounded-full pl-1 pr-2.5 py-1 border border-primary/5"
                            title={name}
                          >
                            <img
                              src={`${AVATAR_SM_URL}${encodeURIComponent(name)}`}
                              alt={name}
                              className="w-5 h-5 rounded-full"
                            />
                            <span className="text-[10px] font-bold text-primary/60 truncate max-w-[48px]">
                              {name}
                            </span>
                          </div>
                        ))
                      ) : (
                        <button
                          onClick={() => setEditingId(expense.id)}
                          className="text-[10px] font-bold text-amber-600 flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-full border border-amber-200/50 hover:bg-amber-100 transition-colors cursor-pointer"
                        >
                          <Users className="w-3 h-3" /> Belum dipilih
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[9px] text-muted-foreground/60 uppercase font-bold tracking-wider shrink-0">
                      Dibayar oleh
                    </span>
                    {expense.paidBy ? (
                      <div className="flex items-center gap-1.5 bg-primary/5 rounded-full pl-1 pr-2.5 py-1 border border-primary/20">
                        <img
                          src={`${AVATAR_SM_URL}${encodeURIComponent(expense.paidBy)}`}
                          alt={expense.paidBy}
                          className="w-5 h-5 rounded-full"
                        />
                        <span className="text-[10px] font-bold text-primary">
                          {expense.paidBy}
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditingId(expense.id)}
                        className="flex items-center gap-1.5 bg-amber-50 rounded-full pl-1 pr-2.5 py-1 border border-amber-200 text-amber-700 hover:bg-amber-100 transition-colors cursor-pointer"
                      >
                        <AlertCircle className="w-3 h-3" />
                        <span className="text-[10px] font-bold">
                          Pilih Pembayar
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <EditExpenseBottomSheet
        isOpen={!!editingId}
        onClose={() => setEditingId(null)}
        expenseId={editingId}
      />

      <ConfirmationModal
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={() => {
          if (confirmDeleteId) {
            removeExpense(confirmDeleteId);
            setConfirmDeleteId(null);
          }
        }}
        title="Hapus Transaksi?"
        description="Data pengeluaran ini akan dihapus permanen. Kamu yakin?"
        icon={Trash2}
        confirmText="Ya, Hapus"
        confirmButtonClassName="bg-destructive text-white shadow-destructive/20"
      />
    </div>
  );
};
