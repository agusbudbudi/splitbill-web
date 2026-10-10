import type { Metadata } from "next";
import BucketDetailClientPage from "./BucketDetailClientPage";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ bucketId: string }>;
}

export default async function BucketDetailPage({ params }: Props) {
  const { bucketId } = await params;
  return (
    <ProtectedRoute>
      <BucketDetailClientPage bucketId={bucketId} />
    </ProtectedRoute>
  );
}
