"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Participant {
  name: string;
  skipped?: boolean;
}

interface TripCardSlide {
  id: string;
  emoji: string;
  category: string;
  image: string;
  imageAlt: string;
  title: string;
  totalPrice: number;
  participants: Participant[];
  /** Override subtitle jadi chip singkat (mis. "Bagi Rata (4 Orang)") daripada daftar nama */
  splitLabel?: string;
}

// Foto avatar per orang, konsisten di semua slide
const PARTICIPANT_AVATARS: Record<string, string> = {
  Nadin: "/img/split-bill-liburan/nadin.png",
  Dimas: "/img/split-bill-liburan/dimas.png",
  Rian: "/img/split-bill-liburan/rian.png",
  Sarah: "/img/split-bill-liburan/sarah.png",
};

const SLIDES: TripCardSlide[] = [
  {
    id: "hotel",
    emoji: "🏨",
    category: "Hotel",
    image: "/img/split-bill-liburan/villa-seminyak.png",
    imageAlt: "Villa di Seminyak buat nginep squad liburan",
    title: "Villa Seminyak (2 Malam)",
    totalPrice: 1850000,
    participants: [{ name: "Nadin" }, { name: "Dimas" }, { name: "Rian" }, { name: "Sarah" }],
    splitLabel: "Bagi Rata (4 Orang)",
  },
  {
    id: "transport",
    emoji: "🚗",
    category: "Transport",
    image: "/img/split-bill-liburan/sewa-mobil.png",
    imageAlt: "Sewa mobil buat mobilitas selama trip",
    title: "Sewa Mobil + Driver",
    totalPrice: 700000,
    participants: [{ name: "Nadin" }, { name: "Dimas" }, { name: "Rian" }, { name: "Sarah" }],
  },
  {
    id: "pantai",
    emoji: "🏖️",
    category: "Tiket Pantai",
    image: "/img/split-bill-liburan/pantai-melasti.png",
    imageAlt: "Tiket masuk Pantai Melasti Bali",
    title: "Tiket Pantai Melasti",
    totalPrice: 75000,
    participants: [{ name: "Nadin" }, { name: "Rian" }, { name: "Sarah" }, { name: "Dimas", skipped: true }],
  },
  {
    id: "jajan",
    emoji: "🍽️",
    category: "Jajan Canggu",
    image: "/img/split-bill-liburan/cafe-canggu.png",
    imageAlt: "Brunch di cafe kekinian daerah Canggu",
    title: "Cafe Canggu Brunch",
    totalPrice: 480000,
    participants: [{ name: "Nadin" }, { name: "Dimas" }, { name: "Rian" }, { name: "Sarah" }],
  },
  {
    id: "aktivitas",
    emoji: "🌋",
    category: "Aktivitas Bali",
    image: "/img/split-bill-liburan/sunset-kintamani.png",
    imageAlt: "Tur sunset di Kintamani Bali",
    title: "Sunset Kintamani Tour",
    totalPrice: 425000,
    participants: [{ name: "Dimas" }, { name: "Sarah" }],
  },
];

const AUTO_SLIDE_MS = 5500;

function formatIDR(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function HeroSplitCardCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAutoSlide = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SLIDES.length);
    }, AUTO_SLIDE_MS);
  };

  useEffect(() => {
    startAutoSlide();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const goTo = (index: number) => {
    setActiveIndex(index);
    startAutoSlide();
  };

  return (
    <div
      className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto lg:mx-0"
      onMouseEnter={() => timerRef.current && clearInterval(timerRef.current)}
      onMouseLeave={startAutoSlide}
    >
      <div className="relative aspect-square">
        {/* Stacked deck illusion — dua kartu solid & miring di belakang kartu utama, asimetris (beda rotasi/jarak/skala kiri-kanan) */}
        <div
          className="absolute inset-0 z-0 -translate-x-[7%] translate-y-[3%] -rotate-[9deg] scale-[0.9] rounded-xl bg-gradient-to-br from-blue-100 to-blue-50"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 z-0 translate-x-[12%] translate-y-[8%] rotate-[5deg] scale-[0.85] rounded-xl bg-gradient-to-br from-primary/25 to-primary/10"
          aria-hidden="true"
        />

        {/* Kartu utama */}
        <div className="relative z-10 h-full w-full rounded-xl overflow-hidden shadow-soft bg-slate-100">
          {SLIDES.map((slide, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={slide.id}
                className={cn(
                  "absolute inset-0 transition-all duration-500 ease-out",
                  isActive ? "opacity-100 scale-100" : "opacity-0 scale-[1.04]"
                )}
                aria-hidden={!isActive}
              >
                <Image
                  src={slide.image}
                  alt={slide.imageAlt}
                  fill
                  priority={index === 0}
                  className="object-cover"
                  sizes="(max-width: 1024px) 90vw, 512px"
                />
                {/* Category badge — pola sama dengan numbered badge di HowItWorksSection LP utama */}
                <span className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-xl bg-white/95 backdrop-blur-sm px-4 py-2 text-sm font-black text-slate-900 shadow-md">
                  <span className="text-base leading-none" aria-hidden="true">
                    {slide.emoji}
                  </span>
                  {slide.category}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating split-bill detail card — overlap batas bawah foto, z-20 biar tetap di atas kartu belakang & gambar utama */}
      <div className="relative z-20 -mt-14 mx-4 sm:mx-6">
        <div className="relative h-[128px] sm:h-[136px]">
          {SLIDES.map((slide, index) => {
            const activeParticipants = slide.participants.filter((p) => !p.skipped);
            const skippedParticipants = slide.participants.filter((p) => p.skipped);
            const perPerson = Math.round(slide.totalPrice / activeParticipants.length);
            const namesLine =
              activeParticipants.map((p) => p.name).join(", ") +
              (skippedParticipants.length > 0
                ? ` (${skippedParticipants.map((p) => `${p.name} Skip`).join(", ")})`
                : "");
            return (
              <div
                key={slide.id}
                className={cn(
                  "absolute inset-0 bg-white border border-slate-100/80 rounded-xl shadow-[0_12px_30px_-6px_rgba(71,159,234,0.2)] px-5 py-4 transition-opacity duration-500",
                  index === activeIndex ? "opacity-100" : "opacity-0"
                )}
                aria-hidden={index !== activeIndex}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                      {slide.title}
                    </p>
                    {slide.splitLabel ? (
                      <span className="inline-block mt-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1">
                        {slide.splitLabel}
                      </span>
                    ) : (
                      <p className="text-sm text-slate-500 font-semibold mt-1 truncate">
                        {namesLine}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm text-slate-500 font-semibold">
                      {formatIDR(slide.totalPrice)}
                    </p>
                    <p className="text-lg sm:text-xl text-success font-black">
                      {formatIDR(perPerson)}
                      <span className="text-sm font-semibold">/org</span>
                    </p>
                  </div>
                </div>
                {!slide.splitLabel && (
                  <div className="flex items-center gap-1 mt-3">
                    {activeParticipants.map((p) => (
                      <span
                        key={p.name}
                        className="relative h-7 w-7 rounded-full overflow-hidden border-2 border-white bg-slate-100 -ml-2 first:ml-0"
                      >
                        {PARTICIPANT_AVATARS[p.name] ? (
                          <Image
                            src={PARTICIPANT_AVATARS[p.name]}
                            alt={p.name}
                            fill
                            className="object-cover"
                            sizes="28px"
                          />
                        ) : (
                          <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold bg-primary/10 text-primary">
                            {p.name.charAt(0)}
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Slide indicators — sama persis pola dot HowItWorksSection di LP utama */}
      <div className="flex items-center justify-center gap-2 mt-5">
        {SLIDES.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`Lihat contoh split ${slide.category}`}
            className={cn(
              "h-2 rounded-full transition-all duration-300 cursor-pointer",
              index === activeIndex ? "w-6 bg-primary" : "w-2 bg-slate-200 hover:bg-slate-300"
            )}
          />
        ))}
      </div>
    </div>
  );
}
