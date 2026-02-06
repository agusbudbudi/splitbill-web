"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useSplitBillStore } from "@/store/useSplitBillStore";
import { Badge } from "@/components/ui/Badge";
import { Plus, Info } from "lucide-react";
import { cn, formatToIDR } from "@/lib/utils";
import { PersonSelector } from "./PersonSelector";
import { AddButton } from "@/components/ui/AddButton";
import { toast } from "sonner";
import { InfoModal } from "@/components/ui/InfoModal";

export const ManualInputForm = () => {
  const { people, addExpense } = useSplitBillStore();

  const [item, setItem] = useState("");
  const [amountStr, setAmountStr] = useState("");
  const [selectedWho, setSelectedWho] = useState<string[]>([]);
  const [paidBy, setPaidBy] = useState("");
  const [isInfoOpen, setIsInfoOpen] = useState(false);

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

    // Reset form
    setItem("");
    setAmountStr("");
    setSelectedWho([]);
    setPaidBy("");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
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
            Jumlah (Rupiah){" "}
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
            {people.length === 0 && (
              <p className="text-sm text-muted-foreground italic">
                Tambahkan teman dulu di step sebelumnya!
              </p>
            )}
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
        </div>{" "}
      </div>

      <AddButton onClick={handleAddExpense} label="Tambah Transaksi" />

      <InfoModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        title="ℹ️ Informasi Jumlah"
        description={`• Isi jumlah pengeluaran seperti: Rp 50.000\n• Untuk diskon atau pengurangan, kamu bisa menambahkan di bagian Biaya Tambahan`}
      />
    </div>
  );
};
