import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { recordEvent } from "@/lib/analyticsStore";

export const runtime = "nodejs";

/**
 * First-party analytics collector.
 *
 * Receives events from lib/analytics.ts, enriches them with what the server can
 * see (referrer, coarse geo, device, a salted IP hash for unique-visitor counts
 * without storing raw IPs), and hands them to a sink.
 *
 * Sink options, in order:
 *   1. ANALYTICS_WEBHOOK_URL set  -> POST the enriched event there (send it to
 *      your database, a spreadsheet webhook, Tinybird, etc.).
 *   2. otherwise                  -> console.log as structured JSON, which shows
 *      up in your hosting provider's logs (e.g. Vercel).
 */

const ALLOWED_EVENTS = new Set([
  "pageview",
  "section_view",
  "chat_open",
  "chat_message",
  "contact_submit",
]);

function hashIp(ip: string): string {
  const salt = process.env.ANALYTICS_IP_SALT || "vv-default-salt";
  return createHash("sha256").update(salt + ip).digest("hex").slice(0, 16);
}

export async function POST(req: NextRequest) {
  let body: {
    event?: string;
    props?: Record<string, unknown>;
    visitorId?: string;
    sessionId?: string;
    path?: string;
    referrer?: string | null;
    ts?: number;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (!body.event || !ALLOWED_EVENTS.has(body.event)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const enriched = {
    event: body.event,
    props: body.props ?? {},
    visitorId: typeof body.visitorId === "string" ? body.visitorId : null,
    sessionId: typeof body.sessionId === "string" ? body.sessionId : null,
    path: typeof body.path === "string" ? body.path.slice(0, 300) : null,
    referrer:
      typeof body.referrer === "string" ? body.referrer.slice(0, 300) : null,
    ts: typeof body.ts === "number" ? body.ts : Date.now(),
    // Enriched server-side.
    visitorHash: hashIp(ip),
    userAgent: req.headers.get("user-agent")?.slice(0, 400) ?? null,
    // Geo headers are populated by Vercel/Cloudflare at the edge.
    country: req.headers.get("x-vercel-ip-country") || null,
    region: req.headers.get("x-vercel-ip-country-region") || null,
    city: req.headers.get("x-vercel-ip-city") || null,
  };

  // Aggregate into the store (Vercel KV / Upstash) when configured. Powers the
  // /admin section-attention view. No-ops without credentials.
  await recordEvent(enriched).catch(() => {});

  const webhook = process.env.ANALYTICS_WEBHOOK_URL;
  if (webhook) {
    // Fire-and-forget; never block the beacon response.
    void fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(enriched),
    }).catch(() => {});
  } else if (!process.env.UPSTASH_REDIS_REST_URL && !process.env.KV_REST_API_URL) {
    // Fall back to structured logs only when no store and no webhook exist.
    console.log("[analytics]", JSON.stringify(enriched));
  }

  return NextResponse.json({ ok: true });
}
