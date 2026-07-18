/**
 * Fixed-window rate limiter for API routes.
 *
 * Prefers Upstash Redis (the same store analytics uses) so the limit is shared
 * across every serverless instance — an in-memory Map is per-instance and easy
 * to bypass once traffic scales out. Falls back to an in-memory window when
 * Redis is not configured, so the app still runs locally without credentials.
 */
import { getRedis } from "@/lib/analyticsStore";

export type RateLimitResult = {
  limited: boolean;
  // Seconds until the current window resets (best-effort; for Retry-After).
  retryAfter: number;
};

// In-memory fallback: per-instance sliding window of hit timestamps.
const memoryHits = new Map<string, number[]>();

function memoryLimit(
  key: string,
  windowMs: number,
  max: number,
): RateLimitResult {
  const now = Date.now();
  const recent = (memoryHits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  memoryHits.set(key, recent);
  // Opportunistically drop stale keys so the map doesn't grow unbounded.
  if (memoryHits.size > 5000) {
    for (const [k, times] of memoryHits) {
      if (times.every((t) => now - t >= windowMs)) memoryHits.delete(k);
    }
  }
  return {
    limited: recent.length > max,
    retryAfter: Math.ceil(windowMs / 1000),
  };
}

/**
 * Returns whether `identifier` has exceeded `max` requests in `windowMs`.
 * `prefix` namespaces the counter so different routes don't collide.
 */
export async function rateLimit(
  identifier: string,
  {
    windowMs,
    max,
    prefix = "rl",
  }: { windowMs: number; max: number; prefix?: string },
): Promise<RateLimitResult> {
  const redis = getRedis();
  if (!redis) return memoryLimit(`${prefix}:${identifier}`, windowMs, max);

  // Fixed window: bucket the timestamp so all requests in the window share a key
  // that Redis can expire automatically.
  const windowSec = Math.ceil(windowMs / 1000);
  const bucket = Math.floor(Date.now() / windowMs);
  const key = `${prefix}:${identifier}:${bucket}`;

  try {
    const count = await redis.incr(key);
    if (count === 1) {
      // First hit in this window — set the TTL so the key self-cleans.
      await redis.expire(key, windowSec);
    }
    return { limited: count > max, retryAfter: windowSec };
  } catch {
    // If Redis is unreachable, fail open to the in-memory limiter rather than
    // blocking legitimate traffic.
    return memoryLimit(`${prefix}:${identifier}`, windowMs, max);
  }
}
