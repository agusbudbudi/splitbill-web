"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Calendar, RotateCcw, ArrowLeft } from "lucide-react";
import { FilterState } from "@/hooks/useTransactionFilter";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface TransactionFilterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilter: (filters: FilterState) => void;
  onResetFilter: () => void;
  currentFilters: FilterState;
}

export const TransactionFilterBottomSheet = ({
  isOpen,
  onClose,
  onApplyFilter,
  onResetFilter,
  currentFilters,
}: TransactionFilterBottomSheetProps) => {
  const [dateFrom, setDateFrom] = useState(currentFilters.dateFrom);
  const [dateTo, setDateTo] = useState(currentFilters.dateTo);
  const [error, setError] = useState("");

  // Sync with current filters when opened
  useEffect(() => {
    if (isOpen) {
      setDateFrom(currentFilters.dateFrom);
      setDateTo(currentFilters.dateTo);
      setError("");
    }
  }, [isOpen, currentFilters]);

  const validateAndApply = () => {
    // Validate date range
    if (dateFrom && dateTo) {
      const from = new Date(dateFrom);
      const to = new Date(dateTo);

      if (from > to) {
        setError("Tanggal 'Dari' tidak boleh lebih besar dari 'Sampai'");
        return;
      }
    }

    setError("");
    onApplyFilter({ dateFrom, dateTo });
  };

  const handleReset = () => {
    setDateFrom("");
    setDateTo("");
    setError("");
    onResetFilter();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex justify-center pointer-events-auto">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      <div
        className={cn(
          "absolute bottom-0 w-full max-w-[600px] bg-white rounded-t-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]",
          "animate-in slide-in-from-bottom-full duration-300 ease-out",
        )}
      >
        {/* Drag Handle */}
        <div
          className="w-full flex justify-center pt-2 pb-1 cursor-pointer"
          onClick={onClose}
        >
          <div className="w-12 h-1.5 rounded-full bg-muted/40" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-2 border-b border-primary/5">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 -ml-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/10 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold">Filter Transaksi</h2>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Date From */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase px-1">
              Dari Tanggal
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  setError("");
                }}
                className="pl-10 bg-white"
                placeholder="Pilih tanggal"
              />
            </div>
          </div>

          {/* Date To */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase px-1">
              Sampai Tanggal
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value);
                  setError("");
                }}
                className="pl-10 bg-white"
                placeholder="Pilih tanggal"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3 animate-in slide-in-from-top-2">
              <p className="text-xs text-destructive font-medium">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-primary/5 bg-background">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex-1"
              disabled={!dateFrom && !dateTo}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button
              onClick={validateAndApply}
              className="flex-1"
              disabled={!dateFrom && !dateTo}
            >
              Terapkan Filter
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};
