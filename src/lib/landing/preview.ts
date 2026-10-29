// postMessage protocol between the splitbill-be admin (parent window) and
// /preview/landing (iframe inside the admin's phone frame).
//   admin  → preview: { source: CMS_SOURCE, type: "landing:content", content }
//                     { source: CMS_SOURCE, type: "landing:focus", section }
//   preview → admin:  { source: PREVIEW_SOURCE, type: "landing:ready" }

export const CMS_SOURCE = "splitbill-cms";
export const PREVIEW_SOURCE = "splitbill-preview";

// Admin origins allowed to embed the preview and drive it. Localhost is always
// allowed so the admin can be developed against the production web.
const CMS_ORIGINS = (process.env.NEXT_PUBLIC_CMS_ORIGINS || "https://splitbillbe.netlify.app")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const LOCAL_ORIGIN = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

export function isAllowedCmsOrigin(origin: string): boolean {
  return CMS_ORIGINS.includes(origin) || LOCAL_ORIGIN.test(origin);
}

/** CSP frame-ancestors value for /preview/* (see next.config.ts). */
export const PREVIEW_FRAME_ANCESTORS = ["'self'", ...CMS_ORIGINS, "http://localhost:*", "http://127.0.0.1:*"].join(" ");
