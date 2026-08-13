import { apiClient } from "./client";
import { EntryPointCardData } from "@/lib/types/entryPoint";

interface EntryPointApiItem extends Omit<EntryPointCardData, "id"> {
  _id: string;
}

interface EntryPointsApiResponse {
  success: boolean;
  data: EntryPointApiItem[];
}

function mapEntryPoint(raw: EntryPointApiItem): EntryPointCardData {
  return {
    id: raw._id,
    imageUrl: raw.imageUrl,
    imageAlt: raw.imageAlt,
    title: raw.title,
    subtitle: raw.subtitle ?? undefined,
    ctaText: raw.ctaText ?? undefined,
    url: raw.url ?? undefined,
    footerText: raw.footerText ?? undefined,
    footerIconUrl: raw.footerIconUrl ?? undefined,
    ribbonText: raw.ribbonText ?? undefined,
  };
}

export async function fetchEntryPoints(
  placement = "homepage-member",
): Promise<EntryPointCardData[]> {
  const response = await apiClient.request<EntryPointsApiResponse>(
    `/api/entry-points?placement=${encodeURIComponent(placement)}`,
    { method: "GET", skipAuth: true },
  );

  return (response.data || []).map(mapEntryPoint);
}
