"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/Card";
import {
  ShoppingBag,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Package,
  Receipt,
  QrCode,
} from "lucide-react";
import { getOrder } from "@/lib/api/subscription";
import type { Order } from "@/lib/types/subscription";
import { formatToIDR, cn, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrder(id as string);
        setOrder(data);
      } catch (err) {
        setError("Gagal memuat detail pesanan");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "paid":
        return {
          label: "Terbayar",
          icon: CheckCircle2,
          color: "text-green-600 bg-green-500/10 border-green-500/20",
          description: "Pesanan ini telah berhasil dibayar.",
        };
      case "pending":
        return {
          label: "Menunggu Pembayaran",
          icon: Clock,
          color: "text-orange-600 bg-orange-500/10 border-orange-500/20",
          description: "Pesanan ini sedang menunggu pembayaran Anda.",
        };
      case "expired":
        return {
          label: "Kedaluwarsa",
          icon: AlertCircle,
          color: "text-muted-foreground bg-muted border-border",
          description: "Pesanan ini telah kedaluwarsa.",
        };
      default:
        return {
          label: status,
          icon: AlertCircle,
          color: "text-destructive bg-destructive/10 border-destructive/20",
          description: "Terjadi kesalahan pada pesanan ini.",
        };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center">
        <Header title="Detail Pesanan" showBackButton />
        <div className="w-full max-w-[600px] p-4 space-y-4">
          <div className="h-32 w-full bg-muted animate-pulse rounded-xl" />
          <div className="h-64 w-full bg-muted animate-pulse rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center">
        <Header title="Detail Pesanan" showBackButton />
        <div className="w-full max-w-[600px] flex-1 flex flex-col items-center justify-center p-6 text-center">
          <AlertCircle className="w-12 h-12 text-destructive mb-4" />
          <h2 className="text-xl font-bold mb-2">
            Oops! Detail Tidak Ditemukan
          </h2>
          <p className="text-muted-foreground mb-6">
            {error || "Pesanan tidak ditemukan."}
          </p>
          <Button onClick={() => router.push("/profile/orders")}>
            Kembali ke Daftar Pesanan
          </Button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <div className="w-full max-w-[600px] min-h-screen flex flex-col bg-background">
        <Header
          title="Detail Pesanan"
          showBackButton
        />

        <main className="flex-1 p-4 space-y-6">
          {/* Status Section */}
          {order.status !== "paid" && (
            <Card
              className={cn(
                "border-none shadow-sm overflow-hidden",
                statusInfo.color,
              )}
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
                  <StatusIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight mb-1">
                  {statusInfo.label}
                </h2>
                <p className="text-xs font-medium opacity-80">
                  {statusInfo.description}
                </p>

                {order.status === "pending" && (
                  <Button
                    onClick={() =>
                      router.push(`/subscription/payment/${order.orderId}`)
                    }
                    className="mt-6 bg-white text-orange-600 hover:bg-white/90 font-bold px-8 rounded-full shadow-soft"
                  >
                    Bayar Sekarang
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Order Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">
              Informasi Pesanan
            </h3>
            <Card className="border-border/50 shadow-sm rounded-2xl overflow-hidden">
              <CardContent className="p-0 divide-y divide-border/50">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                      <ShoppingBag className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">
                      ID Pesanan
                    </span>
                  </div>
                  <span className="text-sm font-mono font-bold">
                    {order.orderId}
                  </span>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">
                      Tanggal
                    </span>
                  </div>
                  <span className="text-sm font-bold">
                    {formatDate(order.createdAt, true)}
                  </span>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                      <Receipt className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">
                      Tipe
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[10px] font-bold uppercase tracking-wider bg-primary/5 border-primary/20 text-primary"
                  >
                    {order.type}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Snapshot Info */}
          {order.snapshot && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">
                Rincian Paket
              </h3>
              <Card className="border-border/50 shadow-sm rounded-2xl overflow-hidden">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                        <Package className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-foreground uppercase tracking-tight">
                          {order.snapshot.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground font-medium">
                          {order.snapshot.durationMonths} Bulan Langganan
                        </p>
                      </div>
                    </div>
                    <p className="text-lg font-black text-foreground">
                      {formatToIDR(order.amount)}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border/50">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
                      Keuntungan Paket
                    </p>
                    <ul className="space-y-2.5">
                      {order.snapshot.benefits?.map(
                        (benefit: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5" />
                            <span className="text-xs text-foreground/80 font-medium leading-tight">
                              {benefit}
                            </span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Rincian Harga */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">
              Rincian Harga
            </h3>
            <Card className="border-border/50 shadow-sm rounded-2xl overflow-hidden">
              <CardContent className="p-0 divide-y divide-border/50">
                <div className="p-4 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-medium">
                    Harga Paket
                  </span>
                  <span className="font-bold text-foreground">
                    {formatToIDR(order.qrisData?.amount || order.amount)}
                  </span>
                </div>
                {order.qrisData?.fee > 0 && (
                  <div className="p-4 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-medium">
                      Biaya Admin
                    </span>
                    <span className="font-bold text-foreground">
                      {formatToIDR(order.qrisData?.fee || 0)}
                    </span>
                  </div>
                )}
                <div className="p-4 flex items-center justify-between bg-primary/[0.02]">
                  <span className="text-sm font-black text-foreground uppercase">
                    Total Pembayaran
                  </span>
                  <span className="text-lg font-black text-primary">
                    {formatToIDR(order.qrisData?.total_payment || order.amount)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Details if Paid */}
          {order.status === "paid" && order.paidAt && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">
                Detail Pembayaran
              </h3>
              <Card className="border-border/50 shadow-sm rounded-2xl overflow-hidden bg-white">
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                      <QrCode className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">
                        Metode: QRIS
                      </p>
                      <p className="text-[10px] text-muted-foreground font-medium">
                        Terverifikasi Otomatis
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-foreground">
                      {formatDate(order.paidAt, true)}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-medium">
                      Waktu Bayar
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="pt-4 px-2 text-center">
            <p className="text-[12px] text-muted-foreground font-medium">
              Ada kendala dengan pesanan ini? <br />
              <a
                href={`https://api.whatsapp.com/send?phone=6285559496968&text=Halo%20Admin%20SplitBill%20%F0%9F%91%8B%0ASaya%20ada%20kendala%20dengan%20pesanan%20dengan%20ID%3A%20${order.orderId}.%20Mohon%20bantuannya%20ya%20%F0%9F%99%8F`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-primary font-bold hover:underline underline-offset-2 mt-1"
              >
                Hubungi Support
              </a>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
