import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/lib/constants";
import type { UserLevel, UserLevelMeResponse, UserLevelStats } from "@/lib/types/level";

interface RawLevel extends Omit<UserLevel, "id"> {
  _id: string;
}

interface LevelsListResponse {
  success: boolean;
  data: RawLevel[];
}

interface MyLevelResponse {
  success: boolean;
  data: {
    stats: UserLevelStats;
    currentLevel: RawLevel | null;
    nextLevel: RawLevel | null;
  };
}

function mapLevel(raw: RawLevel): UserLevel {
  return {
    id: raw._id,
    name: raw.name,
    icon: raw.icon,
    order: raw.order,
    description: raw.description || "",
    benefits: raw.benefits || [],
    rules: raw.rules || [],
    isActive: raw.isActive,
  };
}

// Semua level aktif, sorted order desc. Public — dipakai buat render list di halaman detail level.
export async function fetchLevels(): Promise<UserLevel[]> {
  const response = await apiClient.request<LevelsListResponse>(
    API_ENDPOINTS.LEVELS.LIST,
    { method: "GET", skipAuth: true },
  );
  return (response.data || []).map(mapLevel);
}

// Posisi level user saat ini + stats + level berikutnya. Butuh auth.
// Beberapa komponen (FeatureHighlights, MyLevelCard) manggil ini bareng di
// render pass yang sama — dedupe request yang lagi in-flight biar gak
// double-hit backend buat data yang sama persis.
let inFlightMyLevel: Promise<UserLevelMeResponse> | null = null;

export function fetchMyLevel(): Promise<UserLevelMeResponse> {
  if (inFlightMyLevel) return inFlightMyLevel;

  inFlightMyLevel = apiClient
    .request<MyLevelResponse>(API_ENDPOINTS.LEVELS.ME, { method: "GET" })
    .then((response) => ({
      stats: response.data.stats,
      currentLevel: response.data.currentLevel ? mapLevel(response.data.currentLevel) : null,
      nextLevel: response.data.nextLevel ? mapLevel(response.data.nextLevel) : null,
    }))
    .finally(() => {
      inFlightMyLevel = null;
    });

  return inFlightMyLevel;
}
