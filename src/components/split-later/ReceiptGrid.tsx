"use client";

import React, { useEffect, useState } from "react";
import { BucketReceipt } from "@/store/useSplitLaterStore";
import { ReceiptCard } from "./ReceiptCard";
import { Camera, Receipt } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Card, CardContent } from "@/components/ui/Card";
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
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const receiptUrlsKey = receipts.map((r) => `${r.id}:${r.imageUrl}`).join("|");

  // On (re)load, verify each receipt's image still exists on storage — a manual
  // delete from the Vercel Blob dashboard leaves the browser's image cache
  // unaware, so <img onError> alone won't catch it until cache expires.
  useEffect(() => {
    if (receipts.length === 0) return;
    let cancelled = false;

    fetch("/api/split-later/check-images", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ urls: receipts.map((r) => r.imageUrl) }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled || !data.success) return;
        const missingUrls = new Set(
          data.results.filter((r: { url: string; exists: boolean }) => !r.exists).map((r: { url: string }) => r.url),
        );
        setDeletedIds(
          new Set(
            receipts.filter((r) => missingUrls.has(r.imageUrl)).map((r) => r.id),
          ),
        );
      })
      .catch((err) => console.error("Failed to verify receipt images:", err));

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receiptUrlsKey]);

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
      <Card className="p-3 shadow-md overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />
        <CardContent className="p-2 space-y-4 relative z-10">
          <div className="flex items-center gap-2 px-1">
            <Camera className="w-4 h-4 text-primary" />
            <label className="text-sm font-bold text-foreground">Struk Belanja</label>
          </div>
          <ReceiptImagePicker
            image={null}
            onFileSelect={(file) => handleFileSelect(file)}
            onRemove={() => { }}
            isLoading={isUploading}
          />
        </CardContent>
      </Card>

      {/* Receipt grid */}
      {receipts.length === 0 ? (
        <EmptyState
          icon={Receipt}
          message="Belum Ada Struk"
          subtitle="Yuk foto struk pertamamu! Bisa ambil foto langsung atau upload dari galeri."
          className="bg-transparent rounded-md mt-4"
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 pt-4">
          {receipts.map((receipt) => (
            <ReceiptCard
              key={receipt.id}
              receipt={receipt}
              onProcess={() => onProcess(receipt)}
              onDelete={() => onDelete(receipt.id)}
              forceDeleted={deletedIds.has(receipt.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
