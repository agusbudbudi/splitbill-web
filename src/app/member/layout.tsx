"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChatAgentFAB } from "@/components/splitbill/chat/ChatAgentFAB";
import { ChatRoom } from "@/components/splitbill/chat/ChatRoom";
import { MemberSidebarNav } from "@/components/member/MemberSidebarNav";
import { PwaInstallBanner } from "@/components/member/PwaInstallBanner";

export default function MemberV2Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [bannerHeight, setBannerHeight] = useState(0);
  const headerWrapperRef = React.useRef<HTMLDivElement>(null);
  const bannerWrapperRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
  }, [isMenuOpen]);

  useEffect(() => {
    const el = headerWrapperRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      setHeaderHeight(entries[0].contentRect.height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = bannerWrapperRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      setBannerHeight(entries[0].contentRect.height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const sidebarTop = headerHeight + bannerHeight;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background flex flex-col items-center">
        <div ref={headerWrapperRef} className="fixed top-0 left-0 right-0 z-50">
          <Header
            wide
            sticky={false}
            containerClassName="max-w-[600px] lg:max-w-5xl px-4 sm:px-6 lg:px-8"
            leftContent={
              <button
                onClick={() => setIsMenuOpen(true)}
                className="lg:hidden p-2 -ml-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer text-white"
                aria-label="Buka menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            }
          />
        </div>

        <div
          ref={bannerWrapperRef}
          className="fixed left-0 right-0 z-40"
          style={{ top: headerHeight }}
        >
          <PwaInstallBanner containerClassName="max-w-[600px] lg:max-w-5xl px-4 sm:px-6 lg:px-8" />
        </div>

        {/* Spacer: header + banner are fixed (out of flow), push content down by their measured height */}
        <div
          className={headerHeight === 0 ? "h-14 lg:h-16" : undefined}
          style={headerHeight > 0 ? { height: headerHeight + bannerHeight } : undefined}
        />

        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 pb-4 sm:pb-0 lg:px-8 flex lg:gap-8">
          {/* Desktop persistent sidebar */}
          <aside
            className="hidden lg:block w-72 shrink-0 sticky overflow-y-auto py-6"
            style={{ top: sidebarTop, height: `calc(100vh - ${sidebarTop}px)` }}
          >
            <MemberSidebarNav />
          </aside>

          <main className="flex-1 min-w-0 w-full py-4 lg:py-6">
            <div className="w-full max-w-[600px] mx-auto">{children}</div>
          </main>
        </div>

        <Footer />

        <ChatAgentFAB bottomClass="bottom-24 lg:bottom-6" />
        <ChatRoom />
      </div>

      {isMounted &&
        createPortal(
          <div
            className={cn(
              "lg:hidden fixed inset-0 z-[60]",
              isMenuOpen ? "" : "pointer-events-none",
            )}
          >
            <div
              className={cn(
                "absolute inset-0 bg-black/50 transition-opacity duration-300",
                isMenuOpen ? "opacity-100" : "opacity-0",
              )}
              onClick={() => setIsMenuOpen(false)}
            />
            <div
              className={cn(
                "absolute left-0 top-0 h-full w-[80vw] max-w-[320px] bg-background shadow-xl flex flex-col transition-transform duration-300 ease-out",
                isMenuOpen ? "translate-x-0" : "-translate-x-full",
              )}
            >
              <div className="flex items-center justify-between px-4 h-14 border-b border-border/50 shrink-0">
                <span className="text-sm font-bold text-foreground">Menu</span>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 -mr-2 rounded-lg hover:bg-accent/40 transition-colors cursor-pointer"
                  aria-label="Tutup menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {isMenuOpen && (
                  <MemberSidebarNav onNavigate={() => setIsMenuOpen(false)} />
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </ProtectedRoute>
  );
}
