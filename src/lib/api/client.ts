import { API_BASE_URL } from "@/lib/constants";
import { getAccessToken } from "@/lib/auth/tokens";

export interface ApiError extends Error {
  status?: number;
}

export interface ApiRequestOptions extends RequestInit {
  skipAuth?: boolean;
  skipRefresh?: boolean;
}

// Module-level (not per-instance): apiClient and localApiClient both refresh
// against the same backend endpoint with the same refresh token, which the
// backend rotates/single-uses. Sharing this promise across instances stops
// concurrent 401s on both from racing two refresh calls, where the second
// to land gets rejected as an already-consumed token and force-logs-out a
// user who just obtained valid fresh tokens via the first.
let sharedTokenRefreshPromise: Promise<boolean> | null = null;

class ApiClient {
  private baseURL: string;

  private isRedirecting = false;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async request<T>(
    endpoint: string,
    options: ApiRequestOptions = {},
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const { skipAuth, skipRefresh, ...fetchOptions } = options;

    // Let fetch set its own multipart boundary for FormData bodies (e.g.
    // file uploads) — forcing application/json here would send a
    // Content-Type that doesn't match the actual body encoding.
    const isFormData =
      typeof FormData !== "undefined" && fetchOptions.body instanceof FormData;

    const config: RequestInit = {
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...fetchOptions.headers,
      },
      cache: "no-store",
      ...fetchOptions,
    };

    // Add auth header if not skipped
    if (!skipAuth) {
      const token = getAccessToken();
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
    }

    try {
      let response = await fetch(url, config);

      // If token expired and we have a refresh token, try to refresh
      if (response.status === 401 && !skipAuth) {
        if (!skipRefresh) {
          const refreshed = await this.refreshTokens();
          if (refreshed) {
            // Retry request with new token
            const newToken = getAccessToken();
            config.headers = {
              ...config.headers,
              Authorization: `Bearer ${newToken}`,
            };
            response = await fetch(url, config);
            
            if (response.status === 401) {
              await this.handleTokenExpired();
            }
          } else {
            await this.handleTokenExpired();
          }
        } else {
          await this.handleTokenExpired();
        }
      }

      const data = await response.json();

      if (!response.ok) {
        const error = new Error(
          data.error || data.message || "Request failed",
        ) as ApiError;
        error.status = response.status;
        throw error;
      }

      return data as T;
    } catch (error) {
      // Use warn (not error) so expected, caller-handled HTTP failures
      // (e.g. 403 ownership conflicts that trigger a retry) don't pop the
      // Next.js dev error overlay. Callers surface real failures via toasts.
      console.warn("API request failed:", error);
      throw error;
    }
  }

  private async handleTokenExpired() {
    if (typeof window !== "undefined") {
      if (this.isRedirecting) return;
      this.isRedirecting = true;

      const { clearTokens, markAuthExpired } = await import("@/lib/auth/tokens");
      clearTokens();
      markAuthExpired();

      const currentPath = window.location.pathname + window.location.search;
      const redirectParam =
        currentPath && currentPath !== "/" && currentPath !== "/login"
          ? `redirect=${encodeURIComponent(currentPath)}`
          : "";

      const queryParams = ["expired=true", redirectParam].filter(Boolean).join("&");
      const loginUrl = `/login?${queryParams}`;

      window.location.href = loginUrl;
    }
  }

  private async refreshTokens(): Promise<boolean> {
    // Prevent multiple simultaneous refresh requests across ALL instances
    if (sharedTokenRefreshPromise) {
      return await sharedTokenRefreshPromise;
    }

    sharedTokenRefreshPromise = this.performTokenRefresh();
    const result = await sharedTokenRefreshPromise;
    sharedTokenRefreshPromise = null;
    return result;
  }

  private async performTokenRefresh(): Promise<boolean> {
    try {
      const { getRefreshToken, setTokens, clearTokens } =
        await import("@/lib/auth/tokens");
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        return false;
      }

      // Always refresh against the backend, even for a client instance whose
      // baseURL points at this app's own local API routes (e.g. localApiClient)
      // — /api/auth/refresh only exists on splitbill-be.
      const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        const newRefreshToken = data.refreshToken || refreshToken;
        setTokens(data.accessToken, newRefreshToken);
        // Tell the native shell so it holds the rotated tokens too — otherwise
        // it keeps re-injecting the stale (possibly already-consumed) pair on
        // every fresh webview navigation, breaking the next refresh.
        (window as any).ReactNativeWebView?.postMessage(
          JSON.stringify({
            type: "TOKENS_REFRESHED",
            accessToken: data.accessToken,
            refreshToken: newRefreshToken,
          }),
        );
        return true;
      } else {
        clearTokens();
        return false;
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      const { clearTokens } = await import("@/lib/auth/tokens");
      clearTokens();
      return false;
    }
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Same auth-header injection + 401-refresh-and-retry behavior as apiClient,
// but pointed at this Next.js app's own /api/* routes (same origin) instead
// of the splitbill-be backend — used by the split-later upload/delete/
// check-images routes so an expired access token gets silently refreshed
// and retried instead of surfacing a raw "Upload gagal" toast.
export const localApiClient = new ApiClient("");
