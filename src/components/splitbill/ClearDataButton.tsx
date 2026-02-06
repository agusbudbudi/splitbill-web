"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useSplitBillStore } from "@/store/useSplitBillStore";
import { Trash2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export const ClearDataButton = () => {
  const { resetStore, expenses, additionalExpenses, people } =
    useSplitBillStore();
  const [showConfirm, setShowConfirm] = useState(false);

  const hasData =
    expenses.length > 0 || additionalExpenses.length > 0 || people.length > 0;

  if (!hasData) return null;

  const handleClear = () => {
    resetStore();
    setShowConfirm(false);
  };

  return (
    <div className="pt-4 flex justify-center">
      {!showConfirm ? (
        <button
          onClick={() => setShowConfirm(true)}
          className="flex items-center gap-2 text-xs font-bold text-muted-foreground/50 hover:text-destructive transition-colors px-4 py-2"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Hapus Semua Data
        </button>
      ) : (
        <div className="w-full p-4 bg-destructive/5 border border-destructive/10 rounded-lg space-y-3 shadow-none hover:shadow-none animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-foreground">
                Hapus semua data?
              </p>
              <p className="text-[10px] text-muted-foreground leading-tight">
                Data tidak bisa dikembalikan.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowConfirm(false)}
              className="flex-1 h-8 text-xs bg-white rounded-sm shadow-none hover:shadow-none"
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClear}
              className="flex-1 h-8 text-xs font-bold rounded-sm shadow-none hover:shadow-none"
            >
              Ya, Hapus
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
