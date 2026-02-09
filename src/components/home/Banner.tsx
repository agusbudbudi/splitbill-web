"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { fetchBanners, getCachedBanners } from "@/lib/api/banners";

interface BannerItem {
  id: string | number;
  image: string;
  alt: string;
  href: string;
}

const DEFAULT_BANNERS: BannerItem[] = [
  {
    id: 1,
    image: "/img/banner-shared-goals-1.jpg",
    alt: "Shared Goals",
    href: "/shared-goals",
  },
  {
    id: 2,
    image: "/img/banner-invoice.jpg",
    alt: "Invoice",
    href: "/invoice",
  },
  {
    id: 3,
    image: "/img/banner-collect-money.jpg",
    alt: "Collect Money",
    href: "/collect-money",
  },
  {
    id: 4,
    image: "/img/banner-shared-goals.jpg",
    alt: "Shared Goals",
    href: "/shared-goals",
  },
  {
    id: 5,
    image: "/img/banner-splitbill.jpg",
    alt: "Split Bill",
    href: "/split-bill",
  },
  {
    id: 6,
    image: "/img/banner-scan-ai.png",
    alt: "Scan AI",
    href: "/split-bill?step=2",
  },
];

export const Banner = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [banners, setBanners] = useState<BannerItem[]>(DEFAULT_BANNERS);
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);

    // Initial load from cache to prevent layout shift
    const cached = getCachedBanners();
    if (cached.length > 0) {
      const mappedBanners: BannerItem[] = cached.map((b) => ({
        id: b._id,
        image: b.image,
        alt: "Banner",
        href: b.route,
      }));
      setBanners(mappedBanners);
    }

    // Fetch banners from backend (will use cache if fresh)
    const loadBanners = async () => {
      try {
        const data = await fetchBanners();
        if (data && data.length > 0) {
          const mappedBanners: BannerItem[] = data.map((b) => ({
            id: b._id,
            image: b.image,
            alt: "Banner", // Backend doesn't provide alt text yet
            href: b.route,
          }));
          setBanners(mappedBanners);
        }
      } catch (error) {
        console.error("Failed to fetch banners:", error);
        // Fallback to DEFAULT_BANNERS if no cache and fetch fails
      }
    };

    loadBanners();
  }, []);

  useEffect(() => {
    if (banners.length === 0) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (!isMounted) {
    return (
      <div className="w-full aspect-[480/280] bg-gray-100 rounded-b-[20px] animate-pulse" />
    );
  }

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

    if (isLeftSwipe) {
      setCurrent((prev) => (prev + 1) % banners.length);
    }
    if (isRightSwipe) {
      setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden bg-gray-100 rounded-b-[20px]"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((banner, index) => (
          <Link
            key={banner.id}
            href={banner.href}
            className="min-w-full block relative z-20 group"
          >
            <div className="relative overflow-hidden cursor-pointer leading-[0]">
              <Image
                src={banner.image}
                alt={banner.alt}
                width={480}
                height={280}
                className="w-full aspect-[480/280] block object-cover transition-transform duration-700 group-hover:scale-105"
                priority={index === 0}
                draggable={false}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
            </div>
          </Link>
        ))}
      </div>

      {banners.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {banners.map((_, i) => (
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
