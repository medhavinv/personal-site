import { NextRequest, NextResponse } from "next/server";
import { aiContext } from "@/content/site";
import { rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

// Rate limit each visitor. Backed by Upstash Redis when configured (shared
// across serverless instances), with an in-memory fallback for local dev.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 15;

type Message = { role: "user" | "assistant"; content: string };

function sanitize(input: unknown): Message[] | null {
  if (!Array.isArray(input)) return null;
  const out: Message[] = [];
  for (const m of input.slice(-20)) {
    if (
      m &&
      (m.role === "user" || m.role === "assistant") &&
      typeof m.content === "string" &&
      m.content.trim()
    ) {
      out.push({ role: m.role, content: m.content.slice(0, 2000) });
    }
  }
  // Must end with a user turn.
  if (!out.length || out[out.length - 1].role !== "user") return null;
  return out;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const limit = await rateLimit(ip, {
    windowMs: WINDOW_MS,
    max: MAX_PER_WINDOW,
    prefix: "ask",
  });
  if (limit.limited) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "The assistant is not configured." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const messages = sanitize((body as { messages?: unknown })?.messages);
  if (!messages) {
    return NextResponse.json({ error: "Invalid messages." }, { status: 400 });
  }

  // Answer in the visitor's selected language. Facts stay English in the prompt.
  const locale = (body as { locale?: unknown })?.locale;
  const system =
    locale === "th"
      ? `${aiContext}\n\nIMPORTANT: Reply in Thai (ภาษาไทย), keeping the same warm, plain, first-person voice.`
      : aiContext;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001",
        max_tokens: 400,
        system,
        messages,
      }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "The assistant is unavailable right now." },
        { status: 502 },
      );
    }

    const data = await res.json();
    const reply =
      Array.isArray(data.content) &&
      data.content.find((b: { type: string }) => b.type === "text")?.text;

    return NextResponse.json({ reply: typeof reply === "string" ? reply : "" });
  } catch {
    return NextResponse.json(
      { error: "The assistant is unavailable right now." },
      { status: 502 },
    );
  }
}
