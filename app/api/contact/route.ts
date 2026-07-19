import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

// Rate limit each visitor. Backed by Upstash Redis when configured (shared
// across serverless instances), with an in-memory fallback for local dev.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const limit = await rateLimit(ip, {
    windowMs: WINDOW_MS,
    max: MAX_PER_WINDOW,
    prefix: "contact",
  });
  if (limit.limited) {
    return NextResponse.json(
      { error: "Too many messages. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let body: { name?: string; email?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = (body.name ?? "").trim().slice(0, 200);
  const email = (body.email ?? "").trim().slice(0, 320);
  const message = (body.message ?? "").trim().slice(0, 5000);

  if (!name || !message || !isEmail(email)) {
    return NextResponse.json(
      { error: "Please fill in your name, a valid email, and a message." },
      { status: 400 },
    );
  }

  const resendKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  // Deliver via Resend when configured.
  if (resendKey && to && from) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [to],
          reply_to: email,
          subject: `New message from ${name} via your site`,
          text: `From: ${name} <${email}>\n\n${message}`,
        }),
      });
      if (!res.ok) throw new Error("delivery failed");
      return NextResponse.json({ ok: true });
    } catch {
      return NextResponse.json(
        { error: "Could not send your message. Please try LinkedIn instead." },
        { status: 502 },
      );
    }
  }

  // No delivery backend configured. In production, fail loudly rather than
  // telling the visitor their message was sent and silently dropping it.
  // Configure RESEND_API_KEY, CONTACT_TO_EMAIL, and CONTACT_FROM_EMAIL for
  // real delivery.
  if (process.env.NODE_ENV === "production") {
    console.error("[contact] dropped submission: delivery is not configured");
    return NextResponse.json(
      { error: "The contact form is not set up yet. Please reach out on LinkedIn instead." },
      { status: 503 },
    );
  }

  // Development fallback: record server-side so the form is testable locally.
  console.log("[contact] submission", { name, email, message });
  return NextResponse.json({ ok: true });
}
