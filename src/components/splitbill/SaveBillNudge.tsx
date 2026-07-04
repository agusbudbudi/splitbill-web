"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Image as ImageIcon,
  History,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useSplitBillStore } from "@/store/useSplitBillStore";
import { toast } from "sonner";

interface SaveBillNudgeProps {
  onSave: () => void;
  className?: string;
}

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

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

        <div className="flex items-center gap-4 px-1">
          <div className="flex -space-x-2">
            {[History, ImageIcon, WhatsAppIcon].map((Icon, i) => (
              <div
                key={i}
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center shadow-sm relative border-2 border-white",
                  i === 0
                    ? "z-0 bg-amber-50 text-amber-500"
                    : i === 1
                      ? "z-10 bg-blue-50 text-blue-500"
                      : "z-20 bg-emerald-50 text-emerald-500",
                )}
              >
                <Icon className={cn("w-3.5 h-3.5", i === 2 && "w-3 h-3")} />
              </div>
            ))}
          </div>
          <p className="text-[10px] font-bold text-primary/60 uppercase tracking-wider">
            Plus, tersimpan di riwayat! 📁
          </p>
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
