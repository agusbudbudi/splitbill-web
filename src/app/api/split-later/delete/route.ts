import { del } from "@vercel/blob";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { requireAuthUser, findUnauthorizedReceiptUrl } from "@/lib/api/splitLaterAuth";

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

    // Ownership check: only allow deleting blobs that appear on one of the
    // requesting user's own buckets — closes the "delete any guessed URL"
    // gap now that buckets/receipts are backend-tracked per user.
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

    await Promise.all(
      urls.map(async (url: string) => {
        try {
          if (url.startsWith("/uploads/")) {
            // Local dev fallback file (see upload/route.ts). Resolve and
            // confirm the path stays inside the uploads dir before unlinking
            // — defense in depth against a "../" traversal in the URL, on
            // top of the ownership check above.
            const uploadsDir = path.join(process.cwd(), "public", "uploads");
            const filePath = path.join(process.cwd(), "public", url);
            const resolved = path.resolve(filePath);
            if (resolved !== uploadsDir && !resolved.startsWith(uploadsDir + path.sep)) {
              console.error(`Refusing to delete outside uploads dir: "${url}"`);
              return;
            }
            await fs.unlink(resolved);
          } else if (process.env.BLOB_READ_WRITE_TOKEN) {
            await del(url);
          }
        } catch (err) {
          console.error(`Failed to delete "${url}":`, err);
        }
      }),
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete error details:", error);
    return NextResponse.json(
      { success: false, error: `Delete failed: ${error.message || error}` },
      { status: 500 },
    );
  }
}
