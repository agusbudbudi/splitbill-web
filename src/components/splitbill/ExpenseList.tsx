"use client";

import React, { useState } from "react";
import { useSplitBillStore } from "@/store/useSplitBillStore";
import { Card, CardContent } from "@/components/ui/Card";
import { Trash2, Edit2, User } from "lucide-react";
import { formatToIDR } from "@/lib/utils";
import { EditExpenseBottomSheet } from "./EditExpenseBottomSheet";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";

const AVATAR_SM_URL =
  "https://api.dicebear.com/9.x/personas/svg?backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&size=24&scale=100&seed=";

export const ExpenseList = () => {
  const { expenses, removeExpense } = useSplitBillStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (expenses.length === 0) return null;

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h3 className="text-lg font-bold">Transaksi Pengeluaran 📊</h3>
      <div className="space-y-3">
        {expenses.map((expense) => (
          <Card
            key={expense.id}
            className="overflow-hidden border-primary/10 shadow-none bg-white"
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="space-y-0.5">
                  <h4 className="font-bold text-sm text-foreground/80">
                    {expense.item}
                  </h4>
                  <p className="text-primary font-bold text-base">
                    {formatToIDR(expense.amount)}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setEditingId(expense.id)}
                    className="p-1.5 text-muted-foreground/40 hover:text-primary transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(expense.id)}
                    className="p-1.5 text-muted-foreground/40 hover:text-destructive transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2 border-t border-dashed border-primary/10">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground/60 uppercase font-bold tracking-tight">
                    Split dengan
                  </span>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {expense.who.map((name) => (
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
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground/60 uppercase font-bold tracking-tight">
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
                    <div className="flex items-center gap-1.5 bg-destructive/10 rounded-full px-2.5 py-1 border border-destructive/20 text-destructive">
                      <span className="text-[10px] font-bold">
                        Pilih Pembayar
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
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
