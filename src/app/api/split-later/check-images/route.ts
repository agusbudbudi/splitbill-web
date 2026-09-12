import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { requireAuthUser, findUnauthorizedReceiptUrl } from "@/lib/api/splitLaterAuth";

async function checkExists(url: string): Promise<boolean> {
  try {
    if (url.startsWith("/uploads/")) {
      // Local dev fallback file (see upload/route.ts)
      const filePath = path.join(process.cwd(), "public", url);
      await fs.access(filePath);
      return true;
    }

    const res = await fetch(url, { method: "HEAD", cache: "no-store" });
    return res.ok;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuthUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { urls } = await request.json();

    if (!Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { success: false, error: "No urls provided" },
        { status: 400 },
      );
    }

    // Same ownership check as the delete route — without it, any logged-in
    // user could probe existence of another user's receipt URLs.
    const authorization = request.headers.get("authorization")!;
    const unauthorizedUrl = await findUnauthorizedReceiptUrl(authorization, urls);

    if (unauthorizedUrl === "verification_failed") {
      return NextResponse.json(
        { success: false, error: "Could not verify ownership" },
        { status: 502 },
      );
    }
    if (unauthorizedUrl) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 },
      );
    }

    const results = await Promise.all(
      urls.map(async (url: string) => ({ url, exists: await checkExists(url) })),
    );

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    console.error("Check-images error details:", error);
    return NextResponse.json(
      { success: false, error: `Check failed: ${error.message || error}` },
      { status: 500 },
    );
  }
}
