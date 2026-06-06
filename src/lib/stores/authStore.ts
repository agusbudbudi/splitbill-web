import { create } from "zustand";
import { User } from "@/lib/api/auth";
import * as authApi from "@/lib/api/auth";
import { hasTokens, clearTokens } from "@/lib/auth/tokens";
import { identifyUser, clearUser } from "@/lib/gtag";
import { useSplitBillStore } from "@/store/useSplitBillStore";

export interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  initialize: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    try {
      // Attach any pending guest draft so the backend can auto-associate it
      const { draftId } = useSplitBillStore.getState();
      const payload = draftId ? { ...credentials, draftId } : credentials;

      const response = await authApi.login(payload);
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        isInitialized: true,
      });

      // Track User-ID and Properties
      identifyUser(response.user.id, {
        email: response.user.email,
        name: response.user.name,
        user_type: "registered",
      });

      // Store user data in localStorage for offline access
      if (typeof window !== "undefined") {
        localStorage.setItem("currentUser", JSON.stringify(response.user));
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Login failed",
        isLoading: false,
      });
      throw error;
    }
  },

  loginWithGoogle: async (idToken: string) => {
    set({ isLoading: true, error: null });
    try {
      // Attach any pending guest draft so the backend can auto-associate it
      const { draftId } = useSplitBillStore.getState();
      const response = await authApi.googleLogin(idToken, draftId || undefined);
      
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        isInitialized: true,
      });

      // Track User-ID and Properties
      identifyUser(response.user.id, {
        email: response.user.email,
        name: response.user.name,
        user_type: "registered",
      });

      // Store user data in localStorage for offline access
      if (typeof window !== "undefined") {
        localStorage.setItem("currentUser", JSON.stringify(response.user));
      }

      // Show success toast
      import("sonner").then(({ toast }) => {
        toast.success("Login berhasil! Selamat datang kembali. 👋", {
          id: "google-login-success-toast",
        });
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Google login failed",
        isLoading: false,
      });
      throw error;
    }
  },

  register: async (name: string, email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      // Attach any pending guest draft so the backend can auto-associate it
      const { draftId } = useSplitBillStore.getState();
      await authApi.register({ name, email, password, ...(draftId ? { draftId } : {}) });
      set({
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Registration failed",
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authApi.logout();
      // Try to clear NextAuth session if next-auth/react is used
      try {
        const { signOut: nextAuthSignOut } = await import("next-auth/react");
        await nextAuthSignOut({ redirect: false });
      } catch (e) {
        console.warn("Failed to clear NextAuth session on logout:", e);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearTokens();
      if (typeof window !== "undefined") {
        localStorage.removeItem("currentUser");
      }
      clearUser();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
        error: null,
      });
    }
  },

  initialize: async () => {
    const state = useAuthStore.getState();

    // Only initialize once
    if (state.isInitialized || state.isLoading) {
      return;
    }

    // Set loading state synchronously to block duplicate concurrent checks
    set({ isLoading: true });

    // Check if we have tokens first
    if (!hasTokens()) {
      // Check if there's a Google session from NextAuth
      try {
        const { getSession } = await import("next-auth/react");
        const session = await getSession();
        const idToken = (session as any)?.idToken;
        if (idToken) {
          await state.loginWithGoogle(idToken);
          return;
        }
      } catch (err) {
        console.warn("Failed to check NextAuth session on initialize:", err);
      }

      set({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        isInitialized: true,
      });
      return;
    }

    set({ error: null });
    try {
      const user = await authApi.getCurrentUser();
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        isInitialized: true,
      });

      // Track User-ID and Properties on Init
      identifyUser(user.id, {
        email: user.email,
        name: user.name,
        user_type: "registered",
      });

      // Update localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("currentUser", JSON.stringify(user));
      }
    } catch (error) {
      console.error("Failed to get current user:", error);
      // If unauthorized, clear tokens
      if (error instanceof Error && error.message.includes("401")) {
        clearTokens();
        if (typeof window !== "undefined") {
          localStorage.removeItem("currentUser");
        }
      }
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
        error: error instanceof Error ? error.message : "Failed to get user",
      });
    }
  },

  getCurrentUser: async () => {
    const state = useAuthStore.getState();

    // Don't fetch if already loading
    if (state.isLoading) {
      return;
    }

    // Check if we have tokens first
    if (!hasTokens()) {
      set({ isAuthenticated: false, user: null, isLoading: false });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const user = await authApi.getCurrentUser();
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });

      // Update localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("currentUser", JSON.stringify(user));
      }
    } catch (error) {
      console.error("Failed to get current user:", error);
      // If unauthorized, clear tokens
      if (error instanceof Error && error.message.includes("401")) {
        clearTokens();
        if (typeof window !== "undefined") {
          localStorage.removeItem("currentUser");
        }
      }
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to get user",
      });
    }
  },

  clearError: () => set({ error: null }),
}));
