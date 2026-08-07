"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useSharedGoalsStore, SharedGoal } from "@/store/useSharedGoalsStore";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { CurrencyInput } from "@/components/ui/CurrencyInput";

interface ContributionInputBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  goal: SharedGoal;
}

export const ContributionInputBottomSheet = ({
  isOpen,
  onClose,
  goal,
}: ContributionInputBottomSheetProps) => {
  const { addContribution } = useSharedGoalsStore();

  const [memberId, setMemberId] = useState("");
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState("");

  const handleSave = () => {
    if (!memberId || amount <= 0) {
      toast.error("Pilih member dan isi nominal");
      return;
    }

    addContribution(goal.id, {
      memberId,
      amount,
      note: note || undefined,
    });

    toast.success("Yeay! Tabungan bertambah 💰");
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setMemberId("");
    setAmount(0);
    setNote("");
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Setor Tabungan"
      footer={
        <Button
          onClick={handleSave}
          className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20"
        >
          <Save className="w-5 h-5 mr-2" /> Simpan
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold">Siapa yang setor?</label>
          <select
            className="w-full h-12 px-3 rounded-sm border border-primary/10 bg-white text-sm font-medium transition-all focus-visible:outline-none focus-visible:border-primary/30 focus-visible:ring-2 focus-visible:ring-primary/10 appearance-none"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
          >
            <option value="" disabled>
              Pilih Member
            </option>
            {goal.members.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground/70">
            Nominal Setoran
          </label>
          <CurrencyInput
            value={amount}
            onChange={(val) => setAmount(val || 0)}
            placeholder="Rp 0"
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground/70 flex items-center gap-2">
            Catatan Setoran
            <span className="text-[10px] font-normal text-muted-foreground">
              (Optional)
            </span>
          </label>
          <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Misal: Dari bonus project"
            className="h-12"
          />
        </div>
      </div>
    </BottomSheet>
  );
};
