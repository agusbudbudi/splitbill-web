import { API_BASE_URL } from "@/lib/constants";

export interface AdCampaign {
  id: string;
  sponsorName: string;
  title?: string;
  description?: string;
  mediaType: "image" | "video";
  mediaUrl: string;
  ctaUrl?: string;
  ctaText?: string;
  durationSeconds: number;
}

/** Hardcoded fallback — used when the API is unreachable or returns no active ads */
export const activeAdCampaigns: AdCampaign[] = [
  {
    id: "premium-membership-ad",
    sponsorName: "Split Bill VIP",
    title: "Keuntungan Menjadi VIP 🌟",
    description: "Bebas iklan, akses ke semua fitur pro, scan struk sepuasnya tanpa batas harian, backup data cloud otomatis, dan lain-lain. Upgrade sekarang!",
    mediaType: "video",
    mediaUrl: "video/ads-split-bill.mp4",
    ctaUrl: "/subscription",
    ctaText: "Upgrade ke VIP",
    durationSeconds: 10,
  },
  {
    id: "payment-rewards-promo",
    sponsorName: "Split Bill VIP",
    title: "Tanpa Iklan & Fitur Tak Terbatas dengan VIP! 👑",
    description: "Nikmati pengalaman Split Bill tanpa gangguan iklan, scan struk unlimited, dan akses semua fitur eksklusif. Jadi member VIP sekarang!",
    mediaType: "video",
    mediaUrl: "video/ads-split-bill2.mp4",
    ctaUrl: "/subscription",
    ctaText: "Lihat Paket VIP",
    durationSeconds: 10,
  },
];

/**
 * Fetches a random active ad campaign from the API.
 * Falls back to hardcoded `activeAdCampaigns` if the API is unavailable or returns no data.
 */
export const getRandomAdCampaign = async (): Promise<AdCampaign> => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/ad-campaigns`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.data.length);
        return data.data[randomIndex] as AdCampaign;
      }
    }
  } catch {
    // Silently fall back to hardcoded ads
  }
  const randomIndex = Math.floor(Math.random() * activeAdCampaigns.length);
  return activeAdCampaigns[randomIndex];
};

