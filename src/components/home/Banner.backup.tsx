"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const banners = [
  {
    id: 1,
    image: "/img/banner-splitbill.png",
    alt: "Split Bill Mudah",
  },
  {
    id: 2,
    image: "/img/banner-invoice.png",
    alt: "Scan Bill dengan AI",
  },
  {
    id: 3,
    image: "/img/banner-tabungan.png",
    alt: "Kelola Tabungan",
  },
];

export const Banner = () => {
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

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
      className="relative w-full aspect-[360/113] rounded-2xl overflow-hidden bg-gray-100"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex transition-transform duration-500 ease-out h-full"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((banner) => (
          <div key={banner.id} className="min-w-full h-full">
            <img
              src={banner.image}
              alt={banner.alt}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      <div className="absolute bottom-3 left-3 flex gap-1.5 z-10">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn(
              "w-1.5 h-1.5 rounded-full bg-white transition-all shadow-sm",
              i === current ? "w-4 opacity-100" : "opacity-50",
            )}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
