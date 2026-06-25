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
  History,
  Gift,
  ShieldCheck,
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
import { AuthModal } from "@/components/auth/AuthModal";

import { AIScanBenefits } from "@/components/ui/AIScanBenefits";
import { GUEST_LIMIT, getGuestScanQuota, incrementGuestScanCount } from "@/lib/utils/guestQuota";

export const AIScanForm = ({ onLoginClick }: { onLoginClick?: () => void }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ReceiptScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [imageSource, setImageSource] = useState<"camera" | "gallery" | null>(
    null,
  );
  const [showImportAuthModal, setShowImportAuthModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const scanStartTimeRef = useRef<number | null>(null);

  const { addExpense, setActivityName, addAdditionalExpense, pendingCapturedImage, clearPendingCapturedImage, addScannedReceiptImage } =
    useSplitBillStore();
  const { isAuthenticated, user, getCurrentUser, isInitialized } =
    useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = React.useState(false);
  const [guestRemainingScans, setGuestRemainingScans] = useState<number>(GUEST_LIMIT);

  React.useEffect(() => {
    if (isMounted && !isAuthenticated) {
      const quota = getGuestScanQuota();
      setGuestRemainingScans(quota.remaining);
    }
  }, [isMounted, isAuthenticated]);

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

      // Check if we have a pending scan result waiting in localStorage from guest session
      const pendingScan = localStorage.getItem("pending_ai_scan_result");
      if (pendingScan) {
        try {
          const parsed = JSON.parse(pendingScan);
          // Set scanResult and automatically run import
          setScanResult(parsed.result);
          if (parsed.image) {
            setImage(parsed.image);
          }
          localStorage.removeItem("pending_ai_scan_result");

          // Delayed import to ensure store and DOM are fully synchronized
          setTimeout(() => {
            importItemsDirectly(parsed.result, parsed.image);
          }, 100);
        } catch (e) {
          console.error("Failed to parse pending scan result:", e);
        }
      }
    }
  }, [isAuthenticated]);

  // Helper function to run import directly without relying on state update timing
  const importItemsDirectly = (result: ReceiptScanResult, imgStr: string | null) => {
    if (!result) return;
    if (imgStr) {
      addScannedReceiptImage(imgStr);
    }
    if (result.merchant_name) {
      setActivityName(result.merchant_name);
    }
    if (result.items && Array.isArray(result.items)) {
      result.items.forEach((item: ReceiptItem) => {
        addExpense({
          item: item.name,
          amount: item.price * (item.quantity || 1),
          who: [],
          paidBy: "",
        });
      });
    }
    const addtionalFields = [
      { key: "tax", label: "Tax" },
      { key: "service_charge", label: "Service Charge" },
      { key: "discount", label: "Discount" },
    ];
    addtionalFields.forEach(({ key, label }) => {
      const val = result[key];
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

    setImage(null);
    setScanResult(null);
    toast.success("Berhasil import struk! 🧾✨", {
      description: "Data belanja kamu sudah masuk ke daftar.",
      duration: 3000,
    });
    setTimeout(() => {
      const element = document.getElementById("expense-list-section");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);

    trackSplitBill.aiImport(
      result.items?.length || 0,
      result.merchant_name || undefined,
    );
  };

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

    if (!isAuthenticated) {
      const quota = getGuestScanQuota();
      if (!quota.allowed) {
        toast.error("Batas scan gratis untuk tamu hari ini sudah habis.");
        if (onLoginClick) {
          onLoginClick();
        } else {
          const currentQuery = typeof window !== 'undefined' ? window.location.search : '';
          router.push(
            `/register?redirect=${encodeURIComponent(`/split-bill${currentQuery}`)}`,
          );
        }
        return;
      }
    }

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

      if (!isAuthenticated) {
        incrementGuestScanCount();
        const updatedQuota = getGuestScanQuota();
        setGuestRemainingScans(updatedQuota.remaining);
      } else {
        // Refresh user data to update remaining scan quota
        await getCurrentUser();
      }
    } catch (err: any) {
      console.error("Scan failed", err);
      const duration = Date.now() - (scanStartTimeRef.current || Date.now());
      const newRetryCount = retryCount + 1;
      setRetryCount(newRetryCount);
      if (err.status === 429) {
        setError(
          "Yah, limit scan gratis abis! Guest cuma dapet 1x scan. Daftar dulu yuk biar bisa scan lagi! 🚀"
        );
      } else {
        setError(
          "Waduh, AI Billy lagi sibuk nih. Coba lagi nanti, sambil ngopi, atau lanjut ketik manual aja ya! ☕"
        );
      }
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

    if (image) {
      addScannedReceiptImage(image);
    }

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

    // Auto scroll to Expense List section
    setTimeout(() => {
      const element = document.getElementById("expense-list-section");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);

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

  // Guest Quota Exhausted Barrier - Prompt Login / Register
  if (!isAuthenticated && guestRemainingScans <= 0 && !scanResult) {
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
                  Scan Gratis Habis! 🚀
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  Batas scan gratis untuk kamu hari ini sudah habis. Yuk daftar sekarang (gratis!) biar bisa lanjut scan! ✨
                </p>
              </div>

              <Button
                onClick={() => {
                  trackSubscription.premiumFeatureClick(
                    "ai_scan_guest_quota_barrier",
                  );
                  trackSubscription.initiateCheckout("guest_quota_barrier");
                  if (onLoginClick) {
                    onLoginClick();
                  } else {
                    const currentQuery = typeof window !== 'undefined' ? window.location.search : '';
                    router.push(
                      `/register?redirect=${encodeURIComponent(`/split-bill${currentQuery}`)}`,
                    );
                  }
                }}
                className="w-full max-w-[200px] h-10 bg-primary hover:bg-primary/90 text-white font-bold rounded-md shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-1 text-sm"
              >
                Login / Daftar Gratis
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
                  <span className="bg-gradient-to-r from-primary to-[#7c3aed] bg-clip-text text-transparent inline-block font-black">VIP</span> untuk{" "}
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
                Upgrade ke VIP
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
      {!image ? (
        <>
          {/* Camera capture area — tap to open camera directly */}
          <div
            onClick={handleCameraCapture}
            className="border-2 border-dashed border-primary/20 rounded-2xl pt-8 flex flex-col items-center justify-center gap-4 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer group overflow-hidden"
          >
            <div className="w-16 h-16 rounded-full bg-white shadow-soft flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <Camera className="w-8 h-8" />
            </div>
            <div className="text-center px-4">
              <p className="font-bold text-sm text-foreground">
                Foto Struk Sekarang
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">
                Tap untuk buka kamera
              </p>
            </div>

            {/* Subtle Info Footer */}
            <div className="w-full p-2.5 border-t border-dashed border-primary/20 px-4 text-center bg-primary/5">
              <p className="text-[11px] font-bold text-foreground/80 flex items-center justify-center gap-1">
                <span>💡 Pastikan struk terlihat jelas, terang, dan tidak terpotong</span>
              </p>
            </div>
          </div>

          {/* Action buttons row: Upload dari Galeri & Foto Struk */}
          <div className="flex gap-2 w-full">
            <button
              onClick={handleGalleryUpload}
              className="flex-1 flex items-center justify-center gap-2 h-12 rounded-md border border-primary/15 bg-transparent hover:bg-primary/5 transition-colors active:scale-[0.98] cursor-pointer"
            >
              <ImagePlus className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-semibold text-muted-foreground">
                Upload dari Galeri
              </span>
            </button>
            <button
              onClick={handleCameraCapture}
              className="flex-1 flex items-center justify-center gap-2 h-12 rounded-md bg-primary hover:bg-primary/90 text-white transition-colors active:scale-[0.98] cursor-pointer shadow-md shadow-primary/10"
            >
              <Camera className="w-4 h-4 text-white" />
              <span className="text-xs font-bold text-white">
                Foto Struk
              </span>
            </button>
          </div>

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
          <div className="border border-primary/20 rounded-2xl bg-white overflow-hidden flex flex-col group">
            <div className="relative bg-muted w-full flex items-center justify-center overflow-hidden min-h-[80px]">
              <img
                src={image}
                alt="Receipt Preview"
                className="max-w-full max-h-[360px] w-auto h-auto object-contain"
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

            {!scanResult && (
              <div className="w-full p-2.5 border-t border-dashed border-primary/20 px-4 text-center bg-primary/5">
                <p className="text-[11px] font-bold text-foreground/80 flex items-center justify-center gap-1">
                  <span>💡 Pastikan struk terlihat jelas, terang, dan tidak terpotong</span>
                </p>
              </div>
            )}
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

              <div className="bg-gradient-to-b from-card to-card/90 p-5 rounded-2xl border border-primary/20 relative overflow-hidden space-y-4">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

                {/* Merchant Name Preview */}
                {scanResult.merchant_name && (
                  <div className="pb-3 border-b border-border/80">
                    <p className="text-[9px] uppercase font-black text-primary/60 tracking-wider leading-none mb-1.5">
                      Merchant
                    </p>
                    <p className="text-base font-black text-foreground">
                      {scanResult.merchant_name}
                    </p>
                  </div>
                )}

                {/* Items Preview */}
                <div className="space-y-3">
                  <p className="text-[9px] uppercase font-black text-muted-foreground tracking-wider leading-none mb-1">
                    Items ({scanResult.items?.length || 0})
                  </p>
                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                    {scanResult.items?.map((item: ReceiptItem, idx: number) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center text-xs"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0 pr-4">
                          <span className="text-primary font-bold shrink-0 bg-primary/5 px-2 py-0.5 rounded text-[10px]">
                            {item.quantity}x
                          </span>
                          <span className="font-medium truncate text-foreground/90">
                            {item.name}
                          </span>
                        </div>
                        <span className="font-black text-foreground shrink-0">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary / Tax Preview */}
                {(scanResult.tax ||
                  scanResult.service_charge ||
                  scanResult.discount) && (
                    <div className="pt-3 border-t border-border/80 space-y-2">
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
                          <span className="text-emerald-600 font-bold">
                            Discount
                          </span>
                          <span className="font-bold text-emerald-600">
                            -{formatCurrency(Math.abs(scanResult.discount))}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
              </div>

              {/* Post-scan nudge for guest: value prop before import gate */}
              {!isAuthenticated && (
                <div className="rounded-md bg-primary/5 px-4 py-3.5">
                  <p className="text-sm font-black text-primary mb-3">
                    Daftar gratis untuk import & simpan hasil scan!
                  </p>
                  <div className="space-y-3">
                    {[
                      { icon: "✅", text: "Simpan & akses riwayat split bill kapan saja" },
                      { icon: "⚡", text: "Kuota scan AI lebih banyak setiap hari" },
                      { icon: "🎁", text: "100% gratis, tanpa kartu kredit" },
                    ].map(({ icon, text }) => (
                      <div key={text} className="flex items-center gap-2">
                        <span className="text-sm leading-none">{icon}</span>
                        <p className="text-xs text-foreground/70 font-semibold leading-none">{text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Info Banner: Editable After Import - V2 Design Style (only for authenticated) */}
              {isAuthenticated && (
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
              )}

              {/* Import button — hard-gated for guests */}
              {isAuthenticated ? (
                <Button onClick={importItems} className="w-full font-bold">
                  Import ke Daftar
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => {
                      // Save scanResult and image to localStorage so it survives the login redirect
                      if (scanResult) {
                        localStorage.setItem("pending_ai_scan_result", JSON.stringify({
                          result: scanResult,
                          image: image
                        }));
                      }
                      trackSubscription.premiumFeatureClick("ai_scan_import_gate");
                      setShowImportAuthModal(true);
                    }}
                    className="w-full h-12 font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 rounded-md"
                  >
                    <ShieldCheck className="w-4 h-4 mr-2" />
                    Daftar Gratis & Import Hasil Scan
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Benefits info */}
      {!scanResult && <AIScanBenefits />}
      <LoadingModal isOpen={isScanning} />

      {/* Auth modal triggered when guest tries to import scan result */}
      <AuthModal
        isOpen={showImportAuthModal}
        onClose={() => setShowImportAuthModal(false)}
        onSuccess={() => {
          setShowImportAuthModal(false);
          // After login, auto-import the scan result
          importItems();
        }}
        redirectPath={typeof window !== "undefined" ? window.location.pathname + window.location.search : "/split-bill?step=2"}
        title="Hampir Selesai! 🎉"
        description="Daftar gratis atau login dulu untuk import hasil scan dan simpan split bill kamu."
        iconSrc="/img/feature-splitbill-scan.png"
      />
    </div>
  );
};
