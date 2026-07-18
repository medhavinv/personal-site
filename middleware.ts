import { NextRequest, NextResponse } from "next/server";

/**
 * Protect /admin with HTTP Basic Auth.
 *
 * Set ADMIN_PASSWORD (and optionally ADMIN_USER, default "admin") to enable it.
 * Without ADMIN_PASSWORD the admin page is disabled entirely, so it is never
 * public by accident.
 */
export const config = {
  matcher: ["/admin", "/admin/:path*"],
};

export function middleware(req: NextRequest) {
  const user = process.env.ADMIN_USER || "admin";
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    return new NextResponse("Admin is not configured.", { status: 503 });
  }

  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Basic ")) {
    try {
      const [u, p] = atob(auth.slice(6)).split(":");
      if (u === user && p === password) {
        return NextResponse.next();
      }
    } catch {
      /* fall through to challenge */
    }
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Admin", charset="UTF-8"' },
  });
}
