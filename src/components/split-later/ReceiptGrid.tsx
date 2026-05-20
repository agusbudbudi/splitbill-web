"use client";

import React, { useRef, useState } from "react";
import { BucketReceipt } from "@/store/useSplitLaterStore";
import { ReceiptCard } from "./ReceiptCard";
import { Camera, Upload, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/ui/EmptyState";

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Format file tidak didukung. Gunakan JPG, PNG, atau WebP.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Ukuran file terlalu besar. Maksimal 10MB.");
      return;
    }

    await onUpload(file);
    // Reset input so same file can be re-selected
    e.target.value = "";
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) await onUpload(file);
  };

  return (
    <div className="space-y-4">
      {/* Upload zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all duration-300 cursor-pointer",
          isDragging
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-primary/20 bg-primary/2 hover:border-primary/40 hover:bg-primary/5",
          isUploading && "opacity-60 pointer-events-none"
        )}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          className="hidden"
          onChange={handleFileChange}
          capture="environment"
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="w-5 h-5 text-primary animate-bounce" />
            </div>
            <p className="text-sm font-bold text-primary">Mengupload struk...</p>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <ImagePlus className="w-6 h-6 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-foreground">Tambah Foto Struk</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Tap untuk foto/upload • Drag & drop juga bisa
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-full text-xs font-bold cursor-pointer active:scale-95 transition-transform">
                <Camera className="w-3.5 h-3.5" />
                Ambil Foto
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-primary/20 text-primary rounded-full text-xs font-bold cursor-pointer active:scale-95 transition-transform">
                <Upload className="w-3.5 h-3.5" />
                Pilih File
              </div>
            </div>
          </>
        )}
      </div>

      {/* Receipt grid */}
      {receipts.length === 0 ? (
        <EmptyState
          icon={Camera}
          message="Belum Ada Struk"
          subtitle="Yuk foto struk pertamamu! Bisa ambil foto langsung atau upload dari galeri."
          className="bg-white/50 rounded-2xl"
        />
      ) : (
        <div className="grid grid-cols-2 gap-3">
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
