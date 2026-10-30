import { useEffect, useState } from "react";
import { localApiClient } from "@/lib/api/client";
import { DEFAULT_LANDING_CONTENT } from "@/lib/landing/defaults";
import { toNavFeatures, type NavFeature } from "@/lib/landing/navFeatures";

// Bundled rather than lazy-loaded: the fallback matters most when offline,
// which is when a lazy chunk could fail to load too.
const { features: defaultFeatures } = DEFAULT_LANDING_CONTENT;
const FALLBACK_FEATURES = toNavFeatures({
  ...defaultFeatures,
  items: defaultFeatures.items.filter((item) => item.isActive !== false),
});

// Shared across navbars so moving between pages doesn't refetch; cleared on
// failure so the next mount can retry.
let request: Promise<NavFeature[]> | null = null;

const loadNavFeatures = () =>
  (request ??= localApiClient
    .request<{ data: NavFeature[] }>("/api/landing/nav-features", { skipAuth: true })
    .then((res) => res.data)
    .catch((error) => {
      request = null;
      throw error;
    }));

/**
 * Landing features for the navbar's "Fitur" tray, loaded the first time
 * `enabled` is true. null until loaded. If the request fails it returns the
 * default features and tries again the next time `enabled` turns true.
 */
export function useNavFeatures(enabled: boolean): NavFeature[] | null {
  const [features, setFeatures] = useState<NavFeature[] | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!enabled || loaded) return;
    let cancelled = false;
    loadNavFeatures().then(
      (result) => {
        if (cancelled) return;
        setFeatures(result);
        setLoaded(true);
      },
      () => {
        if (!cancelled) setFeatures(FALLBACK_FEATURES);
      }
    );
    return () => {
      cancelled = true;
    };
  }, [enabled, loaded]);

  return features;
}
