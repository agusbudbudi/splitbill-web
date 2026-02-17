import { useState } from "react";
import { PaymentMethod } from "@/store/useWalletStore";
import { Copy, Trash2, Share2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface PaymentMethodCardProps {
  method: PaymentMethod;
  onDelete: (id: string) => void;
}

const BANK_LOGOS: Record<string, { color: string; image: string }> = {
  BCA: { color: "#0066cc", image: "/img/logo-bca.png" },
  Mandiri: { color: "#ffcc00", image: "/img/logo-mandiri.png" },
  BNI: { color: "#ff6600", image: "/img/logo-bni.png" },
  BRI: { color: "#003d7a", image: "/img/logo-bri.png" },
  "CIMB Niaga": { color: "#dc143c", image: "/img/logo.png" }, // Fallback
  Danamon: { color: "#4169e1", image: "/img/logo-danamon.png" },
  Permata: { color: "#228b22", image: "/img/logo-permata.png" },
  BTN: { color: "#ff4500", image: "/img/logo-btn.png" },
  BSI: { color: "#00a39d", image: "/img/logo-bsi.png" },
  BankTransfer: { color: "#666", image: "/img/logo.png" },
};

const EWALLET_LOGOS: Record<string, { color: string; image: string }> = {
  GoPay: { color: "#00aa13", image: "/img/logo-gopay.png" },
  OVO: { color: "#4c2c92", image: "/img/logo-ovo.png" },
  DANA: { color: "#118eea", image: "/img/logo-dana.png" },
  ShopeePay: { color: "#ee4d2d", image: "/img/logo-shopeepay.png" },
  LinkAja: { color: "#e31e24", image: "/img/logo-linkaja.png" },
  Jenius: { color: "#00d4ff", image: "/img/logo-jenius.png" },
};

import Image from "next/image";

export const PaymentMethodCard = ({
  method,
  onDelete,
}: PaymentMethodCardProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const isBank = method.type === "bank";
  const logoInfo = isBank
    ? BANK_LOGOS[method.providerName] || BANK_LOGOS["BankTransfer"]
    : EWALLET_LOGOS[method.providerName] || {
        color: "#666",
        image: "/img/wallet-icon.png",
      };

  const handleCopy = () => {
    const text = isBank ? method.accountNumber : method.phoneNumber;
    if (text) {
      navigator.clipboard.writeText(text);
      toast.success(
        `${isBank ? "Nomor rekening" : "Nomor HP"} berhasil disalin!`,
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

  const formatNumber = (num?: string) => {
    if (!num) return "";
    if (isVisible) return num;
    const visibleDigits = 4;
    if (num.length <= visibleDigits) return num;
    const masked = "•".repeat(num.length - visibleDigits);
    const last = num.slice(-visibleDigits);
    return `${masked.replace(/(.{4})/g, "$1 ")} ${last}`.trim();
  };

  return (
    <div className="relative w-[85vw] sm:w-[340px] shrink-0 aspect-[1.586/1] rounded-3xl overflow-hidden transition-all duration-300 transform font-sans select-none text-white ring-1 ring-white/10 group">
      {/* Card Background */}
      <div
        className="absolute inset-0 z-0 bg-gradient-to-br"
        style={{
          background: `linear-gradient(135deg, ${logoInfo.color}, ${adjustColor(logoInfo.color, -50)})`,
        }}
      />

      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* Decorative Blur Shapes */}
      <div className="absolute -top-[30%] -right-[30%] w-[80%] h-[80%] bg-white/10 rounded-full blur-[80px]" />
      <div className="absolute bottom-[20%] -left-[20%] w-[60%] h-[60%] bg-black/20 rounded-full blur-[60px]" />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Main Body with Padding */}
        <div className="px-6 py-4 sm:px-6 sm:py-5 flex-1 flex flex-col min-h-0">
          {/* Top Row: Name & Logo */}
          <div className="flex justify-between items-start">
            <h3 className="text-lg sm:text-xl font-bold tracking-wide drop-shadow-md truncate max-w-[180px]">
              {method.providerName}
            </h3>
            <div className="h-6 sm:h-7 w-auto flex items-center justify-end relative">
              <Image
                src={logoInfo.image}
                alt={method.providerName}
                width={80}
                height={28}
                className="h-full w-auto object-contain brightness-0 invert filter drop-shadow-sm transition-transform duration-300 group-hover:scale-110"
              />
            </div>
          </div>

          {/* Chip (Middle) */}
          <div className="mt-2 sm:mt-3">
            <Image
              src="/img/chip-icon.png"
              alt="chip"
              width={40}
              height={28}
              className="w-10 sm:w-8 h-auto rounded opacity-90"
            />
          </div>

          {/* Owner Name (Below Chip) */}
          <div className="mt-auto pt-1">
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest opacity-80 mb-1">
              {method.accountName}
            </p>
            {/* Account Number & Eye (Below Name) */}
            <div className="flex items-center justify-between">
              <div className="font-mono text-xl tracking-widest font-bold text-shadow-sm truncate mr-2">
                {formatNumber(
                  isBank ? method.accountNumber : method.phoneNumber,
                )}
              </div>
              <button
                onClick={() => setIsVisible(!isVisible)}
                className="p-1.5 rounded-full hover:bg-white/20 transition-colors shrink-0 cursor-pointer"
              >
                {isVisible ? (
                  <EyeOff className="w-5 h-5 text-white/90" />
                ) : (
                  <Eye className="w-5 h-5 text-white/90" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Bar: Actions Only */}
        <div className="py-3 sm:py-3.5 bg-white/10 backdrop-blur-md flex items-center justify-center gap-5 sm:gap-7 shrink-0">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 text-xs font-semibold hover:text-white/80 transition-colors active:scale-95 cursor-pointer"
          >
            <Copy className="w-4 h-4" /> Copy
          </button>
          <div className="w-px h-4 bg-white/20" />
          <button
            onClick={handleShare}
            className="flex items-center gap-2 text-xs font-semibold hover:text-white/80 transition-colors active:scale-95 cursor-pointer"
          >
            <Share2 className="w-4 h-4" /> Share
          </button>
          <div className="w-px h-4 bg-white/20" />
          <button
            onClick={() => onDelete(method.id)}
            className="flex items-center gap-2 text-xs font-semibold text-red-100 hover:text-red-300 transition-colors active:scale-95 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

function adjustColor(color: string, amount: number) {
  return (
    "#" +
    color
      .replace(/^#/, "")
      .replace(/../g, (color) =>
        (
          "0" +
          Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)
        ).substr(-2),
      )
  );
}
