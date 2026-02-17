"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sprout, ArrowLeft, LogIn, MessageCircle } from "lucide-react";
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
}: HeaderProps) => {
  const router = useRouter();
  const { user, isAuthenticated, initialize } = useAuthStore();
  const { isPWABannerVisible } = useUIStore();
  const [scrolled, setScrolled] = React.useState(false);

  useEffect(() => {
    // Initialize auth state on mount (only runs once)
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once on mount

  useEffect(() => {
    if (!transparent) return;

    const handleScroll = () => {
      // Change background immediately when user starts scrolling
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [transparent]);

  return (
    <header
      className={cn(
        "sticky z-50 w-full flex flex-col items-center pointer-events-none transition-all duration-500",
        isPWABannerVisible ? "top-[52px]" : "top-0",
      )}
    >
      <div
        className={cn(
          "w-full max-w-[480px] text-white pointer-events-auto transition-colors duration-300",
          transparent
            ? scrolled
              ? "bg-primary"
              : "bg-transparent"
            : "bg-primary",
          className,
        )}
      >
        <div className="flex h-14 items-center px-4 gap-4">
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
                  <span className="font-bold text-lg tracking-tight leading-tight">
                    {title}
                  </span>
                )}
                {subtitle && (
                  <span className="text-[10px] font-bold text-white/100 uppercase tracking-[0.2em] -mt-0.5">
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
                  width={120}
                  height={32}
                  className="h-8 w-auto"
                  priority
                />
              </Link>

              <div className="flex items-center gap-3">
                <Link
                  href="/donate"
                  className="flex items-center gap-1.5 text-white/90 hover:text-white hover:bg-white/10 transition-colors h-8 px-3 rounded-sm"
                >
                  <Sprout className="w-4 h-4" />
                  <span className="text-xs font-bold">Donasi</span>
                </Link>

                {isAuthenticated ? (
                  <Link
                    href="/profile"
                    className={cn(
                      "flex items-center justify-center overflow-hidden rounded-full border-2 border-white/30 w-8 h-8 hover:border-white transition-all bg-white/10 backdrop-blur-sm",
                      transparent &&
                        "drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] border-white/30",
                    )}
                  >
                    <img
                      src={`https://api.dicebear.com/9.x/personas/svg?backgroundColor=b6e3f4&scale=100&seed=${user?.email || "default"}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </Link>
                ) : (
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:text-white hover:bg-white/10 h-8 px-3 rounded-sm"
                    >
                      <LogIn className="w-4 h-4 mr-1.5" />
                      <span className="text-xs font-bold">Masuk</span>
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
