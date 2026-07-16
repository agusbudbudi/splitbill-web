"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Camera,
  ImagePlus,
  Sparkles,
  X,
  CheckCircle2,
  RotateCcw,
  Check,
} from "lucide-react";
import { scanReceipt, type ReceiptScanResult, type ReceiptItem } from "@/lib/AIService";
import { formatToIDR } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { trackChatBill } from "@/lib/gtag";
import { useAuthStore } from "@/lib/stores/authStore";
import { AuthModal } from "@/components/auth/AuthModal";
import { AIScanQuotaBanner } from "@/components/ui/AIScanQuotaBanner";
import { GUEST_LIMIT, getGuestScanQuota, incrementGuestScanCount } from "@/lib/utils/guestQuota";

interface ReceiptScanCardProps {
  onConfirm: (result: ReceiptScanResult, imageDataUrl: string) => void;
  isCompleted: boolean;
  scannedResult: ReceiptScanResult | null;
  activityName: string;
  onCloseChat: () => void;
}

export function ReceiptScanCard({
  onConfirm,
  isCompleted,
  scannedResult,
  activityName,
  onCloseChat,
}: ReceiptScanCardProps) {
  const router = useRouter();

  const { isAuthenticated, user, getCurrentUser } = useAuthStore();
  const [guestRemainingScans, setGuestRemainingScans] = useState<number>(GUEST_LIMIT);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [image, setImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ReceiptScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imageSource, setImageSource] = useState<"camera" | "gallery" | "unknown">("unknown");

  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  // Sync guest scan quota
  useEffect(() => {
    if (!isAuthenticated) {
      const quota = getGuestScanQuota();
      setGuestRemainingScans(quota.remaining);
    }
  }, [isAuthenticated]);

  // Sync user data on mount/auth change
  useEffect(() => {
    if (isAuthenticated) {
      getCurrentUser();
    }
  }, [isAuthenticated, getCurrentUser]);

  // ── Guest Limit Barrier ───────────────────────────────────────────────────
  if (!isAuthenticated && guestRemainingScans <= 0 && !isCompleted && !scanResult) {
    return (
      <div className="rounded-2xl border border-primary/20 bg-white overflow-hidden shadow-sm">
        <div className="px-4 py-3 bg-gradient-to-r from-primary/5 to-violet-500/5 border-b border-primary/10 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <p className="text-xs font-bold text-primary uppercase tracking-wide">
            Scan Struk AI
          </p>
        </div>
        <div className="p-6 flex flex-col items-center text-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10">
            <img
              src="/img/ai-icon.png"
              alt="AI Icon"
              className="w-7 h-7 object-contain"
            />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-foreground">
              Scan Gratis Habis! 🚀
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              Batas scan gratis untuk kamu hari ini sudah habis. Yuk daftar sekarang (gratis!) biar bisa lanjut scan! ✨
            </p>
          </div>
          <button
            onClick={() => setShowAuthModal(true)}
            className="w-full max-w-[200px] h-9 bg-primary hover:bg-primary/95 text-white font-bold rounded-lg shadow-lg shadow-primary/10 transition-all text-xs cursor-pointer"
          >
            Login / Daftar Gratis
          </button>
        </div>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          redirectPath={typeof window !== "undefined" ? `${window.location.pathname}?openChat=true` : "/member"}
          title="Login / Daftar Gratis"
          description="Yuk daftar akun dulu (gratis!) biar bisa lanjut scan struk dan pakai fitur lengkap AI Billy!"
        />
      </div>
    );
  }

  // ── VIP Quota Barrier ─────────────────────────────────────────────────────
  const freeScanCount = user?.freeScanCount;
  const isVip = user?.subscriptionStatus === "active";
  if (
    isAuthenticated &&
    freeScanCount !== undefined &&
    freeScanCount <= 0 &&
    !isVip &&
    !isCompleted &&
    !scanResult
  ) {
    return (
      <div className="rounded-2xl border border-primary/20 bg-white overflow-hidden shadow-sm">
        <div className="px-4 py-3 bg-gradient-to-r from-primary/5 to-violet-500/5 border-b border-primary/10 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <p className="text-xs font-bold text-primary uppercase tracking-wide">
            Scan Struk AI
          </p>
        </div>
        <div className="p-6 flex flex-col items-center text-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10">
            <img
              src="/img/ai-icon.png"
              alt="AI Icon"
              className="w-7 h-7 object-contain"
            />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-foreground">
              Scan Habis! 🚀
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              Kuota gratis kamu sudah habis. Upgrade ke <span className="bg-gradient-to-r from-primary to-[#7c3aed] bg-clip-text text-transparent font-black">VIP</span> untuk <span className="text-foreground font-bold">Scan Tanpa Batas</span> dan fitur eksklusif lainnya!
            </p>
          </div>
          <button
            onClick={() => {
              router.push("/subscription");
            }}
            className="w-full max-w-[200px] h-9 bg-primary hover:bg-primary/95 text-white font-bold rounded-lg shadow-lg shadow-primary/10 transition-all text-xs cursor-pointer"
          >
            Upgrade ke VIP
          </button>
        </div>
      </div>
    );
  }

  // ── Frozen state ────────────────────────────────────────────────────────────
  if (isCompleted && scannedResult) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-white overflow-hidden shadow-sm">
        <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border-b border-emerald-100">
          <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
            <Check className="w-3 h-3 text-white" />
          </div>
          <p className="text-xs font-bold text-emerald-700">Struk Terbaca</p>
          {activityName && (
            <span className="ml-auto text-xs text-emerald-600 font-semibold">
              {activityName}
            </span>
          )}
        </div>
        <div className="px-4 py-3 text-xs text-muted-foreground flex flex-wrap gap-x-2 gap-y-1">
          <span>
            <span className="font-bold text-foreground">
              {scannedResult.items?.length ?? 0} item
            </span>{" "}
            berhasil di-scan
          </span>
          {scannedResult.tax ? (
            <span className="text-amber-600 font-semibold">
              + Pajak {formatToIDR(scannedResult.tax)}
            </span>
          ) : null}
          {scannedResult.service_charge ? (
            <span className="text-amber-600 font-semibold">
              + Service Charge {formatToIDR(scannedResult.service_charge)}
            </span>
          ) : null}
          {scannedResult.discount ? (
            <span className="text-emerald-600 font-semibold">
              - Diskon {formatToIDR(Math.abs(scannedResult.discount))}
            </span>
          ) : null}
        </div>
      </div>
    );
  }

  // ── File selection ──────────────────────────────────────────────────────────
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, source: "camera" | "gallery") => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
      setImageSource(source);
      setScanResult(null);
      setError(null);
      trackChatBill.scanImageSelected(source);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // ── AI Scan ─────────────────────────────────────────────────────────────────
  const handleScan = async () => {
    if (!image) return;

    // Re-scan = scan ulang gambar yang sama setelah scan pertama gagal
    if (error) {
      trackChatBill.scanRetried({ source: imageSource });
    } else {
      trackChatBill.scanStarted({ source: imageSource });
    }

    setIsScanning(true);
    setError(null);
    try {
      const result = await scanReceipt(image);
      setScanResult(result);
      toast.success("Preview Hasil Scan ✨", { duration: 2000 });

      if (!isAuthenticated) {
        incrementGuestScanCount();
        const updatedQuota = getGuestScanQuota();
        setGuestRemainingScans(updatedQuota.remaining);
      } else {
        await getCurrentUser();
      }
    } catch (err: any) {
      if (err.status === 429) {
        setError(
          "Yah, limit scan gratis abis! Guest cuma dapet 1x scan. Daftar dulu yuk biar bisa scan lagi! 🚀"
        );
      } else {
        setError(
          "Waduh, AI Billy lagi sibuk nih. Coba lagi nanti, sambil ngopi, atau lanjut ketik manual aja ya! ☕"
        );
      }
    } finally {
      setIsScanning(false);
    }
  };

  const handleGoToManual = () => {
    trackChatBill.scanFallbackManual();
    onCloseChat();
    router.push("/split-bill?step=2&tab=manual");
  };

  // ── Confirm result ──────────────────────────────────────────────────────────
  const handleConfirm = () => {
    if (!scanResult || !image) return;
    const additionalCount = [
      scanResult.tax,
      scanResult.service_charge,
      scanResult.discount,
    ].filter(Boolean).length;
    trackChatBill.scanAccepted({
      item_count: scanResult.items?.length ?? 0,
      additional_item_count: additionalCount,
      has_merchant: !!scanResult.merchant_name,
    });
    onConfirm(scanResult, image);
  };

  return (
    <div className="rounded-2xl border border-primary/20 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-primary/5 to-violet-500/5 border-b border-primary/10 flex items-center gap-2">
        <p className="text-xs font-bold text-primary uppercase tracking-wide">
          Scan Struk AI (estimasi 1 - 2 menit)
        </p>
      </div>

      {/* Quota strip — attached directly below header */}
      {!scanResult && <AIScanQuotaBanner variant="strip" />}

      <div className="p-4 space-y-3">
        {/* No image yet */}
        {!image && (
          <>
            <button
              onClick={() => cameraRef.current?.click()}
              className="w-full h-24 rounded-sm border-2 border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10 transition flex flex-col items-center justify-center gap-2 text-primary cursor-pointer"
            >
              <Camera className="w-6 h-6" />
              <span className="text-xs font-bold">Foto Struk</span>
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full h-9 rounded-sm border border-border text-xs font-semibold text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <ImagePlus className="w-3.5 h-3.5" />
              Upload dari Galeri
            </button>
          </>
        )}

        {/* Image preview */}
        {image && !scanResult && (
          <>
            <div className="relative rounded-sm overflow-hidden border border-border">
              <img
                src={image}
                alt="Struk"
                className="w-full max-h-48 object-contain bg-muted"
              />
              <button
                onClick={() => setImage(null)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-sm cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            {error && (
              <div className="space-y-2 w-full">
                <p className="text-xs text-destructive font-medium bg-destructive/10 px-3 py-2.5 rounded-sm leading-relaxed">
                  {error}
                </p>
                <button
                  type="button"
                  onClick={handleGoToManual}
                  className="w-full h-10 rounded-sm bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-[0.98] cursor-pointer"
                >
                  Lanjut Input Manual ✍️
                </button>
              </div>
            )}
            {isScanning && (
              <div className="rounded-sm bg-amber-50/60 border border-amber-100/80 p-2.5 text-[11px] text-amber-800/90 leading-relaxed flex items-start gap-2">
                <span className="text-sm shrink-0">⏳</span>
                <div>
                  <span className="font-bold">Estimasi scan 1-2 menit.</span> Sabar ya bestie, AI Billy lagi baca struknya biar gak ada salah paham di antara kita, no salty-salty! ☕✨
                </div>
              </div>
            )}
            <button
              onClick={handleScan}
              disabled={isScanning}
              className="w-full h-10 rounded-sm bg-primary text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60 transition hover:bg-primary/90 active:scale-[0.98] cursor-pointer"
            >
              {isScanning ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Mulai Scan AI
                </>
              )}
            </button>
          </>
        )}

        {/* Scan result */}
        {scanResult && image && (
          <>
            <div className="flex items-center gap-1.5 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
              <p className="text-xs font-bold">Preview Hasil Scan ✨</p>
            </div>

            {/* Compact result preview */}
            <div className="rounded-sm border border-border bg-muted/30 p-3 space-y-2">
              {scanResult.merchant_name && (
                <p className="text-xs font-black text-foreground">
                  {scanResult.merchant_name}
                </p>
              )}
              <div className="space-y-1">
                {scanResult.items?.map((item: ReceiptItem, i: number) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span className="text-foreground/80 flex-1 pr-2 break-words whitespace-normal flex items-start gap-1">
                      <span className="text-muted-foreground select-none">•</span>
                      <span>
                        {item.quantity > 1 && (
                          <span className="text-primary font-bold mr-1">
                            {item.quantity}x
                          </span>
                        )}
                        {item.name}
                      </span>
                    </span>
                    <span className="font-bold shrink-0">
                      {formatToIDR(item.price * (item.quantity || 1))}
                    </span>
                  </div>
                ))}
              </div>
              {(scanResult.tax || scanResult.service_charge || scanResult.discount) && (
                <div className="pt-2 border-t border-border space-y-1">
                  {scanResult.tax && (
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Tax</span>
                      <span className="font-bold">
                        {formatToIDR(scanResult.tax)}
                      </span>
                    </div>
                  )}
                  {scanResult.service_charge && (
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Service Charge</span>
                      <span className="font-bold">
                        {formatToIDR(scanResult.service_charge)}
                      </span>
                    </div>
                  )}
                  {scanResult.discount && (
                    <div className="flex justify-between text-xs text-emerald-600 font-semibold">
                      <span>Diskon</span>
                      <span className="font-bold">
                        -{formatToIDR(Math.abs(scanResult.discount))}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  trackChatBill.scanReset();
                  setScanResult(null);
                  setImage(null);
                }}
                className="h-10 px-4 rounded-sm border border-border text-xs font-semibold text-muted-foreground hover:border-primary/30 transition flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Ulangi
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 h-10 rounded-sm bg-primary text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-[0.98] transition cursor-pointer"
              >
                Pakai Hasil Ini
              </button>
            </div>
          </>
        )}
      </div>

      {/* Hidden inputs */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e, "gallery")}
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFile(e, "camera")}
      />
    </div>
  );
}
