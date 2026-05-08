"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  QrCode,
  AlertCircle,
  ArrowLeft,
  Loader2,
  Copy,
  Check,
} from "lucide-react";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getOrder } from "@/lib/api/subscription";
import type { Order } from "@/lib/types/subscription";
import { cn, formatToIDR } from "@/lib/utils";
import { SuccessSection } from "@/components/ui/SuccessSection";
import { useOrderStore } from "@/store/useOrderStore";

export default function PaymentPage() {
  const { orderId } = useParams();
  const router = useRouter();
  const cachedOrder = useOrderStore((state) => state.currentOrder);
  const [order, setOrder] = useState<Order | null>(
    cachedOrder?.orderId === orderId ? cachedOrder : null,
  );
  const [isLoading, setIsLoading] = useState(!order);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const fetchOrder = useCallback(async () => {
    try {
      const data = await getOrder(orderId as string);
      setOrder(data);
      if (data.status === "paid") {
        // Stop polling is handled by the dependency array of useEffect
      }
    } catch (err: any) {
      setError(err.message || "Gagal memuat detail pesanan.");
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  // Initial fetch and polling
  useEffect(() => {
    fetchOrder();

    const interval = setInterval(() => {
      if (order?.status === "pending") {
        fetchOrder();
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [fetchOrder, order?.status]);

  // Countdown timer
  useEffect(() => {
    if (!order?.expiresAt || order.status !== "pending") return;

    const calculateTimeLeft = () => {
      const expiry = new Date(order.expiresAt).getTime();
      const now = new Date().getTime();
      const diff = expiry - now;
      return diff > 0 ? Math.floor(diff / 1000) : 0;
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(timer);
        if (order.status === "pending") {
          fetchOrder(); // Final refresh to update status to expired
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [order?.expiresAt, order?.status, fetchOrder]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  useEffect(() => {
    if (order?.status === "paid") {
      import("canvas-confetti").then((confetti) => {
        confetti.default({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#7c3aed", "#a78bfa", "#f5f3ff"],
        });
      });
    }
  }, [order?.status]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center">
        <Header title="Pembayaran" showBackButton />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="mt-4 text-muted-foreground animate-pulse">
            Memuat detail pembayaran...
          </p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center">
        <Header title="Pembayaran" showBackButton />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-[400px]">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-bold mb-2">Terjadi Kesalahan</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button
            onClick={() => router.push("/subscription")}
            className="w-full"
          >
            Kembali ke Langganan
          </Button>
        </div>
      </div>
    );
  }

  if (order.status === "paid") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center">
        <Header title="Pembayaran Berhasil" />
        <main className="w-full max-w-[600px] p-4 flex flex-col items-center min-h-[80vh] space-y-6">
          <SuccessSection
            title="Pembayaran Berhasil!"
            subtitle={`Selamat! Paket ${order.snapshot?.name || "-"} kamu sekarang aktif. Nikmati fitur premium tanpa batas.`}
            icon={CheckCircle2}
            className="pt-8"
            actions={[
              {
                label: "Detail Transaksi",
                onClick: () => router.push(`/profile/orders/${order.orderId}`),
                variant: "default",
              },
              {
                label: "Mulai Scan",
                onClick: () => router.push("/"),
                variant: "outline",
              },
            ]}
          >
            <Card className="w-full p-6 border-none bg-white shadow-soft rounded-lg animate-in fade-in zoom-in-95 duration-700 delay-300 fill-mode-both text-left">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-50">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                  Ringkasan Transaksi
                </span>
                <Badge
                  variant="outline"
                  className="bg-emerald-50 text-emerald-600 border-emerald-100 font-black text-[10px] uppercase px-3 py-1"
                >
                  Terverifikasi
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">ID Pesanan</span>
                  <span className="font-mono font-bold text-slate-900 bg-slate-50 px-2 py-1 rounded">
                    {order.orderId}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">
                    Waktu Pembayaran
                  </span>
                  <span className="font-bold text-slate-900">
                    {new Date(order.paidAt || Date.now()).toLocaleString(
                      "id-ID",
                      {
                        dateStyle: "medium",
                        timeStyle: "short",
                      },
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">
                    Metode Pembayaran
                  </span>
                  <span className="font-bold text-slate-900 uppercase">
                    {order.paymentMethod || "QRIS"}
                  </span>
                </div>
                <div className="h-px bg-slate-50 my-2" />
                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                    Total Terbayar
                  </span>
                  <span className="text-xl font-bold text-primary tracking-tight">
                    {formatToIDR(order.qrisData?.total_payment || order.amount)}
                  </span>
                </div>
              </div>
            </Card>
          </SuccessSection>
        </main>
      </div>
    );
  }

  if (order.status === "expired" || order.status === "failed") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center">
        <Header title="Pembayaran Gagal" showBackButton />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-[400px]">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Clock className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold mb-2">Pembayaran Kedaluwarsa</h2>
          <p className="text-muted-foreground mb-6">
            Waktu pembayaran Anda telah habis. Silakan buat pesanan baru.
          </p>
          <Button
            onClick={() => router.push("/subscription")}
            className="w-full"
          >
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <Header title="Pembayaran QRIS" showBackButton />

      <main className="w-full max-w-[600px] p-4 pb-12 space-y-6">
        {/* Order Info */}
        <Card className="p-4 border-primary/10 bg-primary/[0.02] shadow-none">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-0.5">
              <p className="text-[11px] font-bold text-primary/60 uppercase tracking-wider">
                Total Pembayaran
              </p>
              <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
                {formatToIDR(order.qrisData?.total_payment || order.amount)}
              </h2>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
                Waktu Tersisa
              </p>
              <Badge
                variant="outline"
                className={cn(
                  "font-mono text-sm border-2",
                  (timeLeft || 0) < 60
                    ? "text-destructive border-destructive/20 bg-destructive/5 shadow-sm shadow-destructive/5"
                    : "text-primary border-primary/10 bg-primary/[0.04] shadow-sm shadow-primary/5",
                )}
              >
                {timeLeft !== null ? formatTime(timeLeft) : "--:--"}
              </Badge>
            </div>
          </div>

          <div className="pt-4 border-t border-primary/5 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                Paket
              </p>
              <p className="text-sm font-bold text-foreground/80">
                {order.snapshot?.name || "-"}
              </p>
            </div>
            <div className="text-right space-y-0.5">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                ID Pesanan
              </p>
              <button
                onClick={() => handleCopy(order.orderId)}
                className="flex items-center gap-1.5 text-xs font-mono bg-muted/50 px-2 py-1 rounded hover:bg-muted transition-colors text-muted-foreground"
              >
                {order.orderId}
                {isCopied ? (
                  <Check className="w-3 h-3 text-emerald-500" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </div>
          </div>
        </Card>

        {/* QRIS Section */}
        <div className="flex flex-col items-center space-y-6">
          <Card className="p-6 bg-white rounded-2xl border-none">
            <div className="flex flex-col items-center gap-4">
              <div className="relative bg-white p-2">
                {order.qrisData?.payment_number ? (
                  <QRCodeSVG
                    value={order.qrisData?.payment_number}
                    size={240}
                    level="M"
                    includeMargin={false}
                  />
                ) : order.qrisData?.image ? (
                  <div className="relative w-[240px] aspect-square">
                    <Image
                      src={order.qrisData?.image || ""}
                      alt="QRIS Payment"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                ) : (
                  <div className="w-[240px] h-[240px] bg-muted flex items-center justify-center rounded-xl">
                    <QrCode className="w-12 h-12 text-muted-foreground opacity-20" />
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-1">
                  <QrCode className="w-4 h-4 text-primary" />
                  <span className="text-xs font-black uppercase tracking-tighter text-slate-800">
                    QRIS GPN
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground font-medium">
                  Scan dengan e-wallet atau m-banking apa saja
                </p>
              </div>
            </div>
          </Card>

          {/* Payment Breakdown */}
          <div className="w-full max-w-[320px] space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs px-2">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold text-foreground">
                {formatToIDR(order.qrisData?.amount || order.amount)}
              </span>
            </div>
            {order.qrisData?.fee > 0 && (
              <div className="flex items-center justify-between text-xs px-2">
                <span className="text-muted-foreground">Biaya Admin</span>
                <span className="font-semibold text-foreground">
                  {formatToIDR(order.qrisData?.fee || 0)}
                </span>
              </div>
            )}
            <div className="h-px bg-border/50 mx-2" />
            <div className="flex items-center justify-between text-sm px-2 pt-1">
              <span className="font-bold text-foreground">Total Bayar</span>
              <span className="font-black text-primary text-lg">
                {formatToIDR(order.qrisData?.total_payment || order.amount)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 py-2 px-4 bg-primary/[0.03] border border-primary/5 rounded-full">
            <Loader2 className="w-3.5 h-3.5 text-primary/40 animate-spin" />
            <span className="text-[11px] font-bold text-primary/60 uppercase tracking-tight">
              Menunggu pembayaran Anda...
            </span>
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-2 px-1">
            <ArrowLeft className="w-4 h-4 rotate-180" />
            Cara Pembayaran
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {[
              {
                step: 1,
                text: "Buka aplikasi E-Wallet (Gopay, OVO, Dana, LinkAja) atau Mobile Banking.",
              },
              {
                step: 2,
                text: "Pilih menu 'Scan' atau 'Bayar' dan arahkan kamera ke kode QR di atas.",
              },
              {
                step: 3,
                text: "Pastikan nominal yang tertera sesuai dan konfirmasi pembayaran.",
              },
              {
                step: 4,
                text: "Pembayaran akan terverifikasi secara otomatis dalam hitungan detik.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex gap-4 p-4 rounded-2xl bg-muted/50 border border-border/50"
              >
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xs font-bold">
                  {item.step}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
