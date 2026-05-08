import { API_BASE_URL, API_ENDPOINTS } from "@/lib/constants";
import type { SubscriptionPackage, Order } from "@/lib/types/subscription";
import { apiClient } from "./client";

export async function getPublicSubscriptionPackages(): Promise<
  SubscriptionPackage[]
> {
  const res = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.SUBSCRIPTION_PACKAGES_PUBLIC}`,
  );
  if (!res.ok) throw new Error("Gagal memuat paket langganan");
  const data = await res.json();
  return data.data.packages;
}

export async function createOrder(
  referenceId: string,
  type: "subscription",
): Promise<Order> {
  const response = await apiClient.request<{ success: boolean; data: Order }>(
    API_ENDPOINTS.ORDERS.CREATE,
    {
      method: "POST",
      body: JSON.stringify({ referenceId, type }),
    },
  );
  return response.data;
}

export async function getOrder(orderId: string): Promise<Order> {
  const response = await apiClient.request<{ success: boolean; data: Order }>(
    API_ENDPOINTS.ORDERS.BY_ID(orderId),
  );
  return response.data;
}

export async function getOrders(): Promise<Order[]> {
  const response = await apiClient.request<{
    success: boolean;
    data: { orders: Order[]; pagination: any };
  }>(API_ENDPOINTS.ORDERS.LIST);
  return response.data.orders;
}
