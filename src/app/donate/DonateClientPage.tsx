"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import {
  Coffee,
  Heart,
  ChevronRight,
  Sparkles,
  Download,
  ExternalLink,
  Server
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import Image from "next/image";
import { DynamicFinLogo } from "@/components/wallet/DynamicFinLogo";
import { EWALLET_LOGOS } from "@/lib/providerLogos";
import { toPng } from "html-to-image";

// Configuration Constants
const SAWERIA_URL = "https://saweria.co/ajusshi";
const DANA_QRIS_IMAGE = "/donate/dana-qr.JPG";

const DONATION_TIERS = [
  {
    id: "kopi",
    name: "Traktir Kopi",
    amount: 15000,
    icon: "☕",
    description: "Bantu developer melek semalaman.",
  },
  {
    id: "pizza",
    name: "Traktir Pizza",
    amount: 50000,
    icon: "🍕",
    description: "Ekstra energi merilis fitur AI Scan.",
  },
  {
    id: "server",
    name: "Sewa Server",
    amount: 150000,
    icon: "🚀",
    description: "Bantu biaya server online 1 bulan.",
  },
  {
    id: "bebas",
    name: "Seikhlasnya",
    amount: null,
    icon: "💖",
    description: "Dukungan bebas seikhlas hatimu.",
  },
];

export default function DonateClientPage() {
  const [selectedTier, setSelectedTier] = useState<string>("kopi");
  const [isDownloading, setIsDownloading] = useState(false);

  const activeTier = DONATION_TIERS.find((t) => t.id === selectedTier);
  const selectedAmount = activeTier?.amount ?? null;
  const selectedTierName = activeTier?.name ?? "";

  const handleDownloadQR = async () => {
    try {
      setIsDownloading(true);
      const element = document.getElementById("qris-ticket-hidden-donate");
      if (!element) {
        throw new Error("Ticket element not found");
      }

      const image = await toPng(element, {
        pixelRatio: 3,
        backgroundColor: "#ffffff",
      });

      const a = document.createElement("a");
      a.href = image;
      a.download = `DANA-QR-Donasi-SplitBill.png`;
      a.click();
      toast.success("QR Code berhasil disimpan ke galeri!");
    } catch (err) {
      console.error("Gagal mengunduh QR", err);
      toast.error("Gagal mengunduh gambar. Silakan ambil tangkapan layar (screenshot) QR DANA.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <Header title="Support Developer" showBackButton />

      <div className="relative w-full max-w-[600px] flex-1 flex flex-col">
        {/* Gradient background */}
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary via-primary/50 to-transparent pointer-events-none z-0" />

        <main className="relative z-10 w-full pb-10">
          <div className="px-4 pt-4 space-y-6">
            {/* Welcome Card */}
            <Card className="p-6 border border-border/50 shadow-md rounded-2xl bg-card relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-[0.03] rotate-12">
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

              <div className="space-y-3 text-[13px] leading-relaxed text-muted-foreground/90 font-medium">
                <p>
                  Dukung pengembangan SplitBill Online agar tetap gratis, bebas iklan, dan bisa terus menghadirkan fitur-fitur baru yang bermanfaat.
                </p>
              </div>

              <div className="mt-4 flex items-center gap-3 p-2.5 bg-primary/[0.03] rounded-sm border border-primary/5">
                <div className="shrink-0 w-8 h-8 rounded-full overflow-hidden bg-white relative">
                  <Image
                    src="/img/donate-icon.png"
                    alt="Ikon Donasi — Terimakasih atas dukunganmu"
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-[11px] font-semibold text-primary/80">
                  Setiap donasi sangat membantu operasional kami. Terima kasih!
                </p>
              </div>
            </Card>

            {/* Cost Tracker Card */}
            <Card className="p-5 border border-border/50 shadow-sm rounded-2xl bg-card">
              <div className="flex items-center justify-between mb-3">
                <div className="space-y-0.5">
                  <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider">
                    <Server className="w-3.5 h-3.5 text-primary" /> Target Operasional Bulanan
                  </h3>
                  <p className="text-[10px] text-muted-foreground font-medium">
                    Membantu server aktif 24/7 & AI Scan tetap gratis
                  </p>
                </div>
                <span className="text-xs font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  65%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden relative">
                <div
                  className="absolute left-0 top-0 h-full bg-gradient-brand rounded-full transition-all duration-1000"
                  style={{ width: "65%" }}
                />
              </div>

              <div className="flex justify-between items-center mt-3 text-[10px] font-bold text-muted-foreground/80">
                <span>Terdanai: Rp 195.000</span>
                <span>Target: Rp 300.000</span>
              </div>
            </Card>

            {/* Donation Tiers */}
            <section className="space-y-3">
              <h3 className="px-1 text-[11px] font-bold text-muted-foreground/60 tracking-wider uppercase flex items-center gap-2">
                <Heart className="w-3 h-3 text-red-400 fill-red-400" />
                Pilih Nominal Dukungan
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {DONATION_TIERS.map((tier) => {
                  const isSelected = selectedTier === tier.id;
                  return (
                    <button
                      key={tier.id}
                      onClick={() => setSelectedTier(tier.id)}
                      className={`text-left p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between cursor-pointer ${isSelected
                        ? "border-primary bg-primary/[0.03] shadow-sm ring-1 ring-primary"
                        : "border-border/60 bg-card hover:border-border-hover"
                        }`}
                    >
                      <div className="flex justify-between items-start w-full mb-1">
                        <span className="text-2xl">{tier.icon}</span>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        )}
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-foreground leading-tight">
                          {tier.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground/80 font-medium leading-tight mt-0.5">
                          {tier.description}
                        </p>
                        <p className="text-sm font-black text-primary mt-2">
                          {tier.amount ? `Rp ${tier.amount.toLocaleString("id-ID")}` : "Bebas"}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Primary Donation Method: DANA QR */}
            <section className="space-y-3">
              <h3 className="px-1 text-[11px] font-bold text-primary tracking-wider uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 fill-primary" /> Metode Donasi Utama
              </h3>

              <Card className="py-4 border-2 border-primary bg-card shadow-soft rounded-2xl flex flex-col items-center text-center relative overflow-hidden">
                {/* DANA Header */}
                <div className="flex items-center gap-2">
                  <div className="h-6 w-16 flex items-center justify-center">
                    <DynamicFinLogo slug={EWALLET_LOGOS["DANA"].slug!} className="w-full h-full" />
                  </div>
                  <span className="font-extrabold text-sm text-[#118eea] tracking-tight">QR & Transfer</span>
                </div>

                {/* Inline QR Code */}
                <div className="relative w-full max-w-[380px] aspect-square mb-4">
                  <Image
                    src={DANA_QRIS_IMAGE}
                    alt="DANA QR Code"
                    fill
                    sizes="(max-width: 768px) 100vw, 340px"
                    className="object-contain"
                    priority
                  />
                </div>

                {/* Active Tier Display */}
                <div className="space-y-1 mb-4">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                    Nominal Terpilih
                  </p>
                  <h4 className="text-2xl font-black text-foreground">
                    {selectedAmount ? `Rp ${selectedAmount.toLocaleString("id-ID")}` : "Sesuai Keikhlasan"}
                  </h4>
                  {selectedTierName && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-extrabold mt-1">
                      {selectedTierName}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="w-full max-w-xs space-y-2">
                  <Button
                    onClick={handleDownloadQR}
                    disabled={isDownloading}
                    className="w-full h-11 text-xs font-bold rounded-sm flex items-center justify-center gap-2 cursor-pointer bg-[#118eea] hover:bg-[#0f7ecc] text-white border-none shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    Unduh QR DANA (Simpan Galeri)
                  </Button>
                </div>
              </Card>
            </section>

            {/* Secondary Donation Methods */}
            <section className="space-y-3">
              <h3 className="px-1 text-[11px] font-bold text-muted-foreground/60 tracking-wider uppercase">
                Metode Donasi Alternatif
              </h3>

              <div className="space-y-3">
                {/* Saweria Card */}
                <Card className="p-4 border border-border/50 hover:border-primary/20 transition-all rounded-2xl bg-card flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-10 flex items-center justify-center shrink-0 relative">
                      <Image
                        src="/img/logo-saweria.png"
                        alt="Saweria"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-bold text-foreground">Traktir via Saweria</h4>
                      <p className="text-[11px] text-muted-foreground font-medium leading-tight">
                        Mendukung GoPay, OVO, ShopeePay, m-Banking, dll.
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(SAWERIA_URL, "_blank")}
                    className="text-orange-600 border-orange-200 hover:bg-orange-50/50 font-bold text-xs shrink-0 cursor-pointer h-9 px-3 rounded-sm transition-all"
                  >
                    Buka <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Card>
              </div>
            </section>

            {/* Feedback Section */}
            <section className="space-y-3">
              <h3 className="px-1 text-[11px] font-bold text-muted-foreground/60 tracking-wider uppercase">
                Beri Ulasan
              </h3>
              <div
                onClick={() => (window.location.href = "/review")}
                className="relative rounded-2xl p-5 text-white active:scale-[0.98] transition-all group cursor-pointer bg-brand-reversed"
              >
                <div className="absolute bottom-0 right-2 w-28 h-32 transition-transform group-hover:scale-110 group-hover:rotate-3 z-20">
                  <img
                    src="/img/hero-splitbill.png"
                    alt="Feedback"
                    className="w-full h-full object-contain object-bottom drop-shadow-sm"
                  />
                </div>
                <div className="relative z-10 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black">Beri Ulasan</h3>
                    <ChevronRight className="w-5 h-5 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-xs text-white/80 font-medium max-w-[280px]">
                    Bantu kami menjadi lebih baik! Berikan masukan atau ulasan terbaikmu untuk aplikasi ini.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* Hidden Ticket for Download */}
      <div className="fixed top-[-9999px] left-[-9999px]">
        <Card id="qris-ticket-hidden-donate" className="p-6 bg-white rounded-2xl border-2 border-primary w-[360px] shadow-none relative overflow-hidden flex flex-col items-center text-center">
          <div className="flex flex-col items-center w-full">
            {/* DANA Header */}
            <div className="flex items-center gap-2 mb-4">
              <div className="h-6 w-16 flex items-center justify-center shrink-0">
                <DynamicFinLogo slug={EWALLET_LOGOS["DANA"].slug!} className="w-full h-full" />
              </div>
              <span className="font-extrabold text-sm text-[#118eea] tracking-tight">QR & Transfer</span>
            </div>

            {/* Inline QR Code */}
            <div className="relative w-[280px] h-[280px] mb-4">
              <Image
                src={DANA_QRIS_IMAGE}
                alt="DANA QR Code"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Active Tier Display */}
            <div className="space-y-1 mb-4">
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Nominal Terpilih
              </p>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                {selectedAmount ? `Rp ${selectedAmount.toLocaleString("id-ID")}` : "Sesuai Keikhlasan"}
              </h3>
              {selectedTierName && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#118eea]/10 text-[#118eea] text-[10px] font-extrabold mt-1">
                  {selectedTierName}
                </span>
              )}
            </div>

            {/* Warning Info */}
            <p className="text-[9px] text-slate-400 font-semibold mb-4 leading-normal max-w-[280px]">
              Penting: QR ini HANYA mendukung aplikasi DANA. Harap scan menggunakan pemindai bawaan di aplikasi DANA Anda.
            </p>

            <div className="w-full h-px border-t border-dashed border-slate-200 my-1" />

            <div className="flex flex-col items-center w-full mt-2">
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                SplitBill Online
              </p>
              <p className="text-[8px] text-slate-400 mt-0.5">
                Terimakasih atas dukunganmu!
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
