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

## Structure

- `app/` — App Router pages, layout, global styles, API routes.
- `components/` — one component per section (Nav, Hero, Journey, Approach,
  Work, Teaching, Projects, Contact, Footer) plus the floating Chat widget.
- `content/site.ts` — single source of truth for copy and data.
