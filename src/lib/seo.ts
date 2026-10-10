export const SITE_URL = "https://www.splitbill.my.id";

/** Absolute URL for a site path, no trailing slash (homepage = SITE_URL). */
export function absoluteUrl(path: string = "/"): string {
  if (/^https?:\/\//.test(path)) return path;
  const clean = path.split(/[?#]/)[0].replace(/\/+$/, "");
  if (!clean || clean === "/") return SITE_URL;
  return `${SITE_URL}${clean.startsWith("/") ? clean : `/${clean}`}`;
}
