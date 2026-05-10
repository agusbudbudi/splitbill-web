"use client";
 
import { useEffect } from "react";
import { trackGeneral, trackMarketing } from "@/lib/gtag";
import { useWalletStore } from "@/store/useWalletStore";
import { useFriendStore } from "@/lib/stores/friendStore";

export function AppEntryTracker() {
  const savedBillsCount = useWalletStore((state) => state.savedBills.length);
  const friendsCount = useFriendStore((state) => state.friends.length);

  useEffect(() => {
    trackGeneral.appEntry();
    
    // Set user properties for marketing segmentation
    trackMarketing.setUsageIntensity(savedBillsCount);
    trackMarketing.setSocialEngagement(friendsCount);
  }, []);

  return null;
}
