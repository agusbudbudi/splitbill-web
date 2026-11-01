import React from "react";
import { DynamicFinLogo } from "./DynamicFinLogo";
import { getProviderLogoInfo } from "@/lib/providerLogos";
import type { PaymentMethod } from "@/store/useWalletStore";

/**
 * Provider logo for share receipts captured with html-to-image. Renders inline
 * SVG because a single failed <img> rejects the whole capture.
 */
export const ReceiptProviderLogo = ({ method }: { method: PaymentMethod }) => {
  const { slug } = getProviderLogoInfo(
    method.providerName,
    method.type === "bank" ? "bank" : "ewallet",
  );

  if (slug) {
    return <DynamicFinLogo slug={slug} alt={method.providerName} className="p-2" />;
  }

  return (
    <div className="text-primary/40 font-black text-2xl uppercase">
      {method.providerName.slice(0, 3)}
    </div>
  );
};
