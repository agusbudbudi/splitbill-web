"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Copy, Share2, Check } from "lucide-react";
import { toast } from "sonner";

interface QRCodeDisplayProps {
  paymentUrl: string;
}

export default function QRCodeDisplay({ paymentUrl }: QRCodeDisplayProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(paymentUrl);
      setCopied(true);
      toast.success("Link disalin ke clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Gagal menyalin link");
    }
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Permintaan Pembayaran",
          text: "Silakan kirim pembayaran via link ini:",
          url: paymentUrl,
        });
      } catch (err) {
        // Share cancelled or failed
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className="w-full flex flex-col items-center space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-100 flex items-center justify-center transition-transform hover:scale-[1.02] duration-500">
        <QRCodeSVG 
          value={paymentUrl} 
          size={220} 
          level="H" 
          includeMargin 
          className="rounded-xl"
        />
      </div>
      
      <div className="w-full space-y-3">
        <div className="relative group">
          <Input 
            value={paymentUrl} 
            readOnly 
            className="bg-slate-50 border-slate-200 h-14 rounded-2xl pr-12 text-xs font-medium text-slate-500 truncate focus:ring-primary/20 transition-all font-medium" 
          />
          <button 
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-primary hover:bg-white rounded-xl transition-all active:scale-90 cursor-pointer"
            onClick={copyToClipboard}
          >
            {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
          </button>
        </div>

        <Button 
          onClick={shareLink} 
          className="w-full h-14 text-lg font-bold hover:scale-[1.01] active:scale-95 transition-all rounded-2xl"
        >
          <Share2 className="mr-2 h-5 w-5" />
          Bagikan Link Pembayaran
        </Button>
      </div>
    </div>
  );
}
