// Relative import: next.config.ts loads this file, and path aliases don't resolve there.
import { API_BASE_URL } from "../constants";

const LANDING_ASSET_PATH = "/api/landing-assets/";

const httpsHostname = (url: string): string[] => {
  try {
    const { protocol, hostname } = new URL(url);
    return protocol === "https:" ? [hostname] : [];
  } catch {
    return [];
  }
};

/**
 * Backend hosts serving CMS uploads over https. next.config.ts allows exactly
 * these in images.remotePatterns, so the check below and the optimizer's
 * allowlist can't drift apart.
 */
export const LANDING_ASSET_HOSTS = Array.from(
  new Set(["splitbillbe.netlify.app", ...httpsHostname(API_BASE_URL)]),
);

/**
 * Whether next/image must render `src` unoptimized. Only site-relative paths
 * and https CMS uploads go through the optimizer; anything else (a plain-http
 * local backend in dev, an external URL pasted into the CMS) would make
 * next/image throw or the optimizer 400, so it renders as-is instead.
 */
export function isUnoptimizableSrc(src: string): boolean {
  if (src.startsWith("/") && !src.startsWith("//")) return false;
  try {
    const url = new URL(src);
    return !(
      url.protocol === "https:" &&
      LANDING_ASSET_HOSTS.includes(url.hostname) &&
      url.pathname.startsWith(LANDING_ASSET_PATH)
    );
  } catch {
    return true;
  }
}
