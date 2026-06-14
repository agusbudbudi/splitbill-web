"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Zap,
  Scan,
  ShieldCheck,
  Check,
  X,
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

  const renderCell = (val: string, colorClass?: string) => {
    if (val === "Yes") {
      return <Check className="w-5 h-5 text-emerald-500 stroke-[3]" />;
    }
    if (val === "No") {
      return <X className="w-5 h-5 text-rose-500 stroke-[3]" />;
    }
    return <span className={colorClass}>{val}</span>;
  };

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
        <div className="relative w-full max-w-[600px] flex-1 flex flex-col">
          {/* Gradient background */}
          <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary via-primary/50 to-transparent pointer-events-none z-0" />

          <main className="relative z-10 w-full px-4 pt-4 pb-4">
            <div className="space-y-4">
              <div className="rounded-2xl border border-border/50 bg-white p-6 animate-pulse">
                <div className="flex flex-col items-center space-y-6">
                  {/* VIP Icon */}
                  <div className="w-20 h-20 rounded-full bg-muted" />
                  
                  {/* Text */}
                  <div className="space-y-3 w-full flex flex-col items-center">
                    <div className="h-8 w-48 bg-muted rounded-md" />
                    <div className="h-3 w-64 bg-muted rounded-md" />
                    <div className="h-3 w-56 bg-muted rounded-md" />
                  </div>

                  {/* Table */}
                  <div className="w-full h-[260px] bg-muted rounded-2xl" />

                  {/* Button */}
                  <div className="w-full h-14 bg-muted rounded-2xl" />
                </div>
              </div>

              {/* Secondary Card */}
              <div className="rounded-2xl border border-border/50 bg-white p-5 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-muted shrink-0" />
                  <div className="space-y-2 flex-1 pt-1">
                    <div className="h-4 w-48 bg-muted rounded-md" />
                    <div className="h-3 w-full bg-muted rounded-md" />
                    <div className="h-3 w-3/4 bg-muted rounded-md" />
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const isSubscribed = user?.subscriptionStatus === "active";

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <Header title="Membership" showBackButton />

      <div className="relative w-full max-w-[600px] flex-1 flex flex-col">
        {/* Gradient background */}
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary via-primary/50 to-transparent pointer-events-none z-0" />

        <main className="relative z-10 w-full px-4 pt-4 pb-4">
          {isSubscribed && user ? (
            <div className="space-y-4">
              <ActiveSubscriptionCard user={user} />

              <div className="space-y-4">
                <div className="space-y-1 px-1">
                  <h2 className="text-sm font-bold text-foreground uppercase">
                    Fitur VIP Kamu
                  </h2>
                  <p className="text-[12px] text-muted-foreground leading-relaxed">
                    Kamu memiliki akses penuh ke seluruh fitur unggulan SplitBill untuk pengalaman tanpa batas.
                  </p>
                </div>

                <div className="border border-primary rounded-2xl bg-white overflow-hidden shadow-sm">
                  <div className="grid grid-cols-[1.2fr_1fr_1fr] gap-0 bg-primary/5 border-b border-primary">
                    <span className="p-3.5 text-center text-[11px] font-black uppercase tracking-widest text-muted-foreground border-r border-primary/20">
                      Fitur
                    </span>
                    <span className="p-3.5 text-center text-[11px] font-black uppercase tracking-widest text-muted-foreground border-r border-primary/20">
                      Gratis
                    </span>
                    <span className="p-3.5 text-center text-[11px] font-black uppercase tracking-widest text-primary flex items-center justify-center gap-1">
                      <Image
                        src="/img/icon-vip.png"
                        alt="VIP"
                        width={20}
                        height={20}
                        className="object-contain"
                      />
                      VIP
                    </span>
                  </div>

                  <div className="divide-y divide-primary/20">
                    {[
                      { label: "Scan Struk AI", free: "5x", premium: "Unlimited" },
                      { label: "History Transaksi", free: "7 Hari", premium: "Selamanya" },
                      { label: "Tanpa Iklan", free: "No", premium: "Yes" },
                      { label: "Support Prioritas", free: "No", premium: "Yes" },
                      { label: "Badge VIP", free: "No", premium: "Yes" },
                    ].map((row, i) => (
                      <div key={i} className="grid grid-cols-[1.2fr_1fr_1fr] gap-0 items-center">
                        <span className="p-3.5 text-[13px] font-bold text-foreground/80 border-r border-primary/20 h-full flex items-center justify-center text-center">
                          {row.label}
                        </span>
                        <span className="p-3.5 text-center text-[12px] font-black text-muted-foreground italic border-r border-primary/20 h-full flex items-center justify-center">
                          {renderCell(row.free, "text-muted-foreground italic")}
                        </span>
                        <span className="p-3.5 text-center text-[13px] font-black text-primary h-full flex items-center justify-center bg-primary/5 font-black">
                          {renderCell(row.premium, "text-primary font-black")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                variant="default"
                className="w-full h-14 rounded-md shadow-lg shadow-primary/25 transition-all group"
                onClick={() => router.push("/subscription")}
              >
                <div className="flex items-center justify-center gap-2 text-white">
                  <span className="text-sm font-black">Perpanjang Langgananmu</span>
                </div>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Promo Card - Bright & Vibrant */}
              <div className="relative overflow-hidden rounded-lg p-4 sm:p-6">
                <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                  <Image
                    src="/img/icon-vip.png"
                    alt="VIP"
                    width={80}
                    height={80}
                    className="object-contain mb-3"
                  />

                  <div className="space-y-2">
                    <h1 className="text-3xl font-black tracking-tight leading-tight text-foreground">
                      Upgrade ke <span className="bg-gradient-to-r from-primary to-[#7c3aed] bg-clip-text text-transparent inline-block font-black">VIP</span>
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
                        <span className="p-3.5 text-center text-[11px] font-black uppercase tracking-widest text-muted-foreground border-r border-primary/20">
                          Fitur
                        </span>
                        <span className="p-3.5 text-center text-[11px] font-black uppercase tracking-widest text-muted-foreground border-r border-primary/20">
                          Gratis
                        </span>
                        <span className="p-3.5 text-center text-[11px] font-black uppercase tracking-widest text-primary flex items-center justify-center gap-1">
                          <Image
                            src="/img/icon-vip.png"
                            alt="VIP"
                            width={14}
                            height={14}
                            className="object-contain"
                          />
                          VIP
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
                            label: "Badge VIP",
                            free: "No",
                            premium: "Yes",
                          },
                        ].map((row, i) => (
                          <div
                            key={i}
                            className="grid grid-cols-[1.2fr_1fr_1fr] gap-0 items-center"
                          >
                            <span className="p-3.5 text-[13px] font-bold text-foreground/80 border-r border-primary/20 h-full flex items-center justify-center text-center">
                              {row.label}
                            </span>
                            <span className="p-3.5 text-center text-[12px] font-black text-muted-foreground italic border-r border-primary/20 h-full flex items-center justify-center">
                              {renderCell(row.free, "text-muted-foreground italic")}
                            </span>
                            <span className="p-3.5 text-center text-[13px] font-black text-primary h-full flex items-center justify-center bg-primary/5">
                              {renderCell(row.premium, "text-primary")}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full h-14 rounded-2xl bg-primary text-white hover:bg-primary/90 text-base font-black transition-all active:scale-[0.98] mt-4"
                    onClick={() => router.push("/subscription")}
                  >
                    Lihat Paket Langganan
                  </Button>
                </div>
              </div>

              {/* Secondary Info */}
              <Card className="p-5 border-none shadow-soft bg-white/50 backdrop-blur-sm">
                <div className="flex items-top gap-4">
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
    </div>
  );
}
