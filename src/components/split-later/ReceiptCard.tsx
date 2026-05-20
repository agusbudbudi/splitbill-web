"use client";

import React from "react";
import Link from "next/link";
import { BucketReceipt } from "@/store/useSplitLaterStore";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, Trash2, Sparkles } from "lucide-react";
import { formatToIDR } from "@/lib/utils";

interface ReceiptCardProps {
  receipt: BucketReceipt;
  onProcess: () => void;
  onDelete: () => void;
}

export const ReceiptCard = ({ receipt, onProcess, onDelete }: ReceiptCardProps) => {
  const isPending = receipt.status === "pending";

  return (
    <div className="relative group rounded-2xl overflow-hidden bg-white shadow-soft border border-primary/5 hover:shadow-md transition-all duration-300">
      {/* Receipt image */}
      <div className="aspect-[3/4] w-full overflow-hidden bg-muted/30">
        <img
          src={receipt.imageUrl}
          alt={receipt.notes || "Foto struk"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Status badge */}
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

      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-red-400 hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>

      {/* Bottom info */}
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
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-white rounded-xl text-primary text-xs font-black shadow-lg hover:bg-primary hover:text-white active:scale-95 transition-all cursor-pointer"
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
    </div>
  );
};
