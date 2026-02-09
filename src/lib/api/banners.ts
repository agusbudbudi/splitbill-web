import { apiClient } from "./client";

export interface Banner {
  _id: string;
  image: string;
  route: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BannersResponse {
  success: boolean;
  data: {
    banners: Banner[];
  };
}

const CACHE_KEY = "splitbill_banners_cache";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface CacheData {
  banners: Banner[];
  timestamp: number;
}

export function getCachedBanners(): Banner[] {
  if (typeof window === "undefined") return [];

  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return [];

    const data: CacheData = JSON.parse(cached);
    // Return cached data regardless of expiration for instant load
    // Freshness check happens in fetchBanners
    return data.banners || [];
  } catch (e) {
    console.warn("Failed to read banner cache", e);
    return [];
  }
}

export async function fetchBanners(): Promise<Banner[]> {
  // Check cache freshness first
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const data: CacheData = JSON.parse(cached);
        const now = Date.now();

        // If cache is fresh (less than 5 mins old), return it and skip network
        if (now - data.timestamp < CACHE_TTL) {
          return data.banners;
        }
      }
    } catch (e) {
      // Ignore cache errors and proceed to fetch
    }
  }

  // Fetch from API if cache is missing or stale
  try {
    const response = await apiClient.request<BannersResponse>("/api/banners", {
      method: "GET",
      skipAuth: true,
    });

    const banners = response.data?.banners || [];

    // Update cache
    if (typeof window !== "undefined" && banners.length > 0) {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          banners,
          timestamp: Date.now(),
        }),
      );
    }

    return banners;
  } catch (error) {
    console.error("Failed to fetch banners from API:", error);
    // Fallback to cache if API fails, even if stale
    return getCachedBanners();
  }
}
