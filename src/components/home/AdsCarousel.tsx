"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AdItem {
  id: string | number;
  image: string;
  alt: string;
  url: string;
}

const SAMPLE_ADS: AdItem[] = [
  {
    id: 0,
    image: "/img/ads-teman-saya.png",
    alt: "Kelola Teman & Kontak — Tambah daftar teman untuk bagi tagihan lebih mudah",
    url: "/profile/friends",
  },
  {
    id: 1,
    image: "/img/ads-review.png",
    alt: "Review Split Bill Online — Berikan ulasan dan bantu kami berkembang",
    url: "/review",
  },
  {
    id: 2,
    image: "/img/ads-collect-money.png",
    alt: "Collect Money — Kumpulkan iuran dan uang kas secara online dan transparan",
    url: "/collect-money",
  },
  {
    id: 3,
    image: "/img/ads-donasi.png",
    alt: "Donasi Developer — Dukung keberlangsungan server SplitBill Online",
    url: "/donate",
  },
];

export const AdsCarousel = () => {
  const renderAdContent = (ad: AdItem) => {
    const isExternal = ad.url.startsWith("http");

    const Content = (
      <div className="relative aspect-[1080/1350] w-[178px] overflow-hidden rounded-2xl shadow-soft border border-white/50 backdrop-blur-sm">
        <Image
          src={ad.image}
          alt={ad.alt}
          fill
          sizes="178px"
          className="object-cover"
          draggable={false}
        />
      </div>
    );

    if (isExternal) {
      return (
        <a
          href={ad.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          {Content}
        </a>
      );
    }

    return (
      <Link href={ad.url} className="block">
        {Content}
      </Link>
    );
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3 px-1">
        <div className="space-y-0.5">
          <h2 className="text-md font-bold text-foreground">
            Tips & Update 🤩
          </h2>
          <p className="text-xs text-muted-foreground font-medium">
            Jangan sampai ketinggalan info menarik!
          </p>
        </div>
      </div>

      {/* Horizontal Scroll Container with Bleed Effect */}
      <div className="relative -mx-4 overflow-hidden">
        <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide px-4 scroll-pl-4 scroll-pr-4">
          {SAMPLE_ADS.map((ad) => (
            <div key={ad.id} className="flex-shrink-0 snap-start">
              {renderAdContent(ad)}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
