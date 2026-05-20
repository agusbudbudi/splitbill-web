import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 },
      );
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Invalid file type. Only JPG, PNG, WebP, PDF are allowed." },
        { status: 400 },
      );
    }

    // Validate file size (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: "File too large. Max 10MB." },
        { status: 400 },
      );
    }

    const cleanFileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

    // Fallback if Vercel Blob Token is not configured (e.g. Local Dev Environment)
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.warn("⚠️ BLOB_READ_WRITE_TOKEN is missing. Using local public/uploads/ fallback.");
      
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      
      // Ensure the directory exists
      await fs.mkdir(uploadDir, { recursive: true });
      
      const filePath = path.join(uploadDir, cleanFileName);
      const buffer = Buffer.from(await file.arrayBuffer());
      
      await fs.writeFile(filePath, buffer);
      
      return NextResponse.json({
        success: true,
        url: `/uploads/${cleanFileName}`,
        pathname: `uploads/${cleanFileName}`,
        isLocalFallback: true,
      });
    }

    // Standard Vercel Blob upload when token is present
    const filename = `split-later/${cleanFileName}`;
    const blob = await put(filename, file, {
      access: "public",
    });

    return NextResponse.json({
      success: true,
      url: blob.url,
      pathname: blob.pathname,
    });
  } catch (error: any) {
    console.error("Upload error details:", error);
    return NextResponse.json(
      { success: false, error: `Upload failed: ${error.message || error}` },
      { status: 500 },
    );
  }
}
