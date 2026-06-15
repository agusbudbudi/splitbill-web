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

export const getRandomAdCampaign = (): AdCampaign => {
  const randomIndex = Math.floor(Math.random() * activeAdCampaigns.length);
  return activeAdCampaigns[randomIndex];
};
