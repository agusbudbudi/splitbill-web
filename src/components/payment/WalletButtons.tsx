"use client";

import { Button } from "@/components/ui/Button";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface WalletButtonsProps {
  phone: string;
  amount: number;
}

export default function WalletButtons({ phone, amount }: WalletButtonsProps) {
  const copyPhone = async () => {
    try {
      await navigator.clipboard.writeText(phone);
      toast.success("Nomor telepon disalin");
    } catch (err) {
      toast.error("Gagal menyalin nomor");
    }
  };

  const getDeeplink = (wallet: "gopay" | "dana" | "shopeepay") => {
    switch (wallet) {
      case "gopay":
        return `gojek://gopay/transfer?phone=${phone}&amount=${amount}`;
      case "dana":
        return `dana://send?phone=${phone}&amount=${amount}`;
      case "shopeepay":
        return `shopeeid://wallet/send?phone=${phone}&amount=${amount}`;
      default:
        return "";
    }
  };

  const openWallet = (wallet: "gopay" | "dana" | "shopeepay") => {
    const deeplink = getDeeplink(wallet);
    window.location.href = deeplink;
  };

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-1 gap-3">
        {/* GoPay */}
        <button
          onClick={() => openWallet("gopay")}
          className="group relative flex items-center justify-between w-full p-4 bg-white border border-slate-200 rounded-xl transition-all hover:border-[#00AA13] active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center bg-slate-50 rounded-xl group-hover:bg-[#00AA13]/5 transition-colors">
              <Image 
                src="/img/logo-gopay.png" 
                alt="GoPay" 
                width={32} 
                height={32} 
                className="object-contain"
              />
            </div>
            <div className="text-left">
              <div className="font-bold text-slate-900">GoPay</div>
              <div className="text-xs text-slate-500 font-medium tracking-tight">Bayar pakai aplikasi Gojek</div>
            </div>
          </div>
          <div className="h-2 w-2 rounded-full bg-slate-200 group-hover:bg-[#00AA13]" />
        </button>

        {/* DANA */}
        <button
          onClick={() => openWallet("dana")}
          className="group relative flex items-center justify-between w-full p-4 bg-white border border-slate-200 rounded-xl transition-all hover:border-[#118EEA] active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center bg-slate-50 rounded-xl group-hover:bg-[#118EEA]/5 transition-colors">
              <Image 
                src="/img/logo-dana.png" 
                alt="DANA" 
                width={32} 
                height={32} 
                className="object-contain"
              />
            </div>
            <div className="text-left">
              <div className="font-bold text-slate-900">DANA</div>
              <div className="text-xs text-slate-500 font-medium tracking-tight">Dompet Digital Indonesia</div>
            </div>
          </div>
          <div className="h-2 w-2 rounded-full bg-slate-200 group-hover:bg-[#118EEA]" />
        </button>

        {/* ShopeePay */}
        <button
          onClick={() => openWallet("shopeepay")}
          className="group relative flex items-center justify-between w-full p-4 bg-white border border-slate-200 rounded-xl transition-all hover:border-[#EE4D2D] active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center bg-slate-50 rounded-xl group-hover:bg-[#EE4D2D]/5 transition-colors">
              <Image 
                src="/img/logo-shopeepay.png" 
                alt="ShopeePay" 
                width={32} 
                height={32} 
                className="object-contain"
              />
            </div>
            <div className="text-left">
              <div className="font-bold text-slate-900">ShopeePay</div>
              <div className="text-xs text-slate-500 font-medium tracking-tight">Buka aplikasi Shopee</div>
            </div>
          </div>
          <div className="h-2 w-2 rounded-full bg-slate-200 group-hover:bg-[#EE4D2D]" />
        </button>
      </div>

      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-slate-200"></div>
        </div>
        <div className="relative flex justify-center text-[10px]">
          <span className="bg-slate-50 px-2 text-slate-400 font-bold uppercase tracking-[0.2em] italic">Atau salin nomor</span>
        </div>
      </div>

      <Button 
        variant="secondary" 
        className="w-full h-14 text-base font-bold rounded-2xl transition-all active:scale-[0.98]"
        onClick={copyPhone}
      >
        <Copy className="mr-2 h-5 w-5" />
        Salin Nomor ({phone})
      </Button>
    </div>
  );
}
