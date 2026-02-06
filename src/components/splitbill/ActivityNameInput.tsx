"use client";

import React from "react";
import { Input } from "@/components/ui/Input";
import { useSplitBillStore } from "@/store/useSplitBillStore";
import { FileText } from "lucide-react";

export const ActivityNameInput = () => {
  const { activityName, setActivityName } = useSplitBillStore();

  return (
    <div className="space-y-2 animate-in fade-in duration-500">
      <label className="text-sm font-semibold flex items-center gap-2">
        <FileText className="w-4 h-4 text-primary" />
        Nama Kegiatan
      </label>
      <Input
        placeholder="Contoh: Makan malam di Resto X, Liburan Bali"
        value={activityName}
        onChange={(e) => setActivityName(e.target.value)}
        className="text-base font-medium"
      />
      <p className="text-[10px] text-muted-foreground italic px-1">
        Biar gampang inget, kasih nama kegiatannya ya!
      </p>
    </div>
  );
};
