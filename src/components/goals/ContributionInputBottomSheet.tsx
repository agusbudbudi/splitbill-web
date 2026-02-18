"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useSharedGoalsStore, SharedGoal } from "@/store/useSharedGoalsStore";
import { ArrowLeft, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { createPortal } from "react-dom";
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

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex justify-center pointer-events-auto">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      <div
        className={cn(
          "absolute bottom-0 w-full max-w-[600px] bg-white rounded-t-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-[110]",
          "animate-in slide-in-from-bottom-full duration-300 ease-out",
        )}
      >
        <div
          className="w-full flex justify-center pt-2 pb-1 cursor-pointer"
          onClick={onClose}
        >
          <div className="w-12 h-1.5 rounded-full bg-muted/40" />
        </div>

        <div className="flex items-center justify-between px-6 py-2 border-b border-primary/5">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 -ml-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/10 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold">Setor Tabungan</h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Siapa yang setor?</label>
              <select
                className="w-full h-12 px-3 rounded-lg border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none"
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
        </div>

        <div className="p-4 border-t border-primary/5 bg-background">
          <Button
            onClick={handleSave}
            className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20"
          >
            <Save className="w-5 h-5 mr-2" /> Simpan
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
};
