"use client";

import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingBadge } from "@/components/ui/FloatingBadge";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const populerFeatures = [
  {
    id: "split",
    label: "Split Bill",
    image: "/img/menu-split-bill.png",
    badge: "Populer",
    href: "/split-bill",
  },
  {
    id: "kantong",
    label: "Split Later",
    badge: "New",
    image: "/img/menu-split-later.png",
    href: "/split-later",
  },
  {
    id: "invoice",
    badge: "Populer",
    label: "Invoice",
    image: "/img/menu-invoice.png",
    href: "/invoice",
  },
];

const allFeatures = [
  {
    id: "nabung",
    label: "SharedGoal",
    image: "/img/menu-shared-goal.png",
    href: "/shared-goals",
  },
  {
    id: "collect",
    label: "Patungan",
    image: "/img/menu-collect-money.png",
    href: "/collect-money",
  },
  {
    id: "wallet",
    label: "Wallet",
    image: "/img/menu-wallet.png",
    href: "/wallet",
  },
];

interface FeatureItem {
  id: string;
  label: string;
  image: string;
  href: string;
  badge?: string;
}

const FeatureGrid = ({ items }: { items: FeatureItem[] }) => {
  return (
    <div className="grid grid-cols-4 sm:flex sm:flex-wrap items-start justify-items-start justify-start gap-2 sm:gap-12 py-2 px-2">
      {items.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className="group flex flex-col items-center gap-2 w-[80px] cursor-pointer"
        >
          <div className="relative">
            {item.badge && <FloatingBadge>{item.badge}</FloatingBadge>}
            <div className="w-16 h-16 rounded-[30%] bg-white flex items-center justify-center transition-all group-hover:scale-105 shadow-soft border border-primary/5">
              <Image
                src={item.image}
                alt={item.label}
                width={48}
                height={48}
                className="w-12 h-12 object-contain"
              />
            </div>
          </div>
          <span className="text-[12px] text-muted-foreground group-hover:text-primary transition-colors text-center leading-tight font-medium">
            {item.label}
          </span>
        </Link>
      ))}
    </div>
  );
};

export const AllFeatureClientPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-dvh bg-background flex flex-col items-center relative">
      <Header
        title="Semua Fitur"
        showBackButton
      />

      <main className="w-full max-w-[600px] flex-1 pb-20 pt-4 px-4 relative z-10 flex flex-col">
        {/* PWA Banner */}
        <div className="w-full rounded-2xl overflow-hidden mb-4">
          <Image
            src="/img/banner-all-feature.png"
            alt="Semua Fitur Banner"
            width={600}
            height={200}
            className="w-full h-auto object-cover"
          />
        </div>

        <section className="mb-8">
          <div className="flex flex-col mb-4">
            <h2 className="text-xl font-bold text-foreground">Populer 🔥</h2>
            <p className="text-xs text-muted-foreground font-medium mt-1">
              Fitur favorit yang paling sering dipakai bestie kamu
            </p>
          </div>

          <div>
            <FeatureGrid items={populerFeatures} />
          </div>
        </section>

        <section>
          <div className="flex flex-col mb-4">
            <h2 className="text-xl font-bold text-foreground">
              Semua Fitur 🚀
            </h2>
            <p className="text-xs text-muted-foreground font-medium mt-1">
              Jelajahi fitur lengkap untuk kelola duit bareng teman
            </p>
          </div>

          <div>
            <FeatureGrid items={allFeatures} />
          </div>
        </section>
      </main>

      <Footer />

      {/* Background decorations */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[150px]" />
      </div>
    </div>
  );
};
