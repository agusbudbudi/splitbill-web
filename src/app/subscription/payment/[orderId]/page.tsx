"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  QrCode,
  AlertCircle,
  ArrowLeft,
  Copy,
  Check,
  Download,
} from "lucide-react";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { toPng } from "html-to-image";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getOrder } from "@/lib/api/subscription";
import type { Order } from "@/lib/types/subscription";
import { cn, formatToIDR } from "@/lib/utils";
import { SuccessSection } from "@/components/ui/SuccessSection";
import { useOrderStore } from "@/store/useOrderStore";
import { trackSubscription } from "@/lib/gtag";
import { DynamicFinLogo } from "@/components/wallet/DynamicFinLogo";
import { LoadingIndicator } from "@/components/ui/LoadingIndicator";

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

  const handleDownloadQR = async () => {
    try {
      const element = document.getElementById("qris-ticket-hidden");
      if (!element) {
        throw new Error("Ticket element not found");
      }

      const image = await toPng(element, {
        pixelRatio: 3,
        backgroundColor: "#ffffff",
      });

      const a = document.createElement("a");
      a.href = image;
      a.download = `QRIS-${order?.orderId ?? "payment"}.png`;
      a.click();
    } catch (err) {
      console.error("Gagal mengunduh QRIS", err);
      if (order?.qrisData?.image) {
        window.open(order.qrisData.image, "_blank");
      }
    }
  };

  useEffect(() => {
    if (order?.status === "paid") {
      trackSubscription.purchaseSuccess(order.packageId, order.amount);
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
          <LoadingIndicator text="Memuat detail pembayaran..." />
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

      <div className="relative w-full max-w-[600px] flex-1 flex flex-col">
        {/* Sticky Indicator */}
        <div className="sticky top-14 lg:top-16 z-40 w-full bg-amber-50 px-4 py-2 border-b border-amber-100 flex items-center justify-start text-amber-800 text-xs font-medium shadow-sm">
          <Clock className="w-3.5 h-3.5 mr-2 shrink-0" />
          <span>Menunggu pembayaran Anda</span>
          <div className="flex gap-0.5 items-center justify-center pt-1 ml-1.5">
            <span className="w-1 h-1 bg-amber-800 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-1 h-1 bg-amber-800 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-1 h-1 bg-amber-800 rounded-full animate-bounce"></span>
          </div>
        </div>

        {/* Gradient background */}
        <div className="absolute inset-x-0 top-0 h-100 bg-gradient-to-b from-primary via-primary/50 to-transparent pointer-events-none z-0" />

        <main className="relative z-10 w-full p-4 space-y-6">
          {/* Order Info */}
          <Card className="p-2 border-none bg-transparent shadow-none">
            <div className="flex items-center justify-between mb-2">
              <div className="space-y-0.5">
                <p className="text-[11px] font-bold text-white/80 uppercase tracking-wider">
                  Total Pembayaran
                </p>
                <h2 className="text-3xl font-extrabold text-white tracking-tight">
                  {formatToIDR(order.qrisData?.total_payment || order.amount)}
                </h2>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-medium text-white/80 uppercase tracking-wider mb-1">
                  Waktu Tersisa
                </p>
                <Badge
                  variant="outline"
                  className={cn(
                    "font-mono text-sm border-2",
                    (timeLeft || 0) < 60
                      ? "text-white border-red-400/50 bg-red-500/80 shadow-sm"
                      : "text-white border-white/30 bg-white/5 shadow-sm",
                  )}
                >
                  {timeLeft !== null ? formatTime(timeLeft) : "--:--"}
                </Badge>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-[11px] font-medium text-white/80 uppercase tracking-wider">
                  Paket
                </p>
                <p className="text-md font-bold text-white">
                  {order.snapshot?.name || "-"}
                </p>
              </div>
              <div className="text-right space-y-0.5">
                <p className="text-[11px] font-medium text-white/80 uppercase tracking-wider">
                  ID Pesanan
                </p>
                <button
                  onClick={() => handleCopy(order.orderId)}
                  className="flex items-center gap-1.5 text-sm font-bold font-mono bg-white/20 px-2 py-1 rounded hover:bg-white/30 transition-colors text-white"
                >
                  {order.orderId}
                  {isCopied ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>
          </Card>

          {/* QRIS Section */}
          <div className="flex flex-col items-center space-y-6">
            <Card className="p-6 bg-white rounded-2xl border-none shadow-soft">
              <div className="flex flex-col items-center gap-4">
                <div className="relative bg-white">
                  {order.qrisData?.payment_number ? (
                    <QRCodeSVG
                      id="qris-svg"
                      value={order.qrisData?.payment_number}
                      size={280}
                      level="M"
                      includeMargin={false}
                    />
                  ) : order.qrisData?.image ? (
                    <div className="relative w-[280px] aspect-square">
                      <Image
                        src={order.qrisData?.image || ""}
                        alt="QRIS Payment"
                        fill
                        sizes="280px"
                        className="object-contain"
                        priority
                      />
                    </div>
                  ) : (
                    <div className="w-[280px] h-[280px] bg-muted flex items-center justify-center rounded-xl">
                      <QrCode className="w-12 h-12 text-muted-foreground opacity-20" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center w-full max-w-[280px]">
                  <div className="flex items-center justify-center mb-1 h-6 w-20">
                    <DynamicFinLogo slug="qris" alt="QRIS" />
                  </div>
                  <p className="text-[10px] text-muted-foreground font-medium mb-4 text-center">
                    Scan dengan e-wallet atau m-banking apa saja
                  </p>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleDownloadQR}
                    className="w-full h-10 text-xs font-semibold rounded-sm"
                  >
                    <Download className="w-4 h-4 mr-1.5" />
                    Simpan QRIS
                  </Button>
                </div>
              </div>
            </Card>

            {/* Hidden Ticket for Download */}
            <div className="fixed top-[-9999px] left-[-9999px]">
              <Card id="qris-ticket-hidden" className="p-6 bg-white rounded-[24px] border-none w-[320px] shadow-none relative overflow-hidden">
                <div className="flex flex-col items-center gap-5">

                  <div className="flex flex-col items-center text-center space-y-1 w-full">
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Pembayaran</p>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">{formatToIDR(order.qrisData?.total_payment || order.amount)}</h3>
                  </div>

                  <div className="relative bg-white p-2">
                    {order.qrisData?.payment_number ? (
                      <QRCodeSVG
                        value={order.qrisData?.payment_number}
                        size={200}
                        level="M"
                        includeMargin={false}
                      />
                    ) : order.qrisData?.image ? (
                      <div className="relative w-[200px] aspect-square">
                        <Image
                          src={order.qrisData?.image || ""}
                          alt="QRIS Payment"
                          fill
                          sizes="200px"
                          className="object-contain"
                          priority
                        />
                      </div>
                    ) : (
                      <div className="w-[200px] h-[200px] bg-muted flex items-center justify-center rounded-xl">
                        <QrCode className="w-12 h-12 text-muted-foreground opacity-20" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-center w-full">
                    <div className="flex items-center justify-center mb-2 h-6 w-20">
                      <DynamicFinLogo slug="qris" alt="QRIS" />
                    </div>
                    <p className="text-[11px] text-muted-foreground font-medium text-center">
                      Scan untuk membayar pesanan ini
                    </p>
                  </div>

                  <div className="w-full h-px border-t-2 border-dashed border-slate-100 my-1" />

                  <div className="flex justify-between items-center w-full px-1">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ID Pesanan</p>
                    <p className="font-mono text-xs font-bold text-slate-700">{order.orderId}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Payment Breakdown */}
            <div className="w-full max-w-[320px] space-y-3 pt-2">
              <div className="flex items-center justify-between text-sm px-2">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold text-foreground">
                  {formatToIDR(order.qrisData?.amount || order.amount)}
                </span>
              </div>
              {order.qrisData?.fee > 0 && (
                <div className="flex items-center justify-between text-sm px-2">
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

          </div>

          {/* Instructions */}
          <div className="space-y-3 mb-3">
            <h3 className="text-sm font-bold flex items-center gap-2 px-1">
              Cara Pembayaran
            </h3>
            <Card className="p-4 bg-white border-none">
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
                  className="flex gap-4 py-3 first:pt-0 last:pb-0"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xs font-bold">
                    {item.step}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.text}
                  </p>
                </div>
              ))}
            </Card>
          </div>

          {/* Trust Badge */}
          <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-border/50">
            <div className="shrink-0 w-12 h-12 relative">
              <Image
                src="/img/icon-privacy.png"
                alt="Pembayaran Aman"
                fill
                sizes="48px"
                className="object-contain"
              />
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-bold text-foreground">Pembayaran Aman & Terverifikasi</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Transaksi ini diproses dan dijamin keamanannya oleh <span className="font-semibold text-foreground">Pakasir</span>.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
