"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { useSplitLaterStore, BucketReceipt } from "@/store/useSplitLaterStore";
import { useSplitBillStore } from "@/store/useSplitBillStore";
import { ReceiptGrid } from "@/components/split-later/ReceiptGrid";
import { BucketSettlement } from "@/components/split-later/BucketSettlement";
import { BucketFormBottomSheet } from "@/components/split-later/BucketFormBottomSheet";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { cn, formatToIDR } from "@/lib/utils";
import { toast } from "sonner";
import {
  Camera,
  TrendingUp,
  Users,
  Trash2,
  Pencil,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface BucketDetailClientPageProps {
  bucketId: string;
}

type TabId = "receipts" | "settlement";

const TABS: { id: TabId; label: string; icon: typeof Camera }[] = [
  { id: "receipts", label: "Struk", icon: Camera },
  { id: "settlement", label: "Rangkuman", icon: TrendingUp },
];

export default function BucketDetailClientPage({
  bucketId,
}: BucketDetailClientPageProps) {
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
    people,
    addPerson,
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
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-muted-foreground font-bold">
          Split Later tidak ditemukan.
        </p>
        <button
          onClick={() => router.push("/split-later")}
          className="mt-4 text-primary font-bold text-sm underline cursor-pointer"
        >
          Kembali ke Split Later
        </button>
      </div>
    );
  }

  const receipts = getBucketReceipts(bucketId);
  const stats = getBucketStats(bucketId);
  const totalSpend = receipts
    .filter((r) => r.status === "completed")
    .reduce((sum, r) => sum + (r.totalAmount || 0), 0);

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

    // 3. Auto-populate participants from bucket into Split Bill
    // Clear existing people first by adding new ones (addPerson is idempotent)
    clearDraftAfterFinalize();

    // We need to also clear people — use the store's addPerson after resetting
    // Since clearDraftAfterFinalize doesn't reset people, we reload the page with a query param
    // that tells SplitBillPage to init people from bucket
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
    router.push("/split-later");
  };

  return (
    <>
      <div className="min-h-screen bg-background flex flex-col items-center relative">
        {/* Primary BG behind header + hero */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] bg-primary z-0 rounded-b-[28px] h-[270px]" />

        <div className="w-full max-w-[600px] min-h-screen flex flex-col relative z-10">
          {/* Header */}
          <Header
            title={`${bucket.emoji} ${bucket.title}`}
            showBackButton
            onBack={() => router.push("/split-later")}
            transparent
            rightContent={
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsEditFormOpen(true)}
                  className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors cursor-pointer"
                >
                  <Pencil className="w-4.5 h-4.5" />
                </button>
                <button
                  onClick={() => setIsDeleteConfirmOpen(true)}
                  className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>
            }
          />

          {/* Hero total spend & participants inside blue BG */}
          <div className="px-6 pt-2 pb-6 text-white">
            <div className="mb-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                Total Pengeluaran Trip
              </p>
              <h2 className="text-3xl font-black tracking-tight mt-1">
                {formatToIDR(totalSpend)}
              </h2>
            </div>

            {/* Participants */}
            {bucket.participants.length > 0 && (
              <div className="flex items-center gap-2 mt-4">
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

          {/* Hero stats Card - White card below blue BG */}
          <div className="px-4 -mt-2 mb-4">
            <div className="rounded-2xl backdrop-blur-xs text-card-foreground border-none shadow-md shadow-primary/5 bg-white relative overflow-hidden p-4">
              <p className="text-[10px] font-black text-foreground/50 mb-3 px-1 tracking-wider uppercase">
                Status Split Later
              </p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-primary/5 rounded-sm p-3">
                  <p className="text-xl font-black text-primary">
                    {stats.total}
                  </p>
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
          </div>

          {/* Tab bar */}
          <div className="flex bg-background/80 backdrop-blur-sm border-b border-primary/10 px-4 sticky top-0 z-20">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-bold transition-all cursor-pointer border-b-2",
                  activeTab === tab.id
                    ? "text-primary border-primary"
                    : "text-muted-foreground border-transparent hover:text-foreground",
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.id === "receipts" && stats.pending > 0 && (
                  <span className="bg-amber-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                    {stats.pending}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 p-4 pb-10">
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
        </div>
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
