export const GUEST_LIMIT = 1;
export const TRACKER_KEY = "sb_guest_scan_tracker";

export interface GuestTracker {
  count: number;
  lastScanDate: string;
}

export const getGuestScanQuota = (): { allowed: boolean; remaining: number } => {
  if (typeof window === "undefined") return { allowed: true, remaining: GUEST_LIMIT };
  const today = new Date().toISOString().split("T")[0];
  const dataStr = localStorage.getItem(TRACKER_KEY);

  if (!dataStr) return { allowed: true, remaining: GUEST_LIMIT };

  try {
    const tracker: GuestTracker = JSON.parse(dataStr);
    if (tracker.lastScanDate !== today) {
      return { allowed: true, remaining: GUEST_LIMIT };
    }
    return {
      allowed: tracker.count < GUEST_LIMIT,
      remaining: Math.max(0, GUEST_LIMIT - tracker.count)
    };
  } catch {
    return { allowed: true, remaining: GUEST_LIMIT };
  }
};

export const incrementGuestScanCount = () => {
  if (typeof window === "undefined") return;
  const today = new Date().toISOString().split("T")[0];
  const dataStr = localStorage.getItem(TRACKER_KEY);
  let tracker: GuestTracker = { count: 1, lastScanDate: today };

  if (dataStr) {
    try {
      const parsed: GuestTracker = JSON.parse(dataStr);
      if (parsed.lastScanDate === today) {
        tracker.count = parsed.count + 1;
      }
    } catch (e) {
      // Ignore
    }
  }
  localStorage.setItem(TRACKER_KEY, JSON.stringify(tracker));
};
