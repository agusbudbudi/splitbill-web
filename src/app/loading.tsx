"use client";

import { useSyncExternalStore } from "react";
import { LoadingIndicator } from "@/components/ui/LoadingIndicator";

const subscribe = () => () => {};

// Shown only once hydrated (client-side navigations). On the first server
// response it renders nothing, so crawlers never get a full-screen
// "Memuat..." shell in place of the page content.
export default function Loading() {
  // false on the server and during hydration, true afterwards
  const isHydrated = useSyncExternalStore(subscribe, () => true, () => false);

  if (!isHydrated) return <div className="min-h-screen bg-background" />;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <LoadingIndicator text="Memuat..." />
    </div>
  );
}
