"use client";

import React from "react";
import { Scan, Users, Send, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const steps = [
  {
    icon: Scan,
    title: "Scan Struk Otomatis",
    description:
      "Foto struk belanjaanmu dan biarkan AI kami yang mendata itemnya secara otomatis.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Users,
    title: "Pilih Teman & Item",
    description:
      "Tandai siapa saja yang ikut patungan dan pilih item yang mereka beli.",
    color: "bg-warning/10 text-warning",
  },
  {
    icon: Send,
    title: "Kirim Tagihan & Bayar",
    description:
      "Bagikan link tagihan ke teman-teman dan terima pembayaran langsung ke dompetmu.",
    color: "bg-premium/10 text-premium",
  },
];

export const BlogCTA = () => {
  return (
    <section className="w-full max-w-[600px] lg:max-w-7xl mx-auto py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
      <div className="rounded-sm bg-card p-5 shadow-soft lg:p-0 lg:bg-transparent lg:shadow-none">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-10 items-center">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="space-y-2">
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground leading-tight tracking-tight">
                <span className="block text-primary">#PakeSplitBill</span>
                3 Langkah Mudah Bagi Tagihan
              </h2>
              <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">
                Urus patungan jadi lebih cepat, adil, dan transparan.
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="w-full sm:w-fit shadow-glow group"
            >
              <Link href="/split-bill">
                Coba Split Bill
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          <ol className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <li
                  key={step.title}
                  className="flex md:flex-col gap-3 rounded-sm bg-background p-4 transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between shrink-0 md:w-full">
                    <div className={`w-10 h-10 rounded-sm ${step.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="hidden md:block text-2xl font-bold leading-none text-muted-foreground/20 tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-foreground leading-tight">{step.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
};
