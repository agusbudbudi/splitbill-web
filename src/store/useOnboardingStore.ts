import { create } from "zustand";
import { persist } from "zustand/middleware";

interface OnboardingState {
  hasSeenTutorial: boolean;
  dismissedHints: string[];
  isDemoMode: boolean;
  _hasHydrated: boolean;
  
  // Actions
  setHasSeenTutorial: (value: boolean) => void;
  dismissHint: (hintId: string) => void;
  setIsDemoMode: (value: boolean) => void;
  setHasHydrated: (value: boolean) => void;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      hasSeenTutorial: false,
      dismissedHints: [],
      isDemoMode: false,
      _hasHydrated: false,

      setHasSeenTutorial: (value) => set({ hasSeenTutorial: value }),
      dismissHint: (hintId) =>
        set((state) => {
          if (state.dismissedHints.includes(hintId)) return state;
          return { dismissedHints: [...state.dismissedHints, hintId] };
        }),
      setIsDemoMode: (value) => set({ isDemoMode: value }),
      setHasHydrated: (value) => set({ _hasHydrated: value }),
      resetOnboarding: () =>
        set({
          hasSeenTutorial: false,
          dismissedHints: [],
          isDemoMode: false,
        }),
    }),
    {
      name: "split-bill-onboarding-storage",
      // Only persist these fields
      partialize: (state) => ({
        hasSeenTutorial: state.hasSeenTutorial,
        dismissedHints: state.dismissedHints,
        isDemoMode: state.isDemoMode,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
