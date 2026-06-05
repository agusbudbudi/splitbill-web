"use client";

import React, { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import {
  Sparkles,
  Camera,
  X,
  CheckCircle2,
  Info,
  ImagePlus,
} from "lucide-react";
import { useSplitBillStore } from "@/store/useSplitBillStore";
import { scanReceipt, ReceiptScanResult, ReceiptItem } from "@/lib/AIService";
import { LoadingModal } from "@/components/ui/LoadingModal";
import { useAuthStore } from "@/lib/stores/authStore";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
// Removed unused FeatureBanner import

import { AIScanQuotaBanner } from "@/components/ui/AIScanQuotaBanner";
import { trackSplitBill, trackSubscription } from "@/lib/gtag";

const AIScanBenefits = () => (
  <div className="flex gap-3 items-start p-4 bg-primary/5 rounded-2xl border border-primary/10 transition-all hover:bg-primary/[0.07]">
    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0">
      <Image
        src="/img/icon-ai-info.png"
        alt="AI Scan"
        width={40}
        height={40}
        className="w-full h-full object-contain rounded-full"
      />
    </div>
    <div>
      <p className="text-sm font-bold text-primary">Kelebihan Scan AI</p>
      <p className="text-[11px] leading-relaxed mt-0.5 text-muted-foreground font-medium">
        Otomatis deteksi item, harga, dan pajak tanpa perlu ketik manual
        satu-satu. Hemat waktu & tenaga! ⚡
      </p>
    </div>
  </div>
);

export const AIScanForm = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ReceiptScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [imageSource, setImageSource] = useState<"camera" | "gallery" | null>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const scanStartTimeRef = useRef<number | null>(null);

  const { addExpense, setActivityName, addAdditionalExpense, pendingCapturedImage, clearPendingCapturedImage } =
    useSplitBillStore();
  const { isAuthenticated, user, getCurrentUser, isInitialized } =
    useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);

    // Pre-fill from footer camera capture (store takes priority over URL param).
    // IMPORTANT: only clear from the store if already authenticated, so the image
    // survives a login/register redirect and can be re-read on the return mount.
    const storedImage = useSplitBillStore.getState().pendingCapturedImage;
    if (storedImage) {
      setImage(storedImage);
      setImageSource("camera");
      if (isAuthenticated) {
        // Safe to clear — user is logged in and will see the scan UI immediately.
        clearPendingCapturedImage();
      }
      // If NOT authenticated we intentionally keep the value in the store so it
      // survives the login redirect and is picked up by the effect below.
      return;
    }

    // Fallback: pre-fill from URL search param
    const preloadedImage = searchParams.get("image");
    if (preloadedImage) {
      setImage(decodeURIComponent(preloadedImage));
      setImageSource("gallery");
    }
  }, [searchParams]);

  // When the user becomes authenticated (either on initial load or after returning
  // from a login/register redirect), check whether there is still a pending
  // captured image waiting in the store and pre-fill it now that we can show the
  // scan UI.  This also handles the case where auth resolves after the mount
  // effect above has already run.
  React.useEffect(() => {
    if (isAuthenticated) {
      const storedImage = useSplitBillStore.getState().pendingCapturedImage;
      if (storedImage) {
        setImage(storedImage);
        setImageSource("camera");
        clearPendingCapturedImage();
      }
    }
  }, [isAuthenticated]);

  // Refresh user data on mount to ensure quota is up to date
  React.useEffect(() => {
    if (isAuthenticated) {
      getCurrentUser();
    }
  }, [isAuthenticated, getCurrentUser]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setScanResult(null);
        setError(null);
        setRetryCount(0);
      };
      reader.readAsDataURL(file);
    }
    // Reset input value so the same file can be re-selected
    e.target.value = "";
  };

  const handleCameraCapture = useCallback(() => {
    setImageSource("camera");
    trackSplitBill.selectImage("camera");
    cameraInputRef.current?.click();
  }, []);

  const handleGalleryUpload = useCallback(() => {
    setImageSource("gallery");
    trackSplitBill.selectImage("gallery");
    fileInputRef.current?.click();
  }, []);

  const handleScan = async () => {
    if (!image) return;
    trackSplitBill.aiScan("start", retryCount, imageSource || undefined);
    setIsScanning(true);
    setError(null);
    scanStartTimeRef.current = Date.now();

    try {
      const result = await scanReceipt(image);
      const duration = Date.now() - (scanStartTimeRef.current || Date.now());
      setScanResult(result);

      // Show success toast
      toast.success("Scan Berhasil! ✨", {
        description: "Data belanja kamu sudah terbaca otomatis.",
        duration: 2000,
      });

      trackSplitBill.aiScan(
        "success",
        retryCount,
        imageSource || undefined,
        duration,
        result.items?.length || 0,
      );
      setRetryCount(0);

      // Refresh user data to update remaining scan quota
      await getCurrentUser();
    } catch (err: any) {
      console.error("Scan failed", err);
      const duration = Date.now() - (scanStartTimeRef.current || Date.now());
      const newRetryCount = retryCount + 1;
      setRetryCount(newRetryCount);
      setError(
        "Waduh, AI-nya lagi sibuk nih. Kamu bisa lanjut ngopi dulu atau ketik manual aja ya! ☕️",
      );
      trackSplitBill.aiScan(
        "error",
        newRetryCount,
        imageSource || undefined,
        duration,
      );
    } finally {
      setIsScanning(false);
      scanStartTimeRef.current = null;
    }
  };

  const importItems = () => {
    if (!scanResult) return;

    // 1. Map Merchant Name
    if (scanResult.merchant_name) {
      setActivityName(scanResult.merchant_name);
    }

    // 2. Map Items
    if (scanResult.items && Array.isArray(scanResult.items)) {
      scanResult.items.forEach((item: ReceiptItem) => {
        addExpense({
          item: item.name,
          amount: item.price * (item.quantity || 1),
          who: [],
          paidBy: "",
        });
      });
    }

    // 3. Map Additional Expenses (Automated Proportionally)
    const addtionalFields = [
      { key: "tax", label: "Tax" },
      { key: "service_charge", label: "Service Charge" },
      { key: "discount", label: "Discount" },
    ];

    addtionalFields.forEach(({ key, label }) => {
      const val = scanResult[key];
      if (val !== null && val !== undefined && val !== 0) {
        addAdditionalExpense({
          name: label,
          amount: key === "discount" ? -Math.abs(val) : val,
          who: [],
          paidBy: "",
          splitType: "proportionally",
        });
      }
    });

    // Reset
    setImage(null);
    setScanResult(null);
    // Show success toast
    toast.success("Berhasil import struk! 🧾✨", {
      description: "Data belanja kamu sudah masuk ke daftar.",
      duration: 3000,
    });

    trackSplitBill.aiImport(
      scanResult.items?.length || 0,
      scanResult.merchant_name || undefined,
    );
  };

  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amt);
  };

  // Show premium skeleton while initializing or before mounting (to avoid hydration mismatch)
  if (!isMounted || !isInitialized) {
    return (
      <div className="space-y-4 py-2 animate-pulse">
        <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-primary/20 via-primary/10 to-violet-600/10 border border-primary/5">
          <div className="relative z-10 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-primary/5 backdrop-blur-md flex items-center justify-center border border-primary/10">
              <div className="w-8 h-8 rounded-lg bg-primary/20" />
            </div>
            <div className="space-y-2 w-full flex flex-col items-center">
              <div className="h-6 w-32 bg-primary/20 rounded-full" />
              <div className="h-3 w-48 bg-primary/10 rounded-full" />
            </div>
            <div className="w-full max-w-[200px] h-11 bg-primary/10 rounded-xl mt-2" />
          </div>
        </div>
      </div>
    );
  }

  // Login Barrier for AI Scan
  if (!isAuthenticated) {
    return (
      <div className="space-y-4 py-2 animate-in fade-in duration-500 relative">
        <div className="relative p-[1.5px] rounded-3xl bg-gradient-to-br from-violet-400 via-pink-400 to-primary/60 shadow-lg shadow-primary/5 overflow-hidden">
          <div className="relative overflow-hidden bg-white rounded-[calc(1.5rem-1.5px)] p-6">
            {/* Subtle background glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-violet-500/5 rounded-full blur-2xl -ml-12 -mb-12 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10 shadow-inner">
                <Image
                  src="/img/ai-icon.png"
                  alt="AI Icon"
                  width={32}
                  height={32}
                  className="w-8 h-8 object-contain"
                />
              </div>

              <div className="space-y-1 max-w-[340px]">
                <h3 className="text-xl font-bold text-foreground">
                  Cukup Login buat Scan Struk
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  Gak perlu ribet ketik manual! Cukup login dan nikmati fitur{" "}
                  <span className="text-primary font-bold">
                    Scan Struk Otomatis
                  </span>{" "}
                  secara gratis. ✨
                </p>
              </div>

              <Button
                onClick={() => {
                  trackSubscription.premiumFeatureClick(
                    "ai_scan_login_barrier",
                  );
                  trackSubscription.initiateCheckout("login_barrier");
                  const currentQuery = typeof window !== 'undefined' ? window.location.search : '';
                  router.push(
                    `/register?redirect=${encodeURIComponent(`/split-bill${currentQuery}`)}`,
                  );
                }}
                className="w-full max-w-[200px] h-10 bg-primary hover:bg-primary/90 text-white font-bold rounded-md shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-1 text-sm"
              >
                Login Sekarang
              </Button>
            </div>
          </div>
        </div>
        <AIScanBenefits />
      </div>
    );
  }

  // Quota Exhausted Barrier - Only if strictly 0
  const freeScanCount = user?.freeScanCount;
  if (
    isAuthenticated &&
    freeScanCount !== undefined &&
    freeScanCount <= 0 &&
    user?.subscriptionStatus !== "active" &&
    !scanResult
  ) {
    return (
      <div className="space-y-4 py-2 animate-in fade-in duration-500 relative">
        <div className="relative p-[1.5px] rounded-3xl bg-gradient-to-br from-violet-400 via-pink-400 to-primary/60 shadow-lg shadow-primary/5 overflow-hidden">
          <div className="relative overflow-hidden bg-white rounded-[calc(1.5rem-1.5px)] p-6">
            {/* Subtle background glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-violet-500/5 rounded-full blur-2xl -ml-12 -mb-12 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10 shadow-inner">
                <Image
                  src="/img/ai-icon.png"
                  alt="AI Icon"
                  width={32}
                  height={32}
                  className="w-8 h-8 object-contain"
                />
              </div>

              <div className="space-y-1 max-w-[340px]">
                <h3 className="text-xl font-bold tracking-tight text-foreground">
                  Scan Habis! 🚀
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  Kuota gratis kamu sudah habis. Upgrade ke{" "}
                  <span className="text-primary font-bold">Premium</span> untuk{" "}
                  <span className="text-foreground font-bold">
                    Scan Tanpa Batas
                  </span>{" "}
                  dan fitur eksklusif lainnya!
                </p>
              </div>

              <Button
                onClick={() => {
                  trackSubscription.premiumFeatureClick(
                    "ai_scan_quota_barrier",
                  );
                  trackSubscription.initiateCheckout("quota_barrier");
                  router.push("/subscription");
                }}
                className="w-full max-w-[200px] h-10 bg-primary hover:bg-primary/90 text-white font-bold rounded-md shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-1 text-sm"
              >
                Upgrade ke Premium
              </Button>
            </div>
          </div>
        </div>
        <AIScanBenefits />
      </div>
    );
  }

  return (
    <div className="space-y-4 py-2 animate-in fade-in duration-500">
      {/* Quota Info Banner - Premium AI Theme */}
      {!scanResult &&
        freeScanCount !== undefined &&
        (freeScanCount > 0 || user?.subscriptionStatus === "active") && (
          <AIScanQuotaBanner
            freeScanCount={freeScanCount}
            isSubscribed={user?.subscriptionStatus === "active"}
          />
        )}
      {!image ? (
        <>
          {/* Camera capture area — tap to open camera directly */}
          <div
            onClick={handleCameraCapture}
            className="border-2 border-dashed border-primary/20 rounded-2xl py-8 flex flex-col items-center justify-center gap-4 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer group"
          >
            <div className="w-16 h-16 rounded-full bg-white shadow-soft flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <Camera className="w-8 h-8" />
            </div>
            <div className="text-center">
              <p className="font-bold text-sm text-foreground">
                Foto Struk Sekarang
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">
                Tap untuk buka kamera
              </p>
            </div>
          </div>

          {/* Upload from gallery — secondary small button */}
          <button
            onClick={handleGalleryUpload}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md border border-primary/15 bg-transparent hover:bg-primary/5 transition-colors active:scale-[0.98] cursor-pointer"
          >
            <ImagePlus className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs font-semibold text-muted-foreground">
              Upload dari Galeri
            </span>
          </button>

          {/* Hidden inputs */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <input
            type="file"
            ref={cameraInputRef}
            onChange={handleFileChange}
            accept="image/*"
            capture="environment"
            className="hidden"
          />
        </>
      ) : (
        <div className="space-y-4">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-primary/20 bg-muted">
            <Image
              src={image}
              alt="Receipt Preview"
              fill
              className="object-contain"
              unoptimized={image.startsWith("data:")}
            />
            <button
              onClick={() => {
                trackSplitBill.removeImage();
                setImage(null);
              }}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-md cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {!scanResult ? (
            <div className="space-y-3">
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-[10px] font-bold text-center">
                  {error}
                </div>
              )}
              <Button
                onClick={handleScan}
                disabled={isScanning}
                className="w-full h-12 text-base font-bold shadow-glow"
              >
                {isScanning ? "Processing..." : "Mulai Scan AI"}
                <Sparkles className="w-4 h-4 ml-2" />
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-emerald-500 px-1">
                <CheckCircle2 className="w-4 h-4" />
                <p className="text-xs font-bold uppercase">Scan Berhasil! ✨</p>
              </div>

              <div className="bg-muted/30 p-4 rounded-lg border border-dashed border-primary/20 space-y-4">
                {/* Merchant Name Preview */}
                {scanResult.merchant_name && (
                  <div className="pb-2 border-b border-primary/10">
                    <p className="text-[9px] uppercase font-black text-primary/40 leading-none mb-1">
                      Merchant
                    </p>
                    <p className="text-sm font-black text-foreground">
                      {scanResult.merchant_name}
                    </p>
                  </div>
                )}

                {/* Items Preview */}
                <div className="space-y-2">
                  <p className="text-[9px] uppercase font-black text-muted-foreground leading-none mb-1">
                    Items ({scanResult.items?.length || 0})
                  </p>
                  {scanResult.items?.map((item: ReceiptItem, idx: number) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center text-xs"
                    >
                      <div className="flex items-center gap-1.5 flex-1 min-w-0 pr-4">
                        <span className="text-muted-foreground font-bold shrink-0">
                          {item.quantity}x
                        </span>
                        <span className="font-medium truncate leading-none">
                          {item.name}
                        </span>
                      </div>
                      <span className="font-black text-primary shrink-0">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Summary / Tax Preview */}
                {(scanResult.tax ||
                  scanResult.service_charge ||
                  scanResult.discount) && (
                    <div className="pt-2 border-t border-primary/10 space-y-1.5">
                      {scanResult.tax && (
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-muted-foreground font-bold">
                            Tax (PPN)
                          </span>
                          <span className="font-bold text-foreground">
                            {formatCurrency(scanResult.tax)}
                          </span>
                        </div>
                      )}
                      {scanResult.service_charge && (
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-muted-foreground font-bold">
                            Service Charge
                          </span>
                          <span className="font-bold text-foreground">
                            {formatCurrency(scanResult.service_charge)}
                          </span>
                        </div>
                      )}
                      {scanResult.discount && (
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-destructive font-bold">
                            Discount
                          </span>
                          <span className="font-bold text-destructive">
                            -{formatCurrency(scanResult.discount)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
              </div>

              {/* Info Banner: Editable After Import - V2 Design Style */}
              <div className="flex gap-3 items-start p-4 bg-secondary/30 dark:bg-secondary/10 rounded-2xl border border-secondary/20">
                <div className="p-2 bg-white rounded-xl border border-primary/10 shrink-0 flex items-center justify-center">
                  <Info className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black uppercase text-secondary-foreground/60 tracking-wider leading-none mb-1.5">
                    💡 Info Penting
                  </p>
                  <p className="text-xs leading-relaxed text-secondary-foreground font-medium">
                    Jangan khawatir! Semua data bisa diedit setelah di-import
                    jika ada yang belum sesuai.
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    trackSplitBill.aiRetry();
                    setImage(null);
                    setImageSource(null);
                  }}
                  className="flex-1"
                >
                  Ulangi
                </Button>
                <Button onClick={importItems} className="flex-[2] font-bold">
                  Import ke Daftar
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Benefits info */}
      {!scanResult && <AIScanBenefits />}
      <LoadingModal isOpen={isScanning} />
    </div>
  );
};
