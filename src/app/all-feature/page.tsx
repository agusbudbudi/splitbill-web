import { Metadata } from "next";
import { AllFeatureClientPage } from "./AllFeatureClientPage";

export const metadata: Metadata = {
  title: "Semua Fitur | SplitBill Online",
  description:
    "Jelajahi semua fitur di SplitBill Online. Mulai dari Split Bill otomatis dengan AI Scan, Split Later untuk patungan trip, hingga pembuatan Invoice.",
};

export default function AllFeaturePage() {
  return <AllFeatureClientPage />;
}
