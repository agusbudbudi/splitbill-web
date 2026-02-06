import { create } from "zustand";

interface UIState {
  isPWABannerVisible: boolean;
  setIsPWABannerVisible: (visible: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isPWABannerVisible: false,
  setIsPWABannerVisible: (visible: boolean) =>
    set({ isPWABannerVisible: visible }),
}));
