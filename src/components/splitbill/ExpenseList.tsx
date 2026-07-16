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

// Temporarily hidden for testing journey without Quick Assign — flip back to show.
const SHOW_QUICK_ASSIGN = false;

export const ExpenseList = () => {
  const { expenses, removeExpense, people, updateExpense } = useSplitBillStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (expenses.length === 0) return null;

  return (
    <div id="expense-list-section" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {SHOW_QUICK_ASSIGN && (
        <div className="relative -mx-4 px-3 pt-4 space-y-4 rounded-t-lg overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary via-primary/50 to-transparent pointer-events-none z-0" />
          <div className="relative z-10 space-y-3">
            <div className="space-y-0.5 px-1">
              <h3 className="text-lg font-black text-white">Atur Cepat ⚡</h3>
              <p className="text-xs text-white/80 font-medium">
                Biar gak input satu-satu, atur semua item sekaligus di sini.
              </p>
            </div>
            <QuickAssignHeader />
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-bold">Rincian Belanja</h3>
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
                  : "rounded-lg border-primary/0 bg-white shadow-sm",
              )}
            >
              <CardContent className="p-3 sm:p-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm truncate">
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
                  <div className="flex flex-col gap-2">
                    <span className="text-[9px] text-muted-foreground/60 uppercase font-bold tracking-wider">
                      Dibayar oleh
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {people.map((name) => {
                        const isPayer = expense.paidBy === name;
                        return (
                          <button
                            key={name}
                            onClick={() => {
                              updateExpense(expense.id, {
                                paidBy: isPayer ? "" : name,
                              });
                            }}
                            className={cn(
                              "flex items-center gap-1.5 rounded-full pl-1 pr-2.5 py-1 border transition-all cursor-pointer text-[10px] font-bold",
                              isPayer
                                ? "bg-emerald-50 border-emerald-300 text-emerald-700 shadow-xs"
                                : "bg-muted/30 border-muted text-muted-foreground hover:bg-muted/60"
                            )}
                            title={name}
                          >
                            <img
                              src={`${AVATAR_SM_URL}${encodeURIComponent(name)}`}
                              alt={name}
                              className={cn(
                                "w-5 h-5 rounded-full transition-transform duration-200",
                                isPayer ? "scale-105" : "opacity-60"
                              )}
                            />
                            <span className="truncate max-w-[60px]">{name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[9px] text-muted-foreground/60 uppercase font-bold tracking-wider">
                      Split dengan
                    </span>
                    {people.length > 0 && (
                      <button
                        onClick={() => {
                          const allPeople = people;
                          // If already all selected, clear all. Otherwise, select all.
                          const isAllSelected = expense.who.length === allPeople.length;
                          updateExpense(expense.id, {
                            who: isAllSelected ? [] : [...allPeople],
                          });
                        }}
                        className="text-[9px] font-black text-primary hover:underline cursor-pointer bg-primary/5 px-2 py-0.5 rounded-full"
                      >
                        {expense.who.length === people.length
                          ? "Reset"
                          : "Bagi Rata (Semua)"}
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {people.map((name) => {
                      const isSelected = expense.who.includes(name);
                      return (
                        <button
                          key={name}
                          onClick={() => {
                            const newWho = isSelected
                              ? expense.who.filter((w) => w !== name)
                              : [...expense.who, name];
                            updateExpense(expense.id, { who: newWho });
                          }}
                          className={cn(
                            "flex items-center gap-1.5 rounded-full pl-1 pr-2.5 py-1 border transition-all cursor-pointer text-[10px] font-bold",
                            isSelected
                              ? "bg-primary/10 border-primary/30 text-primary shadow-xs"
                              : "bg-muted/30 border-muted text-muted-foreground hover:bg-muted/60"
                          )}
                          title={name}
                        >
                          <img
                            src={`${AVATAR_SM_URL}${encodeURIComponent(name)}`}
                            alt={name}
                            className={cn(
                              "w-5 h-5 rounded-full transition-transform duration-200",
                              isSelected ? "scale-105" : "opacity-60"
                            )}
                          />
                          <span className="truncate max-w-[60px]">{name}</span>
                        </button>
                      );
                    })}
                    {people.length === 0 && (
                      <p className="text-[10px] text-muted-foreground italic">
                        Belum ada anggota. Tambahkan teman di atas terlebih dahulu.
                      </p>
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
