import { useSyncExternalStore } from "react";
import { useAuthStore } from "@/lib/stores/authStore";
import {
  GUEST_LIMIT,
  GUEST_QUOTA_CHANGED_EVENT,
  getGuestScanQuota,
} from "@/lib/utils/guestQuota";

const subscribeToGuestQuota = (onChange: () => void) => {
  window.addEventListener(GUEST_QUOTA_CHANGED_EVENT, onChange);
  return () => window.removeEventListener(GUEST_QUOTA_CHANGED_EVENT, onChange);
};

/** True when the current user, guest or logged in, has no AI scans left. */
export const useAIScanQuotaExhausted = () => {
  const { isAuthenticated, isInitialized, user } = useAuthStore();
  const guestRemaining = useSyncExternalStore(
    subscribeToGuestQuota,
    () => getGuestScanQuota().remaining,
    () => GUEST_LIMIT,
  );

  // Auth starts out false, so a logged-in user would briefly read as a guest.
  if (!isInitialized) return false;
  if (!isAuthenticated) return guestRemaining <= 0;

  const freeScanCount = user?.freeScanCount;
  return (
    user?.subscriptionStatus !== "active" &&
    freeScanCount !== undefined &&
    freeScanCount <= 0
  );
};
