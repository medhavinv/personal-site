"use client";

import { useMemo, useRef, useState } from "react";
import { useContent } from "@/components/LocaleProvider";
import {
  MAP_W,
  MAP_H,
  landPath,
  gratPath,
  mapReady,
  project,
} from "@/lib/worldMap";

export function Journey() {
  const { cities, journey } = useContent();
  const [activeCity, setActiveCity] = useState(journey.defaultCity);
  const [dir, setDir] = useState<1 | -1>(1);

  // Project each city to viewBox coordinates once.
  const cityXY = useMemo(() => {
    const xy: Record<string, { x: number; y: number }> = {};
    cities.forEach((c) => {
      xy[c.id] = project(c.lng, c.lat);
    });
    return xy;
  }, [cities]);

  const routePts = useMemo(
    () =>
      journey.routeOrder
        .map((id) => (cityXY[id] ? `${cityXY[id].x},${cityXY[id].y}` : ""))
        .filter(Boolean)
        .join(" "),
    [cityXY],
  );

  const active = cities.find((c) => c.id === activeCity) ?? cities[0];

  // Order used when swiping/clicking through cities. Sorted by horizontal
  // position on the map (west → east) so a "next"/right click always moves us
  // left-to-right across the map, and "prev"/left moves right-to-left.
  const swipeOrder = useMemo(() => {
    return cities
      .map((c) => c.id)
      .sort((a, b) => (cityXY[a]?.x ?? 0) - (cityXY[b]?.x ?? 0));
  }, [cities, cityXY]);

  const step = (delta: -1 | 1) => {
    if (swipeOrder.length === 0) return;
    const i = swipeOrder.indexOf(active.id);
    const next = (i + delta + swipeOrder.length) % swipeOrder.length;
    setDir(delta);
    setActiveCity(swipeOrder[next]);
  };

  // Jump straight to a city (map pin or position dot), inferring the slide
  // direction from its position in the swipe order.
  const goTo = (id: string) => {
    if (id === active.id) return;
    const from = swipeOrder.indexOf(active.id);
    const to = swipeOrder.indexOf(id);
    if (from !== -1 && to !== -1) setDir(to >= from ? 1 : -1);
    setActiveCity(id);
  };

  // Track the horizontal swipe gesture on the detail card.
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const SWIPE_THRESHOLD = 40;

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    swipeStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!swipeStart.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - swipeStart.current.x;
    const dy = t.clientY - swipeStart.current.y;
    swipeStart.current = null;
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      // Swipe left → next city, swipe right → previous city.
      step(dx < 0 ? 1 : -1);
    }
  };

  return (
    <section
      id="journey"
      className="border-t border-hairline py-[60px]"
    >
      <div className="mb-5 font-mono text-[11px] font-medium uppercase leading-none tracking-[0.14em] text-faint">
        {journey.kicker}
      </div>
      <h2 className="mb-[34px] mt-0 font-display text-[34px] font-semibold leading-[1.1] tracking-[-0.02em]">
        {journey.heading}
      </h2>
      <div className="flex flex-col gap-7">
        {/* Map (full width, stacked above the detail card so the globe is large).
            slice fills the card and crops the poles; the cities stay centered so
            all four dots remain in frame at every width. */}
        <div className="relative h-[210px] w-full overflow-hidden rounded-[12px] border border-hairline-strong bg-surface sm:h-[340px] md:h-[520px]">
          {mapReady && (
            <svg
              viewBox={`0 0 ${MAP_W} ${MAP_H}`}
              preserveAspectRatio="xMidYMid slice"
              className="absolute inset-0 h-full w-full"
            >
              <path
                d={gratPath}
                fill="none"
                stroke="var(--ink)"
                strokeWidth={0.4}
                opacity={0.08}
              />
              <path
                d={landPath}
                fill="var(--surface-alt)"
                stroke="var(--ink)"
                strokeWidth={0.5}
                strokeOpacity={0.25}
                strokeLinejoin="round"
              />
              <polyline
                points={routePts}
                fill="none"
                stroke="var(--accent)"
                strokeWidth={2}
                strokeDasharray="6 6"
                opacity={0.7}
                strokeLinecap="round"
              />
              {cities.map((c) => {
                const isActive = activeCity === c.id;
                const p = cityXY[c.id] ?? { x: 0, y: 0 };
                const top = c.labelPos === "top";
                const anchor = c.labelAnchor ?? "middle";
                const labelX =
                  anchor === "start"
                    ? p.x + 14
                    : anchor === "end"
                      ? p.x - 14
                      : p.x;
                return (
                  <g
                    key={c.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`${c.name}, ${c.country}`}
                    onClick={() => goTo(c.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        goTo(c.id);
                      }
                    }}
                    className="cursor-pointer focus:outline-none focus-visible:[&>circle]:stroke-accent"
                  >
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={isActive ? 19 : 0}
                      fill="var(--accent)"
                      opacity={isActive ? 0.9 : 0}
                      style={{ transition: "all .2s" }}
                    />
                    <circle cx={p.x} cy={p.y} r={22} fill="transparent" />
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={isActive ? 9 : 6}
                      fill={isActive ? "var(--accent)" : "var(--ink)"}
                      stroke="var(--surface)"
                      strokeWidth={2}
                      style={{ transition: "all .2s" }}
                    />
                    <text
                      className="max-sm:hidden"
                      x={labelX}
                      y={top ? p.y - 18 : p.y + 28}
                      textAnchor={anchor}
                      fontFamily="var(--font-jetbrains-mono), var(--font-thai), monospace"
                      fontSize={17}
                      fontWeight={isActive ? 700 : 500}
                      fill={isActive ? "var(--accent)" : "var(--muted)"}
                      style={{ transition: "all .2s" }}
                    >
                      {c.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          )}
        </div>

        {/* Detail card (full width, below the map). Swipe left/right — or use
            the arrow buttons — to iterate through the cities. */}
        <div
          className="relative touch-pan-y select-none rounded-[12px] bg-ink px-[30px] py-8 text-paper"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div
            key={active.id}
            className={`grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)] md:items-center ${
              dir === 1 ? "card-slide-right" : "card-slide-left"
            }`}
          >
            <div>
              <div className="mb-4 font-mono text-[11px] font-medium uppercase leading-none tracking-[0.12em] text-accent2">
                {active.kicker} · {active.years}
              </div>
              <div className="mb-1 font-display text-[28px] font-semibold leading-[1.1]">
                {active.name}
              </div>
              <div className="font-mono text-[13px] font-normal text-on-ink-muted">
                {active.country}
              </div>
            </div>
            <div className="flex flex-col">
              <p className="m-0 font-body text-[18px] leading-[1.6] text-on-ink">
                {active.text}
              </p>
              <a
                href={active.link}
                className="mt-5 font-display text-[13px] font-medium text-accent2"
              >
                {active.linkLabel}
              </a>
            </div>
          </div>

          {/* Swipe controls: prev/next arrows + position dots */}
          <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-5">
            <button
              type="button"
              aria-label="Previous city"
              onClick={() => step(-1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-paper transition-colors hover:border-accent2 hover:text-accent2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              {swipeOrder.map((id) => (
                <button
                  key={id}
                  type="button"
                  aria-label={`Show ${id}`}
                  aria-current={id === active.id}
                  onClick={() => goTo(id)}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    id === active.id ? "bg-accent2" : "bg-white/25 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              aria-label="Next city"
              onClick={() => step(1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-paper transition-colors hover:border-accent2 hover:text-accent2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
