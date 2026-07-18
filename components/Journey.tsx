"use client";

import { useMemo, useState } from "react";
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
        <div className="relative h-[240px] w-full overflow-hidden rounded-[12px] border border-hairline-strong bg-surface sm:h-[360px] md:h-[520px]">
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
                    onClick={() => setActiveCity(c.id)}
                    className="cursor-pointer"
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
                      x={labelX}
                      y={top ? p.y - 18 : p.y + 28}
                      textAnchor={anchor}
                      fontFamily="var(--font-jetbrains-mono), monospace"
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

        {/* Detail card (full width, below the map) */}
        <div className="grid grid-cols-1 gap-x-10 gap-y-4 rounded-[12px] bg-ink px-[30px] py-8 text-paper md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)] md:items-center">
          <div>
            <div className="mb-4 font-mono text-[11px] font-medium uppercase leading-none tracking-[0.12em] text-accent2">
              {active.kicker} · {active.years}
            </div>
            <div className="mb-1 font-display text-[28px] font-semibold leading-[1.1]">
              {active.name}
            </div>
            <div className="font-mono text-[13px] font-normal text-[#9a9285]">
              {active.country}
            </div>
          </div>
          <div className="flex flex-col">
            <p className="m-0 font-serif text-[18px] leading-[1.6] text-[#d8d1c4]">
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
      </div>
    </section>
  );
}
