import type { Metadata } from "next";
import InvoiceClientPage from "./InvoiceClientPage";

export const metadata: Metadata = {
  title: "Buat Invoice Online Gratis - Cepat & Profesional",
  description: "Buat invoice profesional secara online dan gratis. Cocok untuk freelancer, bisnis kecil, atau penagihan jasa. Mudah digunakan, bisa langsung download PDF.",
  keywords: [
    "buat invoice online",
    "invoice gratis",
    "invoice generator free",
    "aplikasi penagihan online",
    "invoice freelancer indonesia",
  ],
  alternates: {
    canonical: "https://splitbill.my.id/invoice",
  },
  openGraph: {
    title: "Buat Invoice Online Gratis - SplitBill.my.id",
    description: "Buat invoice profesional secara online dan gratis. Cepat, mudah, dan bisa langsung download PDF.",
    url: "https://splitbill.my.id/invoice",
    siteName: "Split Bill App",
    locale: "id_ID",
    type: "website",
  },
};

export default function InvoicePage() {
  return <InvoiceClientPage />;
}
