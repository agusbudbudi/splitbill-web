"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, LogIn, MessageCircle, Crown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/stores/authStore";
import { useRouter } from "next/navigation";
import { useUIStore } from "@/lib/stores/uiStore";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  children?: React.ReactNode;
  className?: string;
  transparent?: boolean;
  rightContent?: React.ReactNode;
  alignTitle?: "center" | "left";
  sticky?: boolean;
  wide?: boolean;
}

export const Header = ({
  title,
  subtitle,
  showBackButton,
  onBack,
  children,
  className,
  transparent = false,
  rightContent,
  alignTitle = "center",
  sticky = true,
  wide = false,
}: HeaderProps) => {
  const router = useRouter();
  const { user, isAuthenticated, initialize } = useAuthStore();
  const { isPWABannerVisible } = useUIStore();
  const [scrolled, setScrolled] = React.useState(false);

  useEffect(() => {
    // Initialize auth state on mount (only runs once)
    initialize();
  }, []);

  return (
    <header
      className={cn(
        "z-50 w-full flex flex-col items-center bg-primary pointer-events-auto transition-all duration-500 mx-auto",
        sticky && "sticky top-0",
        wide ? "max-w-full" : "max-w-[600px]",
        className,
      )}
    >
      <div
        className={cn(
          "w-full mx-auto text-white transition-colors duration-300 pt-safe",
          wide ? "max-w-[600px] lg:max-w-7xl" : "max-w-[600px]"
        )}
      >
        <div className="flex h-14 lg:h-16 items-center px-4 gap-4">
          {title || showBackButton ? (
            <div className="flex-1 flex items-center justify-between gap-2">
              <div className="w-10 flex items-center">
                {showBackButton && (
                  <>
                    {onBack ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-10 w-10 hover:bg-white/10 transition-colors cursor-pointer"
                        onClick={onBack}
                      >
                        <ArrowLeft className="w-5 h-5 text-white" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-10 w-10 hover:bg-white/10 transition-colors cursor-pointer"
                        onClick={() => router.back()}
                      >
                        <ArrowLeft className="w-5 h-5 text-white" />
                      </Button>
                    )}
                  </>
                )}
              </div>

              <div
                className={cn(
                  "flex-1 flex flex-col",
                  alignTitle === "center"
                    ? "items-center text-center"
                    : "items-start text-left",
                )}
              >
                {title && (
                  <span className="font-bold text-lg lg:text-xl tracking-tight leading-tight">
                    {title}
                  </span>
                )}
                {subtitle && (
                  <span className="text-[10px] lg:text-[10px] font-bold text-white/100 uppercase tracking-[0.2em] -mt-0.5">
                    {subtitle}
                  </span>
                )}
              </div>

              <div className="min-w-[40px] flex items-center justify-end">
                {rightContent}
              </div>
            </div>
          ) : (
            <div className="w-full flex items-center justify-between">
              <Link
                href="/"
                className="flex items-center gap-2 group"
                aria-label="SplitBill Home"
              >
                <Image
                  src="/img/logo.png"
                  alt="SplitBill Logo"
                  width={130}
                  height={36}
                  className="h-8 lg:h-9 w-auto"
                  priority
                />
              </Link>

              <div className="flex items-center gap-3 lg:gap-5">

                {isAuthenticated ? (
                  <Link
                    href="/profile"
                    className={cn(
                      "group relative flex items-center justify-center rounded-full transition-all duration-300",
                      user?.subscriptionStatus === "active"
                        ? "w-9 h-9 lg:w-10 lg:h-10 p-[2px] bg-gradient-gold shadow-[0_0_10px_rgba(246,226,122,0.4)] hover:scale-105"
                        : "w-8 h-8 lg:w-9 lg:h-9 border-2 border-white/30 hover:border-white bg-white/10 backdrop-blur-sm",
                    )}
                  >
                    <div className="w-full h-full rounded-full overflow-hidden bg-white/20">
                      <img
                        src={`https://api.dicebear.com/9.x/personas/svg?backgroundColor=b6e3f4&scale=100&seed=${user?.email || "default"}`}
                        alt={`Avatar Profil ${user?.name || "Pengguna"} — SplitBill Online`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {user?.subscriptionStatus === "active" && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-gold rounded-full flex items-center justify-center shadow-sm z-10">
                        <Crown className="w-2 h-2 lg:w-2.5 lg:h-2.5 text-white fill-white" />
                      </div>
                    )}
                  </Link>
                ) : (
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:text-white hover:bg-white/10 h-8 lg:h-10 px-3 lg:px-5 rounded-sm lg:rounded-lg"
                    >
                      <LogIn className="w-4 h-4 lg:w-4.5 lg:h-4.5 mr-1.5" />
                      <span className="text-xs lg:text-sm font-bold">Masuk</span>
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
        {children}
      </div>
    </header>
  );
};
