"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useSplitBillStore } from "@/store/useSplitBillStore";
import { toast } from "sonner";

interface SaveBillNudgeProps {
  onSave: () => void;
  className?: string;
}

export const SaveBillNudge = ({ onSave, className }: SaveBillNudgeProps) => {
  const { expenses, additionalExpenses } = useSplitBillStore();

  const handleSave = () => {
    if (expenses.length === 0) {
      toast.error("Belum ada item nih! 📝", {
        description:
          "Yuk isi dulu item belanjaan atau pengeluarannya sebelum disimpan.",
        duration: 4000,
      });
      return;
    }

    const hasUnassigned = expenses.some((e) => e.who.length === 0 || !e.paidBy);
    const hasUnassignedAdx = additionalExpenses.some(
      (e) => e.who.length === 0 || !e.paidBy
    );

    if (hasUnassigned || hasUnassignedAdx) {
      toast.error("Ada item yang belum dilengkapi! ⚠️", {
        description:
          "Pastikan semua item sudah di-assign 'Split dengan' dan 'Dibayar oleh' ya.",
        duration: 4000,
      });
      return;
    }

    onSave();
  };

  return (
    <Card
      className={cn(
        "border-primary/20 shadow-soft bg-white overflow-hidden",
        className,
      )}
    >
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl relative overflow-hidden shrink-0">
            <Image
              src="/img/save-bill-icon.png"
              alt="Save Bill Icon"
              fill
              className="object-contain"
            />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-foreground">
              Share & Download! 📸
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Simpan dulu biar kamu bisa bagiin link dan download gambar rincian
              tagihannya buat temen-temen.
            </p>
          </div>
        </div>

        <Button
          onClick={handleSave}
          variant="outline"
          className="w-full h-11 border-primary/20 text-primary hover:bg-primary/5"
        >
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Simpan & Share
        </Button>
      </CardContent>
    </Card>
  );
};
