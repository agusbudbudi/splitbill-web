import { PaymentMethod } from "@/store/useWalletStore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { DynamicFinLogo } from "./DynamicFinLogo";
import { BANK_LOGOS, EWALLET_LOGOS, getProviderLogoInfo } from "@/lib/providerLogos";

interface PaymentMethodCardProps {
  method: PaymentMethod;
  onDelete: (id: string) => void;
}

// Re-export from central mapping so existing importers keep working
export { BANK_LOGOS, EWALLET_LOGOS } from "@/lib/providerLogos";

export function maskNumber(num?: string): string {
  if (!num) return "••••••";
  const last4 = num.slice(-4);
  return "••" + last4;
}

export const PaymentMethodCard = ({
  method,
  onDelete: _onDelete,
}: PaymentMethodCardProps) => {
  const router = useRouter();

  const isBank = method.type === "bank";
  const logoInfo = getProviderLogoInfo(method.providerName, isBank ? "bank" : "ewallet");

  const rawNumber = isBank ? method.accountNumber : method.phoneNumber;
  const displayNumber = maskNumber(rawNumber);

  return (
    <div
      onClick={() => router.push(`/wallet/${method.id}`)}
      className="relative w-[42vw] sm:w-[220px] shrink-0 aspect-[1.4/1] rounded-2xl overflow-hidden transition-all duration-300 font-sans select-none bg-white border border-slate-200 text-slate-800 group cursor-pointer"
    >
      <div className="flex flex-col h-full p-3.5 justify-between">
        {/* Top: logo kiri atas + type badge kanan */}
        <div className="flex items-start justify-between">
          <div className="h-7 w-16 flex items-center">
            {logoInfo.slug ? (
              <DynamicFinLogo
                slug={logoInfo.slug}
                alt={method.providerName}
                className="filter drop-shadow-xs w-full h-full"
              />
            ) : (
              <img
                src={logoInfo.image}
                alt={method.providerName}
                className="h-full w-auto object-contain filter drop-shadow-xs"
              />
            )}
          </div>
        </div>

        {/* Bottom: nama pemilik → nama bank → nomor */}
        <div className="text-left space-y-0.5">
          {/* Account name */}
          <p className="text-[10px] font-semibold text-slate-500 truncate leading-tight">
            {method.accountName}
          </p>

          {/* Provider name */}
          <p className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 leading-none">
            {method.providerName}
          </p>

          {/* Masked number */}
          <div className="flex items-center gap-1.5 pt-0.5">
            <p className="font-mono text-sm tracking-widest font-black text-slate-800 leading-tight">
              {displayNumber}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
