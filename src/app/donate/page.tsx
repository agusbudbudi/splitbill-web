"use client";

import React from "react";
import { Header } from "@/components/layout/Header";
import { Copy, Coffee, Heart } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { BrandingFooter } from "@/components/layout/BrandingFooter";
import Image from "next/image";

interface DonationMethodProps {
  logo: string;
  name: string;
  accountNumber: string;
  bankName: string;
}

const DonationMethod = ({
  logo,
  name,
  accountNumber,
  bankName,
}: DonationMethodProps) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(accountNumber);
    toast.success(`${bankName} account number copied!`);
  };

  return (
    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50 group transition-all hover:bg-muted/50">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center p-1 relative overflow-hidden">
          <Image
            src={logo}
            alt={bankName}
            fill
            className="object-contain p-1"
          />
        </div>
        <div className="space-y-0.5">
          <p className="text-[13px] font-bold text-foreground leading-tight">
            {name}
          </p>
          <p className="text-sm font-medium text-muted-foreground tracking-tight">
            {accountNumber}
          </p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleCopy}
        className="text-muted-foreground/60 hover:text-primary hover:bg-primary/5 transition-colors"
      >
        <Copy className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default function DonatePage() {
  const donationMethods = [
    {
      logo: "/img/logo-ovo.png",
      name: "Agus Budiman",
      accountNumber: "085559496968",
      bankName: "OVO",
    },
    {
      logo: "/img/logo-dana.png",
      name: "Agus Budiman",
      accountNumber: "085559496968",
      bankName: "DANA",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <Header title="Donasi Developer" showBackButton />

      <main className="w-full max-w-[600px] pb-10">
        {/* Banner Section */}
        <div className="w-full px-4 pt-4">
          <div className="relative aspect-[360/113] w-full overflow-hidden rounded-lg">
            <Image
              src="/img/banner-donate.png"
              alt="Donate Banner"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        <div className="px-4 mt-6 space-y-6">
          {/* Welcome Card */}
          <Card className="p-6 border border-border/50 shadow-md rounded-2xl bg-card relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] rotate-12">
              <Coffee className="w-24 h-24" />
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Coffee className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-lg tracking-tight">
                Traktir Kopi Developer
              </h2>
            </div>

            <div className="space-y-4 text-[14px] leading-relaxed text-muted-foreground/90 font-medium">
              <p>
                Split Bill ini saya buat agar patungan jadi lebih gampang, tanpa
                drama, dan transparan bagi semua orang.
              </p>
              <p>
                Jika aplikasi ini bermanfaat, dukungan darimu akan sangat
                membantu biaya operasional server dan membuat saya semakin
                semangat menghadirkan fitur-fitur baru.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-3 p-3 bg-primary/[0.03] rounded-xl border border-primary/5">
              <div className="shrink-0 w-10 h-10 rounded-full overflow-hidden bg-white relative">
                <Image
                  src="/img/donate-icon.png"
                  alt="Donate Icon"
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-[12px] font-semibold text-primary/80">
                Setiap dukungan darimu sangat berarti! Terimakasih!
              </p>
            </div>
          </Card>

          {/* Donation Methods */}
          <section className="space-y-3">
            <h3 className="px-1 text-[11px] font-bold text-muted-foreground/60 tracking-wider uppercase flex items-center gap-2">
              <Heart className="w-3 h-3 text-red-400 fill-red-400" />
              Pilih Metode Donasi
            </h3>
            <Card className="overflow-hidden border border-border/50 shadow-sm rounded-2xl bg-card">
              <div className="p-4 space-y-3">
                {donationMethods.map((method, index) => (
                  <DonationMethod key={index} {...method} />
                ))}
              </div>
            </Card>
          </section>

          {/* Feedback Section */}
          <section className="space-y-3">
            <h3 className="px-1 text-[11px] font-bold text-muted-foreground/60 tracking-wider uppercase">
              Beri Ulasan
            </h3>
            <Card
              className="overflow-hidden border border-border/50 shadow-sm rounded-2xl bg-card hover:bg-accent/10 transition-colors cursor-pointer relative aspect-[360/100]"
              onClick={() => (window.location.href = "/review")}
            >
              <Image
                src="/img/banner-feedback.jpg"
                alt="Banner Feedback"
                fill
                className="object-cover"
              />
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}
