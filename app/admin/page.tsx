import { getStats } from "@/lib/analyticsStore";

export const dynamic = "force-dynamic";
export const metadata = { title: "Analytics · Admin" };

const SECTION_LABELS: Record<string, string> = {
  top: "Hero",
  journey: "Journey",
  role: "Approach",
  work: "Work",
  teaching: "Teaching",
  projects: "Projects",
  contact: "Contact",
};

function fmtDuration(ms: number): string {
  if (ms <= 0) return "0s";
  const s = ms / 1000;
  if (s < 60) return `${s.toFixed(s < 10 ? 1 : 0)}s`;
  const m = Math.floor(s / 60);
  return `${m}m ${Math.round(s % 60)}s`;
}

function fmtTime(ts: number): string {
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return "";
  }
}

export default async function AdminPage() {
  const stats = await getStats();

  if (!stats) {
    return (
      <main className="mx-auto max-w-content px-8 py-16">
        <h1 className="font-display text-[28px] font-semibold">Analytics</h1>
        <p className="mt-4 max-w-[60ch] font-body text-[17px] text-ink2">
          The analytics store is not configured. Add the Vercel Upstash (Redis)
          integration, or set UPSTASH_REDIS_REST_URL and
          UPSTASH_REDIS_REST_TOKEN, then reload. Until then, events are still
          logged server-side.
        </p>
      </main>
    );
  }

  const maxDwell = Math.max(1, ...stats.sections.map((s) => s.totalDwellMs));

  return (
    <main className="mx-auto max-w-content px-8 py-16">
      <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
        Admin · Analytics
      </div>
      <h1 className="m-0 font-display text-[34px] font-semibold tracking-[-0.02em]">
        Which sections hold attention
      </h1>

      {/* Visitor totals */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Pageviews", value: stats.pageviews.toLocaleString() },
          {
            label: "Unique visitors",
            value: stats.uniqueVisitors.toLocaleString(),
          },
          {
            label: "Chats opened",
            value: (stats.engagement.chat_open ?? 0).toLocaleString(),
          },
          {
            label: "Contact submits",
            value: (stats.engagement.contact_submit ?? 0).toLocaleString(),
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-[12px] border border-hairline-strong bg-surface p-5"
          >
            <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.1em] text-faint">
              {s.label}
            </div>
            <div className="font-display text-[28px] font-semibold">
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Section attention ranking */}
      <h2 className="mb-4 mt-12 font-display text-[20px] font-semibold">
        Section attention (ranked by total time in view)
      </h2>
      <div className="overflow-hidden rounded-[12px] border border-hairline-strong bg-surface">
        <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-4 border-b border-hairline px-5 py-3 font-mono text-[10px] uppercase tracking-[0.1em] text-faint">
          <div>Section</div>
          <div className="text-right">Total time</div>
          <div className="text-right">Avg / view</div>
          <div className="text-right">Unique viewers</div>
        </div>
        {stats.sections.map((s) => (
          <div
            key={s.section}
            className="relative grid grid-cols-[1.5fr_1fr_1fr_1fr] items-center gap-4 border-b border-hairline px-5 py-4 last:border-b-0"
          >
            <div
              aria-hidden
              className="absolute inset-y-0 left-0 bg-accent-soft"
              style={{ width: `${(s.totalDwellMs / maxDwell) * 100}%` }}
            />
            <div className="relative font-display text-[15px] font-medium">
              {SECTION_LABELS[s.section] ?? s.section}
            </div>
            <div className="relative text-right font-mono text-[13px]">
              {fmtDuration(s.totalDwellMs)}
            </div>
            <div className="relative text-right font-mono text-[13px] text-muted">
              {fmtDuration(s.avgDwellMs)}
            </div>
            <div className="relative text-right font-mono text-[13px] text-muted">
              {s.uniqueViewers.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 font-mono text-[11px] text-faint">
        Time counts only while a section owns the middle of the viewport, so it
        reflects real reading rather than scroll-past.
      </p>

      {/* Recent activity */}
      <h2 className="mb-4 mt-12 font-display text-[20px] font-semibold">
        Recent activity
      </h2>
      <div className="overflow-hidden rounded-[12px] border border-hairline-strong bg-surface">
        {stats.recent.length === 0 && (
          <div className="px-5 py-4 font-mono text-[13px] text-muted">
            No events yet.
          </div>
        )}
        {stats.recent.map((e, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-4 border-b border-hairline px-5 py-3 font-mono text-[12px] last:border-b-0"
          >
            <span className="text-ink">
              {e.event}
              {e.section ? (
                <span className="text-muted">
                  {" "}
                  · {SECTION_LABELS[e.section] ?? e.section}
                </span>
              ) : null}
              {e.country ? (
                <span className="text-muted"> · {e.country}</span>
              ) : null}
            </span>
            <span className="text-faint">{fmtTime(e.ts)}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
