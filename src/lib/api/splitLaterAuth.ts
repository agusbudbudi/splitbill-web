import { jwtVerify } from "jose";
import { API_BASE_URL } from "@/lib/constants";

export interface AuthenticatedUser {
  id: string;
}

// Verifies the Authorization header of an incoming Next.js API route request
// locally against JWT_SECRET (same secret + payload shape — {userId} — the
// backend signs access tokens with, see splitbill-be/lib/middleware/auth.js).
// Local verification avoids a network round-trip on every upload/delete
// call; it can't check isVerified/user-still-exists the way the backend's
// own requireUser does, but every mutation this guards is further scoped by
// backend ownership checks anyway, so a stale-but-signature-valid token
// carries no extra risk here.
export async function requireAuthUser(
  request: Request,
): Promise<AuthenticatedUser | null> {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) return null;

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("requireAuthUser: JWT_SECRET is not configured");
    return null;
  }

  try {
    const token = authorization.slice("Bearer ".length);
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    if (typeof payload.userId !== "string") return null;
    return { id: payload.userId };
  } catch (error) {
    console.error("requireAuthUser: failed to verify token", error);
    return null;
  }
}

// Server-side ownership check for the blob-delete route: confirms every URL
// in the batch appears on one of the requesting user's own buckets before
// the blobs get deleted, via a backend endpoint scoped to just these URLs
// (not the user's entire bucket/receipt history). Returns the first URL
// that isn't owned, or null if the whole batch checks out.
export async function findUnauthorizedReceiptUrl(
  authorization: string,
  urls: string[],
): Promise<string | "verification_failed" | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/split-later/buckets/verify-ownership`, {
      method: "POST",
      headers: {
        Authorization: authorization,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ urls }),
      cache: "no-store",
    });
    if (!res.ok) return "verification_failed";

    const data = await res.json();
    const ownedUrls: string[] = data?.ownedUrls ?? [];
    const ownedSet = new Set(ownedUrls);

    for (const url of urls) {
      if (typeof url !== "string") continue;
      if (!ownedSet.has(url)) return url;
    }
    return null;
  } catch (error) {
    console.error("findUnauthorizedReceiptUrl: failed to verify ownership", error);
    return "verification_failed";
  }
}
