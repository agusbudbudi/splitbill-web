import { API_BASE_URL } from "@/lib/constants";
import { getAccessToken } from "@/lib/auth/tokens";

export interface ApiError extends Error {
  status?: number;
}

export interface ApiRequestOptions extends RequestInit {
  skipAuth?: boolean;
  skipRefresh?: boolean;
}

class ApiClient {
  private baseURL: string;
  private tokenRefreshPromise: Promise<boolean> | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async request<T>(
    endpoint: string,
    options: ApiRequestOptions = {},
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const { skipAuth, skipRefresh, ...fetchOptions } = options;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...fetchOptions.headers,
      },
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
      if (response.status === 401 && !skipRefresh && !skipAuth) {
        const refreshed = await this.refreshTokens();
        if (refreshed) {
          // Retry request with new token
          const newToken = getAccessToken();
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${newToken}`,
          };
          response = await fetch(url, config);
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
      console.error("API request failed:", error);
      throw error;
    }
  }

  private async refreshTokens(): Promise<boolean> {
    // Prevent multiple simultaneous refresh requests
    if (this.tokenRefreshPromise) {
      return await this.tokenRefreshPromise;
    }

    this.tokenRefreshPromise = this.performTokenRefresh();
    const result = await this.tokenRefreshPromise;
    this.tokenRefreshPromise = null;
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

      const response = await fetch(`${this.baseURL}/api/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        setTokens(data.accessToken, data.refreshToken || refreshToken);
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
