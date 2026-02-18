"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { BrandingFooter } from "@/components/layout/BrandingFooter";
import {
  ChevronRight,
  ChevronDown,
  LogOut,
  ReceiptText,
  Wallet,
  Laptop,
  Star,
  Share2,
  Mail,
  MessageCircle,
  Instagram,
  Sun,
  Moon,
  Heart,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuthStore } from "@/lib/stores/authStore";
import { useThemeStore } from "@/lib/stores/themeStore";

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
    <Card className="overflow-hidden border border-border/50 shadow-sm rounded-lg bg-card">
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
}

const MenuItem = ({
  icon: Icon,
  label,
  href,
  onClick,
  trailing,
  children,
  isExpanded,
}: MenuItemProps) => {
  const content = (
    <div className="flex items-center justify-between p-4 hover:bg-accent/40 transition-all cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/5 group-hover:text-primary transition-all duration-300">
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-sm font-medium text-foreground/80 tracking-tight">
          {label}
        </span>
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

export default function ProfilePage() {
  const router = useRouter();
  const { user: authUser, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const isThemeDark = theme === "dark";
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Use auth user data or fallback to defaults
  const user = authUser || {
    name: "Guest User",
    email: "guest@splitbill.app",
  };

  const avatarUrl = `https://api.dicebear.com/9.x/personas/svg?backgroundColor=b6e3f4&scale=100&seed=${encodeURIComponent(
    user.email,
  )}`;

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
      url: "https://splitbill.my.id",
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
    <ProtectedRoute>
      <div className="min-h-screen bg-background flex flex-col items-center">
        <Header title="Profil & Pengaturan" showBackButton />

        <main className="w-full max-w-[600px] pb-10">
          {/* Banner Section */}
          <div className="w-full px-4 pt-4">
            <div className="relative aspect-[360/113] w-full overflow-hidden rounded-lg">
              <img
                src="/img/banner-profile.png"
                alt="Profile Banner"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop";
                }}
              />
            </div>
          </div>

          <div className="px-4 mt-6 space-y-6">
            {/* User Profile Section */}
            <Card className="p-4 border border-border/50 shadow-sm rounded-lg bg-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 bg-primary/5 shadow-sm">
                    <img
                      src={avatarUrl}
                      alt="User Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <h2 className="font-bold text-lg leading-tight tracking-tight text-foreground">
                      {user.name}
                    </h2>
                    <p className="text-[13px] font-medium text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Akun & Finansial Section */}
            <MenuGroup title="Akun & Finansial">
              <MenuItem icon={Users} label="Teman Saya" href="/profile/friends" />
              <MenuItem icon={ReceiptText} label="Transaksi" href="/history" />
              <MenuItem icon={Wallet} label="Wallet" href="/wallet" />
            </MenuGroup>

            <MenuGroup title="Preferensi & Masukan">
              <MenuItem icon={Star} label="Ulasan & Feedback" href="/review" />
            </MenuGroup>

            <MenuGroup title="Dukungan & Komunitas">
              <MenuItem icon={Heart} label="Donasi Developer" href="/donate" />
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

            <div className="pt-2">
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full h-14 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive hover:text-destructive border border-destructive/20 hover:border-destructive/40 transition-all flex items-center justify-center gap-3 active:scale-[0.98] group"
              >
                <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm font-bold">Keluar dari Akun</span>
              </Button>
            </div>

            <BrandingFooter className="pt-8" />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
