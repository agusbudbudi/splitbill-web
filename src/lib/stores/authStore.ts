import { create } from "zustand";
import { User } from "@/lib/api/auth";
import * as authApi from "@/lib/api/auth";
import { hasTokens, clearTokens } from "@/lib/auth/tokens";

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
      const response = await authApi.login(credentials);
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        isInitialized: true,
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

  register: async (name: string, email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      await authApi.register({ name, email, password });
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
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearTokens();
      if (typeof window !== "undefined") {
        localStorage.removeItem("currentUser");
      }
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

    // Check if we have tokens first
    if (!hasTokens()) {
      set({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        isInitialized: true,
      });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const user = await authApi.getCurrentUser();
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        isInitialized: true,
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

    // Don't fetch if already loading or if we already have user data
    if (state.isLoading || state.user) {
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
