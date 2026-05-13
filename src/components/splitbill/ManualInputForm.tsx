"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useSplitBillStore } from "@/store/useSplitBillStore";
import { Badge } from "@/components/ui/Badge";
import { Plus, Info, Check } from "lucide-react";
import { cn, formatToIDR } from "@/lib/utils";
import { PersonSelector } from "./PersonSelector";
import { AddButton } from "@/components/ui/AddButton";
import { toast } from "sonner";
import { InfoModal } from "@/components/ui/InfoModal";

export const ManualInputForm = () => {
  const { people, addExpense, lastPaidBy, lastWho } = useSplitBillStore();

  const [item, setItem] = useState("");
  const [amountStr, setAmountStr] = useState("");
  const [selectedWho, setSelectedWho] = useState<string[]>(lastWho);
  const [paidBy, setPaidBy] = useState(lastPaidBy);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  // Update defaults if store defaults change and current is empty
  React.useEffect(() => {
    if (selectedWho.length === 0 && lastWho.length > 0) {
      setSelectedWho(lastWho);
    }
    if (!paidBy && lastPaidBy) {
      setPaidBy(lastPaidBy);
    }
  }, [lastWho, lastPaidBy]);

  const amount = parseFloat(amountStr.replace(/[^0-9]/g, "")) || 0;

  const handleToggleWho = (name: string) => {
    setSelectedWho((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    );
  };

  const handleAddExpense = () => {
    if (!item || amount <= 0 || selectedWho.length === 0 || !paidBy) {
      toast.error("Mohon lengkapi semua data pengeluaran");
      return;
    }

    addExpense({
      item,
      amount,
      who: selectedWho,
      paidBy,
    });

    // Reset form but keep the assignments for next item
    setItem("");
    setAmountStr("");
    toast.success("Item berhasil ditambahkan! 🛒");
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-bold px-1 h-6 flex items-center">
            Nama Item
          </label>
          <Input
            placeholder="Makan malam, Tiket..."
            value={item}
            onChange={(e) => setItem(e.target.value)}
            className="bg-white border-primary/10 h-12"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-bold flex items-center gap-1 px-1 h-6">
            Jumlah (Rp)
            <button
              type="button"
              onClick={() => setIsInfoOpen(true)}
              className="inline-flex items-center justify-center hover:text-primary transition-colors cursor-pointer"
            >
              <Info className="w-3.5 h-3.5 text-muted-foreground/40" />
            </button>
          </label>
          <Input
            placeholder="Contoh: 50.000"
            value={amountStr}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9]/g, "");
              setAmountStr(val ? formatToIDR(parseInt(val)) : "");
            }}
            className="bg-white border-primary/10 h-12 font-bold text-primary"
          />
        </div>
      </div>

      <div className="space-y-5 bg-white p-4 rounded-2xl border border-primary/10">
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <label className="text-sm font-bold">Split dengan Siapa</label>
            <button
              onClick={() =>
                setSelectedWho(
                  selectedWho.length === people.length ? [] : [...people],
                )
              }
              className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
            >
              {selectedWho.length === people.length ? (
                "Batal Pilih Semua"
              ) : (
                <>
                  <Check className="w-3 h-3" />
                  Pilih Semua
                </>
              )}
            </button>
          </div>
          <div className="flex flex-wrap gap-4">
            {people.map((name) => (
              <PersonSelector
                key={name}
                name={name}
                isSelected={selectedWho.includes(name)}
                onClick={handleToggleWho}
                size="md"
              />
            ))}
            {people.length === 0 && (
              <p className="text-xs text-muted-foreground italic">
                Tambahkan teman dulu di step sebelumnya!
              </p>
            )}
          </div>
        </div>

        <div className="space-y-3 border-t border-primary/10 pt-4">
          <label className="text-sm font-bold px-1">Dibayar oleh</label>
          <div className="flex flex-wrap gap-4">
            {people.map((name) => (
              <PersonSelector
                key={name}
                name={name}
                isSelected={paidBy === name}
                onClick={setPaidBy}
                size="md"
              />
            ))}
          </div>
        </div>
      </div>

      <Button
        onClick={handleAddExpense}
        variant="default"
        className="w-full h-12 rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 transition-all active:scale-95"
      >
        <Plus className="w-5 h-5 mr-2" />
        Tambah Item ke Daftar
      </Button>

      <InfoModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        title="ℹ️ Informasi Jumlah"
        description={`• Isi jumlah pengeluaran seperti: Rp 50.000\n• Untuk diskon atau pengurangan, kamu bisa menambahkan di bagian Biaya Tambahan`}
      />
    </div>
  );
};
