"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { fetchBanners, getCachedBanners } from "@/lib/api/banners";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { useSplitBillStore } from "@/store/useSplitBillStore";
import { demoData } from "@/lib/demoData";
import { Sparkles, Play } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useWalletStore } from "@/store/useWalletStore";

interface BannerItem {
  id: string | number;
  image: string;
  alt: string;
  href: string;
}

export const Banner = () => {
  const [isMounted, setIsMounted] = useState(false);
  const defaultBanners = [
    {
      id: "default",
      image: "/img/pwa-banner.png",
      alt: "SplitBill Online — Aplikasi Bagi Tagihan Gratis & Scan Struk AI",
      href: "/split-bill",
    },
    {
      id: "all-feature",
      image: "/img/banner-all-feature.png",
      alt: "SplitBill Online — Semua Fitur Kece",
      href: "/split-bill",
    },
    {
      id: "donate",
      image: "/img/banner-donate.png",
      alt: "Dukung SplitBill dengan Donasi",
      href: "/donate",
    },
    {
      id: "review",
      image: "/img/ads-review.png",
      alt: "Beri Review & Masukan",
      href: "/review",
    },
  ];

  const [banners, setBanners] = useState<BannerItem[]>(defaultBanners);
  const [current, setCurrent] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadedImages, setLoadedImages] = useState<
    Record<string | number, boolean>
  >({});
  const router = useRouter();
  const { setIsDemoMode, setHasSeenTutorial } = useOnboardingStore();
  const {
    people,
    expenses,
    additionalExpenses,
    addPerson,
    addExpense,
    addAdditionalExpense,
    setActivityName,
    clearDraftAfterFinalize,
  } = useSplitBillStore();

  const { savedBills } = useWalletStore();

  const isTrulyNewUser =
    people.length === 0 &&
    expenses.length === 0 &&
    additionalExpenses.length === 0 &&
    savedBills.length === 0;

  const handleStartDemo = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Reset stores
    clearDraftAfterFinalize();

    // Populate with demo data
    setActivityName(demoData.activityName);
    demoData.people.forEach((p) => addPerson(p));
    demoData.expenses.forEach((e) => addExpense(e));
    demoData.additionalExpenses.forEach((ae) => addAdditionalExpense(ae));

    // Setup onboarding
    setIsDemoMode(true);
    setHasSeenTutorial(true); // Don't show tutorial during demo, or maybe show it?
    // Let's show the tutorial during demo to make it more interactive

    router.push("/split-bill");
  };

  /** Derive descriptive alt text from a banner route for SEO & accessibility */
  const getAltFromRoute = (route: string): string => {
    const routeAltMap: Record<string, string> = {
      "/split-bill":
        "Split Bill — Bagi Tagihan Restoran Secara Adil dan Otomatis",
      "/shared-goals": "Shared Goals — Nabung Bareng & Patungan dengan Teman",
      "/collect-money":
        "Collect Money — Kumpulkan Uang Iuran dari Teman Secara Online",
      "/invoice": "Invoice Online — Buat Tagihan Profesional Gratis",
      "/wallet": "Wallet — Kelola Metode Pembayaran Kamu",
      "/donate": "Donasi — Dukung Pengembangan SplitBill",
      "/review": "Review Split Bill — Berikan Penilaianmu",
    };
    for (const [key, label] of Object.entries(routeAltMap)) {
      if (route.startsWith(key)) return label;
    }
    return "SplitBill — Aplikasi Bagi Tagihan Online Gratis";
  };

  useEffect(() => {
    setIsMounted(true);

    // Initial load from cache to prevent layout shift
    const cached = getCachedBanners();
    if (cached.length > 0) {
      const mappedBanners: BannerItem[] = cached.map((b) => ({
        id: b._id,
        image: b.image,
        alt: getAltFromRoute(b.route),
        href: b.route,
      }));
      const merged = [...mappedBanners];
      if (merged.length < 4) {
        defaultBanners.forEach((db) => {
          if (!merged.some((b) => b.id === db.id || b.href === db.href)) {
            merged.push(db);
          }
        });
      }
      setBanners(merged);
    }

    // Fetch banners from backend (will use cache if fresh)
    const loadBanners = async () => {
      try {
        const data = await fetchBanners();
        if (data && data.length > 0) {
          const mappedBanners: BannerItem[] = data.map((b) => ({
            id: b._id,
            image: b.image,
            alt: getAltFromRoute(b.route),
            href: b.route,
          }));
          const merged = [...mappedBanners];
          if (merged.length < 4) {
            defaultBanners.forEach((db) => {
              if (!merged.some((b) => b.id === db.id || b.href === db.href)) {
                merged.push(db);
              }
            });
          }
          setBanners(merged);
        }
      } catch (error) {
        console.error("Failed to fetch banners:", error);
        // Fallback or error handling if no cache and fetch fails
      }
    };

    loadBanners();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (banners.length <= visibleCards) return;

    const timer = setInterval(() => {
      setCurrent((prev) => {
        const maxIndex = banners.length - visibleCards;
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length, visibleCards]);

  // Removed !isMounted gate to allow initial render for SEO and to prevent CLS.
  // The client-side banner logic will hydrate afterwards.

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    const maxIndex = Math.max(0, banners.length - visibleCards);

    if (isLeftSwipe) {
      setCurrent((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }
    if (isRightSwipe) {
      setCurrent((prev) => (prev <= 0 ? maxIndex : prev - 1));
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden bg-transparent rounded-sm md:rounded-lg isolate z-0"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex gap-2 md:gap-6 transition-transform duration-500 ease-out will-change-transform"
        style={{ transform: `translateX(calc(-${current} * (${visibleCards === 2 ? "50% + 4px" : "33.333% + 8px"})))` }}
      >
        {banners.map((banner, index) => (
          <Link
            key={banner.id}
            href={banner.href}
            className={cn(
              "w-[calc(50%-4px)] md:w-[calc(33.333%-16px)]",
              "aspect-[1080/608] shrink-0 block relative z-20 group rounded-sm md:rounded-lg overflow-hidden transition-all duration-300"
            )}
          >
            <div className="relative h-full w-full overflow-hidden cursor-pointer leading-[0] rounded-sm md:rounded-lg">
              {/* Skeleton Loader */}
              {!loadedImages[banner.id] && (
                <div className="absolute inset-0 z-10 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_infinite] h-full w-full" />
              )}

              <Image
                src={banner.image}
                alt={banner.alt}
                width={1080}
                height={608}
                className={cn(
                  "w-full h-full block object-cover transition-all duration-700 group-hover:scale-105",
                  !loadedImages[banner.id] ? "opacity-0" : "opacity-100",
                )}
                priority={index < visibleCards}
                draggable={false}
                onLoad={() =>
                  setLoadedImages((prev) => ({ ...prev, [banner.id]: true }))
                }
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
            </div>
          </Link>
        ))}
      </div>

      {banners.length > visibleCards && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {Array.from({ length: banners.length - (visibleCards - 1) }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                "w-1.5 h-1.5 rounded-full bg-white transition-all shadow-sm cursor-pointer",
                i === current ? "w-4 opacity-100" : "opacity-50",
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
