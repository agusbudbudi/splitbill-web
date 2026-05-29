"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Crown,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Zap,
  Scan,
  ShieldCheck,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { ActiveSubscriptionCard } from "@/components/subscription/ActiveSubscriptionCard";
import { getCurrentUser, type User } from "@/lib/api/auth";
import { cn, formatDate } from "@/lib/utils";
import { getAccessToken } from "@/lib/auth/tokens";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function MembershipClientPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = getAccessToken();
      if (!token) {
        router.push("/login?redirect=/membership");
        return;
      }

      setIsLoading(true);
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center">
        <Header title="Membership" showBackButton />
        <main className="w-full max-w-[600px] p-4 space-y-4">
          <div className="h-48 w-full bg-muted animate-pulse rounded-2xl" />
          <div className="h-64 w-full bg-muted animate-pulse rounded-2xl" />
        </main>
      </div>
    );
  }

  const isSubscribed = user?.subscriptionStatus === "active";

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <Header title="Membership" showBackButton />

      <main className="w-full max-w-[600px] pb-10 px-4 pt-4">
        {isSubscribed && user ? (
          <div className="space-y-6">
            <ActiveSubscriptionCard user={user} />

            <div className="space-y-4">
              <div className="space-y-1 px-1">
                <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                  Fitur Premium Kamu
                </h2>
                <p className="text-[12px] text-muted-foreground leading-relaxed">
                  Kamu memiliki akses penuh ke seluruh fitur unggulan SplitBill untuk pengalaman tanpa batas.
                </p>
              </div>

              <div className="border border-primary rounded-2xl bg-white overflow-hidden shadow-sm">
                <div className="grid grid-cols-[1.2fr_1fr_1fr] gap-0 bg-primary/5 border-b border-primary">
                  <span className="p-3.5 text-[11px] font-black uppercase tracking-widest text-muted-foreground border-r border-primary/20">
                    Fitur
                  </span>
                  <span className="p-3.5 text-center text-[11px] font-black uppercase tracking-widest text-muted-foreground border-r border-primary/20">
                    Gratis
                  </span>
                  <span className="p-3.5 text-center text-[11px] font-black uppercase tracking-widest text-primary">
                    👑 Premium
                  </span>
                </div>

                <div className="divide-y divide-primary/20">
                  {[
                    { label: "Scan Struk AI", free: "5x", premium: "Unlimited" },
                    { label: "History Transaksi", free: "7 Hari", premium: "Selamanya" },
                    { label: "Tanpa Iklan", free: "No", premium: "Yes" },
                    { label: "Support Prioritas", free: "No", premium: "Yes" },
                    { label: "Badge Premium", free: "No", premium: "Yes" },
                  ].map((row, i) => (
                    <div key={i} className="grid grid-cols-[1.2fr_1fr_1fr] gap-0 items-center">
                      <span className="p-3.5 text-[13px] font-bold text-foreground/80 border-r border-primary/20 h-full flex items-center">
                        {row.label}
                      </span>
                      <span className="p-3.5 text-center text-[12px] font-black text-muted-foreground italic border-r border-primary/20 h-full flex items-center justify-center">
                        {row.free}
                      </span>
                      <span className="p-3.5 text-center text-[13px] font-black text-primary h-full flex items-center justify-center bg-primary/5 font-black">
                        {row.premium}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Button
              variant="default"
              className="w-full h-14 rounded-[1.2rem] shadow-lg shadow-primary/25 transition-all group"
              onClick={() => router.push("/subscription")}
            >
              <div className="flex items-center justify-center gap-2 text-white">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-sm font-black">Perpanjang Langgananmu</span>
              </div>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Promo Card - Bright & Vibrant */}
            <div className="relative overflow-hidden rounded-lg bg-gradient-to-b from-primary/10 via-transparent to-transparent p-4 sm:p-6">
              {/* Background Glows */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]" />

              <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center shadow-lg shadow-primary/30 rotate-3">
                  <Crown className="w-8 h-8 text-white" />
                </div>

                <div className="space-y-2">
                  <h1 className="text-3xl font-black tracking-tight leading-tight text-foreground">
                    Upgrade ke <span className="text-primary">Premium</span>
                  </h1>
                  <p className="text-sm text-muted-foreground font-medium max-w-[280px]">
                    Nikmati fitur eksklusif dan kemudahan tanpa batas dalam
                    mengelola tagihanmu.
                  </p>
                </div>

                {/* Bordered Comparison Table - Larger Text & Primary Borders */}
                <div className="w-full pt-4 mb-2">
                  <div className="border border-primary rounded-2xl bg-white overflow-hidden">
                    <div className="grid grid-cols-[1.2fr_1fr_1fr] gap-0 bg-primary/5 border-b border-primary">
                      <span className="p-3.5 text-[11px] font-black uppercase tracking-widest text-muted-foreground border-r border-primary/20">
                        Fitur
                      </span>
                      <span className="p-3.5 text-center text-[11px] font-black uppercase tracking-widest text-muted-foreground border-r border-primary/20">
                        Gratis
                      </span>
                      <span className="p-3.5 text-center text-[11px] font-black uppercase tracking-widest text-primary">
                        👑 Premium
                      </span>
                    </div>

                    <div className="divide-y divide-primary/20">
                      {[
                        {
                          label: "Scan Struk AI",
                          free: "5x",
                          premium: "Unlimited",
                        },
                        {
                          label: "History Transaksi",
                          free: "7 Hari",
                          premium: "Selamanya",
                        },
                        {
                          label: "Tanpa Iklan",
                          free: "No",
                          premium: "Yes",
                        },
                        {
                          label: "Support Prioritas",
                          free: "No",
                          premium: "Yes",
                        },
                        {
                          label: "Badge Premium",
                          free: "No",
                          premium: "Yes",
                        },
                      ].map((row, i) => (
                        <div
                          key={i}
                          className="grid grid-cols-[1.2fr_1fr_1fr] gap-0 items-center"
                        >
                          <span className="p-3.5 text-[13px] font-bold text-foreground/80 border-r border-primary/20 h-full flex items-center">
                            {row.label}
                          </span>
                          <span className="p-3.5 text-center text-[12px] font-black text-muted-foreground italic border-r border-primary/20 h-full flex items-center justify-center">
                            {row.free}
                          </span>
                          <span className="p-3.5 text-center text-[13px] font-black text-primary h-full flex items-center justify-center bg-primary/5">
                            {row.premium}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full h-14 rounded-2xl bg-primary text-white hover:bg-primary/90 shadow-xl shadow-primary/30 text-base font-black transition-all active:scale-[0.98] mt-4"
                  onClick={() => router.push("/subscription")}
                >
                  Lihat Paket Langganan
                  <Sparkles className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>

            {/* Secondary Info */}
            <Card className="p-5 border-none shadow-soft bg-white/50 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    Sudah Pernah Berlangganan?
                  </h3>
                  <p className="text-[12px] text-muted-foreground leading-relaxed">
                    Cek riwayat pesananmu untuk melihat status pembayaran
                    sebelumnya.
                  </p>
                  <button
                    onClick={() => router.push("/profile/orders")}
                    className="text-[12px] font-black text-primary mt-1 hover:underline cursor-pointer"
                  >
                    Riwayat Pesanan
                  </button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
