"use client";

import { use } from "react";
import { WalletDetailPanel } from "@/components/wallet/WalletDetailPanel";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function MemberWalletDetailPage({ params }: PageProps) {
  const { id } = use(params);
  return <WalletDetailPanel id={id} />;
}
