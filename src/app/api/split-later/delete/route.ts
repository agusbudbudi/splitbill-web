import { del } from "@vercel/blob";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const { urls } = await request.json();

    if (!Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { success: false, error: "No urls provided" },
        { status: 400 },
      );
    }

    await Promise.all(
      urls.map(async (url: string) => {
        try {
          if (url.startsWith("/uploads/")) {
            // Local dev fallback file (see upload/route.ts)
            const filePath = path.join(process.cwd(), "public", url);
            await fs.unlink(filePath);
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
