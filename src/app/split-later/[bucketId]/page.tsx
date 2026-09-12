import BucketDetailClientPage from "./BucketDetailClientPage";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

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
