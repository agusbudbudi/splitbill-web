"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BucketReceipt } from "@/store/useSplitLaterStore";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, Trash2, Sparkles, ImageOff } from "lucide-react";
import { formatToIDR } from "@/lib/utils";

interface ReceiptCardProps {
  receipt: BucketReceipt;
  onProcess: () => void;
  onDelete: () => void;
  /** Verified server-side (bypasses browser image cache) — the file no longer exists in storage. */
  forceDeleted?: boolean;
}

export const ReceiptCard = ({ receipt, onProcess, onDelete, forceDeleted = false }: ReceiptCardProps) => {
  const isPending = receipt.status === "pending";
  const [imgErrored, setImgErrored] = useState(false);
  const isDeleted = forceDeleted || imgErrored;

  return (
    <div className="relative group rounded-md overflow-hidden bg-white shadow-soft border border-primary/5 transition-all duration-300">
      {/* Receipt image */}
      <div className="aspect-[3/4] w-full overflow-hidden bg-muted/30">
        {isDeleted ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-center px-3 bg-muted/30 rounded-md border border-dashed border-muted-foreground/30">
            <ImageOff className="w-6 h-6 text-muted-foreground" />
            <p className="text-[11px] font-bold text-foreground">Struk sudah dihapus</p>
            <p className="text-[9px] text-muted-foreground leading-tight">
              Struk hanya tersedia selama 7 hari sejak diunggah.
            </p>
          </div>
        ) : (
          <>
            <img
              src={receipt.imageUrl}
              alt={receipt.notes || "Foto struk"}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              onError={() => setImgErrored(true)}
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </>
        )}
      </div>

      {/* Status badge */}
      {!isDeleted && (
        <div className="absolute top-2 left-2">
          <div
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-wider backdrop-blur-sm shadow-sm",
              isPending
                ? "bg-amber-500/90 text-white"
                : "bg-emerald-500/90 text-white",
            )}
          >
            {isPending ? (
              <Clock className="w-2.5 h-2.5" />
            ) : (
              <CheckCircle2 className="w-2.5 h-2.5" />
            )}
            {isPending ? "Pending" : "Done"}
          </div>
        </div>
      )}

      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className={cn(
          "absolute top-2 right-2 w-7 h-7 rounded-full backdrop-blur-sm flex items-center justify-center transition-all cursor-pointer",
          isDeleted
            ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
            : "bg-black/40 text-white/70 hover:text-red-400 hover:bg-black/60",
        )}
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>

      {/* Bottom info */}
      {!isDeleted && (
        <div className="absolute bottom-0 left-0 right-0 p-3">
          {receipt.merchant && (
            <p className="text-white text-[10px] font-bold truncate mb-1">{receipt.merchant}</p>
          )}
          {receipt.totalAmount && (
            <p className="text-white text-xs font-black mb-2">{formatToIDR(receipt.totalAmount)}</p>
          )}
          {receipt.notes && !receipt.merchant && (
            <p className="text-white/80 text-[10px] truncate mb-2">{receipt.notes}</p>
          )}

          {/* Process button */}
          {isPending && (
            <button
              onClick={onProcess}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-white rounded-sm text-primary text-xs font-black shadow-lg hover:bg-primary hover:text-white active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Proses Struk
            </button>
          )}

          {/* View Details button for completed receipts */}
          {!isPending && receipt.splitBillId && (
            <Link
              href={`/history/split-bill/${receipt.splitBillId}`}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Lihat Detail Split
            </Link>
          )}
        </div>
      )}
    </div>
  );
};
