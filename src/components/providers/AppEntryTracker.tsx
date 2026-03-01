"use client";

import { useEffect } from "react";
import { trackGeneral } from "@/lib/gtag";

export function AppEntryTracker() {
  useEffect(() => {
    trackGeneral.appEntry();
  }, []);

  return null;
}
