import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Per-instance rate limiter.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many messages. Please try again shortly." },
      { status: 429 },
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

  // Fallback when no delivery backend is configured: record server-side so the
  // form is functional in development. Configure RESEND_API_KEY, CONTACT_TO_EMAIL,
  // and CONTACT_FROM_EMAIL for real delivery in production.
  console.log("[contact] submission", { name, email, message });
  return NextResponse.json({ ok: true });
}
