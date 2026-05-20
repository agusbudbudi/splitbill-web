import BucketDetailClientPage from "./BucketDetailClientPage";

interface Props {
  params: Promise<{ bucketId: string }>;
}

export default async function BucketDetailPage({ params }: Props) {
  const { bucketId } = await params;
  return <BucketDetailClientPage bucketId={bucketId} />;
}
