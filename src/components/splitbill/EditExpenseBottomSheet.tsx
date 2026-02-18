"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PersonSelector } from "@/components/splitbill/PersonSelector";
import { useSplitBillStore, Expense } from "@/store/useSplitBillStore";
import { X, Save, Trash2, ArrowLeft } from "lucide-react";
import { formatToIDR, cn } from "@/lib/utils";
import { toast } from "sonner";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { InfoModal } from "@/components/ui/InfoModal";
import { Info } from "lucide-react";

interface EditExpenseBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  expenseId: string | null;
}

export const EditExpenseBottomSheet = ({
  isOpen,
  onClose,
  expenseId,
}: EditExpenseBottomSheetProps) => {
  const { people, expenses, updateExpense, removeExpense } =
    useSplitBillStore();
  const [expense, setExpense] = useState<Expense | null>(null);

  // Local state for form
  const [item, setItem] = useState("");
  const [amountStr, setAmountStr] = useState("");
  const [selectedWho, setSelectedWho] = useState<string[]>([]);
  const [paidBy, setPaidBy] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  useEffect(() => {
    if (isOpen && expenseId) {
      const found = expenses.find((e) => e.id === expenseId);
      if (found) {
        setExpense(found);
        setItem(found.item);
        setAmountStr(formatToIDR(found.amount));
        setSelectedWho(found.who);
        setPaidBy(found.paidBy);
      }
    }
  }, [isOpen, expenseId, expenses]);

  const handleToggleWho = (name: string) => {
    setSelectedWho((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    );
  };

  const handleSave = () => {
    if (!expenseId) return;

    const amount = parseFloat(amountStr.replace(/[^0-9]/g, "")) || 0;

    if (!item || amount <= 0 || selectedWho.length === 0 || !paidBy) {
      toast.error("Mohon lengkapi semua data pengeluaran");
      return;
    }

    updateExpense(expenseId, {
      item,
      amount,
      who: selectedWho,
      paidBy,
    });

    onClose();
  };

  const handleDelete = () => {
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (expenseId) {
      removeExpense(expenseId);
      setIsConfirmOpen(false);
      onClose();
    }
  };

  const amount = parseFloat(amountStr.replace(/[^0-9]/g, "")) || 0;

  if (!isOpen) return null;

  // Use Portal to render at the document body level to ensure it overlays everything
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
              "absolute bottom-0 w-full max-w-[600px] bg-white rounded-t-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]",
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
                <h2 className="text-lg font-bold">Edit Pengeluaran</h2>
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
                  <label className="text-sm font-semibold">Nama Item</label>
                  <Input
                    placeholder="Contoh: Makan malam, Tiket bioskop"
                    value={item}
                    onChange={(e) => setItem(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-1">
                    Jumlah (Rupiah)
                    <button
                      type="button"
                      onClick={() => setIsInfoOpen(true)}
                      className="hover:text-primary transition-colors cursor-pointer"
                    >
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </label>
                  <Input
                    placeholder="Contoh: 50.000"
                    value={amountStr}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, "");
                      setAmountStr(val ? formatToIDR(parseInt(val)) : "");
                    }}
                  />
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
            title="Hapus Transaksi?"
            description="Data pengeluaran ini akan dihapus permanen. Kamu yakin?"
            icon={Trash2}
            confirmText="Ya, Hapus"
            confirmButtonClassName="bg-destructive text-white shadow-destructive/20"
          />

          <InfoModal
            isOpen={isInfoOpen}
            onClose={() => setIsInfoOpen(false)}
            title="ℹ️ Informasi Jumlah"
            description={`• Isi jumlah pengeluaran seperti: Rp 50.000\n• Untuk diskon atau pengurangan, kamu bisa menambahkan di bagian Biaya Tambahan`}
          />
        </div>,
        document.body,
      )
    : null;
};
