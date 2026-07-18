# Vin Vadhanasindhu — Personal Profile Site

An interactive personal profile built with Next.js (App Router), React, TypeScript, and Tailwind CSS.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in keys
npm run dev
```

Open http://localhost:3000.

## Editing copy

All visitor-facing text and data live in a single file: [`content/site.ts`](content/site.ts).
Headings, paragraphs, timeline entries, flip cards, projects, the AI system
prompt, and contact details are all there. Components read from it only, so you
can update copy without touching component code.

Voice rules when editing: plain, complete sentences, first person, no
em-dashes, no punchy fragments.

## Theming

Five palettes (Indigo, Sage, Clay, Plum, Mono) are defined as swappable CSS
variables in [`app/globals.css`](app/globals.css) and surfaced as Tailwind
tokens (`bg-paper`, `text-ink`, `text-accent`, and so on). The default is
Indigo. The palette is switchable at runtime via the control in the footer;
the choice persists in `localStorage`.

## Environment variables

See [`.env.example`](.env.example). The Anthropic API key is used only in the
server route `app/api/ask/route.ts` and is never exposed to the client.

## Analytics

First-party, no third-party script and no cookies. The client
([`lib/analytics.ts`](lib/analytics.ts) + [`components/Analytics.tsx`](components/Analytics.tsx))
sends events to `app/api/track/route.ts`, which enriches them server-side and
hands them to a sink:

- **Who visits** — a `pageview` event per load with referrer, UTM parameters,
  language, and screen size; an anonymous `visitorId` (localStorage) counts
  returning visits, and a salted one-way IP hash counts uniques without storing
  raw IPs. Country/region/city fill in from edge geo headers in production.
- **Which areas people look at** — a `section_view` event per section with the
  dwell time it stayed in view, plus `chat_open`, `chat_message`, and
  `contact_submit` engagement events.

### Section-attention dashboard

Add the **Vercel Upstash (Redis)** Marketplace integration (or set
`UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`) and events aggregate into
a store that powers **`/admin`** — a page that ranks which sections hold
attention by total time in view, with average time per view and unique viewers,
plus visitor totals and a recent-activity feed.

Protect it by setting `ADMIN_PASSWORD` (and optionally `ADMIN_USER`, default
`admin`); `/admin` is disabled until a password is set, so it is never public by
accident. The free Upstash tier is enough for a personal site.

Without a store, events are logged as structured JSON to your host's logs. Set
`ANALYTICS_WEBHOOK_URL` to also forward them to a database or spreadsheet
webhook, or `NEXT_PUBLIC_ANALYTICS_DISABLED=1` to turn analytics off.

## Structure

- `app/` — App Router pages, layout, global styles, API routes.
- `components/` — one component per section (Nav, Hero, Journey, Approach,
  Work, Teaching, Projects, Contact, Footer) plus the floating Chat widget.
- `content/site.ts` — single source of truth for copy and data.
