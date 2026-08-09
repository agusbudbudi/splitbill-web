"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Camera, FolderOpen } from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SuccessSection } from "@/components/ui/SuccessSection";
import { ReceiptImagePicker } from "@/components/splitbill/ReceiptImagePicker";
import { useSplitLaterStore } from "@/store/useSplitLaterStore";

export default function QuickCaptureClientPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const step = searchParams.get("step") === "success" ? "success" : "upload";
  const bucketId = searchParams.get("bucketId");

  const { createBucket, addReceipt, buckets, receipts, getBucketStats } =
    useSplitLaterStore();
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const uploadCancelledRef = useRef(false);

  useEffect(() => {
    if (step === "success" && !bucketId) {
      router.replace("/split-later/quick");
    }
  }, [step, bucketId, router]);

  // Clear the previous upload's preview whenever we land back on the upload step
  // (e.g. via "Foto Struk Lain") — this component stays mounted across that nav.
  useEffect(() => {
    if (step === "upload") {
      uploadCancelledRef.current = true;
      setPreviewUrl(null);
      setIsUploading(false);
    }
  }, [step]);

  // Revoke the previous object URL whenever it's replaced or the page unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

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

    uploadCancelledRef.current = false;
    setPreviewUrl(URL.createObjectURL(file));
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/split-later/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Upload gagal");
      if (uploadCancelledRef.current) return;

      let activeBucketId = bucketId;
      if (!activeBucketId) {
        const pendingBucket = buckets.find((b) => {
          const stats = getBucketStats(b.id);
          return stats.total === 0 || stats.pending > 0;
        });
        activeBucketId = pendingBucket
          ? pendingBucket.id
          : createBucket({
              title: `Struk ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short" })}`,
              emoji: "📦",
              bucketType: "other",
              participants: [],
            });
      }

      addReceipt({ bucketId: activeBucketId, imageUrl: data.url, status: "pending" });
      toast.success("Struk kesimpen! 📸");
      router.replace(`/split-later/quick?step=success&bucketId=${activeBucketId}`);
    } catch (err: any) {
      if (!uploadCancelledRef.current) {
        toast.error(err.message || "Upload gagal, coba lagi ya.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePreview = () => {
    uploadCancelledRef.current = true;
    setPreviewUrl(null);
    setIsUploading(false);
  };

  if (step === "success" && bucketId) {
    const bucket = buckets.find((b) => b.id === bucketId);
    const latestReceipt = receipts.find((r) => r.bucketId === bucketId);
    const stats = getBucketStats(bucketId);

    return (
      <div className="min-h-screen bg-background flex flex-col items-center relative">
        <Header title="Struk Kesimpen" showBackButton onBack={() => router.push(`/split-later/${bucketId}`)} />
        <div className="w-full max-w-[600px] flex-1 flex flex-col justify-start p-4">
          <SuccessSection
            title="Struk Kesimpen!"
            illustration="/img/success-upload-split-later.png"
            illustrationAlt="Struk berhasil disimpan ke Split Later"
            subtitle={
              bucket
                ? `Masuk ke "${bucket.title}", lanjut ngopi dulu gapapa ☕, balik lagi kapan aja buat lanjutin itungannya.`
                : "Lanjut ngopi dulu gapapa ☕, struknya udah aman, balik lagi ke Split Later kapan aja buat lanjutin itungannya."
            }
            actions={[]}
          >
            {bucket && (
              <Card className="shadow-soft w-full">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    {latestReceipt ? (
                      <div className="w-14 h-14 rounded-sm overflow-hidden border border-primary/10 shadow-sm shrink-0 bg-white">
                        <img
                          src={latestReceipt.imageUrl}
                          alt="Struk terakhir"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-sm bg-primary/5 flex items-center justify-center text-2xl shrink-0 border border-primary/10">
                        {bucket.emoji}
                      </div>
                    )}
                    <div className="min-w-0 flex-1 text-left">
                      <p className="font-bold text-sm text-foreground truncate">
                        {bucket.emoji} {bucket.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground font-medium">
                        {stats.total} struk kesimpen
                        {stats.pending > 0 ? ` • ${stats.pending} belum diproses` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 min-w-0 h-12 px-3 rounded-md font-bold"
                      onClick={() => router.push(`/split-later/${bucketId}`)}
                    >
                      <FolderOpen className="w-4 h-4 mr-1.5 shrink-0" />
                      <span className="truncate">Lihat Bucket</span>
                    </Button>
                    <Button
                      variant="default"
                      className="flex-1 min-w-0 h-12 px-3 rounded-md font-bold shadow-lg shadow-primary/20"
                      onClick={() =>
                        router.replace(`/split-later/quick?step=upload&bucketId=${bucketId}`)
                      }
                    >
                      <Camera className="w-4 h-4 mr-1.5 shrink-0" />
                      <span className="truncate">Foto Struk Lain</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </SuccessSection>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center relative">
      <Header
        title={bucketId ? "Foto Struk Lain" : "Foto Struk Pertama"}
        showBackButton
        onBack={() =>
          bucketId ? router.push(`/split-later/${bucketId}`) : router.back()
        }
      />

      <div className="w-full max-w-[600px] flex-1 px-4 pt-6 pb-10 space-y-6">
        <div className="flex flex-col items-start text-left gap-1">
          <h2 className="text-lg font-bold text-foreground">Spill Struk Lu! 📸</h2>
          <p className="text-muted-foreground text-xs max-w-[360px]">
            Foto atau upload struk, langsung kesimpen ke Split Later
          </p>
        </div>

        <Card className="shadow-soft">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-2 px-1">
              <Camera className="w-4 h-4 text-primary" />
              <label className="text-sm font-bold text-foreground">Struk Belanja</label>
            </div>

            <ReceiptImagePicker
              image={previewUrl}
              onFileSelect={(file) => handleFileSelect(file)}
              onRemove={handleRemovePreview}
              isLoading={isUploading}
              loadingText="Mengupload struk..."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
