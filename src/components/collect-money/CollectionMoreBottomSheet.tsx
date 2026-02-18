"use client";

import React from "react";
import { Archive, ArchiveRestore, Trash2, X } from "lucide-react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface CollectionMoreBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onArchive: () => void;
  onDelete: () => void;
  isArchived: boolean;
}

export const CollectionMoreBottomSheet = ({
  isOpen,
  onClose,
  onArchive,
  onDelete,
  isArchived,
}: CollectionMoreBottomSheetProps) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex justify-center pointer-events-auto">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Sheet Content */}
      <div
        className={cn(
          "absolute bottom-0 w-full max-w-[600px] bg-white rounded-t-[32px] shadow-2xl overflow-hidden flex flex-col pb-10",
          "animate-in slide-in-from-bottom-full duration-300 ease-out",
        )}
      >
        {/* Drag handle */}
        <div
          className="w-full flex justify-center pt-2 pb-2 cursor-pointer"
          onClick={onClose}
        >
          <div className="w-12 h-1.5 rounded-full bg-muted/40" />
        </div>

        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Opsi Lainnya</h2>
            <button
              onClick={onClose}
              className="p-2 -mr-2 text-muted-foreground hover:text-foreground hover:bg-muted/10 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2">
            {/* Archive Action */}
            <button
              onClick={() => {
                onArchive();
                onClose();
              }}
              className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-primary/5 transition-all active:scale-95 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                {isArchived ? (
                  <ArchiveRestore className="w-5 h-5 text-primary" />
                ) : (
                  <Archive className="w-5 h-5 text-primary" />
                )}
              </div>
              <div className="flex-1 text-left">
                <p className="font-bold text-sm text-foreground">
                  {isArchived ? "Buka dari Arsip" : "Arsipkan Patungan"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isArchived
                    ? "Pindahkan kembali ke daftar aktif"
                    : "Pindahkan ke tab Selesai agar rapi"}
                </p>
              </div>
            </button>

            {/* Delete Action */}
            <button
              onClick={() => {
                onDelete();
                onClose();
              }}
              className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-destructive/5 transition-all active:scale-95 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-destructive/5 flex items-center justify-center group-hover:bg-destructive/10 transition-colors">
                <Trash2 className="w-5 h-5 text-destructive" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-bold text-sm text-destructive">
                  Hapus Patungan
                </p>
                <p className="text-xs text-muted-foreground">
                  Data yang dihapus tidak bisa dikembalikan
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};
