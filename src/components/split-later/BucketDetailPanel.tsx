"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSplitLaterStore, BucketReceipt } from "@/store/useSplitLaterStore";
import { useSplitBillStore } from "@/store/useSplitBillStore";
import { ReceiptGrid } from "@/components/split-later/ReceiptGrid";
import { BucketSettlement } from "@/components/split-later/BucketSettlement";
import { BucketFormBottomSheet } from "@/components/split-later/BucketFormBottomSheet";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { TabsUnderline } from "@/components/ui/TabsUnderline";
import { formatToIDR } from "@/lib/utils";
import { toast } from "sonner";
import {
  ArrowLeft,
  Camera,
  TrendingUp,
  Trash2,
  Pencil,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface BucketDetailPanelProps {
  bucketId: string;
}

type TabId = "receipts" | "settlement";

export function BucketDetailPanel({ bucketId }: BucketDetailPanelProps) {
  const router = useRouter();
  const {
    buckets,
    getBucketReceipts,
    getBucketStats,
    deleteBucket,
    removeReceipt,
    addReceipt,
  } = useSplitLaterStore();
  const {
    setSource,
    setActivityName,
    clearDraftAfterFinalize,
  } = useSplitBillStore();

  const bucket = buckets.find((b) => b.id === bucketId);

  const [activeTab, setActiveTab] = useState<TabId>("receipts");
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deleteReceiptId, setDeleteReceiptId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!bucket) {
    return (
      <div className="w-full max-w-[600px] mx-auto flex flex-col items-center justify-center py-20 text-center">
        <p className="text-muted-foreground font-bold mb-4">
          Split Later tidak ditemukan.
        </p>
        <Link
          href="/member/split-later"
          className="text-primary font-bold text-sm underline"
        >
          Kembali ke Split Later
        </Link>
      </div>
    );
  }

  const receipts = getBucketReceipts(bucketId);
  const stats = getBucketStats(bucketId);
  const totalSpend = receipts
    .filter((r) => r.status === "completed")
    .reduce((sum, r) => sum + (r.totalAmount || 0), 0);

  const tabs: { id: TabId; label: string; icon: typeof Camera; badge?: string }[] = [
    { id: "receipts", label: "Struk", icon: Camera, badge: stats.pending > 0 ? String(stats.pending) : undefined },
    { id: "settlement", label: "Rangkuman", icon: TrendingUp },
  ];

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    const toastId = toast.loading("Mengupload foto struk...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/split-later/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!data.success) throw new Error(data.error || "Upload gagal");

      addReceipt({
        bucketId,
        imageUrl: data.url,
        status: "pending",
      });

      toast.success("Struk berhasil disimpan! 📸", { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "Upload gagal. Coba lagi.", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const handleProcess = (receipt: BucketReceipt) => {
    // 1. Set source so Split Bill knows to redirect back
    setSource(bucketId, receipt.id);

    // 2. Pre-fill activity name with bucket title
    setActivityName(`${bucket.emoji} ${bucket.title}`);

    // 3. Clear the draft, then pass bucket participants via query param so
    // SplitBillPage can init people fresh from the bucket
    clearDraftAfterFinalize();

    const participantsParam = encodeURIComponent(
      JSON.stringify(bucket.participants),
    );

    // Navigate to split bill step 2 (input expenses) with the receipt image pre-loaded
    const imageParam = encodeURIComponent(receipt.imageUrl);
    router.push(
      `/split-bill?step=2&source=split-later&receiptId=${receipt.id}&bucketId=${bucketId}&participants=${participantsParam}&image=${imageParam}`,
    );
  };

  const handleDeleteReceipt = (receiptId: string) => {
    setDeleteReceiptId(receiptId);
  };

  const confirmDeleteReceipt = () => {
    if (deleteReceiptId) {
      removeReceipt(deleteReceiptId);
      toast.success("Struk dihapus.");
      setDeleteReceiptId(null);
    }
  };

  const handleDeleteBucket = () => {
    deleteBucket(bucketId);
    toast.success(`Split Later "${bucket.title}" dihapus.`);
    router.push("/member/split-later");
  };

  return (
    <>
      <div className="w-full max-w-[600px] mx-auto space-y-6">
        {/* Back + Actions */}
        <div className="flex items-center justify-between">
          <Link
            href="/member/split-later"
            className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors group"
          >
            <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </span>
            Kembali
          </Link>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsEditFormOpen(true)}
              className="text-muted-foreground hover:text-primary hover:bg-primary/10 p-2 rounded-full transition-colors cursor-pointer"
            >
              <Pencil className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={() => setIsDeleteConfirmOpen(true)}
              className="text-muted-foreground hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-colors cursor-pointer"
            >
              <Trash2 className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Hero card */}
        <div className="rounded-md bg-primary text-white p-5 space-y-4 shadow-lg shadow-primary/20">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{bucket.emoji}</span>
            <h1 className="text-lg font-black tracking-tight">{bucket.title}</h1>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">
              Total Pengeluaran Trip
            </p>
            <h2 className="text-3xl font-black tracking-tight mt-1">
              {formatToIDR(totalSpend)}
            </h2>
          </div>

          {bucket.participants.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {bucket.participants.slice(0, 5).map((name, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full border-2 border-primary overflow-hidden bg-white shadow-md"
                  >
                    <img
                      src={`https://api.dicebear.com/9.x/personas/png?backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&seed=${encodeURIComponent(name)}&size=64`}
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                {bucket.participants.length > 5 && (
                  <div className="w-7 h-7 rounded-full border-2 border-primary bg-white/20 flex items-center justify-center text-[9px] font-bold text-white">
                    +{bucket.participants.length - 5}
                  </div>
                )}
              </div>
              <span className="text-xs text-white/80 font-medium">
                {bucket.participants.length} Anggota:{" "}
                {bucket.participants.join(", ").substring(0, 35)}
                {bucket.participants.join(", ").length > 35 ? "..." : ""}
              </span>
            </div>
          )}
        </div>

        {/* Stats card */}
        <div className="rounded-md text-card-foreground border border-border/50 shadow-soft bg-white p-4">
          <p className="text-[10px] font-black text-foreground/50 mb-3 px-1 tracking-wider uppercase">
            Status Split Later
          </p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-primary/5 rounded-sm p-3">
              <p className="text-xl font-black text-primary">{stats.total}</p>
              <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider mt-0.5">
                Struk
              </p>
            </div>
            <div className="bg-amber-50 rounded-sm p-3">
              <p className="text-xl font-black text-amber-600">
                {stats.pending}
              </p>
              <p className="text-[9px] text-amber-700/70 font-bold uppercase tracking-wider mt-0.5 flex items-center justify-center gap-1">
                <Clock className="w-2.5 h-2.5" /> Pending
              </p>
            </div>
            <div className="bg-emerald-50 rounded-sm p-3">
              <p className="text-xl font-black text-emerald-600">
                {stats.completed}
              </p>
              <p className="text-[9px] text-emerald-700/70 font-bold uppercase tracking-wider mt-0.5 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5" /> Selesai
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <TabsUnderline
          options={tabs}
          activeId={activeTab}
          onChange={(id) => setActiveTab(id as TabId)}
        />

        {/* Tab content */}
        {activeTab === "receipts" && (
          <ReceiptGrid
            receipts={receipts}
            onProcess={handleProcess}
            onDelete={handleDeleteReceipt}
            onUpload={handleUpload}
            isUploading={isUploading}
          />
        )}
        {activeTab === "settlement" && (
          <BucketSettlement
            receipts={receipts}
            participants={bucket.participants}
            bucket={bucket}
          />
        )}
      </div>

      {/* Edit bucket form */}
      <BucketFormBottomSheet
        isOpen={isEditFormOpen}
        onClose={() => setIsEditFormOpen(false)}
        editBucketId={bucketId}
      />

      {/* Delete bucket confirmation */}
      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDeleteBucket}
        title="Hapus Split Later?"
        description={`Split Later "${bucket.title}" dan semua ${stats.total} struk di dalamnya akan dihapus permanen.`}
        confirmText="Ya, Hapus"
        cancelText="Batal"
        icon={Trash2}
        confirmButtonClassName="bg-red-600 hover:bg-red-700 text-white shadow-red-600/20"
      />

      {/* Delete receipt confirmation */}
      <ConfirmationModal
        isOpen={!!deleteReceiptId}
        onClose={() => setDeleteReceiptId(null)}
        onConfirm={confirmDeleteReceipt}
        title="Hapus Struk?"
        description="Foto struk ini akan dihapus permanen dari Split Later."
        confirmText="Ya, Hapus"
        cancelText="Batal"
        icon={Trash2}
        confirmButtonClassName="bg-red-600 hover:bg-red-700 text-white shadow-red-600/20"
      />
    </>
  );
}
