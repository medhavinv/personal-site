/**
 * Server-side aggregation of analytics events in Vercel KV / Upstash Redis.
 *
 * The main goal is answering "which section of the page do people keep looking
 * at" — so section_view events accumulate total dwell time, a view count, and
 * a set of unique visitors per section. Pageviews and engagement events are
 * counted too. Everything degrades to a no-op when the store is not configured,
 * so the app still builds and runs without credentials.
 *
 * Configure via the Vercel Upstash (Redis) Marketplace integration, which
 * injects KV_REST_API_URL / KV_REST_API_TOKEN, or set UPSTASH_REDIS_REST_URL /
 * UPSTASH_REDIS_REST_TOKEN directly.
 */
import { Redis } from "@upstash/redis";
import { sectionIds } from "@/content/site";

let cached: Redis | null | undefined;

export function getRedis(): Redis | null {
  if (cached !== undefined) return cached;
  const url =
    process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  cached = url && token ? new Redis({ url, token }) : null;
  return cached;
}

export const analyticsEnabled = () => getRedis() !== null;

type EnrichedEvent = {
  event: string;
  props: Record<string, unknown>;
  visitorHash: string;
  ts: number;
  country: string | null;
};

const KEYS = {
  pageviews: "pv:total",
  visitors: "visitors",
  secViews: "sec:views",
  secDwell: "sec:dwell",
  secUniq: (s: string) => `sec:uniq:${s}`,
  engagement: "events:count",
  recent: "ev:recent",
};

export async function recordEvent(e: EnrichedEvent): Promise<void> {
  const r = getRedis();
  if (!r) return;

  const ops: Promise<unknown>[] = [];

  if (e.event === "pageview") {
    ops.push(r.incr(KEYS.pageviews));
    if (e.visitorHash) ops.push(r.sadd(KEYS.visitors, e.visitorHash));
  }

  if (e.event === "section_view") {
    const section = String(e.props.section ?? "");
    const dwell = Number(e.props.dwell_ms) || 0;
    if (section) {
      ops.push(r.hincrby(KEYS.secViews, section, 1));
      ops.push(r.hincrbyfloat(KEYS.secDwell, section, dwell));
      if (e.visitorHash) ops.push(r.sadd(KEYS.secUniq(section), e.visitorHash));
    }
  }

  if (["chat_open", "chat_message", "contact_submit"].includes(e.event)) {
    ops.push(r.hincrby(KEYS.engagement, e.event, 1));
  }

  // Bounded recent-events feed for the admin view.
  ops.push(
    r.lpush(KEYS.recent, {
      event: e.event,
      section: e.props?.section ?? null,
      ts: e.ts,
      country: e.country,
    }),
  );
  ops.push(r.ltrim(KEYS.recent, 0, 199));

  await Promise.all(ops);
}

export type SectionStat = {
  section: string;
  views: number;
  totalDwellMs: number;
  avgDwellMs: number;
  uniqueViewers: number;
};

export type RecentEvent = {
  event: string;
  section: string | null;
  ts: number;
  country: string | null;
};

export type Stats = {
  pageviews: number;
  uniqueVisitors: number;
  sections: SectionStat[];
  engagement: Record<string, number>;
  recent: RecentEvent[];
};

function num(v: unknown): number {
  const n = typeof v === "string" ? parseFloat(v) : Number(v);
  return Number.isFinite(n) ? n : 0;
}

export async function getStats(): Promise<Stats | null> {
  const r = getRedis();
  if (!r) return null;

  const [pageviews, uniqueVisitors, views, dwell, engagement, recent] =
    await Promise.all([
      r.get<number>(KEYS.pageviews),
      r.scard(KEYS.visitors),
      r.hgetall<Record<string, number>>(KEYS.secViews),
      r.hgetall<Record<string, number>>(KEYS.secDwell),
      r.hgetall<Record<string, number>>(KEYS.engagement),
      r.lrange(KEYS.recent, 0, 49),
    ]);

  const uniquePer = await Promise.all(
    sectionIds.map((s) => r.scard(KEYS.secUniq(s))),
  );

  const sections: SectionStat[] = sectionIds
    .map((section, i) => {
      const v = num(views?.[section]);
      const total = num(dwell?.[section]);
      return {
        section,
        views: v,
        totalDwellMs: Math.round(total),
        avgDwellMs: v > 0 ? Math.round(total / v) : 0,
        uniqueViewers: num(uniquePer[i]),
      };
    })
    // Rank by total attention (dwell), which is the headline question.
    .sort((a, b) => b.totalDwellMs - a.totalDwellMs);

  const recentParsed: RecentEvent[] = (recent as unknown[]).map((item) => {
    const obj =
      typeof item === "string"
        ? (JSON.parse(item) as RecentEvent)
        : (item as RecentEvent);
    return {
      event: String(obj.event),
      section: obj.section ?? null,
      ts: num(obj.ts),
      country: obj.country ?? null,
    };
  });

  return {
    pageviews: num(pageviews),
    uniqueVisitors: num(uniqueVisitors),
    sections,
    engagement: (engagement as Record<string, number>) ?? {},
    recent: recentParsed,
  };
}
