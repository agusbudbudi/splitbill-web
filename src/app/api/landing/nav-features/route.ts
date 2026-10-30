import { NextResponse } from "next/server";
import { getLandingContent } from "@/lib/landing/content";
import { toNavFeatures } from "@/lib/landing/navFeatures";

// Cached like the homepage (same CMS fetch and cache tag, so a CMS save refreshes
// it too). Lets every page's navbar read the features without a root layout
// fetch, which would put all static pages on an hourly ISR cycle.
export const revalidate = 3600;

export async function GET() {
  const { content } = await getLandingContent();
  return NextResponse.json({ data: toNavFeatures(content.features) });
}
