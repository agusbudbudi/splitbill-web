/**
 * Single source of truth for all payment provider logo mappings.
 * Uses idn-finlogos slugs where available; falls back to `image` path for custom assets.
 *
 * Slugs are taken from the `idn-finlogos` package manifest.
 * To add a new provider, add an entry here — all consumers will automatically pick it up.
 */

export interface ProviderLogoInfo {
  /** Brand color used for card backgrounds and accent borders */
  color: string;
  /** idn-finlogos slug. Preferred over `image`. */
  slug?: string;
  /** Fallback image path (public directory) when no slug is available. */
  image?: string;
}

export const BANK_LOGOS: Record<string, ProviderLogoInfo> = {
  BCA: { color: "#1976D2", slug: "bca" },
  Mandiri: { color: "#1565C0", slug: "mandiri" },
  BNI: { color: "#FF8A00", slug: "bni" },
  BRI: { color: "#0D47A1", slug: "bri" },
  Permata: { color: "#29B6F6", slug: "permata-bank-new" },
  BTN: { color: "#039BE5", slug: "btn-new" },
  BSI: { color: "#26A69A", slug: "bsi" },
  SeaBank: { color: "#FF7043", slug: "seabank" },
  /** Generic fallback — no idn-finlogos slug, uses local asset */
  BankTransfer: { color: "#666", image: "/img/logo-splitbill-black.png" },
};


export const EWALLET_LOGOS: Record<string, ProviderLogoInfo> = {
  GoPay: { color: "#00aa13", slug: "gopay" },
  OVO: { color: "#4c2c92", slug: "ovo-new-alt" },
  DANA: { color: "#118eea", slug: "dana" },
  ShopeePay: { color: "#ee4d2d", slug: "shopee-pay" },
  LinkAja: { color: "#e31e24", slug: "linkaja" },
  Jenius: { color: "#00d4ff", slug: "jenius" },
};

/** Resolve logo info for any provider name, with sensible fallbacks. */
export function getProviderLogoInfo(
  providerName: string,
  type: "bank" | "ewallet"
): ProviderLogoInfo {
  if (type === "bank") {
    return BANK_LOGOS[providerName] ?? BANK_LOGOS["BankTransfer"];
  }
  return EWALLET_LOGOS[providerName] ?? { color: "#666", image: "/img/logo-splitbill-black.png" };
}
