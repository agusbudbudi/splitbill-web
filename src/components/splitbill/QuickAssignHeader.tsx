"use client";

import React from "react";
import { useSplitBillStore } from "@/store/useSplitBillStore";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Users, CheckCircle2, Sparkles, AlertCircle } from "lucide-react";
import { PersonSelector } from "./PersonSelector";
import { cn, formatToIDR } from "@/lib/utils";
import { toast } from "sonner";

export const QuickAssignHeader = () => {
  const {
    people,
    expenses,
    additionalExpenses,
    setAllExpensesPaidBy,
    setAllExpensesWho,
    setAllAdditionalExpensesPaidBy,
    setAllAdditionalExpensesWho,
    lastPaidBy,
  } = useSplitBillStore();

  const subtotal = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const unassignedCount = expenses.filter(
    (e) => e.who.length === 0 || !e.paidBy,
  ).length;

  if (expenses.length === 0) return null;

  const negativeItemsCount = [
    ...expenses.filter((e) => e.amount < 0),
    ...additionalExpenses.filter((e) => e.amount < 0),
  ].length;

  const handleSetAllPaidBy = (name: string) => {
    setAllExpensesPaidBy(name);
    setAllAdditionalExpensesPaidBy(name);

    if (negativeItemsCount > 0) {
      toast.success(
        `Berhasil! Item dibayar oleh ${name}. ${negativeItemsCount} item diskon/kredit diabaikan 💸`
      );
    } else {
      toast.success(`Berhasil! Semua item sekarang dibayar oleh ${name} 💸`);
    }
  };

  const handleSplitWithEveryone = () => {
    setAllExpensesWho(people);
    setAllAdditionalExpensesWho(people);
    toast.success("Keren! Semua item sekarang dibagi rata ke semua teman 👥✨");
  };

  return (
    <Card className="rounded-lg bg-white shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
      {/* Subtotal Section */}
      <div className="bg-primary/10 p-4 flex justify-between items-center">
        <div className="space-y-0.5">
          <p className="text-[10px] font-black uppercase text-primary/40 tracking-wider leading-none">
            Subtotal Belanja
          </p>
          <p className="text-xl font-black text-primary leading-none">
            {formatToIDR(subtotal)}
          </p>
        </div>
        <div className="text-right space-y-1">
          <div className="flex items-center gap-1 justify-end">
            {unassignedCount > 0 ? (
              <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                {unassignedCount} butuh aksi
              </span>
            ) : (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Rapi! ✨
              </span>
            )}
          </div>
        </div>
      </div>

      <CardContent className="p-4 space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-bold text-primary">Quick Assign ⚡</h3>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-wider">
            Set Pembayar ke Semua Item
          </label>
          <div className="flex flex-wrap gap-3">
            {people.map((name) => (
              <PersonSelector
                key={name}
                name={name}
                isSelected={lastPaidBy === name}
                onClick={handleSetAllPaidBy}
                size="md"
              />
            ))}
          </div>
        </div>

        <div className="pt-1">
          <Button
            onClick={handleSplitWithEveryone}
            variant="outline"
            className="w-full h-10 rounded-sm border-primary/20 text-primary bg-white hover:bg-primary/5 transition-all font-bold text-xs gap-2"
          >
            <Users className="w-4 h-4" />
            Bagi Rata ke Semua Teman ({people.length} Orang)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
