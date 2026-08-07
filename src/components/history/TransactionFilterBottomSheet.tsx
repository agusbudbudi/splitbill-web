"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Calendar, RotateCcw } from "lucide-react";
import { FilterState } from "@/hooks/useTransactionFilter";
import { BottomSheet } from "@/components/ui/BottomSheet";

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

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Filter Transaksi"
      showBackButton={false}
      footer={
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
      }
    >
      <div className="space-y-6">
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
    </BottomSheet>
  );
};
