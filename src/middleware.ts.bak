import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Extract country from Vercel edge header, Cloudflare header, or geo object
  const country =
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry") ||
    (request as any).geo?.country ||
    "DZ"; // Default fallback (e.g. during local development)

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-country-code", country);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Set cookie so client-side code can also read the detected country seamlessly
  response.cookies.set("user-country", country, {
    path: "/",
    httpOnly: false,
    sameSite: "lax",
  });

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
