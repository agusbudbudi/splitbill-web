"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PersonSelector } from "@/components/splitbill/PersonSelector";
import { useSplitBillChatStore } from "@/store/useSplitBillChatStore";
import type { Expense } from "@/store/useSplitBillStore";
import { Save, Trash2, Info } from "lucide-react";
import { formatToIDR } from "@/lib/utils";
import { toast } from "sonner";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { InfoModal } from "@/components/ui/InfoModal";

interface EditChatExpenseBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  expenseId: string | null;
}

export const EditChatExpenseBottomSheet = ({
  isOpen,
  onClose,
  expenseId,
}: EditChatExpenseBottomSheetProps) => {
  const { participants, expenses, updateExpense, removeExpense } =
    useSplitBillChatStore();
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
      toast.success("Item berhasil dihapus");
    }
  };

  return (
    <>
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        title="Edit Detail Item"
        headerAction={
          <button
            onClick={handleDelete}
            className="text-destructive hover:bg-destructive/10 p-2 rounded-full transition-colors cursor-pointer"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        }
        footer={
          <Button
            onClick={handleSave}
            className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20"
          >
            <Save className="w-5 h-5 mr-2" /> Simpan Perubahan
          </Button>
        }
      >
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
              Dibayar oleh
            </label>
            <div className="flex flex-wrap gap-3">
              {participants.map((name) => (
                <PersonSelector
                  key={name}
                  name={name}
                  isSelected={paidBy === name}
                  onClick={setPaidBy}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-foreground">
              Split dengan Siapa
            </label>
            <div className="flex flex-wrap gap-3">
              {participants.map((name) => (
                <PersonSelector
                  key={name}
                  name={name}
                  isSelected={selectedWho.includes(name)}
                  onClick={handleToggleWho}
                />
              ))}
            </div>
          </div>
        </div>
      </BottomSheet>

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Hapus Transaksi?"
        description="Data pengeluaran ini akan dihapus permanen dari sesi chat. Kamu yakin?"
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
    </>
  );
};
