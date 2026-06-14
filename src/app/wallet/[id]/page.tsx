"use client";

import React, { use, useState } from "react";
import { useWalletStore } from "@/store/useWalletStore";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Copy, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import Link from "next/link";
import Image from "next/image";
import { DynamicFinLogo } from "@/components/wallet/DynamicFinLogo";
import { getProviderLogoInfo } from "@/lib/providerLogos";

interface PageProps {
  params: Promise<{ id: string }>;
}


export default function WalletDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { paymentMethods, removePaymentMethod } = useWalletStore();
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [revealed, setRevealed] = useState(false);

  const method = paymentMethods.find((m) => m.id === id);

  if (!method) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center relative">
        <div className="w-full max-w-[600px] min-h-screen flex flex-col relative bg-background">
          <Header title="Detail Rekening" showBackButton />
          <main className="flex-1 w-full flex flex-col items-center justify-center p-6 text-center">
            <p className="text-muted-foreground mb-4">Rekening tidak ditemukan atau sudah dihapus.</p>
            <Link href="/wallet">
              <Button>Kembali ke Wallet</Button>
            </Link>
          </main>
          <Footer />
        </div>
      </div>
    );
  }

  const isBank = method.type === "bank";
  const details = isBank ? method.accountNumber : method.phoneNumber;
  const logoInfo = getProviderLogoInfo(method.providerName, isBank ? "bank" : "ewallet");
  const cardColor = logoInfo.color;

  const handleCopy = () => {
    if (details) {
      navigator.clipboard.writeText(details);
      toast.success(
        `${isBank ? "Nomor rekening" : "Nomor HP"} berhasil disalin!`
      );
    }
  };

  const handleShare = () => {
    const message = isBank
      ? `🏦 *Info Bank*\n\nBank: ${method.providerName}\nPemilik: ${method.accountName}\nNo. Rekening: ${method.accountNumber}`
      : `📱 *Info E-Wallet*\n\nE-Wallet: ${method.providerName}\nPemilik: ${method.accountName}\nNo. HP: ${method.phoneNumber}`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleDelete = () => {
    removePaymentMethod(method.id);
    router.push("/wallet");
    toast.success("Metode pembayaran berhasil dihapus");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center relative">
      <div className="w-full max-w-[600px] min-h-screen flex flex-col relative bg-background">
        <Header title="Detail Rekening" showBackButton />

        <div className="relative flex-1 w-full flex flex-col">
          {/* Gradient background */}
          <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary via-primary/50 to-transparent pointer-events-none z-0" />

          <main className="relative z-10 flex-1 w-full p-4 space-y-6">
            {/* Card Preview */}
            <div
              className="relative w-full aspect-[1.8/1] rounded-xl overflow-hidden text-white p-5 flex flex-col justify-between shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${cardColor} 0%, ${cardColor}cc 60%, ${cardColor}88 100%)`,
              }}
            >
              {/* Noise texture overlay */}
              <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

              {/* Top: logo kiri atas + type badge kanan */}
              <div className="relative z-10 flex items-start justify-between">
                <div className="h-12 w-28 flex items-center">
                  {logoInfo.slug ? (
                    <DynamicFinLogo
                      slug={logoInfo.slug}
                      alt={method.providerName}
                      className="brightness-0 invert w-full h-full"
                    />
                  ) : (
                    <img
                      src={logoInfo.image}
                      alt={method.providerName}
                      className="h-full w-auto object-contain brightness-0 invert"
                    />
                  )}
                </div>
                <span className="inline-block px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-widest bg-white/20 rounded-full mt-0.5">
                  {isBank ? "Bank Account" : "E-Wallet"}
                </span>
              </div>

              {/* Bottom: nama pemilik → nama bank → nomor masked + eye */}
              <div className="relative z-10 space-y-0.5">
                <p className="text-md font-bold uppercase tracking-widest">
                  {method.accountName}
                </p>
                <p className="text-xs font-extrabold uppercase tracking-widest opacity-80">
                  {method.providerName}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <p className="font-mono text-xl tracking-widest font-bold">
                    {revealed
                      ? details
                      : "•".repeat(Math.max(0, (details?.length ?? 4) - 4)) + (details?.slice(-4) ?? "••••")}
                  </p>
                  <button
                    type="button"
                    onClick={() => setRevealed((v) => !v)}
                    className="text-white/70 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                    aria-label={revealed ? "Sembunyikan nomor" : "Tampilkan nomor"}
                  >
                    {revealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Action Row */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleCopy}
                variant="outline"
                className="h-12 text-sm font-bold shadow-soft flex items-center justify-center gap-2 border-slate-200 text-slate-700"
              >
                <Copy className="w-4 h-4" /> Salin Nomor
              </Button>
              <Button
                onClick={handleShare}
                className="h-12 text-sm font-bold flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe59] text-white"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.112 1.523 5.84L.057 23.492a.5.5 0 0 0 .614.614l5.701-1.457A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.686-.523-5.206-1.428l-.373-.22-3.862.987.993-3.797-.242-.386A9.944 9.944 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                </svg> Share WA
              </Button>
            </div>

            {/* Privacy Card */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-md bg-blue-50">
              <div className="shrink-0">
                <Image src="/img/icon-privacy.png" alt="Privacy" width={36} height={36} className="object-contain" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800">Tersimpan di Perangkat</p>
                <p className="text-[10px] text-slate-500 leading-tight">Data lokal · Tidak dikirim ke server · Offline ready</p>
              </div>
            </div>

            {/* Delete Section */}
            <div>
              <Button
                onClick={() => setIsConfirmOpen(true)}
                variant="ghost"
                className="w-full h-12 text-sm font-bold text-red-600 hover:bg-red-50/50 hover:text-red-700 flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Hapus Rekening
              </Button>
            </div>
          </main>
        </div>

        <Footer />
      </div>

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Rekening?"
        description={`Apakah Anda yakin ingin menghapus rekening ${method.providerName} atas nama ${method.accountName}?`}
        icon={Trash2}
        confirmText="Ya, Hapus"
        confirmButtonClassName="bg-destructive hover:bg-destructive/90 text-white shadow-destructive/20"
      />
    </div>
  );
}
