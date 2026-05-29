"use client";

import React, { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";
import {
  ShoppingBag,
  ChevronRight,
  Clock,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { getOrders } from "@/lib/api/subscription";
import type { Order } from "@/lib/types/subscription";
import { formatToIDR, cn, formatDate } from "@/lib/utils";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (err) {
        setError("Gagal memuat daftar pesanan");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "pending":
        return "bg-orange-500/10 text-orange-600 border-orange-500/20";
      case "expired":
        return "bg-muted text-muted-foreground border-border";
      default:
        return "bg-destructive/10 text-destructive border-destructive/20";
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <div className="w-full max-w-[600px] min-h-screen flex flex-col bg-background">
        <Header
          title="Pesanan Saya"
          showBackButton
        />

        <main className="flex-1 p-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-24 w-full bg-muted animate-pulse rounded-xl"
                />
              ))}
            </div>
          ) : error ? (
            <EmptyState
              icon={AlertCircle}
              message="Terjadi Kesalahan"
              subtitle={error}
              action={
                <button
                  onClick={() => window.location.reload()}
                  className="text-primary font-bold text-sm"
                >
                  Coba Lagi
                </button>
              }
            />
          ) : Array.isArray(orders) && orders.length > 0 ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {orders.map((order) => (
                <Card
                  key={order.orderId}
                  className="border-none shadow-soft hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer group overflow-hidden"
                  onClick={() =>
                    router.push(`/profile/orders/${order.orderId}`)
                  }
                >
                  <CardContent className="p-4 flex items-stretch justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[13px] font-bold text-foreground">
                          {order.snapshot?.name || "Subscription Plan"}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={cn(
                              "text-[9px] px-1.5 py-0 uppercase font-black tracking-wider",
                              getStatusColor(order.status),
                            )}
                          >
                            {order.status}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">
                            •
                          </span>
                          <div className="flex items-center gap-1 opacity-60">
                            <Calendar className="w-2.5 h-2.5" />
                            <p className="text-[9px] font-medium">
                              {formatDate(order.createdAt)}
                            </p>
                          </div>
                        </div>
                        <p className="text-[10px] text-muted-foreground font-medium">
                          ID: {order.orderId}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end justify-between py-0.5">
                      <p className="text-sm font-black text-foreground">
                        {formatToIDR(order.totalPayment || order.amount)}
                      </p>
                      <div className="flex items-center gap-1 group-hover:gap-1.5 transition-all">
                        <span className="text-[10px] text-primary font-bold">
                          Detail
                        </span>
                        <ChevronRight className="w-3 h-3 text-primary transition-colors" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={ShoppingBag}
              message="Belum Ada Pesanan"
              subtitle="Riwayat pesanan langganan kamu akan muncul di sini."
              action={
                <button
                  onClick={() => router.push("/subscription")}
                  className="bg-primary text-white px-6 py-2 rounded-sm font-bold text-sm shadow-lg shadow-primary/20 cursor-pointer"
                >
                  Pilih Paket Langganan
                </button>
              }
            />
          )}
        </main>
      </div>
    </div>
  );
}
