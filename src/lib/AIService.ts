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
  base64OrUrl: string,
): Promise<ReceiptScanResult> => {
  try {
    let base64DataUrl = base64OrUrl;

    // If it's a URL (starts with http or /uploads), convert to base64 data URL
    if (!base64OrUrl.startsWith("data:")) {
      try {
        const response = await fetch(base64OrUrl);
        const blob = await response.blob();
        base64DataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch (err) {
        console.error("Failed to convert image URL to base64:", err);
        throw new Error(
          "Gagal memproses file struk dari link penyimpanan. Silakan coba unggah atau ambil foto ulang."
        );
      }
    }

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

    // Helper to safely parse numeric fields that may arrive as strings (e.g. "-19,650")
    const parseNumericField = (value: any): number | null => {
      if (value === null || value === undefined) return null;
      const str = value.toString().trim();
      if (str === "") return null;
      const isNegative = str.startsWith("-");
      const digits = str.replace(/[^\d]/g, "");
      if (!digits) return null;
      const num = parseInt(digits, 10);
      return isNegative ? -num : num;
    };

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

    // Normalize numeric summary fields (API may return them as strings)
    rawTaxonomy.tax = parseNumericField(rawTaxonomy.tax);
    rawTaxonomy.service_charge = parseNumericField(rawTaxonomy.service_charge);
    rawTaxonomy.discount = parseNumericField(rawTaxonomy.discount);

    return rawTaxonomy as ReceiptScanResult;
  } catch (error: any) {
    console.error("AI Scan Error:", error);
    throw new Error(error.message || "Terjadi kesalahan saat scanning.");
  }
};
