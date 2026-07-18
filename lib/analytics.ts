/**
 * Lightweight first-party analytics client.
 *
 * No third-party script and no cookies. A random anonymous visitor id is kept
 * in localStorage so returning visits can be counted, and a per-tab session id
 * lives in sessionStorage. Events are sent to /api/track, which enriches them
 * server-side (referrer, coarse geo, device) and hands them to a pluggable
 * sink. See app/api/track/route.ts.
 *
 * To disable analytics entirely, set NEXT_PUBLIC_ANALYTICS_DISABLED=1.
 */

const VISITOR_KEY = "vv-visitor-id";
const SESSION_KEY = "vv-session-id";

const disabled =
  typeof process !== "undefined" &&
  process.env.NEXT_PUBLIC_ANALYTICS_DISABLED === "1";

function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getVisitorId(): string {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = uuid();
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return "anonymous";
  }
}

function getSessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = uuid();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "session";
  }
}

export type TrackProps = Record<string, string | number | boolean | null>;

export function track(event: string, props: TrackProps = {}): void {
  if (disabled || typeof window === "undefined") return;

  const payload = {
    event,
    props,
    visitorId: getVisitorId(),
    sessionId: getSessionId(),
    path: window.location.pathname + window.location.search,
    referrer: document.referrer || null,
    ts: Date.now(),
  };

  try {
    const body = JSON.stringify(payload);
    // sendBeacon survives page unloads; fall back to keepalive fetch.
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      const ok = navigator.sendBeacon("/api/track", blob);
      if (ok) return;
    }
    void fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* analytics must never break the page */
  }
}

/** First load of a page: capture entry source (referrer, UTM, campaign). */
export function trackPageview(): void {
  if (disabled || typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  track("pageview", {
    title: document.title,
    language: navigator.language || null,
    screen: `${window.screen.width}x${window.screen.height}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    utm_source: params.get("utm_source"),
    utm_medium: params.get("utm_medium"),
    utm_campaign: params.get("utm_campaign"),
    ref: params.get("ref"),
  });
}
