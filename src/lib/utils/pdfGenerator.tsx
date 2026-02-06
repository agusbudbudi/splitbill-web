import { pdf } from "@react-pdf/renderer";
import React from "react";
import { InvoicePDF } from "@/app/invoice/components/InvoicePDF";

/**
 * Exports a professional vector-based PDF using @react-pdf/renderer.
 * @param invoice The invoice data object.
 * @param fileName The name of the output PDF file.
 */
export const downloadInvoicePDF = async (invoice: any, fileName: string) => {
  try {
    const doc = <InvoicePDF invoice={invoice} />;
    const asBlob = await pdf(doc).toBlob();
    
    // Create a link and trigger download
    const url = URL.createObjectURL(asBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to generate professional PDF:", error);
    throw error;
  }
};
