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

const orderInFlight = new Map<string, Promise<Order>>();

export async function getOrder(orderId: string): Promise<Order> {
  const existing = orderInFlight.get(orderId);
  if (existing) return existing;

  const promise = apiClient
    .request<{ success: boolean; data: Order }>(
      API_ENDPOINTS.ORDERS.BY_ID(orderId),
    )
    .then((response) => response.data)
    .finally(() => {
      orderInFlight.delete(orderId);
    });

  orderInFlight.set(orderId, promise);
  return promise;
}

let ordersInFlight: Promise<Order[]> | null = null;

export async function getOrders(): Promise<Order[]> {
  if (ordersInFlight) return ordersInFlight;

  ordersInFlight = apiClient
    .request<{
      success: boolean;
      data: { orders: Order[]; pagination: any };
    }>(API_ENDPOINTS.ORDERS.LIST)
    .then((response) => response.data.orders)
    .finally(() => {
      ordersInFlight = null;
    });

  return ordersInFlight;
}
