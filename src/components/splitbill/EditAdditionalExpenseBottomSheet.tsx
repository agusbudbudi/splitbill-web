"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PersonSelector } from "@/components/splitbill/PersonSelector";
import {
  useSplitBillStore,
  AdditionalExpense,
} from "@/store/useSplitBillStore";
import { X, Save, Trash2, ArrowLeft } from "lucide-react";
import { formatToIDR, cn } from "@/lib/utils";
import { toast } from "sonner";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";

interface EditAdditionalExpenseBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  expenseId: string | null;
}

export const EditAdditionalExpenseBottomSheet = ({
  isOpen,
  onClose,
  expenseId,
}: EditAdditionalExpenseBottomSheetProps) => {
  const {
    people,
    expenses,
    additionalExpenses,
    updateAdditionalExpense,
    removeAdditionalExpense,
  } = useSplitBillStore();

  // Local state for form
  const [name, setName] = useState("");
  const [amountStr, setAmountStr] = useState("");
  const [isPercentage, setIsPercentage] = useState(false);
  const [percentageStr, setPercentageStr] = useState("");
  const [selectedWho, setSelectedWho] = useState<string[]>([]);
  const [paidBy, setPaidBy] = useState("");
  const [splitType, setSplitType] = useState<"equally" | "proportionally">(
    "proportionally",
  );
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Calculate subtotal from main expenses for percentage calculation
  const subtotal = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  useEffect(() => {
    if (isOpen && expenseId) {
      const found = additionalExpenses.find((e) => e.id === expenseId);
      if (found) {
        setName(found.name);
        setAmountStr(formatToIDR(found.amount));
        setSelectedWho(found.who);
        setPaidBy(found.paidBy);
        setSplitType(found.splitType);

        // Reset percentage mode on open, default to fixed amount edit
        setIsPercentage(false);
        setPercentageStr("");
      }
    }
  }, [isOpen, expenseId, additionalExpenses]);

  const handleToggleWho = (name: string) => {
    setSelectedWho((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    );
  };

  const handleSave = () => {
    if (!expenseId) return;

    let finalAmount = 0;

    // Calculate amount based on mode
    if (isPercentage && subtotal > 0) {
      const pct = parseFloat(percentageStr) || 0;
      finalAmount = (subtotal * pct) / 100;
    } else {
      const cleaned = amountStr.replace(/[^-0-9]/g, "");
      finalAmount = parseFloat(cleaned) || 0;
    }

    if (!name || finalAmount <= 0 || selectedWho.length === 0 || !paidBy) {
      toast.error("Mohon lengkapi semua data pengeluaran");
      return;
    }

    // Append percentage to name if in percentage mode
    let finalName = name;
    if (isPercentage) {
      // If name already has %, maybe remove it first or just update it
      // Simpler: Just use current name, but maybe append % if meaningful.
      // V1 usually handles this by the type label.
      // Let's just update the amount for now.
    }

    updateAdditionalExpense(expenseId, {
      name: finalName,
      amount: finalAmount,
      who: selectedWho,
      paidBy,
      splitType,
    });

    onClose();
  };

  const handleDelete = () => {
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (expenseId) {
      removeAdditionalExpense(expenseId);
      setIsConfirmOpen(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return typeof document !== "undefined"
    ? require("react-dom").createPortal(
        <div className="fixed inset-0 z-[100] flex justify-center pointer-events-auto">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in"
            onClick={onClose}
          />

          {/* Sheet Content */}
          <div
            className={cn(
              "absolute bottom-0 w-full max-w-[480px] bg-white rounded-t-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]",
              "animate-in slide-in-from-bottom-full duration-300 ease-out",
            )}
          >
            {/* Drag handle for mobile feel */}
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
                  className="p-2 -ml-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/10 cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-lg font-bold">Edit Biaya Tambahan</h2>
              </div>
              <button
                onClick={handleDelete}
                className="text-destructive hover:bg-destructive/10 p-2 rounded-full transition-colors cursor-pointer"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Nama Biaya</label>
                  <Input
                    placeholder="Contoh: Tax, Service, Diskon"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">
                    Jumlah / Persentase
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      {isPercentage ? (
                        <div className="relative">
                          <Input
                            type="number"
                            placeholder="10"
                            value={percentageStr}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              if (val > 100) {
                                setPercentageStr("100");
                              } else {
                                setPercentageStr(e.target.value);
                              }
                            }}
                            className="pr-8"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                            %
                          </span>
                        </div>
                      ) : (
                        <Input
                          placeholder="Rp 0"
                          value={amountStr}
                          onChange={(e) => {
                            const input = e.target.value;
                            const isNegative = input.startsWith("-");
                            const val = input.replace(/[^-0-9]/g, "");
                            const numericVal = parseInt(val.replace(/-/g, ""));

                            if (isNaN(numericVal)) {
                              setAmountStr(isNegative ? "-" : "");
                            } else {
                              setAmountStr(
                                (isNegative ? "-" : "") +
                                  formatToIDR(numericVal),
                              );
                            }
                          }}
                        />
                      )}
                    </div>
                    <button
                      onClick={() => setIsPercentage(!isPercentage)}
                      className={cn(
                        "px-4.5 rounded-full border border-primary/10 text-sm font-bold transition-all cursor-pointer",
                        isPercentage
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-muted-foreground hover:text-primary hover:border-primary/50",
                      )}
                    >
                      %
                    </button>
                  </div>
                  {isPercentage && (
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        {[5, 10, 11].map((p) => (
                          <button
                            key={p}
                            onClick={() => setPercentageStr(p.toString())}
                            className={cn(
                              "flex-1 py-1.5 rounded-xl text-xs font-black border transition-all cursor-pointer",
                              percentageStr === p.toString()
                                ? "bg-primary/10 border-primary text-primary"
                                : "bg-white border-primary/10 text-muted-foreground hover:border-primary/30",
                            )}
                          >
                            {p}%
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {percentageStr}% dari subtotal {formatToIDR(subtotal)} ={" "}
                        <span className="font-bold text-primary">
                          {formatToIDR(
                            (subtotal * (parseFloat(percentageStr) || 0)) / 100,
                          )}
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Split Type Selector */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">
                    Metode Bagi (Split)
                  </label>
                  <div className="flex p-1 bg-white/50 rounded-lg border border-primary/10">
                    <button
                      onClick={() => setSplitType("proportionally")}
                      className={cn(
                        "flex-1 py-1.5 rounded-md text-[10px] font-bold transition-all cursor-pointer",
                        splitType === "proportionally"
                          ? "bg-primary text-white shadow-sm"
                          : "text-muted-foreground hover:bg-white/80",
                      )}
                    >
                      PROPORSIONAL (%)
                    </button>
                    <button
                      onClick={() => setSplitType("equally")}
                      className={cn(
                        "flex-1 py-1.5 rounded-md text-[10px] font-bold transition-all cursor-pointer",
                        splitType === "equally"
                          ? "bg-primary text-white shadow-sm"
                          : "text-muted-foreground hover:bg-white/80",
                      )}
                    >
                      BAGI RATA (=)
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-foreground">
                    Split dengan Siapa
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {people.map((name) => (
                      <PersonSelector
                        key={name}
                        name={name}
                        isSelected={selectedWho.includes(name)}
                        onClick={handleToggleWho}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-foreground">
                    Dibayar oleh
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {people.map((name) => (
                      <PersonSelector
                        key={name}
                        name={name}
                        isSelected={paidBy === name}
                        onClick={setPaidBy}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-primary/5 bg-background">
              <Button
                onClick={handleSave}
                className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20"
              >
                <Save className="w-5 h-5 mr-2" /> Simpan Perubahan
              </Button>
            </div>
          </div>

          <ConfirmationModal
            isOpen={isConfirmOpen}
            onClose={() => setIsConfirmOpen(false)}
            onConfirm={confirmDelete}
            title="Hapus Biaya Tambahan?"
            description="Biaya tambahan ini akan dihapus permanen. Kamu yakin?"
            icon={Trash2}
            confirmText="Ya, Hapus"
            confirmButtonClassName="bg-destructive text-white shadow-destructive/20"
          />
        </div>,
        document.body,
      )
    : null;
};
