"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight,
  ChevronDown,
  LogOut,
  Wallet,
  Star,
  Share2,
  Mail,
  MessageCircle,
  Instagram,
  Heart,
} from "lucide-react";
import { PremiumBanner } from "@/components/subscription/PremiumBanner";
import Image from "next/image";
import { cn, getAvatarUrl } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAuthStore } from "@/lib/stores/authStore";
import { AdsCarousel } from "@/components/home/AdsCarousel";

import { useWalletStore } from "@/store/useWalletStore";
import { PaymentMethodCard } from "@/components/wallet/PaymentMethodCard";
import { BrandingFooter } from "@/components/layout/BrandingFooter";

// --- Reusable Components ---

interface MenuGroupProps {
  title: string;
  children: React.ReactNode;
}

const MenuGroup = ({ title, children }: MenuGroupProps) => (
  <div className="space-y-1.5">
    <h3 className="px-1 text-[11px] font-bold text-muted-foreground/60 tracking-wider uppercase">
      {title}
    </h3>
    <Card className="shadow-md overflow-hidden relative">
      <div className="divide-y divide-border/70">{children}</div>
    </Card>
  </div>
);

interface MenuItemProps {
  icon: React.ElementType;
  label: string;
  href?: string;
  onClick?: () => void;
  trailing?: React.ReactNode;
  children?: React.ReactNode;
  isExpanded?: boolean;
  count?: number;
}

const MenuItem = ({
  icon: Icon,
  label,
  href,
  onClick,
  trailing,
  children,
  isExpanded,
  count,
}: MenuItemProps) => {
  const content = (
    <div className="flex items-center justify-between p-4 hover:bg-accent/40 transition-all cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/5 group-hover:text-primary transition-all duration-300">
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground/80 tracking-tight">
            {label}
          </span>
          {count !== undefined && count > 0 && (
            <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-white text-[9px] font-black leading-none animate-in zoom-in duration-200">
              {count}
            </span>
          )}
        </div>
      </div>
      {trailing || (
        <ChevronRight className="w-4 h-4 text-muted-foreground/60 group-hover:translate-x-0.5 transition-transform" />
      )}
    </div>
  );

  const wrapper = href ? (
    href.startsWith("http") ? (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    ) : (
      <Link href={href}>{content}</Link>
    )
  ) : (
    <div onClick={onClick}>{content}</div>
  );

  return (
    <div className="flex flex-col w-full">
      {wrapper}
      {children && isExpanded && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-500 ease-out border-t border-border/70 overflow-hidden bg-muted/30">
          {children}
        </div>
      )}
    </div>
  );
};

export function ProfilePanel() {
  const router = useRouter();
  const { user: authUser, logout } = useAuthStore();
  const { paymentMethods } = useWalletStore();
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Use auth user data or fallback to defaults
  const user = authUser || {
    name: "Guest User",
    email: "guest@splitbill.app",
  };

  const avatarUrl = getAvatarUrl(user);

  const handleLogout = async () => {
    if (confirm("Apakah Anda yakin ingin logout?")) {
      setIsLoggingOut(true);
      try {
        await logout();
        router.push("/");
      } catch (error) {
        console.error("Logout failed:", error);
      } finally {
        setIsLoggingOut(false);
      }
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: "SplitBill Online - Bagi Tagihan Jadi Gampang! ✨",
      text: "Guys, cobain deh SplitBill Online. Bisa scan struk otomatis pakai AI, hitung fair share, dan langsung dapet ringkasan pembayarannya. Praktis banget buat patungan! 🍱✈️",
      url: "https://www.splitbill.my.id",
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.log("Error sharing:", err);
        }
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(
          `${shareData.text} \n\nCek di sini: ${shareData.url}`,
        );
        alert("Link berhasil di-copy ke clipboard!");
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  return (
    <div className="relative w-full flex-1 flex flex-col">
      <main className="relative z-10 w-full">
        <div className="space-y-6">
          {/* User Profile Section */}
          <Card className="shadow-md overflow-hidden relative">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "relative flex items-center justify-center rounded-full transition-all duration-500",
                      authUser?.subscriptionStatus === "active"
                        ? "w-14 h-14 p-[3px] bg-gradient-gold shadow-[0_0_15px_rgba(246,226,122,0.3)]"
                        : "w-12 h-12 border-2 border-primary/20 bg-primary/5 shadow-sm",
                    )}
                  >
                    <div className="w-full h-full rounded-full overflow-hidden bg-white/20">
                      <img
                        src={avatarUrl}
                        alt="User Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {authUser?.subscriptionStatus === "active" && (
                      <div className="absolute -bottom-0 -right-0 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-100 z-10 p-0.5">
                        <Image
                          src="/img/icon-vip.png"
                          alt="VIP"
                          width={18}
                          height={18}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h2 className="font-bold text-lg leading-tight tracking-tight text-foreground">
                        {user.name}
                      </h2>
                      {authUser?.subscriptionStatus === "active" && (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-primary to-violet-600 text-[10px] font-black text-white uppercase tracking-wider">
                          <span>VIP</span>
                        </div>
                      )}
                    </div>
                    <p className="text-[13px] font-medium text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Banner inside card */}
            <PremiumBanner
              status={(authUser?.subscriptionStatus as "active" | "expired" | "free") ?? "free"}
              className="m-0"
              embedded
            />
          </Card>


          {/* Wallet Saya Section */}
          {paymentMethods.length > 0 && (
            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-sm font-bold text-foreground tracking-wider flex items-center gap-2">
                  Wallet Saya
                  <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-primary text-white text-[10px] font-black tabular-nums">
                    {paymentMethods.length}
                  </span>
                </h3>
              </div>

              <div className="flex overflow-x-auto gap-3 pb-3 mb-0 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="snap-center shrink-0">
                    <PaymentMethodCard
                      method={method}
                      onDelete={() => { }}
                    />
                  </div>
                ))}

                {/* Lihat Semua Wallet Card */}
                <div className="snap-center shrink-0">
                  <Card
                    onClick={() => router.push("/member/wallet")}
                    className="relative w-[42vw] sm:w-[220px] shrink-0 aspect-[1.4/1] rounded-md border border-slate-200 bg-white hover:border-slate-300 flex flex-col items-center justify-center gap-2 text-slate-600 hover:text-primary transition-all active:scale-95 cursor-pointer shadow-none"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-700">Lihat Semua Wallet</span>
                  </Card>
                </div>
              </div>
            </div>
          )}

          <MenuGroup title="Preferensi & Masukan">
            <MenuItem icon={Star} label="Ulasan & Feedback" href="/review" />
          </MenuGroup>

          <MenuGroup title="Dukungan & Komunitas">
            <MenuItem icon={Heart} label="Support Developer" href="/donate" />
            <MenuItem
              icon={Share2}
              label="Share SplitBill"
              onClick={handleShare}
              trailing={
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-all duration-300 group-active:scale-95">
                  <Share2 className="w-4 h-4" />
                </div>
              }
            />
            <MenuItem
              icon={Mail}
              label="Kontak Kami"
              onClick={() => setIsContactOpen(!isContactOpen)}
              isExpanded={isContactOpen}
              trailing={
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-muted-foreground/40 transition-transform duration-500",
                    isContactOpen && "rotate-180",
                  )}
                />
              }
            >
              <div className="bg-muted/30 divide-y divide-border/40">
                <a
                  href="https://api.whatsapp.com/send?phone=6285559496968&text=Hi%20Admin%20%F0%9F%91%8B%0AMau%20tanya%20dong%20soal%20aplikasi%20split%20bill%20%F0%9F%99%8F"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 hover:bg-accent/40 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-xs font-semibold text-foreground/70">
                      WhatsApp
                    </span>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground/80">
                    085559496968
                  </span>
                </a>

                <a
                  href="mailto:split.bill.apps@gmail.com"
                  className="flex items-center justify-between p-4 hover:bg-accent/40 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-xs font-semibold text-foreground/70">
                      Email
                    </span>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground/80">
                    split.bill.apps@gmail.com
                  </span>
                </a>

                <a
                  href="https://instagram.com/splitbill.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 hover:bg-accent/40 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <Instagram className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-xs font-semibold text-foreground/70">
                      Instagram
                    </span>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground/80">
                    @splitbill.app
                  </span>
                </a>
              </div>
            </MenuItem>
          </MenuGroup>

          <div className="pt-2 pb-2 mb-0">
            <AdsCarousel />
          </div>

          <div className="pt-2">
            <Button
              variant="ghost"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full h-14 rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive transition-all flex items-center justify-center gap-3 active:scale-[0.98] group"
            >
              <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-sm font-bold">Keluar dari Akun</span>
            </Button>
          </div>

          <BrandingFooter className="pt-8" />
        </div>
      </main>
    </div>
  );
}
