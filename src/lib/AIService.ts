import { apiClient } from "./api/client";
import { API_ENDPOINTS } from "./constants";

export interface ReceiptItem {
  name: string;
  price: number;
  quantity: number;
}

export interface ReceiptScanResult {
  merchant_name: string | null;
  items: ReceiptItem[];
  tax: number | null;
  service_charge: number | null;
  discount: number | null;
  [key: string]: any; // Allow for extra fields from API
}

export const scanReceipt = async (
  base64DataUrl: string,
): Promise<ReceiptScanResult> => {
  try {
    // 1. Extract mime type and base64 data
    const matches = base64DataUrl.match(/^data:(.+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error("Invalid image format. Please capture a new photo.");
    }
    const mimeType = matches[1];
    const base64Image = matches[2];

    // 2. Call the external API using apiClient (handles auth)
    const data = await apiClient.request<any>(API_ENDPOINTS.GEMINI_SCAN, {
      method: "POST",
      body: JSON.stringify({
        mime_type: mimeType,
        base64Image: base64Image,
      }),
    });

    // 3. Handle different response formats
    let rawTaxonomy = data;

    // Handle extraction from string (legacy/common LLM baggage)
    const text = data.text || data.result;
    if (typeof text === "string") {
      const jsonMatch = text.match(/\{[\s\S]*\}/) || text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          rawTaxonomy = JSON.parse(jsonMatch[0]);
        } catch (e) {
          console.error("Failed to parse extracted JSON", e);
        }
      }
    }

    // 4. Normalize to the new Taxonomy structure or return as-is
    if (Array.isArray(rawTaxonomy)) {
      return {
        merchant_name: null,
        items: rawTaxonomy.map((item: any) => ({
          name: (item.name || item.item || "Unknown Item") as string,
          price: parseInt(
            (item.total || item.amount || item.price || "0")
              .toString()
              .replace(/[^\d]/g, ""),
            10,
          ),
          quantity: 1,
        })),
        tax: null,
        service_charge: null,
        discount: null,
      };
    }

    // Clean up items in the object if they exist
    if (rawTaxonomy.items && Array.isArray(rawTaxonomy.items)) {
      rawTaxonomy.items = rawTaxonomy.items.map((item: any) => ({
        name: (item.name || item.item || "Unknown Item") as string,
        price: parseInt(
          (item.total || item.amount || item.price || "0")
            .toString()
            .replace(/[^\d]/g, ""),
          10,
        ),
        quantity: item.quantity || 1,
      }));
    }

    return rawTaxonomy as ReceiptScanResult;
  } catch (error: any) {
    console.error("AI Scan Error:", error);
    throw new Error(error.message || "Terjadi kesalahan saat scanning.");
  }
};
