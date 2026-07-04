"use client";

import React from "react";
import { BucketReceipt } from "@/store/useSplitLaterStore";
import { ReceiptCard } from "./ReceiptCard";
import { Camera } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/ui/EmptyState";
import { ReceiptImagePicker } from "@/components/splitbill/ReceiptImagePicker";

interface ReceiptGridProps {
  receipts: BucketReceipt[];
  onProcess: (receipt: BucketReceipt) => void;
  onDelete: (receiptId: string) => void;
  onUpload: (file: File) => Promise<void>;
  isUploading: boolean;
}

export const ReceiptGrid = ({
  receipts,
  onProcess,
  onDelete,
  onUpload,
  isUploading,
}: ReceiptGridProps) => {
  const handleFileSelect = async (file: File) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Format file tidak didukung. Gunakan JPG, PNG, atau WebP.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Ukuran file terlalu besar. Maksimal 10MB.");
      return;
    }

    await onUpload(file);
  };

  return (
    <div className="space-y-4">
      {/* Upload zone */}
      <ReceiptImagePicker
        image={null}
        onFileSelect={(file) => handleFileSelect(file)}
        onRemove={() => { }}
        isLoading={isUploading}
      />

      {/* Receipt grid */}
      {receipts.length === 0 ? (
        <EmptyState
          icon={Camera}
          message="Belum Ada Struk"
          subtitle="Yuk foto struk pertamamu! Bisa ambil foto langsung atau upload dari galeri."
          className="bg-white/50 rounded-2xl"
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 pt-4">
          {receipts.map((receipt) => (
            <ReceiptCard
              key={receipt.id}
              receipt={receipt}
              onProcess={() => onProcess(receipt)}
              onDelete={() => onDelete(receipt.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
