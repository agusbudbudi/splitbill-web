"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import {
  Sparkles,
  Camera,
  X,
  CheckCircle2,
  Lock, // Import Lock icon
} from "lucide-react";
import { useSplitBillStore } from "@/store/useSplitBillStore";
import { scanReceipt, ReceiptScanResult, ReceiptItem } from "@/lib/AIService";
import { LoadingModal } from "@/components/ui/LoadingModal";
import { useAuthStore } from "@/lib/stores/authStore"; // Import auth store
import { useRouter } from "next/navigation"; // Import useRouter
import { FeatureBanner } from "@/components/ui/FeatureBanner"; // Import FeatureBanner

export const AIScanForm = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ReceiptScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { addExpense, setActivityName, addAdditionalExpense } =
    useSplitBillStore();
  const { isAuthenticated } = useAuthStore(); // Get auth status
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setScanResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScan = async () => {
    if (!image) return;
    setIsScanning(true);
    setError(null);

    try {
      const result = await scanReceipt(image);
      setScanResult(result);
    } catch (err: any) {
      console.error("Scan failed", err);
      setError(err.message || "Gagal membaca struk. Coba lagi!");
    } finally {
      setIsScanning(false);
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
  };

  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amt);
  };

  // Login Barrier for AI Scan
  if (!isAuthenticated) {
    return (
      <div className="space-y-4 py-2 animate-in fade-in duration-500 relative">
        {/* Premium Banner */}
        <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-primary via-primary/90 to-violet-600 text-white shadow-xl shadow-primary/20 border border-white/20 z-10 mx-1">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-500/30 rounded-full blur-[60px] -ml-10 -mb-10 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center gap-4">
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-white/20 blur-xl rounded-full animate-pulse" />
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg shadow-black/5 relative border border-white/30">
                <Sparkles className="w-8 h-8 text-white fill-white/30" />
              </div>
              <div className="absolute -top-1 -right-1 bg-amber-300 text-[9px] font-black text-amber-950 px-1.5 py-0.5 rounded-full border border-white/20 shadow-sm">
                PRO
              </div>
            </div>

            <div className="space-y-2 max-w-[280px]">
              <h3 className="text-xl font-bold tracking-tight text-white drop-shadow-sm">
                Unlock AI Scan
              </h3>
              <p className="text-xs text-white/90 leading-relaxed font-medium">
                Login untuk akses fitur{" "}
                <span className="bg-white/20 px-1 rounded text-white font-bold">
                  Scan Struk Otomatis
                </span>
                . Hemat waktu tanpa ketik manual!
              </p>
            </div>

            <Button
              onClick={() => router.push("/login")}
              className="w-full max-w-[200px] h-11 bg-white hover:bg-white/90 text-primary font-bold rounded-xl shadow-lg shadow-black/5 border-0 transition-all hover:scale-[1.02] active:scale-[0.98] mt-2 text-base"
            >
              Login Sekarang
            </Button>
          </div>
        </div>

        {/* Blurred Preview/Teaser background */}
        <div className="absolute inset-0 top-6 z-0 px-2 opacity-40 blur-[2px] pointer-events-none grayscale brightness-125 contrast-75 overflow-hidden">
          <div className="border-2 border-dashed border-slate-300 rounded-2xl h-[280px] w-full flex flex-col items-center justify-center gap-4 bg-slate-50"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 py-2 animate-in fade-in duration-500">
      {!image ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-primary/20 rounded-2xl py-8 flex flex-col items-center justify-center gap-4 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer group"
        >
          <div className="w-16 h-16 rounded-full bg-white shadow-soft flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <Camera className="w-8 h-8" />
          </div>
          <div className="text-center">
            <p className="font-bold text-sm text-foreground">
              Ambil Foto Struk
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">
              Atau klik untuk upload
            </p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-primary/20 bg-muted">
            <img
              src={image}
              alt="Receipt Preview"
              className="w-full h-full object-contain"
            />
            <button
              onClick={() => setImage(null)}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-md cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {!scanResult ? (
            <div className="space-y-3">
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-sm text-destructive text-[10px] font-bold uppercase text-center">
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

              <div className="bg-muted/30 p-4 rounded-xl border border-dashed border-primary/20 space-y-4">
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

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setImage(null)}
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
      {!image && (
        <div className="flex gap-3 items-start p-3 bg-muted/20 rounded-xl">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-muted-foreground">
              Kelebihan Scan AI
            </p>
            <p className="text-[11px] leading-relaxed mt-0.5">
              Automatis deteksi menu, harga, dan total pajak tanpa perlu ketik
              manual satu-satu.
            </p>
          </div>
        </div>
      )}
      <LoadingModal isOpen={isScanning} />
    </div>
  );
};
