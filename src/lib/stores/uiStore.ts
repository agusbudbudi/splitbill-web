import { create } from "zustand";

interface UIState {
  isPWABannerVisible: boolean;
  setIsPWABannerVisible: (visible: boolean) => void;
  /** Override warna bg Header app (hex), dipakai halaman kayak /member/level
   * biar Header ikut warna hero yang lagi aktif. null = balik ke bg-primary default. */
  headerColor: string | null;
  setHeaderColor: (color: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isPWABannerVisible: false,
  setIsPWABannerVisible: (visible: boolean) =>
    set({ isPWABannerVisible: visible }),
  headerColor: null,
  setHeaderColor: (color: string | null) => set({ headerColor: color }),
}));
