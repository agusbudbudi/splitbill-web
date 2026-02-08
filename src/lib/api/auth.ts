import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/lib/constants";
import { setTokens, clearTokens, getRefreshToken } from "@/lib/auth/tokens";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface CurrentUserResponse {
  user: User;
}

export async function login(
  credentials: LoginCredentials,
): Promise<AuthResponse> {
  const response = await apiClient.request<AuthResponse>(
    API_ENDPOINTS.AUTH.LOGIN,
    {
      method: "POST",
      body: JSON.stringify(credentials),
      skipAuth: true,
    },
  );

  if (response.accessToken) {
    setTokens(response.accessToken, response.refreshToken);
  }

  return response;
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await apiClient.request<AuthResponse>(
    API_ENDPOINTS.AUTH.REGISTER,
    {
      method: "POST",
      body: JSON.stringify(data),
      skipAuth: true,
    },
  );

  if (response.accessToken) {
    setTokens(response.accessToken, response.refreshToken);
  }

  return response;
}

export async function logout(): Promise<void> {
  try {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      await apiClient.request(API_ENDPOINTS.AUTH.LOGOUT, {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      });
    }
  } catch (error) {
    console.warn("Logout request failed:", error);
  } finally {
    clearTokens();
  }
}

export async function getCurrentUser(): Promise<User> {
  const response = await apiClient.request<CurrentUserResponse>(
    API_ENDPOINTS.AUTH.ME,
  );
  return response.user;
}

export async function verifyEmail(token: string): Promise<{ message: string }> {
  return await apiClient.request<{ message: string }>(
    API_ENDPOINTS.AUTH.VERIFY,
    {
      method: "POST",
      body: JSON.stringify({ token }),
      skipAuth: true,
    },
  );
}

export async function resendVerification(
  email: string,
): Promise<{ message: string }> {
  return await apiClient.request<{ message: string }>(
    API_ENDPOINTS.AUTH.RESEND_VERIFICATION,
    {
      method: "POST",
      body: JSON.stringify({ email }),
      skipAuth: true,
    },
  );
}
