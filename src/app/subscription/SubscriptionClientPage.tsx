"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Crown, Sparkles } from "lucide-react";
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
import { trackSubscription } from "@/lib/gtag";

export default function SubscriptionClientPage() {
  const router = useRouter();
  const setCurrentOrder = useOrderStore((state) => state.setCurrentOrder);
  const [packages, setPackages] = useState<SubscriptionPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const packagesData = await getPublicSubscriptionPackages();
        setPackages(packagesData);
      } catch (err) {
        setError("Gagal memuat data. Coba lagi nanti.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    trackSubscription.viewPlans();
  }, []);

  const handleBuy = async (packageId: string) => {
    // Check auth
    const token = getAccessToken();
    if (!token) {
      router.push(`/login?redirect=/subscription`);
      return;
    }

    setProcessingId(packageId);
    trackSubscription.initiateCheckout(packageId);
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

      <div className="relative w-full max-w-[600px] flex-1 flex flex-col">
        {/* Gradient background */}
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary via-primary/50 to-transparent pointer-events-none z-0" />

        <main className="relative z-10 w-full pb-4">
          {/* Hero Section */}
          <div className="px-4 pt-4 flex flex-col gap-6">
            {/* <div className="relative aspect-[360/113] w-full overflow-hidden rounded-2xl">
              <Image
                src="/img/banner-donate.png"
                alt="Subscription Banner"
                fill
                className="object-cover"
                priority
              />
            </div> */}

            <div className="flex items-center gap-3">
              <div className="shrink-0 w-16 h-16 relative">
                <Image
                  src="/img/icon-vip.png"
                  alt="VIP"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-lg font-extrabold tracking-tight text-white leading-tight">
                    Pilih Paket Langganan
                  </h1>
                </div>
                <p className="text-[13px] text-white/90 leading-relaxed">
                  Nikmati fitur VIP tanpa batas, pilih durasi yang sesuai
                  kebutuhanmu.
                </p>
              </div>
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
    </div>
  );
}
