"use client";

import { use } from "react";
import { BucketDetailPanel } from "@/components/split-later/BucketDetailPanel";

interface PageProps {
  params: Promise<{ bucketId: string }>;
}

export default function MemberSplitLaterDetailPage({ params }: PageProps) {
  const { bucketId } = use(params);
  return <BucketDetailPanel bucketId={bucketId} />;
}
