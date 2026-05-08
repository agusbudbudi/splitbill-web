"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Crown, Sparkles, CheckCircle2, Calendar } from "lucide-react";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { SubscriptionList } from "@/components/subscription/SubscriptionList";
import {
  getPublicSubscriptionPackages,
  createOrder,
} from "@/lib/api/subscription";
import type { SubscriptionPackage } from "@/lib/types/subscription";
import { getAccessToken } from "@/lib/auth/tokens";
import { useOrderStore } from "@/store/useOrderStore";
import { getCurrentUser, type User } from "@/lib/api/auth";
import { formatDate } from "@/lib/utils";

export default function SubscriptionPage() {
  const router = useRouter();
  const setCurrentOrder = useOrderStore((state) => state.setCurrentOrder);
  const [user, setUser] = useState<User | null>(null);
  const [packages, setPackages] = useState<SubscriptionPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    const token = getAccessToken();
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [packagesData, userData] = await Promise.all([
          getPublicSubscriptionPackages(),
          token ? getCurrentUser() : Promise.resolve(null),
        ]);
        setPackages(packagesData);
        setUser(userData);
      } catch (err) {
        setError("Gagal memuat data. Coba lagi nanti.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBuy = async (packageId: string) => {
    // Check auth
    const token = getAccessToken();
    if (!token) {
      router.push(`/login?redirect=/subscription`);
      return;
    }

    setProcessingId(packageId);
    try {
      const order = await createOrder(packageId, "subscription");
      setCurrentOrder(order);
      router.push(`/subscription/payment/${order.orderId}`);
    } catch (err: any) {
      alert(err.message || "Gagal membuat pesanan. Silakan coba lagi.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <Header title="Langganan" showBackButton />

      <main className="w-full max-w-[600px] pb-10">
        {/* Banner or Active Subscription */}
        <div className="w-full px-4 pt-4">
          {user?.subscriptionStatus === "active" ? (
            <div className="relative overflow-hidden rounded-lg bg-white shadow-xl shadow-primary/5 border-primary border">
              {/* Header: Blue Gradient Section */}
              <div className="relative bg-gradient-brand p-5 text-white overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>

                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/30 shadow-inner">
                      <Crown className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-[10px] font-bold text-white/70 uppercase tracking-[0.2em] mb-0.5 leading-none">
                        Status Langganan
                      </h3>
                      <p className="text-xl font-black tracking-tight leading-tight">
                        {user.subscriptionPlan}
                      </p>
                    </div>
                  </div>
                  <div className="bg-white/20 px-3.5 py-1.5 rounded-full backdrop-blur-md border border-white/30 shadow-sm flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Body: Details with White Background */}
              <div className="p-5 bg-white relative">
                <div className="grid grid-cols-2 gap-y-4 gap-x-4 relative">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" />
                      <p className="text-[10px] font-bold uppercase tracking-widest">
                        Tgl Pembelian
                      </p>
                    </div>
                    <p className="text-sm font-bold text-foreground pl-5">
                      {formatDate(user.order?.paidAt || user.createdAt)}
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Sparkles className="w-3.5 h-3.5" />
                      <p className="text-[10px] font-bold uppercase tracking-widest">
                        Durasi
                      </p>
                    </div>
                    <p className="text-sm font-bold text-foreground pl-5">
                      {user.order?.snapshot?.durationMonths || 1} Bulan
                    </p>
                  </div>

                  {/* Expiry Section: Minimalist Style */}
                  <div className="col-span-2 pt-5 border-t border-dashed border-border flex items-center justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" />
                        <p className="text-[10px] font-bold uppercase tracking-widest">
                          Berlaku Sampai
                        </p>
                      </div>
                      <p className="text-sm font-bold text-primary pl-5">
                        {formatDate(user.subscriptionExpiry)}
                      </p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10">
                      <CheckCircle2 className="w-5 h-5 text-primary/70" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative aspect-[360/113] w-full overflow-hidden rounded-2xl">
              <Image
                src="/img/banner-donate.png"
                alt="Subscription Banner"
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
        </div>

        {/* Hero */}
        <div className="px-4 pt-5 flex items-center gap-4">
          <div className="shrink-0 w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Crown className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg font-extrabold tracking-tight text-foreground leading-tight">
                Pilih Paket Langganan
              </h1>
              <Sparkles className="w-4 h-4 text-yellow-400 shrink-0" />
            </div>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              Nikmati fitur premium tanpa batas, pilih durasi yang sesuai
              kebutuhanmu.
            </p>
          </div>
        </div>

        {/* Package list */}
        <div className="px-4 mt-5">
          {error ? (
            <div className="text-center py-12">
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          ) : (
            <SubscriptionList
              packages={packages}
              isLoading={isLoading}
              onBuy={handleBuy}
              processingId={processingId}
            />
          )}
        </div>
      </main>
    </div>
  );
}
