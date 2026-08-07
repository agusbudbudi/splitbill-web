"use client";

import React from "react";
import { Archive, ArchiveRestore, Trash2 } from "lucide-react";
import { BottomSheet } from "@/components/ui/BottomSheet";

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
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Opsi Lainnya" showBackButton={false}>
      <div className="space-y-2">
        {/* Archive Action */}
        <button
          onClick={() => {
            onArchive();
            onClose();
          }}
          className="w-full flex items-center gap-4 p-4 rounded-md hover:bg-primary/5 transition-all active:scale-95 cursor-pointer group"
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
          className="w-full flex items-center gap-4 p-4 rounded-md hover:bg-destructive/5 transition-all active:scale-95 cursor-pointer group"
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
    </BottomSheet>
  );
};
